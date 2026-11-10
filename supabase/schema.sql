create extension if not exists pgcrypto;

-- admin
create table public.admins (user_id uuid primary key references auth.users(id) on delete cascade);

create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;

-- pengaturan (satu baris)
create table public.settings (
  id int primary key default 1 check (id = 1),
  about text,
  default_price_gk int not null default 35000 check (default_price_gk >= 0),
  default_price_player int not null default 40000 check (default_price_player >= 0),
  wa_admin_1 text, wa_admin_2 text, email text, instagram text,
  bank_name text, bank_number text, bank_holder text
);
insert into public.settings (id, default_price_gk, default_price_player, wa_admin_1, wa_admin_2, email, instagram, bank_name, bank_number, bank_holder)
values (1, 35000, 40000, '6281615334069', '6281228933141', 'mokerfc2026@gmail.com',
        'https://instagram.com/mfc.utd', 'BRI', '6408 0101 2984 501', 'Ahmad Mauludin')
on conflict (id) do nothing;

create view public.public_settings as
select id, about, default_price_gk, default_price_player,
       wa_admin_1, wa_admin_2, email, instagram
from public.settings;
grant select on public.public_settings to anon, authenticated;

-- acara
create type event_type as enum ('pertandingan', 'internal');
create type event_status as enum ('draft', 'published', 'closed', 'cancelled');

create table public.events (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  type event_type not null,
  event_date date not null,
  start_time time not null,
  end_time time,
  venue_name text not null,
  venue_address text,
  maps_url text,
  description text,
  benefits text[] not null default '{}',
  quota_total int check (quota_total is null or quota_total > 0),
  quota_gk int check (quota_gk is null or quota_gk >= 0),
  price_gk int check (price_gk is null or price_gk >= 0),
  price_player int check (price_player is null or price_player >= 0),
  cover_path text,
  status event_status not null default 'draft',
  created_at timestamptz not null default now()
);

-- pendaftar
create type reg_position as enum ('gk', 'player');
create type reg_status as enum ('pending', 'paid', 'cancelled');

create table public.registrations (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  event_id uuid not null references public.events(id) on delete cascade,
  full_name text not null,
  nickname text,
  phone text not null,
  player_position reg_position not null,
  amount int not null check (amount >= 0),
  status reg_status not null default 'pending',
  created_at timestamptz not null default now(),
  paid_at timestamptz
);
create unique index registrations_event_phone_active
  on public.registrations (event_id, phone) where status <> 'cancelled';

-- hitungan publik (hanya angka, tanpa data pribadi)
create view public.event_counts as
select event_id,
       count(*) filter (where status <> 'cancelled') as total,
       count(*) filter (where status <> 'cancelled' and player_position = 'gk') as gk
from public.registrations group by event_id;
grant select on public.event_counts to anon, authenticated;

-- galeri
create table public.albums (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  album_date date,
  event_id uuid references public.events(id) on delete set null,
  cover_photo_id uuid,
  is_published boolean not null default true,
  created_at timestamptz not null default now()
);
create table public.photos (
  id uuid primary key default gen_random_uuid(),
  album_id uuid not null references public.albums(id) on delete cascade,
  path text not null,
  alt text not null,
  caption text,
  width int, height int,
  sort int not null default 0,
  created_at timestamptz not null default now()
);
alter table public.albums
  add constraint albums_cover_photo_id_fkey
  foreign key (cover_photo_id) references public.photos(id) on delete set null;

-- fungsi pendaftaran atomik
create or replace function public.register_for_event(
  p_slug text, p_full_name text, p_nickname text, p_phone text, p_position reg_position
) returns table (
  out_code text, out_amount int, out_title text,
  out_bank_name text, out_bank_number text, out_bank_holder text
)
language plpgsql security definer set search_path = public as $$
declare
  ev public.events%rowtype;
  s public.settings%rowtype;
  taken_total int; taken_gk int; price int; new_code text; norm_phone text;
begin
  select * into ev from public.events where slug = p_slug and status = 'published' for update;
  if not found then raise exception 'EVENT_CLOSED'; end if;
  if (ev.event_date + ev.start_time) < (now() at time zone 'Asia/Jakarta') then
    raise exception 'EVENT_PASSED';
  end if;

  norm_phone := regexp_replace(coalesce(p_phone, ''), '[^0-9]', '', 'g');
  if norm_phone like '0%' then norm_phone := '62' || substr(norm_phone, 2); end if;
  if norm_phone not like '62%' or length(norm_phone) < 10 or length(norm_phone) > 15 then
    raise exception 'PHONE_INVALID';
  end if;
  if length(trim(coalesce(p_full_name, ''))) < 2 then raise exception 'NAME_INVALID'; end if;

  select count(*) into taken_total from public.registrations
    where event_id = ev.id and status <> 'cancelled';
  if ev.quota_total is not null and taken_total >= ev.quota_total then
    raise exception 'QUOTA_FULL';
  end if;
  if p_position = 'gk' and ev.quota_gk is not null then
    select count(*) into taken_gk from public.registrations
      where event_id = ev.id and status <> 'cancelled' and player_position = 'gk';
    if taken_gk >= ev.quota_gk then raise exception 'QUOTA_GK_FULL'; end if;
  end if;

  select * into s from public.settings where id = 1;
  price := case when p_position = 'gk'
                then coalesce(ev.price_gk, s.default_price_gk)
                else coalesce(ev.price_player, s.default_price_player) end;

  new_code := 'MFC-' || upper(substr(encode(gen_random_bytes(4), 'hex'), 1, 6));
  insert into public.registrations (code, event_id, full_name, nickname, phone, player_position, amount)
  values (new_code, ev.id, trim(p_full_name), nullif(trim(coalesce(p_nickname, '')), ''),
          norm_phone, p_position, price);

  return query select new_code, price, ev.title, s.bank_name, s.bank_number, s.bank_holder;
exception when unique_violation then
  raise exception 'ALREADY_REGISTERED';
end $$;

revoke all on function public.register_for_event(text, text, text, text, reg_position) from public;
grant execute on function public.register_for_event(text, text, text, text, reg_position) to anon, authenticated;

-- RLS
alter table public.admins enable row level security;
alter table public.settings enable row level security;
alter table public.events enable row level security;
alter table public.registrations enable row level security;
alter table public.albums enable row level security;
alter table public.photos enable row level security;

create policy "settings admin read" on public.settings for select using (public.is_admin());
create policy "settings admin update" on public.settings for update using (public.is_admin()) with check (public.is_admin());

create policy "events public read" on public.events for select
  using (status in ('published', 'closed') or public.is_admin());
create policy "events admin write" on public.events for all
  using (public.is_admin()) with check (public.is_admin());

create policy "registrations admin all" on public.registrations for all
  using (public.is_admin()) with check (public.is_admin());

create policy "albums public read" on public.albums for select
  using (is_published or public.is_admin());
create policy "albums admin write" on public.albums for all
  using (public.is_admin()) with check (public.is_admin());

create policy "photos public read" on public.photos for select
  using (exists (select 1 from public.albums a where a.id = album_id and (a.is_published or public.is_admin())));
create policy "photos admin write" on public.photos for all
  using (public.is_admin()) with check (public.is_admin());

-- storage
insert into storage.buckets (id, name, public) values ('gallery', 'gallery', true), ('events', 'events', true)
on conflict (id) do nothing;
create policy "media public read" on storage.objects for select
  using (bucket_id in ('gallery', 'events'));
create policy "media admin insert" on storage.objects for insert
  with check (bucket_id in ('gallery', 'events') and public.is_admin());
create policy "media admin update" on storage.objects for update
  using (bucket_id in ('gallery', 'events') and public.is_admin());
create policy "media admin delete" on storage.objects for delete
  using (bucket_id in ('gallery', 'events') and public.is_admin());

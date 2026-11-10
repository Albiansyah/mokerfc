// ponytail: Central data queries with graceful offline fallback when Supabase is unconfigured.
import { createClient as createServerClient } from "./supabase/server";
import { Settings, ClubEvent, EventCount, Album, Photo } from "./types";

export const EMPTY_SETTINGS: Settings = {
  id: 1,
  about: null,
  default_price_gk: 0,
  default_price_player: 0,
  wa_admin_1: null,
  wa_admin_2: null,
  email: null,
  instagram: null,
  bank_name: null,
  bank_number: null,
  bank_holder: null,
};

export async function getSettings(): Promise<Settings> {
  try {
    const supabase = await createServerClient();
    const { data, error } = await supabase
      .from("public_settings")
      .select("*")
      .eq("id", 1)
      .single();

    if (error || !data) return EMPTY_SETTINGS;
    return { ...(data as Omit<Settings, "bank_name" | "bank_number" | "bank_holder">), bank_name: null, bank_number: null, bank_holder: null };
  } catch {
    return EMPTY_SETTINGS;
  }
}

export async function getPublicEvents(): Promise<{
  events: (ClubEvent & { counts?: EventCount })[];
  error: string | null;
}> {
  try {
    const supabase = await createServerClient();
    const { data: events, error } = await supabase
      .from("events")
      .select("*")
      .in("status", ["published", "closed"])
      .order("event_date", { ascending: true })
      .order("start_time", { ascending: true });

    if (error || !events) {
      return { events: [], error: error?.message || null };
    }

    // Ambil hitungan kuota publik
    const { data: counts } = await supabase.from("event_counts").select("*");
    const countsMap = new Map<string, EventCount>();
    if (counts) {
      counts.forEach((c) => countsMap.set(c.event_id, c as EventCount));
    }

    const merged = (events as ClubEvent[]).map((ev) => ({
      ...ev,
      counts: countsMap.get(ev.id) || { event_id: ev.id, total: 0, gk: 0 },
    }));

    return { events: merged, error: null };
  } catch {
    return { events: [], error: null };
  }
}

export async function getEventBySlug(
  slug: string
): Promise<(ClubEvent & { counts: EventCount }) | null> {
  try {
    const supabase = await createServerClient();
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .eq("slug", slug)
      .single();

    if (error || !data) return null;

    const { data: countData } = await supabase
      .from("event_counts")
      .select("*")
      .eq("event_id", data.id)
      .single();

    const counts: EventCount = countData || {
      event_id: data.id,
      total: 0,
      gk: 0,
    };

    return { ...(data as ClubEvent), counts };
  } catch {
    return null;
  }
}

export async function getPublicAlbums(): Promise<{
  albums: (Album & { photos: Photo[] })[];
  error: string | null;
}> {
  try {
    const supabase = await createServerClient();
    const { data: albums, error } = await supabase
      .from("albums")
      .select("*")
      .eq("is_published", true)
      .order("album_date", { ascending: false });

    if (error || !albums) {
      return { albums: [], error: error?.message || null };
    }

    const { data: photos } = await supabase
      .from("photos")
      .select("*")
      .order("sort", { ascending: true });

    const photosByAlbum = new Map<string, Photo[]>();
    if (photos) {
      photos.forEach((p) => {
        const arr = photosByAlbum.get(p.album_id) || [];
        arr.push(p as Photo);
        photosByAlbum.set(p.album_id, arr);
      });
    }

    const merged = (albums as Album[]).map((a) => ({
      ...a,
      photos: photosByAlbum.get(a.id) || [],
    }));

    return { albums: merged, error: null };
  } catch {
    return { albums: [], error: null };
  }
}


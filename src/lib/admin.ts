import type { EventStatus, EventType } from "./types";

type EventInput = {
  slug: string;
  title: string;
  type: EventType;
  event_date: string;
  start_time: string;
  end_time: string | null;
  venue_name: string;
  venue_address: string | null;
  maps_url: string | null;
  description: string | null;
  benefits: string[];
  quota_total: number | null;
  quota_gk: number | null;
  price_gk: number | null;
  price_player: number | null;
  cover_path: string | null;
  status: EventStatus;
};

type ParseResult<T> = { ok: true; value: T } | { ok: false; error: string; value: never };

function text(form: FormData, name: string): string {
  const value = form.get(name);
  return typeof value === "string" ? value.trim() : "";
}

function optionalNumber(form: FormData, name: string): number | null {
  const value = text(form, name);
  if (!value) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : Number.NaN;
}

export function slugify(value: string): string {
  return value.toLowerCase().normalize("NFKD").replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-").replace(/-+/g, "-");
}

export function eventInputFromForm(form: FormData): ParseResult<EventInput> {
  const title = text(form, "title");
  const type = text(form, "type") as EventType;
  const eventDate = text(form, "event_date");
  const startTime = text(form, "start_time");
  const venueName = text(form, "venue_name");
  if (title.length < 2 || !["pertandingan", "internal"].includes(type) || !eventDate || !startTime || !venueName) return { ok: false, error: "Nama, jenis, tanggal, jam mulai, dan lokasi wajib diisi.", value: undefined as never };
  const quotaTotal = optionalNumber(form, "quota_total");
  const quotaGk = optionalNumber(form, "quota_gk");
  const priceGk = optionalNumber(form, "price_gk");
  const pricePlayer = optionalNumber(form, "price_player");
  if ([quotaTotal, quotaGk, priceGk, pricePlayer].some((value) => value !== null && (!Number.isFinite(value) || value < 0)) || quotaTotal === 0) return { ok: false, error: "Kuota dan harga harus berupa angka yang valid.", value: undefined as never };
  const rawStatus = text(form, "status");
  const status: EventStatus = ["draft", "published", "closed", "cancelled"].includes(rawStatus) ? rawStatus as EventStatus : "draft";
  const benefits = text(form, "benefits").split(/\r?\n/).map((item) => item.trim()).filter(Boolean);
  return { ok: true, value: { slug: text(form, "slug") || slugify(title), title, type, event_date: eventDate, start_time: startTime, end_time: text(form, "end_time") || null, venue_name: venueName, venue_address: text(form, "venue_address") || null, maps_url: text(form, "maps_url") || null, description: text(form, "description") || null, benefits, quota_total: quotaTotal, quota_gk: quotaGk, price_gk: priceGk, price_player: pricePlayer, cover_path: text(form, "cover_path") || null, status } };
}

export function validateSettingsInput(input: { default_price_gk: number; default_price_player: number }): { ok: boolean; error?: string } {
  if (![input.default_price_gk, input.default_price_player].every((value) => Number.isInteger(value) && value >= 0)) return { ok: false, error: "Harga default harus berupa angka nol atau lebih." };
  return { ok: true };
}

export function escapeCsvCell(value: unknown): string {
  const textValue = String(value ?? "");
  return /[",\r\n]/.test(textValue) ? `"${textValue.replace(/"/g, '""')}"` : textValue;
}

export function movePhoto<T extends { sort: number }>(items: T[], index: number, direction: -1 | 1): T[] {
  const target = index + direction;
  if (target < 0 || target >= items.length) return items;
  const moved = [...items];
  [moved[index], moved[target]] = [moved[target], moved[index]];
  return moved.map((item, sort) => ({ ...item, sort }));
}

export function storageObjectPath(publicUrl: string, bucket: string): string | null {
  const marker = `/storage/v1/object/public/${bucket}/`;
  const markerIndex = publicUrl.indexOf(marker);
  if (markerIndex < 0) return null;
  const path = publicUrl.slice(markerIndex + marker.length).split(/[?#]/, 1)[0];
  return path ? decodeURIComponent(path) : null;
}

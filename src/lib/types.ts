export type EventType = "pertandingan" | "internal";
export type EventStatus = "draft" | "published" | "closed" | "cancelled";
export type RegistrationPosition = "gk" | "player";
export type RegistrationStatus = "pending" | "paid" | "cancelled";

export interface Settings {
  id: number;
  about: string | null;
  default_price_gk: number;
  default_price_player: number;
  wa_admin_1: string | null;
  wa_admin_2: string | null;
  email: string | null;
  instagram: string | null;
  bank_name: string | null;
  bank_number: string | null;
  bank_holder: string | null;
}

export interface ClubEvent {
  id: string;
  slug: string;
  title: string;
  type: EventType;
  event_date: string; // YYYY-MM-DD
  start_time: string; // HH:mm:ss or HH:mm
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
  created_at: string;
}

export interface EventCount {
  event_id: string;
  total: number;
  gk: number;
}

export interface Registration {
  id: string;
  code: string;
  event_id: string;
  full_name: string;
  nickname: string | null;
  phone: string;
  player_position: RegistrationPosition;
  amount: number;
  status: RegistrationStatus;
  created_at: string;
  paid_at: string | null;
}

export interface Album {
  id: string;
  slug: string;
  title: string;
  album_date: string | null;
  event_id: string | null;
  cover_photo_id: string | null;
  is_published: boolean;
  created_at: string;
}

export interface Photo {
  id: string;
  album_id: string;
  path: string;
  alt: string;
  caption: string | null;
  width: number | null;
  height: number | null;
  sort: number;
  created_at: string;
}

export interface SparringFormData {
  clubName: string;
  picName: string;
  whatsapp: string;
  date: string;
  time?: string;
  venue?: string;
  playerCount?: string;
  note?: string;
  adminWa: string;
}

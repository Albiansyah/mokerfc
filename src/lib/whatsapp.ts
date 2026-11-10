// ponytail: WhatsApp link and prefilled message generator for V2 registration and sparring.
import { formatRupiah } from "./money";

export function buildWhatsAppLink(phone: string, text: string): string {
  const cleanPhone = phone.replace(/\D/g, "");
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
}

export function buildWhatsAppShareLink(text: string): string {
  return `https://wa.me/?text=${encodeURIComponent(text)}`;
}

export function getEventWhatsAppMessage(title: string, date: string): string {
  return `Halo admin, saya mau tanya soal acara: ${title} (${date}).`;
}

export function getRegistrationWhatsAppMessage(params: {
  code: string;
  eventTitle: string;
  eventDate: string;
  fullName: string;
  nickname?: string | null;
  position: "gk" | "player";
  phone: string;
  total: number;
}): string {
  const posLabel = params.position === "gk" ? "Kiper (GK)" : "Pemain";
  const nameWithNick = params.nickname
    ? `${params.fullName} (${params.nickname})`
    : params.fullName;

  return [
    "Halo admin Moker FC United, saya sudah daftar.",
    `Kode: ${params.code}`,
    `Acara: ${params.eventTitle} (${params.eventDate})`,
    `Nama: ${nameWithNick}`,
    `Posisi: ${posLabel}`,
    `No. HP: ${params.phone}`,
    `Total: ${formatRupiah(params.total)}`,
    "Bukti transfer saya lampirkan di chat ini.",
  ].join("\n");
}

export function getEventShareMessage(title: string, date: string, pageUrl: string): string {
  return `Ayo main mini soccer bersama Moker FC United! Acara: ${title} (${date}). Info & pendaftaran: ${pageUrl}`;
}

export function getSparringWhatsAppMessage(data: {
  clubName: string;
  picName: string;
  whatsapp: string;
  date: string;
  time?: string;
  venue?: string;
  playerCount?: string;
  note?: string;
}): string {
  const lines = [
    `Halo admin Moker FC United, kami dari klub ${data.clubName} mengajak sparring.`,
    `Penanggung jawab: ${data.picName}`,
    `Nomor WhatsApp: ${data.whatsapp}`,
    `Usulan tanggal: ${data.date}`,
  ];

  if (data.time) lines.push(`Usulan jam: ${data.time}`);
  if (data.venue) lines.push(`Usulan lokasi: ${data.venue}`);
  if (data.playerCount) lines.push(`Jumlah pemain: ${data.playerCount}`);
  if (data.note) lines.push(`Catatan: ${data.note}`);

  return lines.join("\n");
}

import assert from "node:assert/strict";
import { buildWhatsAppLink, getRegistrationWhatsAppMessage, getEventWhatsAppMessage, getSparringWhatsAppMessage } from "../src/lib/whatsapp.ts";
import { buildIcsContent } from "../src/lib/ics.ts";
import { formatDateIndo, formatDateOnly, isUpcoming, getTimeRemaining } from "../src/lib/dates.ts";
import { normalizePhone } from "../src/lib/registration.ts";
import { eventInputFromForm, escapeCsvCell, movePhoto, storageObjectPath, validateSettingsInput } from "../src/lib/admin.ts";
import { isAdminRoute } from "../src/lib/navigation.ts";

console.log("Running self-check test suite...");

// 1. WhatsApp link & messages
const registrationMsg = getRegistrationWhatsAppMessage({
  code: "MFC-7K3Q9A",
  eventTitle: "Laga Persahabatan",
  eventDate: "20 Desember 2026",
  fullName: "Budi Santoso",
  nickname: "Budi",
  position: "player",
  phone: "628123456789",
  total: 40000,
});
assert.ok(registrationMsg.includes("Kode: MFC-7K3Q9A"));
assert.ok(registrationMsg.includes("Bukti transfer saya lampirkan"));

const waLink = buildWhatsAppLink("6281615334069", registrationMsg);
assert.ok(waLink.startsWith("https://wa.me/6281615334069?text="));
assert.equal(normalizePhone("0812-3456-7890"), "6281234567890");
assert.equal(normalizePhone("+6281234567890"), "6281234567890");
assert.equal(normalizePhone("6201"), null);

const eventForm = new FormData();
eventForm.set("title", "  Laga Mingguan  ");
eventForm.set("type", "internal");
eventForm.set("event_date", "2026-12-20");
eventForm.set("start_time", "19:00");
eventForm.set("venue_name", "GOR Mojopahit");
eventForm.set("quota_total", "20");
eventForm.set("quota_gk", "2");
eventForm.set("benefits", "Jersey\nAir mineral\n\n");
eventForm.set("cover_path", "https://example.test/event-cover.jpg");
const parsedEvent = eventInputFromForm(eventForm);
assert.equal(parsedEvent.ok, true);
assert.equal(parsedEvent.value.title, "Laga Mingguan");
assert.deepEqual(parsedEvent.value.benefits, ["Jersey", "Air mineral"]);
assert.equal(parsedEvent.value.quota_total, 20);
assert.equal(parsedEvent.value.cover_path, "https://example.test/event-cover.jpg");

const invalidEvent = new FormData();
assert.equal(eventInputFromForm(invalidEvent).ok, false);
assert.equal(escapeCsvCell('Budi, "Kiper"'), '"Budi, ""Kiper"""');
assert.equal(validateSettingsInput({ default_price_gk: -1, default_price_player: 40000 }).ok, false);

const photoOrder = movePhoto([
  { id: "a", sort: 0 },
  { id: "b", sort: 1 },
  { id: "c", sort: 2 },
], 1, -1);
assert.deepEqual(photoOrder.map((photo) => [photo.id, photo.sort]), [["b", 0], ["a", 1], ["c", 2]]);
assert.equal(storageObjectPath("https://example.supabase.co/storage/v1/object/public/gallery/album/photo.jpg", "gallery"), "album/photo.jpg");
assert.equal(storageObjectPath("not-a-storage-url", "gallery"), null);
assert.equal(isAdminRoute("/admin"), true);
assert.equal(isAdminRoute("/admin/login"), true);
assert.equal(isAdminRoute("/acara/admin"), false);

const eventMsg = getEventWhatsAppMessage("Sparring vs Tim A", "2026-12-01");
assert.equal(eventMsg, "Halo admin, saya mau tanya soal acara: Sparring vs Tim A (2026-12-01).");

const sparringMsg = getSparringWhatsAppMessage({
  clubName: "Majapahit FC",
  picName: "Budi",
  whatsapp: "08123456789",
  date: "2026-12-15",
  time: "19:30",
  venue: "Lapangan A",
});
assert.ok(sparringMsg.includes("Majapahit FC"));
assert.ok(sparringMsg.includes("Penanggung jawab: Budi"));
assert.ok(sparringMsg.includes("Usulan jam: 19:30"));

// 2. ICS calendar generation
const mockEvent = {
  id: "test-event-id",
  slug: "laga-uji-coba",
  title: "Laga Persahabatan",
  type: "pertandingan",
  event_date: "2026-12-20",
  start_time: "19:00",
  end_time: null,
  venue_name: "Lapangan Kranggan",
  venue_address: null,
  maps_url: null,
  description: "Bawa jersey merah",
  benefits: [],
  quota_total: null,
  quota_gk: null,
  price_gk: null,
  price_player: null,
  cover_path: null,
  status: "published",
  created_at: "2026-01-01T00:00:00.000Z",
};
const ics = buildIcsContent(mockEvent);
assert.ok(ics.includes("BEGIN:VCALENDAR"));
assert.ok(ics.includes("BEGIN:VEVENT"));
assert.ok(ics.includes("SUMMARY:Laga Persahabatan - Moker FC United"));
assert.ok(ics.includes("LOCATION:Lapangan Kranggan"));
assert.ok(ics.includes("Durasi perkiraan 90 menit"));
assert.ok(ics.includes("END:VCALENDAR"));

// 3. Date helpers
const formatted = formatDateIndo("2026-08-17");
assert.ok(formatted.includes("2026"));

const dateOnly = formatDateOnly("2026-08-17");
assert.equal(dateOnly.day, "17");
assert.equal(dateOnly.year, "2026");

assert.equal(isUpcoming("2020-01-01", "00:00"), false);
assert.equal(isUpcoming("2030-01-01", "00:00"), true);

const rem = getTimeRemaining("2030-01-01", "00:00");
assert.equal(rem.ended, false);
assert.ok(rem.days > 0);

console.log("All self-checks passed successfully!");

// ponytail: Client-side .ics generator for ClubEvent in Asia/Jakarta timezone.
import type { ClubEvent } from "./types";

function pad(num: number): string {
  return String(num).padStart(2, "0");
}

function parseDateTime(dateStr: string, timeStr: string): Date {
  const [year, month, day] = dateStr.split("-").map(Number);
  const [hours, minutes] = (timeStr || "00:00").split(":").map(Number);
  return new Date(Date.UTC(year, month - 1, day, (hours || 0) - 7, minutes || 0));
}

function formatUtcIcs(date: Date): string {
  return (
    date.getUTCFullYear() +
    pad(date.getUTCMonth() + 1) +
    pad(date.getUTCDate()) +
    "T" +
    pad(date.getUTCHours()) +
    pad(date.getUTCMinutes()) +
    pad(date.getUTCSeconds()) +
    "Z"
  );
}

export function buildIcsContent(event: ClubEvent): string {
  const startTime = event.start_time || "00:00";
  const startDate = parseDateTime(event.event_date, startTime);

  let endDate: Date;
  let descriptionNote = event.description || "";

  if (event.end_time) {
    endDate = parseDateTime(event.event_date, event.end_time);
  } else {
    endDate = new Date(startDate.getTime() + 90 * 60 * 1000);
    const durationNotice = "Durasi perkiraan 90 menit (waktu selesai tidak ditentukan).";
    descriptionNote = descriptionNote ? `${descriptionNote} (${durationNotice})` : durationNotice;
  }

  const nowStr = formatUtcIcs(new Date());
  const startStr = formatUtcIcs(startDate);
  const endStr = formatUtcIcs(endDate);
  const uid = `${event.slug || "event"}-${Date.now()}@mokerfc.id`;
  const location = [event.venue_name, event.venue_address].filter(Boolean).join(", ");

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Moker FC United//Kalender Acara//ID",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${nowStr}`,
    `DTSTART:${startStr}`,
    `DTEND:${endStr}`,
    `SUMMARY:${event.title} - Moker FC United`,
    `DESCRIPTION:${descriptionNote.replace(/\n/g, " ")}`,
    `LOCATION:${location}`,
    "STATUS:CONFIRMED",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

export function downloadIcs(event: ClubEvent): void {
  const content = buildIcsContent(event);
  const blob = new Blob([content], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `${event.slug || "acara-moker-fc"}.ics`;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

// ponytail: Date and time helpers with id-ID locale and Asia/Jakarta timezone.

export function formatDateIndo(dateStr: string, options?: Intl.DateTimeFormatOptions): string {
  try {
    const [year, month, day] = dateStr.split("-").map(Number);
    const date = new Date(year, month - 1, day);
    const defaultOptions: Intl.DateTimeFormatOptions = {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
      ...options,
    };
    return new Intl.DateTimeFormat("id-ID", defaultOptions).format(date);
  } catch {
    return dateStr;
  }
}

export function formatDateOnly(dateStr: string): { day: string; month: string; year: string; weekday: string } {
  try {
    const [year, month, day] = dateStr.split("-").map(Number);
    const date = new Date(year, month - 1, day);
    const dayStr = String(day).padStart(2, "0");
    const monthStr = new Intl.DateTimeFormat("id-ID", { month: "short" }).format(date).toUpperCase();
    const weekdayStr = new Intl.DateTimeFormat("id-ID", { weekday: "short" }).format(date).toUpperCase();
    return { day: dayStr, month: monthStr, year: String(year), weekday: weekdayStr };
  } catch {
    return { day: "--", month: "---", year: "----", weekday: "---" };
  }
}

export function formatTime(timeStr: string | null | undefined): string {
  if (!timeStr) return "";
  const parts = timeStr.split(":");
  return `${parts[0]}:${parts[1]}`;
}

export function isUpcoming(dateStr: string, startTime: string = "00:00"): boolean {
  try {
    const [year, month, day] = dateStr.split("-").map(Number);
    const [hour, min] = (startTime || "00:00").split(":").map(Number);
    const eventDate = new Date(year, month - 1, day, hour || 0, min || 0);
    return eventDate.getTime() >= Date.now();
  } catch {
    return false;
  }
}

export function getTimeRemaining(targetDateStr: string, startTime: string = "00:00") {
  try {
    const [year, month, day] = targetDateStr.split("-").map(Number);
    const [hour, min] = (startTime || "00:00").split(":").map(Number);
    const target = new Date(year, month - 1, day, hour || 0, min || 0).getTime();
    const diff = target - Date.now();

    if (diff <= 0) {
      return { total: 0, days: 0, hours: 0, minutes: 0, seconds: 0, ended: true };
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / 1000 / 60) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    return { total: diff, days, hours, minutes, seconds, ended: false };
  } catch {
    return { total: 0, days: 0, hours: 0, minutes: 0, seconds: 0, ended: true };
  }
}

"use client";

import { ClubEvent } from "@/lib/types";
import { downloadIcs } from "@/lib/ics";
import { buildWhatsAppShareLink, getEventShareMessage } from "@/lib/whatsapp";
import { Button } from "@/components/ui/Button";

export function EventDetailActions({ event }: { event: ClubEvent }) {
  const url = typeof window === "undefined" ? "" : window.location.href;
  const share = buildWhatsAppShareLink(getEventShareMessage(event.title, event.event_date, url));

  // Fungsi buat generate link Google Calendar
  const getGoogleCalendarLink = () => {
    // Format tanggal: YYYYMMDD
    const dateStr = event.event_date.replace(/-/g, "");
    // Format waktu: HHmmss
    const startStr = event.start_time.replace(/:/g, "") + "00";
    
    let endStr = "";
    if (event.end_time) {
      endStr = event.end_time.replace(/:/g, "") + "00";
    } else {
      // Kalau jam selesai kosong, default tambah 2 jam
      const [hours, minutes] = event.start_time.split(":").map(Number);
      const endHours = String((hours + 2) % 24).padStart(2, "0");
      endStr = `${endHours}${String(minutes).padStart(2, "0")}00`;
    }

    const dates = `${dateStr}T${startStr}/${dateStr}T${endStr}`;
    
    const params = new URLSearchParams({
      action: "TEMPLATE",
      text: event.title,
      dates: dates,
      details: event.description || "Fun Match Moker FC United",
      location: event.venue_name,
    });

    return `https://calendar.google.com/calendar/render?${params.toString()}`;
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
      <div className="text-lg font-bold text-navy mb-4">Bagikan & Simpan Jadwal</div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
        {/* Tombol Google Calendar */}
        <Button 
          href={getGoogleCalendarLink()}
          isExternal
          variant="secondary" 
          className="w-full bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700"
        >
          <svg className="w-5 h-5 mr-2 text-red" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19.5 22h-15A2.5 2.5 0 0 1 2 19.5v-15A2.5 2.5 0 0 1 4.5 2h15A2.5 2.5 0 0 1 22 4.5v15a2.5 2.5 0 0 1-2.5 2.5zM4.5 4a.5.5 0 0 0-.5.5v15a.5.5 0 0 0 .5.5h15a.5.5 0 0 0 .5-.5v-15a.5.5 0 0 0-.5-.5h-15zm4.5 8.5v6H7v-6h2zm6 0v6h-2v-6h2zm-2-5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zm4 5h-2v6h2v-6z"/>
          </svg>
          Google Calendar
        </Button>

        {/* Tombol Apple / Outlook (.ics) */}
        <Button 
          type="button" 
          onClick={() => downloadIcs(event)} 
          variant="secondary" 
          className="w-full bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700"
        >
          <svg className="w-5 h-5 mr-2 text-navy" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Apple / Outlook
        </Button>
      </div>

      {/* Tombol Share WhatsApp */}
      <Button 
        href={share} 
        variant="primary" 
        isExternal 
        className="w-full shadow-lg shadow-red/20"
      >
        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
        Bagikan via WhatsApp
      </Button>
    </div>
  );
}
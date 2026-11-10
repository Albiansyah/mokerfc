import Link from "next/link";
import { requireAdmin } from "@/lib/supabase/admin";
import type { ClubEvent } from "@/lib/types";
import { formatDateIndo } from "@/lib/dates";

export default async function AdminEventsPage() {
  const { supabase } = await requireAdmin();
  const { data: eventsData } = await supabase.from("events").select("*").order("event_date", { ascending: false });
  const events = (eventsData ?? []) as ClubEvent[];

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header Halaman */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          {/* Pake div biar ga kena style global h1 */}
          <div className="text-2xl sm:text-3xl font-bold text-navy mb-1">Daftar Acara</div>
          <p className="text-slate-500 text-sm">Kelola jadwal pertandingan dan fun match.</p>
        </div>
        <Link 
          href="/admin/acara/baru" 
          className="inline-flex items-center justify-center min-h-10 px-5 rounded-xl bg-red text-white font-bold hover:bg-red-700 transition-colors shadow-sm text-sm shrink-0"
        >
          + Buat Acara Baru
        </Link>
      </div>

      {/* List Acara */}
      {events.length === 0 ? (
        <div className="bg-white border border-dashed border-slate-300 rounded-2xl p-12 text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div className="text-lg font-bold text-navy mb-1">Belum ada acara</div>
          <p className="text-slate-500 text-sm">Gunakan tombol di atas untuk membuat jadwal pertandingan baru.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {events.map((evt) => (
            <article key={evt.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-col md:flex-row justify-between md:items-center gap-4 hover:shadow-md transition-shadow">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-wider">
                    {evt.status}
                  </span>
                  {/* Pake div biar ga kena style global h2 */}
                  <div className="text-lg font-bold text-navy line-clamp-1">{evt.title}</div>
                </div>
                <p className="text-sm text-slate-500">
                  {formatDateIndo(evt.event_date)} &middot; {evt.start_time.slice(0,5)} WIB &middot; {evt.venue_name}
                </p>
              </div>
              <div className="flex gap-2 shrink-0">
                <Link 
                  href={`/admin/acara/${evt.id}/pendaftar`} 
                  className="inline-flex items-center justify-center min-h-9 px-4 rounded-lg bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  Pendaftar
                </Link>
                <Link 
                  href={`/admin/acara/${evt.id}`} 
                  className="inline-flex items-center justify-center min-h-9 px-4 rounded-lg bg-navy text-white text-xs font-semibold hover:bg-navy/90 transition-colors"
                >
                  Edit
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
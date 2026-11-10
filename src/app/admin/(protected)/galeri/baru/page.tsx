import { AlbumForm } from "@/components/admin/AlbumForm";
import { requireAdmin } from "@/lib/supabase/admin";
import type { ClubEvent } from "@/lib/types";

export default async function NewAlbumPage() {
  const { supabase } = await requireAdmin();
  const { data: eventsData } = await supabase.from("events").select("*").order("event_date", { ascending: false });
  const events = (eventsData ?? []) as ClubEvent[];

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        {/* Tag h1 diganti div biar ga kena style jumbo */}
        <div className="text-2xl sm:text-3xl font-bold text-navy mb-1">Buat Album Baru</div>
        <p className="text-slate-500 text-sm">Isi detail album, lalu tambahkan fotonya setelah disimpan.</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <AlbumForm events={events} />
      </div>
    </div>
  );
}
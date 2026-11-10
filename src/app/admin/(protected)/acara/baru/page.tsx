import { EventForm } from "@/components/admin/EventForm";
import { getSettings } from "@/lib/queries";

export default async function NewEventPage() {
  const settings = await getSettings();

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        {/* Tag h1 diganti div biar ga kena style jumbo */}
        <div className="text-2xl sm:text-3xl font-bold text-navy mb-1">Acara Baru</div>
        <p className="text-slate-500 text-sm">Buat jadwal pertandingan atau fun match baru.</p>
      </div>
      
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <EventForm settings={settings} />
      </div>
    </div>
  );
}
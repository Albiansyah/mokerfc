import { EventForm } from "@/components/admin/EventForm";
import { getSettings } from "@/lib/queries";

export default async function NewEventPage() {
  const settings = await getSettings();

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-navy">Acara Baru</h1>
        <p className="text-slate-500 mt-1">Buat jadwal pertandingan atau fun match baru.</p>
      </div>
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <EventForm settings={settings} />
      </div>
    </div>
  );
}
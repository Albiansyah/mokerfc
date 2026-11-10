import { notFound } from "next/navigation";
import { EventForm } from "@/components/admin/EventForm";
import { requireAdmin } from "@/lib/supabase/admin";
import type { ClubEvent, Settings } from "@/lib/types";

export default async function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { supabase } = await requireAdmin();
  
  const [{ data: event }, { data: settings }] = await Promise.all([
    supabase.from("events").select("*").eq("id", id).single(), 
    supabase.from("settings").select("*").eq("id", 1).single()
  ]);

  if (!event) notFound();

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-navy">Edit Acara</h1>
        <p className="text-slate-500 mt-1">Perbarui informasi jadwal atau kuota pertandingan.</p>
      </div>
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <EventForm event={event as ClubEvent} settings={settings as Settings} />
      </div>
    </div>
  );
}
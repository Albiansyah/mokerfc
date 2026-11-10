import type { Metadata } from "next";
import { getPublicEvents } from "@/lib/queries";
import { EventsContent } from "./EventsContent";

export const metadata: Metadata = {
  title: "Jadwal Acara & Pertandingan",
  description:
    "Jadwal pertandingan mini soccer dan internal match Moker FC United Mojokerto.",
};

export default async function AcaraPage() {
  const { events, error } = await getPublicEvents();

  return (
    // Padding atas dikurangi drastis (pt-4 lg:pt-6) biar langsung naik ke atas
    <div className="w-full bg-slate-50 pt-4 pb-16 lg:pt-6 lg:pb-20 min-h-screen">
      <div className="max-w-300 mx-auto px-6 lg:px-8">
        
        {/* Label "Agenda Klub" udah dihapus total */}
        <EventsContent initialEvents={events} fetchError={error} />
        
      </div>
    </div>
  );
}
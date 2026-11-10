import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { EventDetailActions } from "./EventDetailActions";
import { RegisterCard } from "@/components/sections/RegisterCard";
import { getEventBySlug, getSettings } from "@/lib/queries";
import { formatDateIndo } from "@/lib/dates";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const event = await getEventBySlug((await params).slug);
  return event 
    ? { title: event.title, description: `${event.title}, ${formatDateIndo(event.event_date)} di ${event.venue_name}.`, openGraph: { images: event.cover_path ? [event.cover_path] : ["/brand/logo-full.png"] } } 
    : { title: "Acara Tidak Ditemukan" };
}

export default async function EventDetailPage({ params }: Props) {
  const event = await getEventBySlug((await params).slug);
  if (!event) notFound();
  const settings = await getSettings();

  return (
    <div className="w-full bg-slate-50 pb-20">
      
      {/* Header Hero Section */}
      <section className="relative bg-navy text-white pt-12 pb-28 lg:pt-16 lg:pb-36 overflow-hidden">
        {/* Efek Latar Belakang */}
        <div className="absolute top-0 right-0 w-150 h-150 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>

        <div className="max-w-300 mx-auto px-6 lg:px-8 relative z-10">
          <Link href="/acara" className="inline-flex items-center gap-2 text-gold hover:text-white transition-colors mb-8 text-sm font-semibold">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Kembali ke Daftar Acara
          </Link>
          
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <span className="inline-block px-3 py-1 rounded-full bg-white/10 text-gold text-xs font-bold uppercase tracking-wider mb-4">
                {event.type === "pertandingan" ? "Pertandingan" : "Internal Match"}
              </span>
              
              {/* Menggunakan div, bukan h1, agar tidak terkena style jumbo */}
              <div className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-6">
                {event.title}
              </div>
              
              <div className="flex flex-col sm:flex-row gap-5 text-slate-300">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-red shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-sm font-medium">{formatDateIndo(event.event_date, { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-red shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm font-medium">Pukul {event.start_time.slice(0, 5)} {event.end_time ? `- ${event.end_time.slice(0, 5)}` : "WIB"}</span>
                </div>
              </div>
            </div>

            {event.cover_path && (
              <div className="relative aspect-video lg:aspect-4/3 rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                <Image src={event.cover_path} alt={`Cover ${event.title}`} fill className="object-cover" priority />
                <div className="absolute inset-0 bg-linear-to-t from-navy/60 via-transparent to-transparent"></div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Konten Utama */}
      <main className="max-w-300 mx-auto px-6 lg:px-8 -mt-16 relative z-20 grid lg:grid-cols-12 gap-8">
        
        {/* Kolom Kiri: Info Detail */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Card Lokasi */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
            <div className="text-xl font-bold text-navy mb-4">Lokasi Acara</div>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-red/10 text-red flex items-center justify-center shrink-0">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <p className="text-lg font-semibold text-slate-800">{event.venue_name}</p>
                {event.venue_address && <p className="text-slate-500 mt-1 text-sm">{event.venue_address}</p>}
                {event.maps_url && (
                  <a className="inline-flex items-center gap-2 text-red font-semibold mt-3 text-sm hover:underline" href={event.maps_url} target="_blank" rel="noreferrer">
                    Buka di Google Maps
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Card Benefit */}
          {event.benefits.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
              <div className="text-xl font-bold text-navy mb-5">Fasilitas & Benefit</div>
              <ul className="grid sm:grid-cols-2 gap-4">
                {event.benefits.map((benefit) => (
                  <li key={benefit} className="flex items-start gap-2.5 text-slate-600 text-sm">
                    <svg className="w-5 h-5 text-gold shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Card Deskripsi */}
          {event.description && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
              <div className="text-xl font-bold text-navy mb-4">Deskripsi Acara</div>
              <p className="text-slate-600 leading-relaxed whitespace-pre-line text-sm sm:text-base">
                {event.description}
              </p>
            </div>
          )}

          {/* Tombol Aksi */}
          <EventDetailActions event={event} />
        </div>

        {/* Kolom Kanan: Form Pendaftaran (Sticky) */}
        <aside id="daftar" className="lg:col-span-5 relative">
          <div className="lg:sticky lg:top-24">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xl border-t-4 border-t-red">
              <RegisterCard event={event} settings={settings} />
            </div>
          </div>
        </aside>

      </main>
    </div>
  );
}
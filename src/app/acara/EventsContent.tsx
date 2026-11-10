"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ClubEvent, EventCount } from "@/lib/types";
import { formatDateOnly, isUpcoming } from "@/lib/dates";
import { formatRupiah } from "@/lib/money";
import { Button } from "@/components/ui/Button";

type PublicEvent = ClubEvent & { counts?: EventCount };

export function EventsContent({ initialEvents, fetchError }: { initialEvents: PublicEvent[]; fetchError: string | null }) {
  const [activeTab, setActiveTab] = useState<"terdekat" | "akan-datang" | "selesai">("terdekat");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDate, setFilterDate] = useState("");

  const filteredEvents = useMemo(() => {
    let events = [...initialEvents];

    const upcomingEvents = events.filter((event) => isUpcoming(event.event_date, event.start_time)).sort((a, b) => new Date(a.event_date).getTime() - new Date(b.event_date).getTime());
    const pastEvents = events.filter((event) => !isUpcoming(event.event_date, event.start_time)).sort((a, b) => new Date(b.event_date).getTime() - new Date(a.event_date).getTime());

    if (activeTab === "terdekat") {
      events = upcomingEvents.slice(0, 1);
    } else if (activeTab === "akan-datang") {
      events = upcomingEvents;
    } else {
      events = pastEvents;
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      events = events.filter(
        (e) => e.title.toLowerCase().includes(q) || e.venue_name.toLowerCase().includes(q)
      );
    }

    if (filterDate) {
      events = events.filter((e) => e.event_date === filterDate);
    }

    return events;
  }, [initialEvents, activeTab, searchQuery, filterDate]);

  if (fetchError) {
    return (
      <div className="p-8 text-center bg-white border border-red-200 rounded-2xl shadow-sm text-red">
        <p className="font-semibold">Acara tidak dapat dimuat. Coba lagi nanti.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm mb-8 flex flex-col lg:flex-row gap-4 items-center justify-between">
        
        <div className="flex bg-slate-100 p-1 rounded-xl w-full lg:w-auto overflow-x-auto">
          {(["terdekat", "akan-datang", "selesai"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 lg:flex-none whitespace-nowrap px-4 py-2 rounded-lg text-sm font-bold transition-all duration-200 ${
                activeTab === tab ? "bg-white text-navy shadow-sm" : "text-slate-500 hover:text-navy"
              }`}
            >
              {tab === "terdekat" ? "Terdekat" : tab === "akan-datang" ? "Akan Datang" : "Selesai"}
            </button>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          <div className="relative w-full sm:w-64">
            <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Cari acara atau lokasi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red/20 focus:border-red transition-all"
            />
          </div>
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="w-full sm:w-auto px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-red/20 focus:border-red transition-all"
          />
          {(searchQuery || filterDate) && (
            <button
              onClick={() => { setSearchQuery(""); setFilterDate(""); }}
              className="text-sm text-red font-semibold hover:underline px-2"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {filteredEvents.length === 0 ? (
        <div className="bg-white border border-dashed border-slate-300 rounded-2xl p-12 text-center max-w-xl mx-auto">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          {/* UBAH DARI H2 KE H3 AGAR TIDAK RAKSASA */}
          <h3 className="text-xl font-bold text-navy mb-2">
            Acara tidak ditemukan
          </h3>
          <p className="text-slate-500 text-sm">
            Coba ubah filter, tanggal, atau kata kunci pencarian kamu.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => {
            const date = formatDateOnly(event.event_date);
            const total = event.counts?.total ?? 0;
            const full = event.quota_total !== null && total >= event.quota_total;
            const isClosed = event.status === "cancelled" || event.status === "closed" || full;
            
            let label = null;
            if (event.status === "cancelled") label = "Dibatalkan";
            else if (event.status === "closed") label = "Ditutup";
            else if (full) label = "Kuota Penuh";

            return (
              <Link 
                href={`/acara/${event.slug}`}
                key={event.id} 
                className="group relative flex flex-col bg-white rounded-2xl border border-slate-200 overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-red/30 cursor-pointer"
              >
                <div className="bg-navy p-5 flex items-center justify-between text-white">
                  <div>
                    <p className="text-3xl font-extrabold text-red leading-none">{date.day}</p>
                    <p className="font-bold uppercase tracking-widest text-xs mt-1">{date.month}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-semibold text-slate-300">{date.weekday}</p>
                    <p className="text-[10px] text-slate-400">{event.start_time.slice(0, 5)} WIB</p>
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col">
                  <span className="inline-block px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-wider mb-3 w-fit">
                    {event.type === "pertandingan" ? "Pertandingan" : "Internal Match"}
                  </span>
                  <h2 className="text-lg font-bold text-navy mb-2 line-clamp-2 group-hover:text-red transition-colors">
                    {event.title}
                  </h2>
                  <p className="text-sm text-slate-500 mb-4 flex items-center gap-1.5 line-clamp-1">
                    <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {event.venue_name}
                  </p>
                  
                  <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                    <span>GK: <strong className="text-navy">{formatRupiah(event.price_gk ?? 0)}</strong></span>
                    <span>Pemain: <strong className="text-navy">{formatRupiah(event.price_player ?? 0)}</strong></span>
                  </div>
                </div>

                <div className="p-5 pt-0 flex gap-2 relative z-10">
                  <Button 
                    href={`/acara/${event.slug}`} 
                    variant="secondary" 
                    className="flex-1 text-sm border-slate-200 text-slate-600 hover:bg-slate-50"
                  >
                    Detail
                  </Button>
                  {label ? (
                    <Button variant="secondary" disabled className="flex-1 bg-slate-100 text-slate-400 border-none text-sm">
                      {label}
                    </Button>
                  ) : (
                    <Button href={`/acara/${event.slug}#daftar`} variant="primary" className="flex-1 text-sm shadow-md shadow-red/10">
                      Daftar
                    </Button>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
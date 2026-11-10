import React from "react";
import Link from "next/link";
import { ClubEvent, EventCount } from "@/lib/types";
import { formatDateOnly } from "@/lib/dates";

export interface EventStripProps {
  events: (ClubEvent & { counts?: EventCount })[];
}

export function EventStrip({ events }: EventStripProps) {
  const displayEvents = events.slice(0, 3);

  return (
    <section className="w-full py-20 lg:py-28 bg-slate-50 border-b border-slate-100">
      <div className="max-w-300 mx-auto px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <span className="block text-sm font-semibold tracking-wider text-gold mb-2 uppercase">
              Jadwal Mendatang
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-navy">
              Acara Klub
            </h2>
          </div>
          <Link
            href="/acara"
            className="inline-flex items-center gap-2 font-semibold text-red hover:text-red-700 transition-colors"
          >
            Lihat semua acara
            <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>

        {displayEvents.length === 0 ? (
          <div className="p-12 text-center rounded-2xl border border-slate-200 bg-white">
            <p className="text-slate-500 font-medium">
              Belum ada jadwal acara mendatang yang terdaftar.
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {displayEvents.map((evt) => {
              const { day, month, weekday } = formatDateOnly(evt.event_date);
              return (
                <div
                  key={evt.slug}
                  className="group flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 rounded-2xl bg-white border border-slate-200 transition-all hover:border-red/30 hover:shadow-md"
                >
                  <div className="flex items-center gap-5 min-w-[140px]">
                    <div className="text-4xl font-bold text-red leading-none">
                      {day}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-navy uppercase leading-none">
                        {month}
                      </span>
                      <span className="text-xs text-slate-500 uppercase font-medium mt-1">
                        {weekday}
                      </span>
                    </div>
                  </div>

                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold uppercase tracking-wider">
                        {evt.type === "pertandingan" ? "Pertandingan" : "Internal"}
                      </span>
                      <h3 className="text-xl font-bold text-navy group-hover:text-red transition-colors">
                        <Link href={`/acara/${evt.slug}`}>
                          {evt.title}
                        </Link>
                      </h3>
                    </div>
                    <p className="text-sm text-slate-500">
                      Pukul {evt.start_time.slice(0, 5)} {evt.end_time ? `sampai ${evt.end_time.slice(0, 5)}` : "WIB"} di {evt.venue_name}
                    </p>
                  </div>

                  <div>
                    <Link
                      href={`/acara/${evt.slug}`}
                      className="inline-flex items-center justify-center min-h-11 px-6 py-2 rounded-lg border border-slate-200 text-sm font-semibold text-navy hover:bg-slate-50 transition-colors"
                    >
                      Detail Acara
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
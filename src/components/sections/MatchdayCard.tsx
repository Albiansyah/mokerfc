"use client";

import React from "react";
import Link from "next/link";
import { ClubEvent, EventCount, Settings } from "@/lib/types";
import { formatDateOnly } from "@/lib/dates";
import { formatRupiah } from "@/lib/money";
import { downloadIcs } from "@/lib/ics";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { QuotaBar } from "../ui/QuotaBar";
import { Countdown } from "../ui/Countdown";
import { Button } from "../ui/Button";

export interface MatchdayCardProps {
  event: (ClubEvent & { counts?: EventCount }) | null;
  settings: Settings;
  className?: string;
}

export function MatchdayCard({ event, settings, className = "" }: MatchdayCardProps) {
  const primaryAdmin = settings.wa_admin_1 || "6281615334069";

  if (!event) {
    const waLink = buildWhatsAppLink(
      primaryAdmin,
      "Halo admin, mau tanya jadwal laga terdekat Moker FC United."
    );

    return (
      <div
        className={`bg-white text-slate-800 p-6 rounded-2xl border border-slate-200 shadow-xl relative ${className}`}
      >
        <span className="inline-block text-xs font-bold uppercase tracking-wider text-gold mb-2">
          Laga Terdekat
        </span>
        <h3 className="text-xl sm:text-2xl font-bold text-navy mb-2">
          Jadwal main berikutnya segera diumumkan
        </h3>
        <p className="text-sm text-slate-600 mb-5 max-w-lg leading-relaxed">
          Pantau terus informasi sparring dan internal match Moker FC United. Hubungi admin untuk pertanyaan jadwal.
        </p>
        <Button href={waLink} variant="primary" isExternal size="sm">
          Chat Admin via WhatsApp
        </Button>
      </div>
    );
  }

  const { day, month, weekday } = formatDateOnly(event.event_date);
  const totalTaken = event.counts?.total || 0;
  const isFull = event.quota_total !== null && totalTaken >= event.quota_total;
  const isClosed = event.status === "closed" || isFull;

  const priceGk = event.price_gk ?? settings.default_price_gk;
  const pricePlayer = event.price_player ?? settings.default_price_player;

  return (
    <div
      className={`bg-white text-slate-800 p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xl relative ${className}`}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 items-center">
        
        <div className="lg:col-span-2 flex lg:flex-col items-center justify-center p-3 bg-navy text-white rounded-xl text-center gap-2">
          <span className="text-[10px] uppercase font-bold tracking-widest text-gold">
            {weekday}
          </span>
          <span className="text-3xl font-extrabold tabular-nums text-red leading-none">
            {day}
          </span>
          <span className="text-sm font-bold uppercase tracking-wider">
            {month}
          </span>
        </div>

        <div className="lg:col-span-5 flex flex-col justify-center">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full bg-navy text-gold text-[10px] font-bold uppercase tracking-wider">
              {event.type === "pertandingan" ? "Pertandingan" : "Internal Match"}
            </span>
          </div>

          <h3 className="text-lg sm:text-xl font-bold text-navy leading-tight mb-2">
            <Link href={`/acara/${event.slug}`} className="hover:text-red transition-colors">
              {event.title}
            </Link>
          </h3>

          <div className="text-xs sm:text-sm text-slate-500 space-y-0.5">
            <p className="font-semibold tabular-nums">
              Pukul {event.start_time.slice(0, 5)} {event.end_time ? `sampai ${event.end_time.slice(0, 5)}` : "WIB"}
            </p>
            <p>{event.venue_name}</p>
          </div>
        </div>

        <div className="lg:col-span-2 flex flex-col justify-center border-y lg:border-y-0 lg:border-x border-slate-200 py-3 lg:py-0 lg:px-4">
          <div className="text-[10px] font-bold uppercase tracking-wider mb-1 text-slate-400">
            Biaya Main
          </div>
          <div className="text-xs font-semibold tabular-nums space-y-0.5 mb-3 text-navy">
            <p>GK: <span className="text-red font-bold">{formatRupiah(priceGk)}</span></p>
            <p>Pemain: <span>{formatRupiah(pricePlayer)}</span></p>
          </div>
          <QuotaBar total={event.quota_total} taken={totalTaken} />
        </div>

        <div className="lg:col-span-3 flex flex-col justify-center gap-3">
          <Countdown targetDate={event.event_date} startTime={event.start_time} />

          <div className="flex gap-2">
            {isClosed ? (
              <Button variant="secondary" size="sm" disabled className="flex-1 opacity-60 text-xs">
                {event.status === "closed" ? "Ditutup" : "Kuota Penuh"}
              </Button>
            ) : (
              <Button href={`/acara/${event.slug}#daftar`} variant="primary" size="sm" className="flex-1 text-xs">
                Daftar
              </Button>
            )}
            <Button
              type="button"
              onClick={() => downloadIcs(event)}
              variant="secondary"
              size="sm"
              className="px-2.5"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
}
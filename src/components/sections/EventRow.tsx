"use client";

// ponytail: Horizontal event row with growing 6px red left bar on hover.
import React from "react";
import Link from "next/link";
import { ClubEvent, EventCount, Settings } from "@/lib/types";
import { formatDateOnly } from "@/lib/dates";
import { formatShortRupiah } from "@/lib/money";
import { Button } from "../ui/Button";

export interface EventRowProps {
  event: ClubEvent & { counts?: EventCount };
  settings: Settings;
}

export function EventRow({ event, settings }: EventRowProps) {
  const { day, month, weekday } = formatDateOnly(event.event_date);
  const totalTaken = event.counts?.total || 0;
  const isFull = event.quota_total !== null && totalTaken >= event.quota_total;
  const isClosed = event.status === "closed" || isFull;

  const priceGk = event.price_gk ?? settings.default_price_gk;
  const pricePlayer = event.price_player ?? settings.default_price_player;

  const remaining =
    event.quota_total !== null ? Math.max(0, event.quota_total - totalTaken) : null;

  return (
    <div className="group relative bg-[var(--surface)] text-[var(--ink)] dark:text-[var(--paper)] border border-[var(--border)] chamfer-sm p-5 sm:p-6 transition-all duration-200 hover:shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6 overflow-hidden">
      {/* Bar Merah Kiri Tumbuh 0 ke 6px saat hover (A4) */}
      <span
        aria-hidden="true"
        className="absolute top-0 bottom-0 left-0 w-0 group-hover:w-1.5 bg-[var(--red)] transition-all duration-200"
      />

      {/* Bagian Tanggal & Jam (Bergeser 4px saat hover) */}
      <div className="flex items-center gap-4 transition-transform duration-200 group-hover:translate-x-1 min-w-[170px]">
        <div className="chamfer-sm bg-[var(--navy)] text-white p-3 text-center min-w-[76px]">
          <span className="block text-3xl font-heading font-extrabold tabular-nums text-[var(--red)] leading-none">
            {day}
          </span>
          <span className="block text-xs font-heading font-bold uppercase mt-1 text-[var(--gold)]">
            {month}
          </span>
        </div>

        <div>
          <span className="block text-sm font-heading font-bold uppercase text-[var(--fg)]">
            {weekday}
          </span>
          <span className="block text-xs font-semibold tabular-nums opacity-75">
            Pukul {event.start_time.slice(0, 5)} WIB
          </span>
        </div>
      </div>

      {/* Bagian Judul, Lokasi, Label Jenis */}
      <div className="flex-1">
        <div className="flex flex-wrap items-center gap-2 mb-1.5">
          <span className="chamfer-sm px-2 py-0.5 bg-[var(--navy)] text-[var(--gold)] text-xs font-heading font-bold uppercase tracking-wider">
            {event.type === "pertandingan" ? "Pertandingan" : "Internal"}
          </span>
          {event.status === "closed" && (
            <span className="chamfer-sm px-2 py-0.5 bg-[var(--red)] text-white text-xs font-heading font-bold uppercase">
              Ditutup
            </span>
          )}
        </div>

        <h3 className="text-xl sm:text-2xl font-heading font-extrabold uppercase leading-tight">
          <Link href={`/acara/${event.slug}`} className="hover:text-[var(--red)]">
            {event.title}
          </Link>
        </h3>

        <p className="text-xs sm:text-sm opacity-80 mt-1">
          {event.venue_name}
        </p>
      </div>

      {/* Bagian Sisa Kuota & Harga */}
      <div className="flex flex-col sm:items-end justify-center min-w-[140px] text-xs sm:text-sm tabular-nums space-y-1">
        <div className="font-heading font-bold text-sm uppercase">
          {remaining !== null ? (
            <span className={isFull ? "text-[var(--red)]" : "text-[var(--gold)]"}>
              {isFull ? "Kuota Penuh" : `Sisa ${remaining} Kuota`}
            </span>
          ) : (
            <span className="opacity-80">Kuota Terbuka</span>
          )}
        </div>
        <div className="opacity-85 text-xs">
          GK {formatShortRupiah(priceGk)}, Pemain {formatShortRupiah(pricePlayer)}
        </div>
      </div>

      {/* Tombol Aksi */}
      <div className="flex-shrink-0">
        {isClosed ? (
          <Button
            href={`/acara/${event.slug}`}
            variant="secondary"
            size="sm"
            className="w-full sm:w-auto"
          >
            Lihat Detail
          </Button>
        ) : (
          <Button
            href={`/acara/${event.slug}#daftar`}
            variant="primary"
            size="sm"
            className="w-full sm:w-auto"
          >
            Daftar
          </Button>
        )}
      </div>
    </div>
  );
}

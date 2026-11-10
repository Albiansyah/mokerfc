"use client";

import React, { useState } from "react";
import { ClubEvent, EventCount, Settings } from "@/lib/types";
import { formatRupiah } from "@/lib/money";
import { Button } from "../ui/Button";

export interface RegisterCardProps {
  event: ClubEvent & { counts?: EventCount };
  settings: Settings;
}

export function RegisterCard({ event, settings }: RegisterCardProps) {
  const [position, setPosition] = useState<"gk" | "player">("player");

  const totalTaken = event.counts?.total || 0;
  const isFull = event.quota_total !== null && totalTaken >= event.quota_total;
  const isClosed = event.status === "closed" || isFull;

  const priceGk = event.price_gk ?? settings.default_price_gk;
  const pricePlayer = event.price_player ?? settings.default_price_player;

  const inputClass = "mt-1 block w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 focus:border-red focus:outline-none focus:ring-2 focus:ring-red/20 transition-all placeholder:text-slate-400";

  return (
    <div>
      {/* Header Form */}
      <div className="mb-6 pb-5 border-b border-slate-100">
        <div className="text-2xl font-bold text-navy mb-2">Daftar Main</div>
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-full text-xs font-semibold text-slate-600">
          <span className="w-2 h-2 rounded-full bg-green-500"></span>
          Tersisa {event.quota_total === null ? "Tanpa Batas" : Math.max(0, event.quota_total - totalTaken)} Slot
        </div>
      </div>

      <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
        
        {/* Input Nama & HP */}
        <div>
          <label className="block text-sm font-semibold text-slate-700">Nomor WhatsApp</label>
          <input type="tel" placeholder="Contoh: 08123456789" className={inputClass} required />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700">Nama Lengkap</label>
          <input type="text" placeholder="Sesuai KTP / Identitas" className={inputClass} required />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700">Nama Panggilan <span className="text-slate-400 font-normal">(Opsional)</span></label>
          <input type="text" placeholder="Nama untuk jersey" className={inputClass} />
        </div>

        {/* Pilihan Posisi (Card Radio) */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Pilih Posisi</label>
          <div className="grid grid-cols-1 gap-3">
            
            {/* Opsi Kiper */}
            <label className={`relative flex cursor-pointer rounded-xl border p-4 transition-all duration-200 ${
              position === "gk" 
                ? "border-red bg-red/5 ring-1 ring-red" 
                : "border-slate-200 bg-white hover:bg-slate-50"
            }`}>
              <input 
                type="radio" 
                name="position" 
                value="gk" 
                checked={position === "gk"} 
                onChange={() => setPosition("gk")}
                className="sr-only" 
              />
              <div className="flex w-full items-center justify-between">
                <div>
                  <p className="font-bold text-navy">Kiper (GK)</p>
                  <p className="text-sm text-slate-500">{formatRupiah(priceGk)}</p>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${position === "gk" ? "border-red" : "border-slate-300"}`}>
                  {position === "gk" && <div className="w-2.5 h-2.5 bg-red rounded-full" />}
                </div>
              </div>
            </label>

            {/* Opsi Pemain */}
            <label className={`relative flex cursor-pointer rounded-xl border p-4 transition-all duration-200 ${
              position === "player" 
                ? "border-red bg-red/5 ring-1 ring-red" 
                : "border-slate-200 bg-white hover:bg-slate-50"
            }`}>
              <input 
                type="radio" 
                name="position" 
                value="player" 
                checked={position === "player"} 
                onChange={() => setPosition("player")}
                className="sr-only" 
              />
              <div className="flex w-full items-center justify-between">
                <div>
                  <p className="font-bold text-navy">Pemain Lapangan</p>
                  <p className="text-sm text-slate-500">{formatRupiah(pricePlayer)}</p>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${position === "player" ? "border-red" : "border-slate-300"}`}>
                  {position === "player" && <div className="w-2.5 h-2.5 bg-red rounded-full" />}
                </div>
              </div>
            </label>

          </div>
        </div>

        {/* Total Biaya */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <span className="text-sm font-semibold text-slate-500">Total Biaya</span>
          <span className="text-2xl font-bold text-navy">
            {formatRupiah(position === "gk" ? priceGk : pricePlayer)}
          </span>
        </div>

        {/* Tombol Submit */}
        <Button 
          type="submit" 
          variant="primary" 
          size="lg" 
          disabled={isClosed}
          className="w-full justify-center mt-2 shadow-lg shadow-red/20"
        >
          {isClosed ? "Pendaftaran Ditutup" : "Daftar Sekarang"}
        </Button>
        
        <p className="text-center text-xs text-slate-400 mt-4 leading-relaxed">
          Dengan mendaftar, Anda menyetujui peraturan klub dan kebijakan pengembalian dana.
        </p>
      </form>
    </div>
  );
}
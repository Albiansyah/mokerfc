"use client";

import { useMemo, useState } from "react";
import { updateRegistrationStatusAction } from "@/app/admin/actions";
import { escapeCsvCell } from "@/lib/admin";
import { formatRupiah } from "@/lib/money";
import type { Registration } from "@/lib/types";

export function RegistrantsTable({ registrations, eventId }: { registrations: Registration[]; eventId: string }) {
  const [filter, setFilter] = useState("all"); 
  const [search, setSearch] = useState("");
  
  const shown = useMemo(() => registrations.filter((item) => (filter === "all" || item.status === filter) && `${item.full_name} ${item.nickname ?? ""} ${item.phone}`.toLowerCase().includes(search.toLowerCase())), [registrations, filter, search]);

  function exportCsv() { 
    const rows = [["kode", "nama", "panggilan", "hp", "posisi", "nominal", "status", "waktu"], ...shown.map((item) => [item.code, item.full_name, item.nickname, item.phone, item.player_position, item.amount, item.status, item.created_at])]; 
    const blob = new Blob([rows.map((row) => row.map(escapeCsvCell).join(",")).join("\r\n")], { type: "text/csv;charset=utf-8" }); 
    const url = URL.createObjectURL(blob); 
    const link = document.createElement("a"); 
    link.href = url; 
    link.download = "pendaftar.csv"; 
    link.click(); 
    URL.revokeObjectURL(url); 
  }

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'paid': return <span className="px-2.5 py-1 rounded-full bg-green-100 text-green-700 text-[10px] font-bold uppercase tracking-wider">Lunas</span>;
      case 'pending': return <span className="px-2.5 py-1 rounded-full bg-yellow-100 text-yellow-700 text-[10px] font-bold uppercase tracking-wider">Pending</span>;
      case 'cancelled': return <span className="px-2.5 py-1 rounded-full bg-red-100 text-red-700 text-[10px] font-bold uppercase tracking-wider">Batal</span>;
      default: return null;
    }
  }

  return (
    <div className="p-4 sm:p-6">
      {/* Filters & Search */}
      <div className="flex flex-col lg:flex-row gap-4 mb-6">
        <input 
          value={search} 
          onChange={(e) => setSearch(e.target.value)} 
          placeholder="Cari nama atau nomor HP..." 
          className="w-full lg:w-72 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm focus:border-red focus:outline-none focus:ring-2 focus:ring-red/20 transition-all" 
        />
        
        <div className="flex flex-wrap gap-2 items-center">
          {["all", "pending", "paid", "cancelled"].map((value) => (
            <button 
              key={value} 
              onClick={() => setFilter(value)} 
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors ${
                filter === value ? "bg-navy text-white shadow-sm" : "bg-slate-100 text-slate-500 hover:bg-slate-200"
              }`}
            >
              {value === "all" ? "Semua" : value === "pending" ? "Pending" : value === "paid" ? "Lunas" : "Batal"}
            </button>
          ))}
        </div>

        <button onClick={exportCsv} className="ml-auto inline-flex items-center justify-center rounded-xl bg-slate-800 px-5 py-2.5 text-sm font-bold text-white hover:bg-slate-900 transition-colors">
          Export CSV
        </button>
      </div>

      {/* List Cards */}
      <div className="grid gap-3">
        {shown.map((item) => (
          <article key={item.id} className="bg-white rounded-xl border border-slate-200 p-4 transition-shadow hover:shadow-md flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <strong className="text-navy text-lg">{item.full_name}</strong>
                {item.nickname && <span className="text-slate-500 text-sm">({item.nickname})</span>}
                {getStatusBadge(item.status)}
              </div>
              <p className="text-sm text-slate-500">
                <span className="font-semibold text-slate-700">{item.code}</span> &middot; {item.phone} &middot; {item.player_position === "gk" ? "Kiper (GK)" : "Pemain"} &middot; <span className="font-semibold text-navy">{formatRupiah(item.amount)}</span>
              </p>
            </div>

            <div className="flex flex-wrap gap-2 lg:shrink-0">
              <a 
                href={`https://wa.me/${item.phone}`} 
                target="_blank" 
                rel="noreferrer"
                className="inline-flex items-center justify-center min-h-9 rounded-lg border border-slate-200 px-3 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Chat WA
              </a>
              
              {item.status !== "paid" && (
                <form action={updateRegistrationStatusAction}>
                  <input type="hidden" name="id" value={item.id} />
                  <input type="hidden" name="event_id" value={eventId} />
                  <input type="hidden" name="status" value="paid" />
                  <button className="inline-flex items-center justify-center min-h-9 rounded-lg bg-green-50 border border-green-200 px-3 text-xs font-semibold text-green-700 hover:bg-green-100 transition-colors">
                    Tandai Lunas
                  </button>
                </form>
              )}
              
              {item.status !== "cancelled" && (
                <form action={updateRegistrationStatusAction} onSubmit={(e) => { if (!confirm("Batalkan pendaftaran ini?")) e.preventDefault(); }}>
                  <input type="hidden" name="id" value={item.id} />
                  <input type="hidden" name="event_id" value={eventId} />
                  <input type="hidden" name="status" value="cancelled" />
                  <button className="inline-flex items-center justify-center min-h-9 rounded-lg bg-red-50 border border-red-200 px-3 text-xs font-semibold text-red hover:bg-red-100 transition-colors">
                    Batalkan
                  </button>
                </form>
              )}
            </div>
          </article>
        ))}
        
        {shown.length === 0 && (
          <div className="border border-dashed border-slate-300 rounded-xl p-10 text-center text-slate-500">
            Belum ada pendaftar yang cocok dengan filter.
          </div>
        )}
      </div>
    </div>
  );
}
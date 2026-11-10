"use client";

import { useState } from "react";

export function BenefitsInput({ initial = [] }: { initial?: string[] }) {
  const [items, setItems] = useState(initial.length ? initial : [""]);
  const input = "min-h-11 flex-1 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 focus:border-red focus:outline-none focus:ring-2 focus:ring-red/20 transition-all";
  const btn = "flex items-center justify-center min-h-11 min-w-11 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 hover:bg-slate-100 transition-colors disabled:opacity-40";

  function move(index: number, direction: -1 | 1) { 
    const target = index + direction; 
    if (target < 0 || target >= items.length) return; 
    const next = [...items]; 
    [next[index], next[target]] = [next[target], next[index]]; 
    setItems(next); 
  }

  return (
    <fieldset className="border-t border-slate-100 pt-6">
      <legend className="text-sm font-semibold text-slate-700 mb-2">Fasilitas / Benefit Acara</legend>
      <input type="hidden" name="benefits" value={items.filter(Boolean).join("\n")} /> 
      <div className="grid gap-3">
        {items.map((item, index) => (
          <div key={index} className="flex gap-2">
            <input 
              value={item} 
              onChange={(e) => setItems((current) => current.map((value, i) => i === index ? e.target.value : value))} 
              placeholder="Contoh: Air mineral, Rompi, P3K" 
              className={input} 
            />
            <div className="flex gap-1.5">
              <button type="button" onClick={() => move(index, -1)} disabled={index === 0} className={btn} aria-label="Naikkan">↑</button>
              <button type="button" onClick={() => move(index, 1)} disabled={index === items.length - 1} className={btn} aria-label="Turunkan">↓</button>
              <button type="button" onClick={() => setItems((current) => current.filter((_, i) => i !== index))} className={`${btn} text-red border-red-100 hover:bg-red-50`} aria-label="Hapus">×</button>
            </div>
          </div>
        ))}
      </div>
      <button type="button" onClick={() => setItems((current) => [...current, ""])} className="mt-3 inline-flex items-center justify-center min-h-10 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors">
        + Tambah Benefit
      </button>
    </fieldset>
  );
}
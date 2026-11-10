"use client";

import { useActionState } from "react";
import { saveSettingsAction } from "@/app/admin/actions";
import type { Settings } from "@/lib/types";

export function SettingsForm({ settings }: { settings: Settings }) {
  const [state, action, pending] = useActionState(saveSettingsAction, { ok: false, message: "" });
  const input = "mt-1 block w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-slate-900 focus:border-red focus:outline-none focus:ring-2 focus:ring-red/20 transition-all text-sm";
  const label = "block text-sm font-semibold text-slate-700";

  const fields: Array<[keyof Settings, string, string]> = [
    ["default_price_gk", "Harga default GK", "number"], 
    ["default_price_player", "Harga default pemain", "number"], 
    ["wa_admin_1", "WhatsApp Admin 1", "tel"], 
    ["wa_admin_2", "WhatsApp Admin 2", "tel"], 
    ["email", "Email", "email"], 
    ["instagram", "Instagram URL", "url"], 
    ["bank_name", "Nama bank", "text"], 
    ["bank_number", "Nomor rekening", "text"], 
    ["bank_holder", "Atas nama", "text"]
  ];

  return (
    <form action={action} className="grid gap-6">
      <div className="grid gap-5 sm:grid-cols-2">
        {fields.map(([name, labelText, type]) => (
          <label key={name} className={label}>
            <span>{labelText}</span>
            <input name={name} type={type} defaultValue={settings[name] ?? ""} required={name === "default_price_gk" || name === "default_price_player"} className={input} />
          </label>
        ))}
      </div>
      
      <label className={label}>
        <span>Tentang klub (Tampil di Beranda)</span>
        <textarea name="about" defaultValue={settings.about ?? ""} rows={6} className={input} />
      </label>
      
      {state.message && <p role="status" className={`text-sm font-semibold ${state.ok ? "text-green-600" : "text-red"}`}>{state.message}</p>}
      
      <div className="pt-4 border-t border-slate-100">
        <button disabled={pending} className="inline-flex items-center justify-center min-h-12 rounded-xl bg-red px-8 font-bold text-white hover:bg-red-700 transition-colors disabled:opacity-50">
          {pending ? "Menyimpan..." : "Simpan Pengaturan"}
        </button>
      </div>
    </form>
  );
}
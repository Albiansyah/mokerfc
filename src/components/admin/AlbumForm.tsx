"use client";

import { useActionState } from "react";
import { saveAlbumAction } from "@/app/admin/actions";
import type { Album, ClubEvent } from "@/lib/types";

export function AlbumForm({ album, events }: { album?: Album; events: ClubEvent[] }) {
  const [state, action, pending] = useActionState(saveAlbumAction, { ok: false, message: "" });
  const input = "mt-1 block w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-slate-900 focus:border-red focus:outline-none focus:ring-2 focus:ring-red/20 transition-all text-sm";
  const label = "block text-sm font-semibold text-slate-700";

  return (
    <form action={action} className="grid gap-5 sm:grid-cols-2">
      <input type="hidden" name="id" value={album?.id ?? ""} />
      
      <label className={label}><span>Judul album</span><input name="title" defaultValue={album?.title ?? ""} required className={input} /></label>
      <label className={label}><span>Slug</span><input name="slug" defaultValue={album?.slug ?? ""} placeholder="Otomatis dari judul" className={input} /></label>
      <label className={label}><span>Tanggal album</span><input name="album_date" type="date" defaultValue={album?.album_date ?? ""} className={input} /></label>
      <label className={label}><span>Hubungkan acara</span><select name="event_id" defaultValue={album?.event_id ?? ""} className={input}><option value="">Tanpa acara</option>{events.map((event) => <option key={event.id} value={event.id}>{event.title}</option>)}</select></label>
      
      <label className="flex items-center gap-3 sm:col-span-2 p-4 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer">
        <input name="is_published" type="checkbox" defaultChecked={album?.is_published ?? true} className="w-5 h-5 rounded border-slate-300 text-red focus:ring-red" /> 
        <span className="text-sm font-semibold text-slate-700">Terbitkan album ke halaman publik</span>
      </label>
      
      {state.message && <p role="status" className={`text-sm font-semibold sm:col-span-2 ${state.ok ? "text-green-600" : "text-red"}`}>{state.message}</p>}
      
      <button disabled={pending} className="sm:col-span-2 inline-flex items-center justify-center min-h-12 rounded-xl bg-red px-6 font-bold text-white hover:bg-red-700 transition-colors disabled:opacity-50">
        {pending ? "Menyimpan..." : "Simpan Album"}
      </button>
    </form>
  );
}
"use client";

import { useActionState } from "react";
import { deleteEventAction, saveEventAction } from "@/app/admin/actions";
import { BenefitsInput } from "./BenefitsInput";
import type { ClubEvent, Settings } from "@/lib/types";

const initialState = { ok: false, message: "" };

export function EventForm({ event, settings }: { event?: ClubEvent; settings: Settings }) {
  const [state, action, pending] = useActionState(saveEventAction, initialState);
  const [deleteState, deleteAction, deleting] = useActionState(deleteEventAction, initialState);
  
  const input = "mt-1 block w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-slate-900 focus:border-red focus:outline-none focus:ring-2 focus:ring-red/20 transition-all text-sm";
  const label = "block text-sm font-semibold text-slate-700";

  return (
    <div className="grid gap-8">
      <form action={action} className="grid gap-6">
        <input type="hidden" name="id" value={event?.id ?? ""} />
        <input type="hidden" name="cover_path" value={event?.cover_path ?? ""} />
        
        <div className="grid gap-5 sm:grid-cols-2">
          <label className={label}><span>Nama acara</span><input name="title" defaultValue={event?.title ?? ""} required className={input} /></label>
          <label className={label}><span>Slug</span><input name="slug" defaultValue={event?.slug ?? ""} placeholder="Otomatis dari nama" className={input} /></label>
          <label className={label}><span>Jenis</span><select name="type" defaultValue={event?.type ?? "internal"} className={input}><option value="internal">Internal</option><option value="pertandingan">Pertandingan</option></select></label>
          <label className={label}><span>Status</span><select name="status" defaultValue={event?.status ?? "draft"} className={input}><option value="draft">Draft</option><option value="published">Published</option><option value="closed">Closed</option><option value="cancelled">Cancelled</option></select></label>
          <label className={label}><span>Tanggal</span><input name="event_date" type="date" defaultValue={event?.event_date ?? ""} required className={input} /></label>
          <label className={label}><span>Jam mulai</span><input name="start_time" type="time" defaultValue={event?.start_time?.slice(0, 5) ?? ""} required className={input} /></label>
          <label className={label}><span>Jam selesai</span><input name="end_time" type="time" defaultValue={event?.end_time?.slice(0, 5) ?? ""} className={input} /></label>
          <label className={label}><span>Nama lokasi</span><input name="venue_name" defaultValue={event?.venue_name ?? ""} required className={input} /></label>
          <label className={label}><span>Alamat</span><input name="venue_address" defaultValue={event?.venue_address ?? ""} className={input} /></label>
          <label className={label}><span>Google Maps</span><input name="maps_url" type="url" defaultValue={event?.maps_url ?? ""} className={input} /></label>
          <label className={label}><span>Kuota total</span><input name="quota_total" type="number" min="1" defaultValue={event?.quota_total ?? ""} className={input} /></label>
          <label className={label}><span>Kuota GK</span><input name="quota_gk" type="number" min="0" defaultValue={event?.quota_gk ?? ""} className={input} /></label>
          <label className={label}><span>Harga GK</span><input name="price_gk" type="number" min="0" defaultValue={event?.price_gk ?? ""} placeholder={String(settings.default_price_gk)} className={input} /></label>
          <label className={label}><span>Harga pemain</span><input name="price_player" type="number" min="0" defaultValue={event?.price_player ?? ""} placeholder={String(settings.default_price_player)} className={input} /></label>
        </div>
        
        <label className={label}>
          <span>Foto cover <span className="text-slate-400 font-normal">(opsional, maksimal 8 MB)</span></span>
          <input name="cover" type="file" accept="image/jpeg,image/png,image/webp" className={`${input} p-2 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200`} />
          {event?.cover_path && <a href={event.cover_path} target="_blank" rel="noreferrer" className="mt-2 inline-block text-sm text-red font-semibold hover:underline">Lihat cover saat ini</a>}
        </label>
        
        <label className={label}><span>Deskripsi</span><textarea name="description" defaultValue={event?.description ?? ""} rows={6} className={input} /></label>
        
        <BenefitsInput initial={event?.benefits} />
        
        {state.message && <p role="status" className={`text-sm font-semibold ${state.ok ? "text-green-600" : "text-red"}`}>{state.message}</p>}
        
        <div className="flex flex-wrap gap-3 pt-4 border-t border-slate-100">
          <button disabled={pending} className="inline-flex items-center justify-center min-h-11 rounded-xl bg-red px-6 font-bold text-white hover:bg-red-700 transition-colors disabled:opacity-50">
            {pending ? "Menyimpan..." : "Simpan Acara"}
          </button>
          {event && <a href={`/acara/${event.slug}`} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center min-h-11 rounded-xl border border-slate-200 px-6 font-semibold text-slate-600 hover:bg-slate-50 transition-colors">Lihat Halaman Publik</a>}
        </div>
      </form>

      {event && (
        <form
          action={deleteAction}
          onSubmit={(submission) => {
            if (!window.confirm("Hapus acara ini? Acara yang sudah memiliki pendaftar tidak dapat dihapus.")) submission.preventDefault();
          }}
          className="border-t border-slate-200 pt-6"
        >
          <input type="hidden" name="id" value={event.id} />
          <button disabled={deleting} className="inline-flex items-center justify-center min-h-11 rounded-xl border border-red-200 bg-red-50 px-6 font-semibold text-red hover:bg-red-100 transition-colors disabled:opacity-50">
            {deleting ? "Menghapus..." : "Hapus Acara"}
          </button>
          {deleteState.message && <p role="status" className="mt-2 text-sm text-red font-semibold">{deleteState.message}</p>}
        </form>
      )}
    </div>
  );
}
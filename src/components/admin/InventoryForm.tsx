"use client";

import { useActionState } from "react";
import { saveInventoryAction } from "@/app/admin/actions";
import { Button } from "@/components/ui/Button";

export function InventoryForm() {
  const [state, action, pending] = useActionState(saveInventoryAction, { ok: false, message: "" });
  
  const input = "mt-1 block w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-slate-900 focus:border-red focus:outline-none focus:ring-2 focus:ring-red/20 transition-all text-sm";
  const label = "block text-sm font-semibold text-slate-700";

  return (
    <form action={action} className="grid gap-5 sm:grid-cols-2">
      
      <label className={`${label} sm:col-span-2`}>
        <span>Nama Barang</span>
        <input type="text" name="name" placeholder="Contoh: Rompi Latihan" className={input} required />
      </label>

      <label className={label}>
        <span>Kategori</span>
        <select name="category" className={input} required>
          <option value="Pakaian">Pakaian (Rompi, Jersey)</option>
          <option value="Bola">Bola</option>
          <option value="Perlengkapan Wasit">Perlengkapan Wasit (Peluit, Kartu)</option>
          <option value="Medis">Medis (P3K, Cooling Spray)</option>
          <option value="Lainnya">Lainnya</option>
        </select>
      </label>

      <label className={label}>
        <span>Jumlah</span>
        <input type="number" name="quantity" min="1" defaultValue="1" className={input} required />
      </label>

      <label className={label}>
        <span>Kondisi</span>
        <select name="condition" className={input} required>
          <option value="baru">Baru</option>
          <option value="bekas">Bekas (Masih Layak)</option>
          <option value="rusak">Rusak (Perlu Perbaikan/Ganti)</option>
        </select>
      </label>

      <label className={label}>
        <span>Tanggal Pembelian <span className="text-slate-400 font-normal">(Opsional)</span></span>
        <input type="date" name="purchase_date" className={input} />
      </label>

      <label className={`${label} sm:col-span-2`}>
        <span>Catatan Tambahan <span className="text-slate-400 font-normal">(Opsional)</span></span>
        <textarea name="notes" rows={3} placeholder="Contoh: Beli di toko sport terdekat, ukuran L" className={input} />
      </label>

      {state.message && <p role="status" className={`text-sm font-semibold sm:col-span-2 ${state.ok ? "text-green-600" : "text-red"}`}>{state.message}</p>}
      
      <div className="pt-4 border-t border-slate-100 sm:col-span-2">
        <Button type="submit" variant="primary" disabled={pending} className="w-full justify-center">
          {pending ? "Menyimpan..." : "Simpan Barang"}
        </Button>
      </div>
    </form>
  );
}
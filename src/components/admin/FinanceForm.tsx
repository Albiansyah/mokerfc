"use client";

import { useActionState } from "react";
import { saveTransactionAction } from "@/app/admin/actions";
import { Button } from "@/components/ui/Button";

export function FinanceForm() {
  const [state, action, pending] = useActionState(saveTransactionAction, { ok: false, message: "" });
  
  const input = "mt-1 block w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-slate-900 focus:border-red focus:outline-none focus:ring-2 focus:ring-red/20 transition-all text-sm";
  const label = "block text-sm font-semibold text-slate-700";

  return (
    <form action={action} className="grid gap-5 sm:grid-cols-2">
      
      <label className={label}>
        <span>Jenis Transaksi</span>
        <select name="type" className={input} required>
          <option value="pemasukan">Pemasukan (Uang Masuk)</option>
          <option value="pengeluaran">Pengeluaran (Uang Keluar)</option>
        </select>
      </label>

      <label className={label}>
        <span>Tanggal</span>
        <input type="date" name="date" className={input} required />
      </label>

      <label className={label}>
        <span>Kategori</span>
        <select name="category" className={input} required>
          <option value="Pendaftaran Peserta">Pendaftaran Peserta</option>
          <option value="Sponsorship">Sponsorship / Donasi</option>
          <option value="Sewa Lapangan">Sewa Lapangan</option>
          <option value="Operasional">Operasional (Wasit, P3K, dll)</option>
          <option value="Inventaris">Beli Inventaris (Bola, Rompi)</option>
          <option value="Konsumsi">Konsumsi / Ngopi</option>
          <option value="Lainnya">Lainnya</option>
        </select>
      </label>

      <label className={label}>
        <span>Nominal (Rp)</span>
        <input type="number" name="amount" min="0" placeholder="Contoh: 150000" className={input} required />
      </label>

      <label className={`${label} sm:col-span-2`}>
        <span>Keterangan Singkat</span>
        <input type="text" name="description" placeholder="Contoh: Bayar DP sewa lapangan pekan ke-3" className={input} required />
      </label>

      {state.message && <p role="status" className={`text-sm font-semibold sm:col-span-2 ${state.ok ? "text-green-600" : "text-red"}`}>{state.message}</p>}
      
      <div className="pt-4 border-t border-slate-100 sm:col-span-2">
        <Button type="submit" variant="primary" disabled={pending} className="w-full justify-center">
          {pending ? "Menyimpan..." : "Simpan Transaksi"}
        </Button>
      </div>
    </form>
  );
}
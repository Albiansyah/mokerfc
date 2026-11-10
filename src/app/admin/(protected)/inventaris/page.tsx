import Link from "next/link";
import { requireAdmin } from "@/lib/supabase/admin";
import { InventoryList } from "@/components/admin/InventoryList";

export default async function InventoryPage() {
  const { supabase } = await requireAdmin();
  
  // Fetch Data
  const { data: inventories } = await supabase.from("inventories").select("*").order("created_at", { ascending: false });
  const data = inventories || [];

  // Statistik
  const totalItems = data.reduce((sum, item) => sum + item.quantity, 0);
  const totalBaru = data.filter(i => i.condition === "baru").reduce((sum, item) => sum + item.quantity, 0);
  const totalRusak = data.filter(i => i.condition === "rusak").reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="max-w-6xl mx-auto">
      
      <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="text-2xl sm:text-3xl font-bold text-navy mb-1">Inventaris Klub</div>
          <p className="text-slate-500 text-sm">Daftar perlengkapan, pakaian, dan alat-alat klub.</p>
        </div>
        <Link 
          href="/admin/inventaris/baru" 
          className="inline-flex items-center justify-center min-h-10 px-5 rounded-xl bg-red text-white font-bold hover:bg-red-700 transition-colors shadow-sm text-sm shrink-0"
        >
          + Tambah Barang
        </Link>
      </div>

      {/* Statistik Cards */}
      <div className="grid gap-4 sm:grid-cols-3 mb-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Total Semua Barang</p>
          <p className="text-3xl font-bold text-navy">{totalItems} <span className="text-sm text-slate-400 font-normal">Pcs</span></p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Barang Baru</p>
          <p className="text-3xl font-bold text-green-600">{totalBaru} <span className="text-sm text-slate-400 font-normal">Pcs</span></p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Rusak / Perlu Ganti</p>
          <p className="text-3xl font-bold text-red">{totalRusak} <span className="text-sm text-slate-400 font-normal">Pcs</span></p>
        </div>
      </div>

      {/* List Barang & Fitur Search */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <InventoryList inventories={data} />
      </div>

    </div>
  );
}
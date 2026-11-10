import Link from "next/link";
import { requireAdmin } from "@/lib/supabase/admin";
import { FinanceCharts } from "@/components/admin/FinanceCharts";
import { TransactionList } from "@/components/admin/TransactionList";
import { formatRupiah } from "@/lib/money";

export default async function FinancePage() {
  const { supabase } = await requireAdmin();
  
  // Fetch Data
  const { data: transactions } = await supabase.from("transactions").select("*").order("date", { ascending: false });
  const data = transactions || [];

  // Hitung Total
  const totalPemasukan = data.filter(t => t.type === "pemasukan").reduce((sum, t) => sum + t.amount, 0);
  const totalPengeluaran = data.filter(t => t.type === "pengeluaran").reduce((sum, t) => sum + t.amount, 0);
  const saldo = totalPemasukan - totalPengeluaran;

  // Siapkan Data Chart: Arus Kas
  const summaryData = [
    { name: "Pemasukan", pemasukan: totalPemasukan, pengeluaran: 0 },
    { name: "Pengeluaran", pemasukan: 0, pengeluaran: totalPengeluaran },
  ];

  // Siapkan Data Chart: Pengeluaran per Kategori
  const expenseMap = new Map();
  data.filter(t => t.type === "pengeluaran").forEach(t => {
    expenseMap.set(t.category, (expenseMap.get(t.category) || 0) + t.amount);
  });
  const categoryData = Array.from(expenseMap, ([name, value]) => ({ name, value }));

  return (
    <div className="max-w-6xl mx-auto">
      
      <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="text-2xl sm:text-3xl font-bold text-navy mb-1">Keuangan Kas Klub</div>
          <p className="text-slate-500 text-sm">Catatan pemasukan, pengeluaran, dan saldo kas bendahara.</p>
        </div>
        <Link 
          href="/admin/keuangan/baru" 
          className="inline-flex items-center justify-center min-h-10 px-5 rounded-xl bg-red text-white font-bold hover:bg-red-700 transition-colors shadow-sm text-sm shrink-0"
        >
          + Catat Transaksi
        </Link>
      </div>

      {/* Cards Statistik */}
      <div className="grid gap-4 sm:grid-cols-3 mb-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Total Pemasukan</p>
          <p className="text-2xl font-bold text-green-600">{formatRupiah(totalPemasukan)}</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Total Pengeluaran</p>
          <p className="text-2xl font-bold text-red">{formatRupiah(totalPengeluaran)}</p>
        </div>
        <div className="bg-navy rounded-2xl border border-gold/30 p-5 shadow-lg">
          <p className="text-xs font-bold text-gold uppercase tracking-wider mb-2">Saldo Kas Saat Ini</p>
          <p className="text-3xl font-bold text-white">{formatRupiah(saldo)}</p>
        </div>
      </div>

      {/* Grafik */}
      <FinanceCharts summaryData={summaryData} categoryData={categoryData} />

      {/* Tabel Transaksi & Export */}
      <div className="mt-8">
        <div className="mb-4">
          <div className="text-xl font-bold text-navy">Riwayat Transaksi</div>
          <p className="text-sm text-slate-500">Daftar semua uang masuk dan keluar.</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <TransactionList transactions={data} />
        </div>
      </div>

    </div>
  );
}
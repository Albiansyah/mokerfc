"use client";

import { useMemo, useState } from "react";
import { formatRupiah } from "@/lib/money";
import { Button } from "@/components/ui/Button";
import jsPDF from "jspdf";
import "jspdf-autotable";

export function TransactionList({ transactions }: { transactions: any[] }) {
  const [filterType, setFilterType] = useState("all");

  const filteredData = useMemo(() => {
    if (filterType === "all") return transactions;
    return transactions.filter(t => t.type === filterType);
  }, [transactions, filterType]);

  // --- Export Excel (CSV) ---
  const exportCSV = () => {
    const rows = [["Tanggal", "Jenis", "Kategori", "Keterangan", "Nominal"]];
    filteredData.forEach(t => {
      rows.push([
        t.date, 
        t.type === "pemasukan" ? "Masuk" : "Keluar", 
        t.category, 
        `"${t.description}"`, 
        t.amount.toString()
      ]);
    });
    
    const blob = new Blob([rows.map(r => r.join(",")).join("\r\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Keuangan_MokerFC_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // --- Export PDF ---
  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Laporan Keuangan Moker FC United", 14, 15);
    
    const tableData = filteredData.map(t => [
      t.date,
      t.type === "pemasukan" ? "Masuk" : "Keluar",
      t.category,
      t.description,
      formatRupiah(t.amount)
    ]);

    (doc as any).autoTable({
      head: [["Tanggal", "Jenis", "Kategori", "Keterangan", "Nominal"]],
      body: tableData,
      startY: 25,
    });

    doc.save(`Laporan_Keuangan_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  return (
    <div>
      {/* Filter & Actions */}
      <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50">
        <div className="flex bg-white rounded-lg border border-slate-200 p-1 w-full sm:w-auto">
          {["all", "pemasukan", "pengeluaran"].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`flex-1 sm:flex-none px-4 py-1.5 rounded-md text-xs font-bold transition-colors ${
                filterType === type ? "bg-navy text-white" : "text-slate-500 hover:text-navy"
              }`}
            >
              {type === "all" ? "Semua" : type === "pemasukan" ? "Masuk" : "Keluar"}
            </button>
          ))}
        </div>
        
        <div className="flex gap-2 w-full sm:w-auto">
          <button onClick={exportCSV} className="flex-1 sm:flex-none inline-flex items-center justify-center min-h-9 px-4 rounded-lg bg-green-50 border border-green-200 text-xs font-bold text-green-700 hover:bg-green-100 transition-colors">
            <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            Excel
          </button>
          <button onClick={exportPDF} className="flex-1 sm:flex-none inline-flex items-center justify-center min-h-9 px-4 rounded-lg bg-red-50 border border-red-200 text-xs font-bold text-red hover:bg-red-100 transition-colors">
            <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
            PDF
          </button>
        </div>
      </div>

      {/* Tabel Data */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-slate-600">
          <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 font-bold">Tanggal</th>
              <th className="px-6 py-4 font-bold">Keterangan</th>
              <th className="px-6 py-4 font-bold">Kategori</th>
              <th className="px-6 py-4 font-bold text-right">Nominal</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredData.map((t) => (
              <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">{new Date(t.date).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                <td className="px-6 py-4">
                  <p className="font-semibold text-navy">{t.description}</p>
                  <p className={`text-xs font-bold mt-0.5 ${t.type === "pemasukan" ? "text-green-600" : "text-red"}`}>
                    {t.type === "pemasukan" ? "Uang Masuk" : "Uang Keluar"}
                  </p>
                </td>
                <td className="px-6 py-4">
                  <span className="px-2.5 py-1 bg-slate-100 rounded-full text-xs font-medium text-slate-600">
                    {t.category}
                  </span>
                </td>
                <td className={`px-6 py-4 text-right font-bold ${t.type === "pemasukan" ? "text-green-600" : "text-red"}`}>
                  {t.type === "pemasukan" ? "+" : "-"} {formatRupiah(t.amount)}
                </td>
              </tr>
            ))}
            {filteredData.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-10 text-center text-slate-400">Belum ada catatan transaksi.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
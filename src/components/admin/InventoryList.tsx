"use client";

import { useMemo, useState } from "react";

export function InventoryList({ inventories }: { inventories: any[] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");

  const filteredData = useMemo(() => {
    let result = inventories;
    
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(item => item.name.toLowerCase().includes(q));
    }

    if (filterCategory !== "all") {
      result = result.filter(item => item.category === filterCategory);
    }

    return result;
  }, [inventories, searchQuery, filterCategory]);

  const getBadge = (condition: string) => {
    switch(condition) {
      case 'baru': return <span className="px-2.5 py-1 rounded-full bg-green-100 text-green-700 text-[10px] font-bold uppercase tracking-wider">Baru</span>;
      case 'bekas': return <span className="px-2.5 py-1 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold uppercase tracking-wider">Bekas</span>;
      case 'rusak': return <span className="px-2.5 py-1 rounded-full bg-red-100 text-red-700 text-[10px] font-bold uppercase tracking-wider">Rusak</span>;
      default: return null;
    }
  };

  return (
    <div>
      {/* Filter & Search Bar */}
      <div className="p-4 border-b border-slate-200 flex flex-col lg:flex-row items-center justify-between gap-4 bg-slate-50">
        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          <div className="relative w-full sm:w-64">
            <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Cari nama barang..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red/20 focus:border-red transition-all"
            />
          </div>
          <select 
            value={filterCategory} 
            onChange={(e) => setFilterCategory(e.target.value)}
            className="w-full sm:w-auto px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-red/20 focus:border-red transition-all"
          >
            <option value="all">Semua Kategori</option>
            <option value="Pakaian">Pakaian</option>
            <option value="Bola">Bola</option>
            <option value="Perlengkapan Wasit">Perlengkapan Wasit</option>
            <option value="Medis">Medis</option>
            <option value="Lainnya">Lainnya</option>
          </select>
        </div>
        <p className="text-sm font-semibold text-slate-500 w-full lg:w-auto text-left lg:text-right">
          Total {filteredData.length} Item
        </p>
      </div>

      {/* Tabel Data */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-slate-600">
          <thead className="text-xs text-slate-500 uppercase bg-white border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 font-bold">Nama Barang</th>
              <th className="px-6 py-4 font-bold">Kategori</th>
              <th className="px-6 py-4 font-bold text-center">Jumlah</th>
              <th className="px-6 py-4 font-bold text-center">Kondisi</th>
              <th className="px-6 py-4 font-bold">Tgl Beli</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredData.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <p className="font-semibold text-navy">{item.name}</p>
                  {item.notes && <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{item.notes}</p>}
                </td>
                <td className="px-6 py-4">
                  <span className="px-2.5 py-1 bg-slate-100 rounded-full text-xs font-medium text-slate-600">
                    {item.category}
                  </span>
                </td>
                <td className="px-6 py-4 text-center font-bold text-navy">{item.quantity}</td>
                <td className="px-6 py-4 text-center">{getBadge(item.condition)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-500">
                  {item.purchase_date ? new Date(item.purchase_date).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) : "-"}
                </td>
              </tr>
            ))}
            {filteredData.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-10 text-center text-slate-400">Belum ada data inventaris.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
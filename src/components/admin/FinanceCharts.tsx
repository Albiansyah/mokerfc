"use client";

import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";

const COLORS = ['#dc2626', '#0f172a', '#f59e0b', '#10b981', '#6366f1'];

export function FinanceCharts({ categoryData, summaryData }: { categoryData: any[]; summaryData: any[] }) {
  return (
    <div className="grid gap-6 md:grid-cols-2 mt-6">
      
      {/* Bar Chart: Pemasukan vs Pengeluaran */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="text-lg font-bold text-navy mb-6">Arus Kas (Pemasukan vs Pengeluaran)</div>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={summaryData} margin={{ top: 0, right: 0, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} tickFormatter={(val) => `Rp${val/1000}k`} />
              <Tooltip 
                cursor={{ fill: '#f1f5f9' }} 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} 
                formatter={(value: any) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(Number(value))} 
              />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Bar dataKey="pemasukan" name="Pemasukan" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="pengeluaran" name="Pengeluaran" fill="#dc2626" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Pie Chart: Pengeluaran per Kategori */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="text-lg font-bold text-navy mb-6">Pengeluaran per Kategori</div>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} 
                formatter={(value: any) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(Number(value))} 
              />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}
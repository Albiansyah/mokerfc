import Link from "next/link";
import { requireAdmin } from "@/lib/supabase/admin";
import { DashboardCharts } from "@/components/admin/DashboardCharts";

export default async function AdminDashboardPage() {
  const { supabase } = await requireAdmin();
  const today = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Jakarta", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());

  // 1. Fetch Data Utama (Statistik)
  const [{ data: nextEvent }, { count: pending }, { count: totalRegistrants }] = await Promise.all([
    supabase.from("events").select("id,title,event_date").gte("event_date", today).in("status", ["published", "closed"]).order("event_date").limit(1).maybeSingle(),
    supabase.from("registrations").select("id", { count: "exact", head: true }).eq("status", "pending"),
    supabase.from("registrations").select("id", { count: "exact", head: true }).neq("status", "cancelled"),
  ]);

  const { count: nearestTotal } = nextEvent
    ? await supabase.from("registrations").select("id", { count: "exact", head: true }).eq("event_id", nextEvent.id).neq("status", "cancelled")
    : { count: 0 };

  // 2. Fetch Data untuk Chart
  const { data: rawRegs } = await supabase.from("registrations")
    .select("created_at, status, events(title)")
    .neq("status", "cancelled");

  // 3. Olah Data Bar Chart (Pendaftar per Acara)
  const eventMap = new Map();
  rawRegs?.forEach((reg: any) => {
    const title = reg.events?.title || "Tanpa Acara";
    eventMap.set(title, (eventMap.get(title) || 0) + 1);
  });
  const eventData = Array.from(eventMap, ([name, total]) => ({ name, total }))
    .sort((a, b) => (b.total as number) - (a.total as number)) // Urutkan terbanyak
    .slice(0, 5); // Ambil 5 teratas

  // 4. Olah Data Line Chart (Tren 7 Hari Terakhir)
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().split("T")[0];
  });
  
  const timeData = last7Days.map(date => {
    const count = rawRegs?.filter(reg => reg.created_at.startsWith(date)).length || 0;
    const displayDate = new Date(date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
    return { date: displayDate, total: count };
  });

  return (
    <div className="max-w-6xl mx-auto">
      
      {/* Header Dasbor */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="text-2xl sm:text-3xl font-bold text-navy mb-1">Dasbor</div>
          <p className="text-slate-500 text-sm">Ringkasan aktivitas dan pendaftaran klub.</p>
        </div>
        <Link 
          href="/admin/acara/baru" 
          className="inline-flex items-center justify-center min-h-10 px-5 rounded-xl bg-red text-white font-bold hover:bg-red-700 transition-colors shadow-sm text-sm shrink-0"
        >
          + Buat Acara Baru
        </Link>
      </div>

      {/* 4 Kartu Statistik */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Total Pendaftar</p>
          <p className="text-3xl font-bold text-navy">{totalRegistrants ?? 0}</p>
        </div>
        
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Menunggu Pembayaran</p>
          <p className="text-3xl font-bold text-yellow-600">{pending ?? 0}</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Acara Terdekat</p>
          <p className="text-lg font-bold text-navy line-clamp-1">{nextEvent?.title ?? "Belum ada"}</p>
          {nextEvent && <p className="text-xs text-slate-400 mt-1">{nextEvent.event_date}</p>}
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Slot Acara Terdekat</p>
          <p className="text-3xl font-bold text-green-600">{nearestTotal ?? 0} <span className="text-sm text-slate-400 font-normal">Terisi</span></p>
        </div>
      </div>

      {/* Panggil Komponen Chart */}
      <DashboardCharts eventData={eventData} timeData={timeData} />

    </div>
  );
}
import { SettingsForm } from "@/components/admin/SettingsForm";
import { requireAdmin } from "@/lib/supabase/admin";
import type { Settings } from "@/lib/types";

export default async function SettingsPage() {
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from("settings").select("*").eq("id", 1).single();

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        {/* Tag h1 diganti div biar ga kena style jumbo */}
        <div className="text-2xl sm:text-3xl font-bold text-navy mb-1">Pengaturan</div>
        <p className="text-slate-500 text-sm">Harga default, kontak, rekening, dan profil klub.</p>
      </div>
      
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <SettingsForm settings={data as Settings} />
      </div>
    </div>
  );
}
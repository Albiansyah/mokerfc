import { InventoryForm } from "@/components/admin/InventoryForm";

export default function NewInventoryPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <div className="text-2xl sm:text-3xl font-bold text-navy mb-1">Tambah Barang</div>
        <p className="text-slate-500 text-sm">Catat inventaris klub yang baru dibeli atau didata.</p>
      </div>
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <InventoryForm />
      </div>
    </div>
  );
}
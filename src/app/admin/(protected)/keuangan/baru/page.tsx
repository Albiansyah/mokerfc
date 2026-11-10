import { FinanceForm } from "@/components/admin/FinanceForm";

export default function NewTransactionPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <div className="text-2xl sm:text-3xl font-bold text-navy mb-1">Catat Transaksi</div>
        <p className="text-slate-500 text-sm">Input uang masuk atau keluar untuk kas klub.</p>
      </div>
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <FinanceForm />
      </div>
    </div>
  );
}
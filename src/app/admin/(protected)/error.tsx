"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/Button";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Admin Error:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] p-8 text-center">
      <div className="w-16 h-16 bg-red-100 text-red rounded-full flex items-center justify-center mb-4">
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <h2 className="text-2xl font-bold text-navy mb-2">Terjadi Kesalahan</h2>
      <p className="text-slate-500 mb-6 max-w-md">
        Sistem gagal memuat halaman ini. Silakan coba lagi atau hubungi developer.
      </p>
      <div className="p-4 bg-slate-100 rounded-xl text-left w-full max-w-lg overflow-auto mb-6">
        <p className="text-xs font-mono text-red-600">{error.message}</p>
      </div>
      <Button onClick={() => reset()} variant="primary">
        Coba Lagi
      </Button>
    </div>
  );
}
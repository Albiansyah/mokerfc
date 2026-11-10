"use client";

import React, { useEffect } from "react";
import { Button } from "@/components/ui/Button";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error secara internal
  }, [error]);

  return (
    <div className="w-full min-h-[60vh] flex items-center justify-center py-16 px-4">
      <div className="max-w-md w-full text-center chamfer-card bg-[var(--surface)] border-2 border-[var(--red)] p-8">
        <span className="inline-block text-xs font-heading font-bold uppercase tracking-wider text-[var(--red)] mb-2">
          Terjadi Gangguan
        </span>
        <h1 className="text-2xl font-heading font-extrabold uppercase text-[var(--fg)] mb-3">
          Gagal Memuat Konten
        </h1>
        <p className="text-sm opacity-80 mb-6">
          Sistem mengalami kendala saat memproses permintaan Anda. Silakan coba kembali.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button type="button" onClick={() => reset()} variant="primary">
            Coba Lagi
          </Button>
          <Button href="/" variant="secondary">
            Ke Beranda
          </Button>
        </div>
      </div>
    </div>
  );
}

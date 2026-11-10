import React from "react";
import { Settings } from "@/lib/types";

export interface AboutProps {
  settings: Settings;
}

export function About({ settings }: AboutProps) {
  if (!settings.about || !settings.about.trim()) {
    return null;
  }

  return (
    <section className="w-full bg-white py-20 lg:py-28 border-b border-slate-100">
      <div className="max-w-3xl mx-auto px-6 text-center">
        <span className="inline-block text-sm font-semibold tracking-wider text-gold mb-4 uppercase">
          Tentang Klub
        </span>
        <h2 className="text-3xl sm:text-4xl font-bold text-navy mb-6 leading-tight">
          Terbuka Untuk Siapa Saja
        </h2>
        <p className="text-lg sm:text-xl text-slate-600 leading-relaxed">
          {settings.about}
        </p>
      </div>
    </section>
  );
}
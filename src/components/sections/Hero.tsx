import React from "react";
import Image from "next/image";
import { ClubEvent, EventCount, Settings } from "@/lib/types";
import { MatchdayCard } from "./MatchdayCard";
import { Button } from "../ui/Button";

export interface HeroProps {
  nextEvent: (ClubEvent & { counts?: EventCount }) | null;
  settings: Settings;
}

export function Hero({ nextEvent, settings }: HeroProps) {
  const registerHref = nextEvent ? `/acara/${nextEvent.slug}#daftar` : "/acara";

  return (
    <div className="w-full flex flex-col">
      <section className="relative w-full bg-navy text-white overflow-hidden pt-10 pb-16 lg:pt-14 lg:pb-20">
        
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-red/10 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3 pointer-events-none"></div>

        <div className="max-w-300 mx-auto px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
            
            <div className="lg:col-span-7 flex flex-col justify-center text-center lg:text-left">
              <div className="flex justify-center lg:justify-start mb-5">
                <span className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-white/5 border border-white/10 text-slate-200 text-xs sm:text-sm font-medium tracking-wide">
                  <span className="w-2 h-2 rounded-full bg-red animate-pulse"></span>
                  Fun Match Mingguan
                </span>
              </div>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tighter mb-5 leading-[1.1] lg:leading-[0.95]">
                <span className="text-white block">MOKER FC</span>
                <span className="text-red block">UNITED</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-300 max-w-lg mx-auto lg:mx-0 mb-8 leading-relaxed">
                Gak perlu punya tim atau jago bola. Bayar perorangan, langsung main. Fasilitas lengkap dari lapangan sampai dokumentasi sudah kami siapkan.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Button href={registerHref} variant="primary" size="lg" className="w-full sm:w-auto shadow-lg shadow-red/20">
                  Daftar Match
                </Button>
                <Button href="/acara" variant="outline-white" size="lg" className="w-full sm:w-auto">
                  Cek Jadwal
                </Button>
              </div>
            </div>

            <div className="lg:col-span-5 relative mt-10 lg:mt-0">
              <div className="relative w-full max-w-[380px] aspect-square mx-auto lg:ml-auto">
                
                <div className="absolute inset-0 rounded-[2rem] overflow-hidden border border-white/20 shadow-2xl">
                  <Image 
                    src="https://images.unsplash.com/photo-1522778119026-d647f0596c20" 
                    alt="Suasana Fun Match Moker FC" 
                    fill 
                    sizes="(max-width: 768px) 100vw, 40vw"
                    className="object-cover opacity-80"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/20 to-transparent"></div>
                </div>

                <div className="absolute -bottom-4 -left-4 w-24 h-24 sm:w-28 sm:h-28 bg-navy rounded-2xl p-3 border border-gold/30 shadow-2xl flex items-center justify-center">
                  <Image
                    src="/brand/logo-full.png"
                    alt="Logo Moker FC"
                    width={100}
                    height={100}
                    className="object-contain w-auto h-auto"
                  />
                </div>

                <div className="absolute top-4 right-4 bg-white text-navy px-3 py-2 rounded-xl shadow-xl flex items-center gap-2">
                  <svg className="w-4 h-4 text-red" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-wider text-slate-500">Open Play</p>
                    <p className="text-xs font-bold">Semua Bisa Ikut</p>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>

        <div className="w-full bg-red text-white py-3 overflow-hidden border-y border-red-700 relative z-10 flex mt-12">
          <div className="flex w-max animate-[marquee_20s_linear_infinite]">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center gap-6 font-bold text-xs sm:text-sm tracking-widest uppercase px-3 shrink-0 whitespace-nowrap">
                <span>Fun Match</span> <span>•</span>
                <span>Mojokerto</span> <span>•</span>
                <span>Dokumentasi Drone</span> <span>•</span>
                <span>Open Play</span> <span>•</span>
                <span>Follow Instagram @mfc.utd</span> <span>•</span>
              </div>
            ))}
          </div>
        </div>

        <div className="max-w-300 mx-auto px-6 lg:px-8 relative z-20 mt-8">
          <MatchdayCard event={nextEvent} settings={settings} />
        </div>

      </section>
    </div>
  );
}
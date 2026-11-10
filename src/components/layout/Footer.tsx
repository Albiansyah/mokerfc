import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Settings } from "@/lib/types";

export interface FooterProps {
  settings: Settings;
}

export function Footer({ settings }: FooterProps) {
  const wa1 = settings.wa_admin_1 || "6281615334069";
  const wa2 = settings.wa_admin_2 || "6281228933141";
  const email = settings.email || "mokerfc2026@gmail.com";
  const ig = settings.instagram || "https://instagram.com/mfc.utd";

  return (
    <footer className="w-full shrink-0 bg-white text-slate-800 border-t border-slate-200 pt-16 pb-32 md:pb-12">
      <div className="max-w-300 mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-12 pb-12">
          
          <div className="md:col-span-5 lg:col-span-4 flex flex-col items-start">
            <Link href="/" className="flex items-center gap-3 mb-5">
              <Image
                src="/brand/logo-full.png"
                alt="Logo Moker FC United"
                width={40}
                height={40}
                className="object-contain w-auto h-10"
              />
              <span className="font-heading font-extrabold text-xl uppercase tracking-wide text-navy">
                MOKER FC <span className="text-red">UNITED</span>
              </span>
            </Link>

            <p className="text-sm text-slate-500 max-w-xs mb-6 leading-relaxed">
              Klub mini soccer Mojokerto. Terbuka untuk siapa saja yang ingin ikut main.
            </p>

            <div className="flex items-center gap-3">
              <a href={ig} target="_blank" rel="noopener noreferrer" className="w-9 h-9 flex items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-red hover:text-white transition-colors">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" strokeWidth={2} />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01" />
                </svg>
              </a>
              <a href="#" className="w-9 h-9 flex items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-red hover:text-white transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                </svg>
              </a>
              <a href="#" className="w-9 h-9 flex items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-red hover:text-white transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
            </div>
          </div>

          <div className="md:col-span-2 lg:col-span-2">
            <h4 className="font-bold text-sm text-navy mb-4 tracking-wide">Menu</h4>
            <ul className="space-y-3 text-sm text-slate-500">
              <li><Link href="/" className="hover:text-red transition-colors">Beranda</Link></li>
              <li><Link href="/acara" className="hover:text-red transition-colors">Acara</Link></li>
              <li><Link href="/galeri" className="hover:text-red transition-colors">Galeri</Link></li>
              <li><Link href="/sparring" className="hover:text-red transition-colors">Sparring</Link></li>
            </ul>
          </div>

          <div className="md:col-span-3 lg:col-span-3">
            <h4 className="font-bold text-sm text-navy mb-4 tracking-wide">Kontak Admin</h4>
            <ul className="space-y-3 text-sm text-slate-500">
              <li>
                <a href={`https://wa.me/${wa1}`} target="_blank" rel="noopener noreferrer" className="hover:text-red transition-colors">
                  WhatsApp 1
                </a>
              </li>
              <li>
                <a href={`https://wa.me/${wa2}`} target="_blank" rel="noopener noreferrer" className="hover:text-red transition-colors">
                  WhatsApp 2
                </a>
              </li>
              <li>
                <a href={`mailto:${email}`} className="hover:text-red transition-colors">
                  {email}
                </a>
              </li>
            </ul>
          </div>

          <div className="md:col-span-2 lg:col-span-3">
            <h4 className="font-bold text-sm text-navy mb-4 tracking-wide">Lokasi</h4>
            <p className="text-sm text-slate-500 leading-relaxed">
              Mojokerto, Jawa Timur<br />
              Indonesia
            </p>
          </div>

        </div>

        <div className="pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© 2026 Moker FC United. Hak cipta dilindungi.</p>
          <p>Dibuat untuk komunitas Moker FC United.</p>
        </div>
      </div>
    </footer>
  );
}
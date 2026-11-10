import type { Metadata } from "next";
import Link from "next/link";
import { getSettings } from "@/lib/queries";
import { SparringForm } from "./SparringForm";

export const metadata: Metadata = {
  title: "Ajak Sparring Mini Soccer",
  description:
    "Formulir pengajuan jadwal sparring dan pertandingan persahabatan dengan Moker FC United Mojokerto.",
};

export default async function SparringPage() {
  const settings = await getSettings();

  return (
    // Padding disamain persis dengan Acara & Galeri (pt-4 lg:pt-6)
    <div className="w-full bg-slate-50 pt-4 pb-16 lg:pt-6 lg:pb-20 min-h-screen">
      <div className="max-w-300 mx-auto px-6 lg:px-8">
        
        {/* Header teks jumbo udah dihapus total. Langsung ke Form. */}
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          <div className="lg:col-span-7 bg-white p-6 sm:p-10 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-red" />
            <SparringForm settings={settings} />
          </div>

          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
            
            {/* Hook ke Halaman Acara */}
            <Link 
              href="/acara" 
              className="group block bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-red/30 transition-all duration-300"
            >
              <div className="w-12 h-12 bg-red/10 rounded-xl flex items-center justify-center mb-4 text-red">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              {/* Tag h3 diganti div biar ga jumbo */}
              <div className="font-bold text-navy text-xl mb-2 group-hover:text-red transition-colors">Lihat Jadwal Acara</div>
              <p className="text-sm text-slate-500 mb-4 leading-relaxed">
                Pantau jadwal pertandingan dan fun match mendatang yang diselenggarakan Moker FC United.
              </p>
              <span className="text-red font-semibold text-sm inline-flex items-center gap-1">
                Cek Acara
                <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </span>
            </Link>

            {/* Hook ke Halaman Galeri */}
            <Link 
              href="/galeri" 
              className="group block bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-red/30 transition-all duration-300"
            >
              <div className="w-12 h-12 bg-red/10 rounded-xl flex items-center justify-center mb-4 text-red">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              {/* Tag h3 diganti div biar ga jumbo */}
              <div className="font-bold text-navy text-xl mb-2 group-hover:text-red transition-colors">Lihat Galeri Kegiatan</div>
              <p className="text-sm text-slate-500 mb-4 leading-relaxed">
                Intip keseruan fun match, latihan rutin, dan dokumentasi tim di lapangan.
              </p>
              <span className="text-red font-semibold text-sm inline-flex items-center gap-1">
                Buka Galeri
                <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </span>
            </Link>

          </div>

        </div>
      </div>
    </div>
  );
}
"use client";

import React, { useState } from "react";

const FAQS = [
  {
    question: "Saya tidak punya tim, apakah tetap bisa ikut?",
    answer: "Sangat bisa. Kami membuka sistem fun match untuk umum. Peserta perorangan akan digabungkan ke dalam tim oleh admin, jadi kamu bisa langsung main dan cari teman baru.",
  },
  {
    question: "Apa saja yang didapat dari biaya pendaftaran perorangan?",
    answer: "Biaya per orang sudah mencakup sewa lapangan, inventaris (rompi & bola), P3K, air mineral, dan parkir gratis. Selain itu, setiap match biasanya dilengkapi dokumentasi foto, video slowmo, dan drone.",
  },
  {
    question: "Apakah semua benefit (drone/ngopi) pasti ada di setiap match?",
    answer: "Fasilitas dasar seperti lapangan, rompi, bola, dan P3K dipastikan ada. Namun untuk fasilitas ekstra seperti rekaman drone dan ngopi bareng, sifatnya menyesuaikan agenda dan kesepakatan di jadwal match tersebut.",
  },
  {
    question: "Bagaimana sistem pembayarannya?",
    answer: "Setelah mendaftar di website, kamu akan mendapatkan kode pendaftaran. Cukup transfer nominal per orang ke rekening resmi klub, lalu kirim bukti ke WhatsApp admin. Slot kamu langsung terkunci.",
  },
];

export function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0); // Default buka yang pertama

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="w-full bg-slate-50 py-20 lg:py-24 border-b border-slate-100">
      <div className="max-w-3xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="inline-block text-sm font-semibold tracking-wider text-gold mb-3 uppercase">
            Tanya Jawab
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-navy">
            Pertanyaan Umum
          </h2>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            
            return (
              <div 
                key={idx} 
                className={`rounded-2xl bg-white border transition-colors duration-300 ${
                  isOpen ? "border-red/30 shadow-md" : "border-slate-200 hover:border-slate-300"
                }`}
              >
                {/* Tombol Pertanyaan */}
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <h3 className={`text-lg font-bold transition-colors ${isOpen ? "text-red" : "text-navy"}`}>
                    {faq.question}
                  </h3>
                  <div className={`ml-4 shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isOpen ? "bg-red/10 text-red" : "bg-slate-100 text-slate-500"}`}>
                    <svg 
                      className={`w-5 h-5 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>

                {/* Jawaban (Animasi Slide) */}
                <div 
                  className={`grid transition-all duration-300 ease-in-out ${
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="px-6 pb-6 text-slate-600 leading-relaxed text-sm sm:text-base">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
import React from "react";

const FEATURES = [
  {
    title: "Fasilitas Lapangan",
    description: "Biaya perorangan sudah mencakup sewa lapangan standar, peminjaman rompi, bola, dan layanan P3K.",
    icon: (
      <svg className="w-6 h-6 text-red" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    title: "Dokumentasi Premium",
    description: "Dapatkan foto aksi, video slowmo, dan rekaman drone udara untuk mengabadikan momen seru di lapangan.",
    icon: (
      <svg className="w-6 h-6 text-red" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    title: "Ekstra & Kenyamanan",
    description: "Parkir gratis, air mineral, dan sesi ngopi bareng yang biayanya ditanggung klub (sesuai agenda match).",
    icon: (
      <svg className="w-6 h-6 text-red" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
  },
];

export function Features() {
  return (
    <section className="w-full bg-white py-20 lg:py-24 border-b border-slate-100">
      <div className="max-w-300 mx-auto px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="inline-block text-sm font-semibold tracking-wider text-gold mb-3 uppercase">
            Fun Match Terbuka
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-navy mb-4">
            Main Tanpa Ribet
          </h2>
          <p className="text-slate-600 leading-relaxed">
            Bayar perorangan, langsung main. Semua kebutuhan dasar di lapangan sudah kami siapkan. Siapa saja boleh ikut, baik yang sudah punya tim maupun yang ingin cari teman main.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {FEATURES.map((feature, idx) => (
            <div 
              key={idx} 
              className="flex flex-col items-start p-8 rounded-2xl border border-slate-200 bg-slate-50/50 transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-lg hover:border-red/20"
            >
              <div className="w-12 h-12 rounded-xl bg-red/10 flex items-center justify-center mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-navy mb-3">{feature.title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
        
        <div className="mt-10 p-4 rounded-xl bg-gold/10 border border-gold/20 text-center text-sm text-navy max-w-2xl mx-auto">
          <strong>Catatan:</strong> Ketersediaan benefit ekstra (seperti drone atau ngopi bareng) menyesuaikan agenda di setiap jadwal match.
        </div>
      </div>
    </section>
  );
}
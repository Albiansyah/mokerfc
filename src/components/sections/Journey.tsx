import React from "react";

const JOURNEY_ITEMS = [
  {
    date: "25 Oktober 2026",
    title: "Pekan Pertama",
    description: "Kick-off perdana Moker FC United. Fun match pembuka yang mempertemukan pemain lokal Mojokerto.",
    status: "completed",
  },
  {
    date: "7 November 2026",
    title: "Pekan Kedua",
    description: "Lanjutan rutinitas match. Skema permainan makin solid dengan tambahan dokumentasi drone.",
    status: "completed",
  },
  {
    date: "15 November 2026",
    title: "Pekan Ketiga",
    description: "Matchday selanjutnya dengan kuota pemain yang lebih banyak dan sesi ngopi bareng setelah pertandingan.",
    status: "upcoming",
  },
  {
    date: "Segera Hadir",
    title: "More to Come",
    description: "Jadwal match, turnamen internal, dan event komunitas lainnya akan terus berlanjut. Pantau terus website ini.",
    status: "coming-soon",
  },
];

export function Journey() {
  return (
    <section className="w-full bg-white py-20 lg:py-24 border-b border-slate-100">
      <div className="max-w-3xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-block text-sm font-semibold tracking-wider text-gold mb-3 uppercase">
            Perjalanan Kami
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-navy">
            Jejak Langkah Moker FC
          </h2>
        </div>

        <div className="relative border-l border-slate-200 ml-4 md:ml-6 space-y-10">
          {JOURNEY_ITEMS.map((item, idx) => {
            const isComingSoon = item.status === "coming-soon";
            const isUpcoming = item.status === "upcoming";

            return (
              <div 
                key={idx} 
                className="relative pl-8 md:pl-10 transition-transform duration-300 hover:translate-x-1"
              >
                <span
                  className={`absolute -left-[9px] top-1.5 w-4 h-4 rounded-full border-2 bg-white transition-colors duration-300 ${
                    isComingSoon
                      ? "border-slate-300"
                      : isUpcoming
                      ? "border-gold"
                      : "border-red"
                  }`}
                />
                <div className="flex flex-col md:flex-row md:items-baseline gap-2 mb-2">
                  <span
                    className={`text-sm font-bold ${
                      isComingSoon
                        ? "text-slate-500"
                        : isUpcoming
                        ? "text-gold"
                        : "text-red"
                    }`}
                  >
                    {item.date}
                  </span>
                  <h3
                    className={`text-xl font-bold ${
                      isComingSoon ? "text-slate-600" : "text-navy"
                    }`}
                  >
                    {item.title}
                  </h3>
                </div>
                <p
                  className={`text-sm leading-relaxed ${
                    isComingSoon ? "text-slate-500 italic" : "text-slate-600"
                  }`}
                >
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
export default function Loading() {
  return (
    <div className="w-full flex flex-col min-h-screen bg-white animate-pulse">
      
      {/* Skeleton Hero Section */}
      <section className="relative w-full bg-navy pt-10 pb-16 lg:pt-14 lg:pb-20 overflow-hidden">
        <div className="max-w-300 mx-auto px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
            
            {/* Teks Kiri */}
            <div className="lg:col-span-7 flex flex-col justify-center space-y-6">
              <div className="h-8 bg-white/10 rounded-full w-40"></div>
              <div className="h-16 bg-white/10 rounded-xl w-3/4"></div>
              <div className="h-16 bg-white/10 rounded-xl w-2/3"></div>
              <div className="h-5 bg-white/10 rounded-lg w-full max-w-md"></div>
              <div className="h-5 bg-white/10 rounded-lg w-5/6 max-w-md"></div>
              <div className="flex gap-4 mt-4">
                <div className="h-14 bg-white/10 rounded-xl w-36"></div>
                <div className="h-14 bg-white/10 rounded-xl w-36"></div>
              </div>
            </div>

            {/* Gambar Kanan */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end mt-10 lg:mt-0">
              <div className="w-full max-w-[380px] aspect-square bg-white/10 rounded-[2rem]"></div>
            </div>

          </div>
        </div>

        {/* Running Text */}
        <div className="w-full h-12 bg-red-700 mt-12 opacity-50"></div>
      </section>

      {/* Skeleton Matchday Card (Laga Terdekat) */}
      <div className="max-w-300 mx-auto px-6 lg:px-8 -mt-8 relative z-20">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-6 h-48 w-full flex flex-col justify-between">
          <div className="flex gap-6">
            <div className="w-24 h-24 bg-slate-200 rounded-xl"></div>
            <div className="flex-1 space-y-3 py-2">
              <div className="h-4 bg-slate-200 rounded w-20"></div>
              <div className="h-6 bg-slate-200 rounded w-1/2"></div>
              <div className="h-4 bg-slate-200 rounded w-1/3"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Skeleton Section Bawah (About / Features) */}
      <div className="max-w-300 mx-auto px-6 lg:px-8 py-20 space-y-16">
        
        {/* About Skeleton */}
        <div className="flex flex-col items-center space-y-4">
          <div className="h-4 bg-slate-200 rounded w-32"></div>
          <div className="h-10 bg-slate-200 rounded w-64"></div>
          <div className="h-4 bg-slate-200 rounded w-full max-w-2xl mt-4"></div>
          <div className="h-4 bg-slate-200 rounded w-5/6 max-w-2xl"></div>
        </div>

        {/* Features Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-8 rounded-2xl border border-slate-100 bg-slate-50/50 space-y-4">
              <div className="w-12 h-12 bg-slate-200 rounded-xl"></div>
              <div className="h-6 bg-slate-200 rounded w-3/4"></div>
              <div className="h-4 bg-slate-200 rounded w-full"></div>
              <div className="h-4 bg-slate-200 rounded w-5/6"></div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
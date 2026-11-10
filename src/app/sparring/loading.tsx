export default function Loading() {
  return (
    <div className="w-full bg-slate-50 pt-8 pb-16 lg:pt-12 lg:pb-20 min-h-screen animate-pulse">
      <div className="max-w-300 mx-auto px-6 lg:px-8">
        
        {/* Skeleton Header */}
        <div className="mb-8">
          <div className="h-4 bg-slate-200 rounded w-32 mb-3"></div>
          <div className="h-9 bg-slate-200 rounded w-64 mb-3"></div>
          <div className="h-5 bg-slate-200 rounded w-96 max-w-full"></div>
        </div>

        {/* Skeleton Konten Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Kiri: Form */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-10 rounded-2xl border border-slate-200 h-[600px] shadow-sm relative overflow-hidden">
             <div className="absolute top-0 left-0 right-0 h-1.5 bg-slate-200" />
             <div className="space-y-6">
               <div className="h-20 bg-slate-100 rounded-xl"></div>
               <div className="grid grid-cols-2 gap-6">
                 <div className="h-14 bg-slate-100 rounded-xl"></div>
                 <div className="h-14 bg-slate-100 rounded-xl"></div>
               </div>
               <div className="grid grid-cols-2 gap-6">
                 <div className="h-14 bg-slate-100 rounded-xl"></div>
                 <div className="h-14 bg-slate-100 rounded-xl"></div>
               </div>
               <div className="h-14 bg-slate-100 rounded-xl"></div>
               <div className="h-24 bg-slate-100 rounded-xl"></div>
             </div>
          </div>

          {/* Kanan: Card Hook */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 h-48 shadow-sm"></div>
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 h-48 shadow-sm"></div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
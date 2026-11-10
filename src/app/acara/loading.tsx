export default function Loading() {
  return (
    <div className="w-full bg-slate-50 pt-8 pb-16 lg:pt-12 lg:pb-20 min-h-screen animate-pulse">
      <div className="max-w-300 mx-auto px-6 lg:px-8">
        <div className="mb-8">
          <div className="h-4 bg-slate-200 rounded w-24 mb-3"></div>
          <div className="h-9 bg-slate-200 rounded w-64 mb-3"></div>
          <div className="h-5 bg-slate-200 rounded w-96 max-w-full"></div>
        </div>
        
        <div className="h-20 bg-white rounded-2xl border border-slate-200 mb-8 w-full"></div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-[360px] bg-white rounded-2xl border border-slate-200 flex flex-col">
              <div className="h-24 bg-slate-200 rounded-t-2xl"></div>
              <div className="p-5 flex-1">
                <div className="h-4 bg-slate-200 rounded w-20 mb-4"></div>
                <div className="h-6 bg-slate-200 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-slate-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
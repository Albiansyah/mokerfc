export default function Loading() {
  return (
    <div className="w-full bg-slate-50 pt-8 pb-16 lg:pt-12 lg:pb-20 min-h-screen animate-pulse">
      <div className="max-w-300 mx-auto px-6 lg:px-8">
        <div className="mb-8">
          <div className="h-4 bg-slate-200 rounded w-24 mb-3"></div>
          <div className="h-9 bg-slate-200 rounded w-64 mb-3"></div>
          <div className="h-5 bg-slate-200 rounded w-96 max-w-full"></div>
        </div>

        <div className="h-14 bg-white rounded-2xl border border-slate-200 mb-8 w-full max-w-xl"></div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="aspect-square bg-slate-200 rounded-2xl"></div>
          ))}
        </div>
      </div>
    </div>
  );
}
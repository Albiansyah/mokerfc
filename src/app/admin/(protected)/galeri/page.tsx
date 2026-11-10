import Link from "next/link";
import { requireAdmin } from "@/lib/supabase/admin";
import type { Album } from "@/lib/types";

export default async function AdminGalleryPage() {
  const { supabase } = await requireAdmin();
  const { data: albumsData } = await supabase.from("albums").select("*").order("album_date", { ascending: false });
  const albums = (albumsData ?? []) as Album[];

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="text-2xl sm:text-3xl font-bold text-navy mb-1">Galeri</div>
          <p className="text-slate-500 text-sm">Daftar semua album dokumentasi klub.</p>
        </div>
        <Link href="/admin/galeri/baru" className="inline-flex items-center justify-center min-h-10 px-5 rounded-xl bg-red text-white font-bold hover:bg-red-700 transition-colors shadow-sm text-sm shrink-0">
          + Buat Album Baru
        </Link>
      </div>

      {albums.length === 0 ? (
        <div className="bg-white border border-dashed border-slate-300 rounded-2xl p-12 text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div className="text-lg font-bold text-navy mb-1">Belum ada album</div>
          <p className="text-slate-500 text-sm mb-4">Gunakan tombol di atas untuk membuat album dokumentasi pertama.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {albums.map((album) => (
            <article key={album.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-col hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex-1">
                  <div className="text-lg font-bold text-navy line-clamp-2 leading-tight mb-1">{album.title}</div>
                  <p className="text-xs text-slate-500 font-medium">
                    {album.album_date ? new Date(album.album_date).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }) : "Tanpa tanggal"}
                  </p>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shrink-0 ${album.is_published ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                  {album.is_published ? "Terbit" : "Draft"}
                </span>
              </div>
              <div className="mt-auto pt-4 border-t border-slate-100">
                <Link href={`/admin/galeri/${album.id}`} className="inline-flex items-center justify-center w-full min-h-10 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-100 hover:text-navy transition-colors">
                  Kelola Foto
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
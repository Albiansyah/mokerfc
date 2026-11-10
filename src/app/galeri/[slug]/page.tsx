import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { GalleryGrid } from "@/components/sections/GalleryGrid";
import type { Album, Photo } from "@/lib/types";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: album } = await supabase.from("albums").select("title, cover_photo_id").eq("slug", slug).single();
  
  return album ? { title: `${album.title} | Galeri Moker FC` } : { title: "Album Tidak Ditemukan" };
}

export default async function AlbumDetailPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();
  
  // Fetch Album dan Foto-fotonya
  const { data: albumData } = await supabase
    .from("albums")
    .select("*, photos(*)")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (!albumData) notFound();

  const album = albumData as Album & { photos: Photo[] };
  // Sortir foto berdasarkan urutan (sort)
  const photos = [...(album.photos || [])].sort((a, b) => (a.sort || 0) - (b.sort || 0));

  return (
    <div className="w-full bg-slate-50 pt-4 pb-16 lg:pt-6 lg:pb-20 min-h-screen">
      <div className="max-w-300 mx-auto px-6 lg:px-8">
        
        {/* Header Album */}
        <div className="mb-8">
          <Link href="/galeri" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-red transition-colors mb-4">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Kembali ke Galeri
          </Link>
          
          <div className="text-2xl sm:text-3xl font-bold text-navy mb-2">{album.title}</div>
          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {album.album_date ? new Date(album.album_date).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }) : "Tanpa tanggal"}
            </span>
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {photos.length} Foto
            </span>
          </div>
        </div>

        {/* Grid Foto Album */}
        {photos.length > 0 ? (
          <GalleryGrid photos={photos} showViewAll={false} limit={null} />
        ) : (
          <div className="bg-white border border-dashed border-slate-300 rounded-2xl p-12 text-center max-w-xl mx-auto">
            <p className="text-slate-500 text-sm">Belum ada foto di album ini.</p>
          </div>
        )}

      </div>
    </div>
  );
}
import { notFound } from "next/navigation";
import { AlbumForm } from "@/components/admin/AlbumForm";
import { PhotoUploader } from "@/components/admin/PhotoUploader";
import { requireAdmin } from "@/lib/supabase/admin";
import type { Album, ClubEvent, Photo } from "@/lib/types";

export default async function AlbumPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { supabase } = await requireAdmin();
  
  const [{ data: album }, { data: photos }, { data: events }] = await Promise.all([
    supabase.from("albums").select("*").eq("id", id).single(), 
    supabase.from("photos").select("*").eq("album_id", id).order("sort"), 
    supabase.from("events").select("*").order("event_date", { ascending: false })
  ]);

  if (!album) notFound();
  const typedAlbum = album as Album;

  return (
    <div className="max-w-5xl mx-auto">
      
      {/* Header Halaman - Tag diganti div biar ga kena style global h1/h2 */}
      <div className="mb-8">
        <div className="text-2xl sm:text-3xl font-bold text-navy mb-1">Kelola Album</div>
        <p className="text-slate-500 text-sm sm:text-base">Atur detail album dan unggah foto baru.</p>
      </div>

      {/* Form Detail Album */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm mb-10">
        <AlbumForm album={typedAlbum} events={(events ?? []) as ClubEvent[]} />
      </section>

      {/* Section Foto */}
      <section>
        <div className="mb-4">
          {/* Tag diganti div biar ga kena style global h1/h2 */}
          <div className="text-xl font-bold text-navy mb-1">Foto Album</div>
          <p className="text-sm text-slate-500">Kelola foto yang tampil di galeri publik.</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <PhotoUploader albumId={id} initialPhotos={(photos ?? []) as Photo[]} initialCoverPhotoId={typedAlbum.cover_photo_id} />
        </div>
      </section>

    </div>
  );
}
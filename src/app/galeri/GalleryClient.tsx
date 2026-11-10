"use client";

import { useMemo, useState } from "react";
import { Album, Photo } from "@/lib/types";
import { GalleryGrid } from "@/components/sections/GalleryGrid";

export function GalleryClient({ albums, fetchError }: { albums: (Album & { photos: Photo[] })[]; fetchError: string | null }) {
  const [selected, setSelected] = useState("all");
  
  const allPhotos = useMemo(() => albums.flatMap((album) => album.photos), [albums]);
  const photos = useMemo(() => selected === "all" ? allPhotos : albums.find((album) => album.id === selected)?.photos ?? [], [albums, allPhotos, selected]);

  if (fetchError) {
    return (
      <div className="p-8 text-center bg-white border border-red-200 rounded-2xl shadow-sm text-red">
        <p className="font-semibold">Galeri tidak dapat dimuat. Coba lagi nanti.</p>
      </div>
    );
  }

  if (allPhotos.length === 0) {
    return (
      <div className="bg-white border border-dashed border-slate-300 rounded-2xl p-12 text-center max-w-xl mx-auto">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-navy mb-2">Belum ada foto</h3>
        <p className="text-slate-500 text-sm">Dokumentasi klub akan tampil di sini.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 overflow-x-auto pb-2 -mx-6 px-6 lg:mx-0 lg:px-0">
        <div className="flex bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm w-max min-w-full sm:min-w-0" role="tablist" aria-label="Filter album">
          <button
            role="tab"
            aria-selected={selected === "all"}
            onClick={() => setSelected("all")}
            className={`whitespace-nowrap px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ${
              selected === "all" 
                ? "bg-navy text-white shadow-md" 
                : "text-slate-500 hover:text-navy hover:bg-slate-50"
            }`}
          >
            Semua Foto ({allPhotos.length})
          </button>
          
          {albums.map((album) => (
            <button
              key={album.id}
              role="tab"
              aria-selected={selected === album.id}
              onClick={() => setSelected(album.id)}
              className={`whitespace-nowrap px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ${
                selected === album.id 
                  ? "bg-navy text-white shadow-md" 
                  : "text-slate-500 hover:text-navy hover:bg-slate-50"
              }`}
            >
              {album.title} ({album.photos.length})
            </button>
          ))}
        </div>
      </div>

      {photos.length > 0 ? (
        <GalleryGrid photos={photos} showViewAll={false} limit={null} />
      ) : (
        <div className="bg-white border border-dashed border-slate-300 rounded-2xl p-12 text-center max-w-xl mx-auto">
          <p className="text-slate-500 text-sm">Album ini belum memiliki foto.</p>
        </div>
      )}
    </div>
  );
}
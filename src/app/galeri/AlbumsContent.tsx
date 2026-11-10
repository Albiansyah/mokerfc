"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Album, Photo } from "@/lib/types";

export function AlbumsContent({ albums, fetchError }: { albums: (Album & { photos: Photo[] })[]; fetchError: string | null }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDate, setFilterDate] = useState(""); // State baru buat filter tanggal

  const filteredAlbums = useMemo(() => {
    let result = albums;

    // Filter berdasarkan teks pencarian
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter((album) => album.title.toLowerCase().includes(q));
    }

    // Filter berdasarkan tanggal spesifik
    if (filterDate) {
      result = result.filter((album) => album.album_date === filterDate);
    }

    return result;
  }, [albums, searchQuery, filterDate]);

  if (fetchError) {
    return (
      <div className="p-8 text-center bg-white border border-red-200 rounded-2xl shadow-sm text-red">
        <p className="font-semibold">Galeri tidak dapat dimuat. Coba lagi nanti.</p>
      </div>
    );
  }

  return (
    <div>
      {/* Area Filter (Search & Tanggal) */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm mb-8 flex flex-col lg:flex-row items-center justify-between gap-4">
        
        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          {/* Input Search */}
          <div className="relative w-full sm:w-64">
            <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Cari nama album..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red/20 focus:border-red transition-all"
            />
          </div>

          {/* Input Tanggal */}
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="w-full sm:w-auto px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-red/20 focus:border-red transition-all"
          />

          {/* Tombol Reset (Muncul kalau ada filter aktif) */}
          {(searchQuery || filterDate) && (
            <button
              onClick={() => { setSearchQuery(""); setFilterDate(""); }}
              className="text-sm text-red font-semibold hover:underline px-2 py-2"
            >
              Reset
            </button>
          )}
        </div>

        <p className="text-sm font-semibold text-slate-500 w-full lg:w-auto text-left lg:text-right">
          Total {filteredAlbums.length} Album
        </p>
      </div>

      {/* Grid Album */}
      {filteredAlbums.length === 0 ? (
        <div className="bg-white border border-dashed border-slate-300 rounded-2xl p-12 text-center max-w-xl mx-auto">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-navy mb-2">Album tidak ditemukan</h3>
          <p className="text-slate-500 text-sm">Coba ubah kata kunci atau tanggal pencarian.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAlbums.map((album) => {
            const coverPhoto = album.photos.find(p => p.id === album.cover_photo_id) || album.photos[0];
            
            return (
              <Link 
                href={`/galeri/${album.slug}`} 
                key={album.id}
                className="group flex flex-col bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg transition-all duration-300 hover:border-red/30"
              >
                <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
                  {coverPhoto ? (
                    <Image
                      src={coverPhoto.path}
                      alt={album.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                      <svg className="w-12 h-12 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                  <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm text-white text-xs font-bold px-2.5 py-1 rounded-lg">
                    {album.photos.length} Foto
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col">
                  {/* Tag h2 diganti div biar ga jumbo */}
                  <div className="text-lg sm:text-xl font-bold text-navy mb-1 line-clamp-2 group-hover:text-red transition-colors">
                    {album.title}
                  </div>
                  
                  <p className="text-sm text-slate-500 flex items-center gap-1.5 mt-auto pt-3">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {album.album_date ? new Date(album.album_date).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }) : "Tanpa tanggal"}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
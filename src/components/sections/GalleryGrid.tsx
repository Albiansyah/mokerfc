"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { Photo } from "@/lib/types";

export interface GalleryGridProps {
  photos: Photo[];
  showViewAll?: boolean;
  limit?: number | null;
}

export function GalleryGrid({ photos, showViewAll = true, limit = 5 }: GalleryGridProps) {
  const displayPhotos = limit === null ? photos : photos.slice(0, limit);
  const [activePhotoIdx, setActivePhotoIdx] = useState<number | null>(null);
  const [failedIndices, setFailedIndices] = useState<Record<number, boolean>>({});
  const triggerRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const touchStartX = useRef<number | null>(null);

  const closeLightbox = useCallback(() => {
    const lastIdx = activePhotoIdx;
    setActivePhotoIdx(null);
    if (lastIdx !== null && triggerRefs.current[lastIdx]) {
      triggerRefs.current[lastIdx]?.focus();
    }
  }, [activePhotoIdx]);

  const showNext = useCallback(() => {
    if (activePhotoIdx === null || displayPhotos.length === 0) return;
    setActivePhotoIdx((prev) => (prev! + 1) % displayPhotos.length);
  }, [activePhotoIdx, displayPhotos.length]);

  const showPrev = useCallback(() => {
    if (activePhotoIdx === null || displayPhotos.length === 0) return;
    setActivePhotoIdx((prev) => (prev! - 1 + displayPhotos.length) % displayPhotos.length);
  }, [activePhotoIdx, displayPhotos.length]);

  useEffect(() => {
    if (activePhotoIdx === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        closeLightbox();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        showNext();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        showPrev();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activePhotoIdx, closeLightbox, showNext, showPrev]);

  if (displayPhotos.length === 0) {
    return null;
  }

  return (
    <div className="w-full">
      {/* Grid Seragam (Lebih rapi untuk banyak foto) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {displayPhotos.map((photo, index) => {
          return (
            <div key={photo.id || index} className="aspect-square relative group">
              <button
                type="button"
                ref={(el) => {
                  triggerRefs.current[index] = el;
                }}
                onClick={() => setActivePhotoIdx(index)}
                className="relative w-full h-full overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 block focus-visible:outline-2 focus-visible:outline-red cursor-zoom-in"
                aria-label={`Buka foto: ${photo.alt}`}
              >
                {failedIndices[index] ? (
                  <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center text-slate-400">
                    <svg className="w-8 h-8 mb-2 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-xs">Foto gagal dimuat</span>
                  </div>
                ) : (
                  <Image
                    src={photo.path}
                    alt={photo.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    onError={() => setFailedIndices((prev) => ({ ...prev, [index]: true }))}
                  />
                )}
                {/* Overlay Hover untuk Alt Text */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <p className="text-white text-xs font-medium line-clamp-2">{photo.alt}</p>
                </div>
              </button>
            </div>
          );
        })}
      </div>

      {showViewAll && photos.length > displayPhotos.length && (
        <div className="mt-8 text-center">
          <Link
            href="/galeri"
            className="inline-flex items-center justify-center min-h-12 px-8 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-bold text-navy hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 shadow-sm"
          >
            Lihat Semua Foto
            <span aria-hidden="true" className="ml-2">&rarr;</span>
          </Link>
        </div>
      )}

      {/* Lightbox Modal */}
      {activePhotoIdx !== null && displayPhotos[activePhotoIdx] && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Tampilan penuh foto"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
          onClick={closeLightbox}
          onTouchStart={(e) => {
            touchStartX.current = e.touches[0].clientX;
          }}
          onTouchEnd={(e) => {
            if (touchStartX.current === null) return;
            const touchEndX = e.changedTouches[0].clientX;
            const diff = touchEndX - touchStartX.current;
            if (diff > 50) showPrev();
            if (diff < -50) showNext();
            touchStartX.current = null;
          }}
        >
          <div
            className="relative max-w-5xl w-full max-h-[90vh] flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={closeLightbox}
              className="absolute -top-12 right-0 min-h-11 min-w-11 text-white p-2 hover:bg-white/20 rounded-lg flex items-center justify-center focus-visible:outline-2 focus-visible:outline-white"
              aria-label="Tutup lightbox (Escape)"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {displayPhotos.length > 1 && (
              <button
                type="button"
                onClick={showPrev}
                className="absolute left-2 sm:-left-14 top-1/2 -translate-y-1/2 min-h-11 min-w-11 bg-black/60 text-white p-3 hover:bg-black/90 rounded-lg flex items-center justify-center focus-visible:outline-2 focus-visible:outline-white"
                aria-label="Foto sebelumnya (Panah Kiri)"
              >
                <span aria-hidden="true">&larr;</span>
              </button>
            )}

            <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] max-h-[75vh] rounded-xl overflow-hidden bg-black">
              {failedIndices[activePhotoIdx] ? (
                <div className="w-full h-full flex items-center justify-center text-white text-base">
                  Foto tidak bisa dimuat
                </div>
              ) : (
                <Image
                  src={displayPhotos[activePhotoIdx].path}
                  alt={displayPhotos[activePhotoIdx].alt}
                  fill
                  sizes="100vw"
                  className="object-contain"
                />
              )}
            </div>

            <div className="w-full mt-4 flex items-center justify-between text-white text-sm">
              <span className="opacity-90">{displayPhotos[activePhotoIdx].alt}</span>
              <span className="tabular-nums opacity-75">
                {activePhotoIdx + 1} / {displayPhotos.length}
              </span>
            </div>

            {displayPhotos[activePhotoIdx].caption && (
              <p className="w-full text-xs text-white/75 mt-1">
                {displayPhotos[activePhotoIdx].caption}
              </p>
            )}

            {displayPhotos.length > 1 && (
              <button
                type="button"
                onClick={showNext}
                className="absolute right-2 sm:-right-14 top-1/2 -translate-y-1/2 min-h-11 min-w-11 bg-black/60 text-white p-3 hover:bg-black/90 rounded-lg flex items-center justify-center focus-visible:outline-2 focus-visible:outline-white"
                aria-label="Foto selanjutnya (Panah Kanan)"
              >
                <span aria-hidden="true">&rarr;</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
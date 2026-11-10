"use client";

import Image from "next/image";
import { ChangeEvent, DragEvent, useRef, useState } from "react";
import { movePhoto, storageObjectPath } from "@/lib/admin";
import { compressImage } from "@/lib/image";
import { createClient } from "@/lib/supabase/client";
import type { Photo } from "@/lib/types";

type FileProgress = { name: string; status: string };

export function PhotoUploader({
  albumId,
  initialPhotos,
  initialCoverPhotoId,
}: {
  albumId: string;
  initialPhotos: Photo[];
  initialCoverPhotoId: string | null;
}) {
  const [photos, setPhotos] = useState(initialPhotos);
  const [coverPhotoId, setCoverPhotoId] = useState(initialCoverPhotoId);
  const [status, setStatus] = useState("");
  const [progress, setProgress] = useState<FileProgress[]>([]);
  const [pending, setPending] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function setFileStatus(index: number, nextStatus: string) {
    setProgress((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, status: nextStatus } : item));
  }

  async function uploadFiles(files: File[]) {
    if (!files.length || pending) return;
    setPending(true);
    setStatus("");
    setProgress(files.map((file) => ({ name: file.name, status: "Menunggu" })));
    const supabase = createClient();
    let nextSort = photos.length;

    for (let index = 0; index < files.length; index++) {
      const file = files[index];
      const alt = window.prompt(`Teks alt wajib untuk ${file.name}`)?.trim();
      if (!alt) {
        setFileStatus(index, "Dilewati: teks alt kosong");
        continue;
      }

      try {
        setFileStatus(index, "Mengecilkan foto");
        const compressed = await compressImage(file);
        const objectPath = `${albumId}/${crypto.randomUUID()}.jpg`;
        setFileStatus(index, "Mengunggah");
        const { error: uploadError } = await supabase.storage.from("gallery").upload(objectPath, compressed.blob, { contentType: "image/jpeg" });
        if (uploadError) throw uploadError;
        const publicUrl = supabase.storage.from("gallery").getPublicUrl(objectPath).data.publicUrl;
        const { data, error } = await supabase.from("photos").insert({
          album_id: albumId,
          path: publicUrl,
          alt,
          width: compressed.width,
          height: compressed.height,
          sort: nextSort,
        }).select().single();
        if (error || !data) {
          await supabase.storage.from("gallery").remove([objectPath]);
          throw error ?? new Error("Foto gagal disimpan.");
        }
        nextSort += 1;
        setPhotos((current) => [...current, data as Photo]);
        setFileStatus(index, "Selesai");
      } catch {
        setFileStatus(index, "Gagal");
      }
    }

    setPending(false);
    setStatus("Proses upload selesai. Periksa status setiap foto.");
    if (inputRef.current) inputRef.current.value = "";
  }

  async function upload(event: ChangeEvent<HTMLInputElement>) {
    await uploadFiles(Array.from(event.target.files ?? []));
  }

  async function drop(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    await uploadFiles(Array.from(event.dataTransfer.files).filter((file) => file.type.startsWith("image/")));
  }

  async function move(index: number, direction: -1 | 1) {
    const next = movePhoto(photos, index, direction);
    if (next === photos) return;
    const previous = photos;
    setPhotos(next);
    const supabase = createClient();
    const results = await Promise.all(next.map((photo) => supabase.from("photos").update({ sort: photo.sort }).eq("id", photo.id)));
    if (results.some(({ error }) => error)) {
      setPhotos(previous);
      setStatus("Urutan foto gagal disimpan.");
      return;
    }
    setStatus("Urutan foto disimpan.");
  }

  async function selectCover(photoId: string) {
    const supabase = createClient();
    const { error } = await supabase.from("albums").update({ cover_photo_id: photoId }).eq("id", albumId);
    if (error) {
      setStatus("Cover album gagal disimpan.");
      return;
    }
    setCoverPhotoId(photoId);
    setStatus("Cover album diperbarui.");
  }

  async function remove(photo: Photo) {
    if (!window.confirm("Hapus foto ini secara permanen?")) return;
    const supabase = createClient();
    const { error } = await supabase.from("photos").delete().eq("id", photo.id);
    if (error) {
      setStatus("Foto gagal dihapus.");
      return;
    }
    const objectPath = storageObjectPath(photo.path, "gallery");
    if (objectPath) await supabase.storage.from("gallery").remove([objectPath]);
    const next = photos.filter((item) => item.id !== photo.id).map((item, sort) => ({ ...item, sort }));
    setPhotos(next);
    if (coverPhotoId === photo.id) setCoverPhotoId(null);
    await Promise.all(next.map((item) => supabase.from("photos").update({ sort: item.sort }).eq("id", item.id)));
    setStatus("Foto dihapus.");
  }

  return (
    <div>
      <label
        className="flex flex-col items-center justify-center min-h-40 cursor-pointer rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-6 text-center hover:bg-slate-100 transition-colors"
        onDragOver={(event) => event.preventDefault()}
        onDrop={drop}
      >
        <svg className="w-8 h-8 text-slate-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <span className="text-sm font-semibold text-slate-600">{pending ? "Upload sedang berjalan..." : "Klik atau jatuhkan foto di sini"}</span>
        <span className="text-xs text-slate-400 mt-1">Mendukung banyak file sekaligus</span>
        <input ref={inputRef} type="file" accept="image/*" multiple className="sr-only" onChange={upload} disabled={pending} />
      </label>
      
      <p className="mt-3 text-sm font-semibold text-slate-600" aria-live="polite">{status}</p>
      
      {progress.length > 0 && (
        <ul className="mt-3 grid gap-1 text-xs">
          {progress.map((item) => <li key={item.name} className="flex justify-between gap-4 border-b border-slate-100 py-1.5"><span className="truncate">{item.name}</span><span className={`font-semibold ${item.status === "Selesai" ? "text-green-600" : item.status === "Gagal" ? "text-red" : "text-slate-500"}`}>{item.status}</span></li>)}
        </ul>
      )}
      
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {photos.map((photo, index) => (
          <article key={photo.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm flex flex-col">
            <div className="relative aspect-video bg-slate-100">
              <Image src={photo.path} alt={photo.alt} fill sizes="(max-width: 640px) 100vw, 33vw" className="object-cover" />
            </div>
            <div className="p-3 flex-1 flex flex-col">
              <p className="text-sm font-semibold text-navy line-clamp-1">{index + 1}. {photo.alt}</p>
              {coverPhotoId === photo.id && <span className="inline-block mt-1 text-[10px] font-bold text-red uppercase tracking-wider">Cover Album</span>}
              
              <div className="mt-auto pt-3 flex items-center justify-between gap-2">
                <div className="flex gap-1">
                  <button type="button" onClick={() => move(index, -1)} disabled={index === 0} aria-label="Naikkan" className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-30">↑</button>
                  <button type="button" onClick={() => move(index, 1)} disabled={index === photos.length - 1} aria-label="Turunkan" className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-30">↓</button>
                </div>
                
                <div className="flex gap-1">
                  {coverPhotoId !== photo.id && <button type="button" onClick={() => selectCover(photo.id)} className="px-2 py-1 text-xs font-semibold rounded-lg border border-slate-200 hover:bg-slate-50">Set Cover</button>}
                  <button type="button" onClick={() => remove(photo)} className="px-2 py-1 text-xs font-semibold rounded-lg bg-red-50 text-red hover:bg-red-100">Hapus</button>
                </div>
              </div>
            </div>
          </article>
        ))}
        {photos.length === 0 && <p className="col-span-full border border-dashed border-slate-200 rounded-xl p-8 text-center text-sm text-slate-500">Belum ada foto di album ini.</p>}
      </div>
    </div>
  );
}
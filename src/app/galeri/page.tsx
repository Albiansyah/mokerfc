import type { Metadata } from "next";
import { getPublicAlbums } from "@/lib/queries";
import { AlbumsContent } from "./AlbumsContent";

export const metadata: Metadata = {
  title: "Galeri Dokumentasi",
  description:
    "Dokumentasi foto aksi pertandingan dan kegiatan latihan mini soccer Moker FC United Mojokerto.",
};

export default async function GaleriPage() {
  const { albums, error } = await getPublicAlbums();

  return (
    <div className="w-full bg-slate-50 pt-4 pb-16 lg:pt-6 lg:pb-20 min-h-screen">
      <div className="max-w-300 mx-auto px-6 lg:px-8">
        <AlbumsContent albums={albums} fetchError={error} />
      </div>
    </div>
  );
}
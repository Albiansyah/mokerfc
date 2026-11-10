import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="w-full min-h-[60vh] flex items-center justify-center py-16 px-4">
      <div className="max-w-md w-full text-center chamfer-card bg-[var(--surface)] border-2 border-[var(--border-strong)] p-8 relative">
        <div className="absolute top-0 left-0 right-0 h-1 bg-[var(--red)]" />
        <span className="text-6xl font-heading font-extrabold tabular-nums text-[var(--red)] block mb-2">
          404
        </span>
        <h1 className="text-2xl font-heading font-extrabold uppercase text-[var(--fg)] mb-3">
          Halaman Tidak Ditemukan
        </h1>
        <p className="text-sm opacity-80 mb-6">
          Halaman yang Anda cari tidak tersedia atau alamat URL telah dipindahkan.
        </p>
        <div className="flex justify-center">
          <Button href="/" variant="primary">
            Kembali ke Beranda
          </Button>
        </div>
      </div>
    </div>
  );
}

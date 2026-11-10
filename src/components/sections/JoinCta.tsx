import React from "react";
import { Button } from "../ui/Button";

export interface JoinCtaProps {
  registerHref?: string;
}

export function JoinCta({ registerHref = "/acara" }: JoinCtaProps) {
  return (
    <section className="w-full bg-navy text-white py-20 lg:py-28">
      <div className="max-w-300 mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          <div className="flex flex-col justify-center">
            <span className="block text-sm font-semibold tracking-wider text-gold mb-3 uppercase">
              Bergabung Bersama Kami
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6 leading-tight">
              Mau Ikut Main?
            </h2>
            <p className="text-lg text-slate-300 mb-10 leading-relaxed">
              Siapa saja boleh daftar. Pilih acara, isi data, transfer, lalu kirim bukti ke admin.
            </p>
            <div>
              <Button href={registerHref} variant="primary" size="lg" className="w-full sm:w-auto">
                Daftar Main
              </Button>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="flex items-start gap-5 p-6 rounded-2xl bg-white/5 border border-white/10">
              <div className="w-12 h-12 bg-navy border border-gold rounded-xl flex items-center justify-center flex-shrink-0 text-gold font-bold text-xl">
                1
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-1">
                  Pilih Acara dan Isi Data
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Buka jadwal laga, pilih posisi main (Kiper atau Pemain), lalu lengkapi nama dan nomor WhatsApp aktif.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-5 p-6 rounded-2xl bg-white/5 border border-white/10">
              <div className="w-12 h-12 bg-navy border border-gold rounded-xl flex items-center justify-center flex-shrink-0 text-gold font-bold text-xl">
                2
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-1">
                  Transfer Sesuai Nominal
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Kirimkan pembayaran ke rekening resmi klub sesuai total biaya yang tercantum pada kode pendaftaran.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-5 p-6 rounded-2xl bg-white/5 border border-white/10">
              <div className="w-12 h-12 bg-navy border border-gold rounded-xl flex items-center justify-center flex-shrink-0 text-gold font-bold text-xl">
                3
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-1">
                  Kirim Bukti ke WhatsApp Admin
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Kirimkan tangkapan layar bukti transfer ke chat WhatsApp admin agar slot Anda segera dikonfirmasi lunas.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
"use client";

// ponytail: Registration success screen with registration code, bank details, and dual WhatsApp proof triggers.
import React from "react";
import { Settings } from "@/lib/types";
import { formatRupiah } from "@/lib/money";
import { buildWhatsAppLink, getRegistrationWhatsAppMessage } from "@/lib/whatsapp";
import { CopyButton } from "../ui/CopyButton";
import { Button } from "../ui/Button";

export interface RegistrationSuccessData {
  code: string;
  eventTitle: string;
  eventDate: string;
  fullName: string;
  nickname?: string | null;
  position: "gk" | "player";
  phone: string;
  total: number;
}

export interface RegisterSuccessProps {
  data: RegistrationSuccessData;
  settings: Settings;
  onReset?: () => void;
}

export function RegisterSuccess({ data, settings, onReset }: RegisterSuccessProps) {
  const waMsg = getRegistrationWhatsAppMessage({
    code: data.code,
    eventTitle: data.eventTitle,
    eventDate: data.eventDate,
    fullName: data.fullName,
    nickname: data.nickname,
    position: data.position,
    phone: data.phone,
    total: data.total,
  });

  const admin1 = settings.wa_admin_1 || "6281615334069";
  const admin2 = settings.wa_admin_2 || "6281228933141";

  const admin1Url = buildWhatsAppLink(admin1, waMsg);
  const admin2Url = buildWhatsAppLink(admin2, waMsg);

  const bankNumberClean = (settings.bank_number || "").replace(/\s+/g, "");

  return (
    <div className="space-y-6" role="status" aria-live="polite">
      {/* Box Kode Registrasi */}
      <div className="p-6 bg-[var(--navy)] text-white chamfer-card border-2 border-[var(--gold)] text-center">
        <span className="block text-xs font-heading font-bold uppercase tracking-widest text-[var(--gold)] mb-1">
          Pendaftaran Berhasil Dibuat
        </span>
        <div className="text-3xl sm:text-4xl font-heading font-extrabold tracking-wider text-[var(--gold)] tabular-nums my-2">
          {data.code}
        </div>
        <p className="text-xs text-[var(--paper)]/85">
          Simpan kode pendaftaran ini untuk verifikasi pembayaran.
        </p>
      </div>

      {/* Ringkasan Biaya & Data */}
      <div className="p-4 bg-[var(--surface-muted)] chamfer-sm space-y-2 text-sm border border-[var(--border)]">
        <div className="flex justify-between pb-2 border-b border-[var(--border)]">
          <span className="opacity-75">Nama Pendaftar</span>
          <span className="font-semibold text-[var(--fg)]">
            {data.fullName} {data.nickname ? `(${data.nickname})` : ""}
          </span>
        </div>
        <div className="flex justify-between pb-2 border-b border-[var(--border)]">
          <span className="opacity-75">Posisi</span>
          <span className="font-semibold text-[var(--fg)]">
            {data.position === "gk" ? "Kiper (GK)" : "Pemain"}
          </span>
        </div>
        <div className="flex justify-between pb-2 border-b border-[var(--border)]">
          <span className="opacity-75">Total Pembayaran</span>
          <span className="text-lg font-heading font-extrabold text-[var(--red)] tabular-nums">
            {formatRupiah(data.total)}
          </span>
        </div>
      </div>

      {/* Blok Rekening Pembayaran */}
      <div className="p-5 bg-[var(--surface)] border-2 border-[var(--gold)] chamfer-sm space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-heading font-bold uppercase tracking-wider text-[var(--gold)]">
            Rekening Pembayaran Klub
          </span>
          <span className="text-xs font-bold text-[var(--fg)]">Bank {settings.bank_name || "BRI"}</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-[var(--surface-muted)] chamfer-sm">
          <span className="text-xl sm:text-2xl font-heading font-extrabold tracking-wider tabular-nums text-[var(--fg)]">
            {settings.bank_number || "6408 0101 2984 501"}
          </span>
          <CopyButton
            textToCopy={bankNumberClean || "640801012984501"}
            label="Salin Nomor"
            successLabel="Tersalin"
          />
        </div>

        <p className="text-xs opacity-85">
          Atas Nama: <strong className="font-bold">{settings.bank_holder || "Ahmad Mauludin"}</strong>
        </p>
      </div>

      {/* Tombol Kirim Bukti WhatsApp */}
      <div className="space-y-3 pt-2">
        <span className="block text-xs font-heading font-bold uppercase tracking-wider text-[var(--fg)] text-center">
          Kirim Bukti Transfer ke Admin
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Button href={admin1Url} variant="primary" isExternal className="w-full justify-center">
            Admin 1 ({admin1})
          </Button>
          <Button href={admin2Url} variant="primary" isExternal className="w-full justify-center">
            Admin 2 ({admin2})
          </Button>
        </div>
      </div>

      {onReset && (
        <div className="text-center pt-2">
          <button
            type="button"
            onClick={onReset}
            className="text-xs font-heading font-bold uppercase tracking-wider text-[var(--gold)] hover:underline"
          >
            Daftarkan Peserta Lain
          </button>
        </div>
      )}
    </div>
  );
}

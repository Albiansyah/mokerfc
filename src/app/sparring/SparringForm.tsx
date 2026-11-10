"use client";

import React, { useState, useRef } from "react";
import { Settings } from "@/lib/types";
import { getSparringWhatsAppMessage, buildWhatsAppLink } from "@/lib/whatsapp";
import { Field } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { CopyButton } from "@/components/ui/CopyButton";

export interface SparringFormProps { settings: Settings; }

interface FormState {
  clubName: string;
  picName: string;
  whatsapp: string;
  date: string;
  time: string;
  venue: string;
  playerCount: string;
  note: string;
  adminWa: string;
}

interface FormErrors {
  clubName?: string;
  picName?: string;
  whatsapp?: string;
  date?: string;
}

export function SparringForm({ settings }: SparringFormProps) {
  const adminList = [
    settings.wa_admin_1 ? { label: "Admin 1", wa: settings.wa_admin_1, display: settings.wa_admin_1 } : null,
    settings.wa_admin_2 ? { label: "Admin 2", wa: settings.wa_admin_2, display: settings.wa_admin_2 } : null,
  ].filter((admin): admin is { label: string; wa: string; display: string } => admin !== null);

  const [formData, setFormData] = useState<FormState>({
    clubName: "",
    picName: "",
    whatsapp: "",
    date: "",
    time: "",
    venue: "",
    playerCount: "",
    note: "",
    adminWa: adminList[0]?.wa ?? "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [submittedMessage, setSubmittedMessage] = useState<string | null>(null);

  const clubNameRef = useRef<HTMLInputElement>(null);
  const picNameRef = useRef<HTMLInputElement>(null);
  const whatsappRef = useRef<HTMLInputElement>(null);
  const dateRef = useRef<HTMLInputElement>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.clubName.trim()) {
      newErrors.clubName = "Nama klub wajib diisi.";
    }

    if (!formData.picName.trim()) {
      newErrors.picName = "Nama penanggung jawab wajib diisi.";
    }

    const cleanWa = formData.whatsapp.replace(/\D/g, "");
    if (!formData.whatsapp.trim()) {
      newErrors.whatsapp = "Nomor WhatsApp wajib diisi.";
    } else if (cleanWa.length < 9) {
      newErrors.whatsapp = "Nomor WhatsApp harus berupa angka valid (minimal 9 digit).";
    }

    if (!formData.date.trim()) {
      newErrors.date = "Usulan tanggal pertandingan wajib dipilih.";
    }

    setErrors(newErrors);

    if (newErrors.clubName) {
      clubNameRef.current?.focus();
      return false;
    }
    if (newErrors.picName) {
      picNameRef.current?.focus();
      return false;
    }
    if (newErrors.whatsapp) {
      whatsappRef.current?.focus();
      return false;
    }
    if (newErrors.date) {
      dateRef.current?.focus();
      return false;
    }

    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const message = getSparringWhatsAppMessage({
      clubName: formData.clubName.trim(),
      picName: formData.picName.trim(),
      whatsapp: formData.whatsapp.trim(),
      date: formData.date.trim(),
      time: formData.time.trim() || undefined,
      venue: formData.venue.trim() || undefined,
      playerCount: formData.playerCount.trim() || undefined,
      note: formData.note.trim() || undefined,
    });

    setSubmittedMessage(message);

    const waLink = buildWhatsAppLink(formData.adminWa, message);
    window.open(waLink, "_blank", "noopener,noreferrer");
  };

  if (submittedMessage) {
    const waLink = buildWhatsAppLink(formData.adminWa, submittedMessage);
    const emailSubject = `Usulan Sparring: ${formData.clubName}`;
    const mailtoLink = `mailto:${settings.email ?? ""}?subject=${encodeURIComponent(
      emailSubject
    )}&body=${encodeURIComponent(submittedMessage)}`;

    return (
      <div className="space-y-6" role="status" aria-live="polite">
        <div className="p-5 bg-green-50 rounded-xl border border-green-200">
          {/* Tag h2 diganti div biar ga jumbo */}
          <div className="text-lg font-bold text-green-800 mb-1">
            Pengajuan Berhasil Disiapkan
          </div>
          <p className="text-sm text-green-700">
            Tab WhatsApp telah dibuka. Jika tidak otomatis terkirim, silakan salin ringkasan pesan di bawah atau kirim via email.
          </p>
        </div>

        <div>
          <span className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            Ringkasan Pesan
          </span>
          <pre className="p-4 bg-slate-50 text-slate-700 text-sm rounded-xl border border-slate-200 whitespace-pre-wrap font-sans">
            {submittedMessage}
          </pre>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button href={waLink} variant="primary" isExternal className="flex-1 shadow-md shadow-red/10">
            Buka WhatsApp Lagi
          </Button>
          <CopyButton
            textToCopy={submittedMessage}
            label="Salin Pesan"
            successLabel="Tersalin!"
          />
        </div>

        <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4">
          <a
            href={mailtoLink}
            className="text-sm font-semibold text-slate-500 hover:text-navy underline underline-offset-4"
          >
            Kirim via Email ({settings.email || "Belum diatur"})
          </a>
          <button
            type="button"
            onClick={() => setSubmittedMessage(null)}
            className="text-sm font-bold text-red hover:text-red-700 transition-colors"
          >
            Edit Formulir
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      <div>
        <span className="block text-sm font-bold text-navy mb-3">
          Pilih Admin Tujuan <span className="text-red">*</span>
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {adminList.map((admin) => (
            <label
              key={admin.wa}
              className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-all duration-200 ${
                formData.adminWa === admin.wa
                  ? "border-red bg-red/5 ring-1 ring-red"
                  : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
              }`}
            >
              <input
                type="radio"
                name="adminWa"
                value={admin.wa}
                checked={formData.adminWa === admin.wa}
                onChange={handleChange}
                className="w-4 h-4 text-red focus:ring-red"
              />
              <span className="text-sm font-bold text-slate-700">
                {admin.label} <span className="text-slate-400 font-normal">({admin.display})</span>
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Field
          ref={clubNameRef}
          id="clubName"
          name="clubName"
          label="Nama Klub / Tim Lawan"
          value={formData.clubName}
          onChange={handleChange}
          required
          error={errors.clubName}
          placeholder="Contoh: Majapahit FC"
        />

        <Field
          ref={picNameRef}
          id="picName"
          name="picName"
          label="Penanggung Jawab (PIC)"
          value={formData.picName}
          onChange={handleChange}
          required
          error={errors.picName}
          placeholder="Nama perwakilan Anda"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Field
          ref={whatsappRef}
          id="whatsapp"
          name="whatsapp"
          type="tel"
          label="Nomor WhatsApp PIC"
          value={formData.whatsapp}
          onChange={handleChange}
          required
          error={errors.whatsapp}
          placeholder="Contoh: 08123456789"
        />

        <Field
          ref={dateRef}
          id="date"
          name="date"
          type="date"
          label="Usulan Tanggal"
          value={formData.date}
          onChange={handleChange}
          required
          error={errors.date}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Field
          id="time"
          name="time"
          type="time"
          label="Usulan Jam (WIB)"
          value={formData.time}
          onChange={handleChange}
        />

        <Field
          id="playerCount"
          name="playerCount"
          label="Perkiraan Jumlah Pemain"
          value={formData.playerCount}
          onChange={handleChange}
          placeholder="Contoh: 14 orang (7 vs 7)"
        />
      </div>

      <Field
        id="venue"
        name="venue"
        label="Usulan Lapangan / Lokasi"
        value={formData.venue}
        onChange={handleChange}
        placeholder="Nama lapangan atau usulkan di Mojokerto"
      />

      <Field
        id="note"
        name="note"
        label="Catatan Tambahan (Opsional)"
        value={formData.note}
        onChange={handleChange}
        multiline
        rows={3}
        placeholder="Informasi jersey, aturan main, atau hal penting lainnya"
      />

      <div className="pt-4 border-t border-slate-100">
        <Button type="submit" variant="primary" size="lg" className="w-full justify-center shadow-lg shadow-red/20">
          Kirim Usulan via WhatsApp
        </Button>
      </div>
    </form>
  );
}
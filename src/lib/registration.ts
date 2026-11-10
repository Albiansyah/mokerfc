import { createClient } from "./supabase/client";

export function normalizePhone(value: string): string | null {
  const digits = value.replace(/\D/g, "");
  const normalized = digits.startsWith("0") ? `62${digits.slice(1)}` : digits;
  return /^62\d{8,13}$/.test(normalized) ? normalized : null;
}

export async function registerForEventRpc(params: { slug: string; fullName: string; nickname?: string; phone: string; position: "gk" | "player" }) {
  try {
    const { data, error } = await createClient().rpc("register_for_event", { p_slug: params.slug, p_full_name: params.fullName, p_nickname: params.nickname || null, p_phone: params.phone, p_position: params.position });
    if (error) {
      const message = error.message;
      if (message.includes("QUOTA_FULL")) return { success: false, error: "Kuota acara ini sudah penuh." };
      if (message.includes("QUOTA_GK_FULL")) return { success: false, error: "Slot kiper sudah penuh. Coba daftar sebagai pemain." };
      if (message.includes("ALREADY_REGISTERED")) return { success: false, error: "Nomor ini sudah terdaftar di acara ini. Hubungi admin jika ada kendala." };
      if (message.includes("EVENT_CLOSED") || message.includes("EVENT_PASSED")) return { success: false, error: "Pendaftaran acara ini sudah ditutup." };
      return { success: false, error: "Pendaftaran tidak dapat disimpan. Coba lagi." };
    }
    const result = Array.isArray(data) ? data[0] : data;
    return { success: true, code: result?.out_code as string | undefined, amount: result?.out_amount as number | undefined, bankName: result?.out_bank_name as string | undefined, bankNumber: result?.out_bank_number as string | undefined, bankHolder: result?.out_bank_holder as string | undefined };
  } catch { return { success: false, error: "Gagal menghubungi server pendaftaran. Coba lagi." }; }
}

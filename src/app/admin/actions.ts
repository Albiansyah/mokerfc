"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/supabase/admin";

// ==========================================
// 1. AUTH ACTIONS
// ==========================================
export async function signOutAction() {
  const { supabase } = await requireAdmin();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

// ==========================================
// 2. EVENT (ACARA) ACTIONS
// ==========================================
export async function saveEventAction(prevState: any, formData: FormData) {
  const { supabase } = await requireAdmin();
  
  const id = formData.get("id") as string;
  const title = formData.get("title") as string;
  const slugInput = formData.get("slug") as string;
  
  // Bikin slug otomatis kalau kosong
  const slug = slugInput?.trim() 
    ? slugInput.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-") 
    : title.toLowerCase().replace(/[^a-z0-9]+/g, "-");

  let cover_path = formData.get("cover_path") as string;
  const coverFile = formData.get("cover") as File;

  // Handle Upload File Cover kalau ada file baru
  if (coverFile && coverFile.size > 0) {
    const fileExt = coverFile.name.split(".").pop();
    const fileName = `${crypto.randomUUID()}.${fileExt}`;
    const { error: uploadError } = await supabase.storage
      .from("events") // Pastiin nama bucket di Supabase lo "events"
      .upload(fileName, coverFile, { upsert: true });

    if (uploadError) return { ok: false, message: "Gagal upload cover: " + uploadError.message };

    const { data: publicUrlData } = supabase.storage.from("events").getPublicUrl(fileName);
    cover_path = publicUrlData.publicUrl;
  }

  // Olah benefits (dari textarea dipisah enter, jadi array)
  const benefitsRaw = formData.get("benefits") as string;
  const benefits = benefitsRaw ? benefitsRaw.split("\n").filter(Boolean) : [];

  const payload = {
    title,
    slug,
    type: formData.get("type") as string,
    status: formData.get("status") as string,
    event_date: formData.get("event_date") as string,
    start_time: formData.get("start_time") as string,
    end_time: (formData.get("end_time") as string) || null,
    venue_name: formData.get("venue_name") as string,
    venue_address: (formData.get("venue_address") as string) || null,
    maps_url: (formData.get("maps_url") as string) || null,
    quota_total: formData.get("quota_total") ? Number(formData.get("quota_total")) : null,
    quota_gk: formData.get("quota_gk") ? Number(formData.get("quota_gk")) : null,
    price_gk: formData.get("price_gk") ? Number(formData.get("price_gk")) : null,
    price_player: formData.get("price_player") ? Number(formData.get("price_player")) : null,
    description: (formData.get("description") as string) || null,
    benefits,
    cover_path,
  };

  if (id) {
    // Update
    const { error } = await supabase.from("events").update(payload).eq("id", id);
    if (error) return { ok: false, message: "Gagal update acara: " + error.message };
  } else {
    // Insert
    const { error } = await supabase.from("events").insert(payload);
    if (error) return { ok: false, message: "Gagal membuat acara: " + error.message };
  }

  revalidatePath("/admin/acara");
  revalidatePath("/admin");
  revalidatePath("/acara");
  revalidatePath("/");
  
  return { ok: true, message: "Acara berhasil disimpan!" };
}

export async function deleteEventAction(prevState: any, formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = formData.get("id") as string;

  // Cek apakah udah ada pendaftar
  const { count } = await supabase.from("registrations").select("*", { count: "exact", head: true }).eq("event_id", id);
  if (count && count > 0) {
    return { ok: false, message: "Tidak bisa dihapus, acara ini sudah memiliki pendaftar." };
  }

  const { error } = await supabase.from("events").delete().eq("id", id);
  if (error) return { ok: false, message: "Gagal menghapus acara." };

  revalidatePath("/admin/acara");
  revalidatePath("/admin");
  revalidatePath("/acara");
  redirect("/admin/acara");
}

// ==========================================
// 3. REGISTRANT (PENDAFTAR) ACTIONS
// ==========================================
export async function updateRegistrationStatusAction(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = formData.get("id") as string;
  const event_id = formData.get("event_id") as string;
  const status = formData.get("status") as string;

  const { error } = await supabase.from("registrations").update({ status }).eq("id", id);
  
  if (error) {
    console.error("Gagal update status:", error.message);
  }

  revalidatePath(`/admin/acara/${event_id}/pendaftar`);
  revalidatePath(`/admin/acara/${event_id}`);
  revalidatePath("/admin");
  revalidatePath("/acara");
}

// ==========================================
// 4. ALBUM (GALERI) ACTIONS
// ==========================================
export async function saveAlbumAction(prevState: any, formData: FormData) {
  const { supabase } = await requireAdmin();
  
  const id = formData.get("id") as string;
  const title = formData.get("title") as string;
  const slugInput = formData.get("slug") as string;
  const slug = slugInput?.trim() 
    ? slugInput.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-") 
    : title.toLowerCase().replace(/[^a-z0-9]+/g, "-");

  const payload = {
    title,
    slug,
    album_date: (formData.get("album_date") as string) || null,
    event_id: (formData.get("event_id") as string) || null,
    is_published: formData.get("is_published") === "on",
  };

  if (id) {
    const { error } = await supabase.from("albums").update(payload).eq("id", id);
    if (error) return { ok: false, message: "Gagal update album: " + error.message };
  } else {
    const { error } = await supabase.from("albums").insert(payload);
    if (error) return { ok: false, message: "Gagal membuat album: " + error.message };
  }

  revalidatePath("/admin/galeri");
  revalidatePath("/galeri");
  
  return { ok: true, message: "Album berhasil disimpan!" };
}

// ==========================================
// 5. SETTINGS (PENGATURAN) ACTIONS
// ==========================================
export async function saveSettingsAction(prevState: any, formData: FormData) {
  const { supabase } = await requireAdmin();
  
  const payload = {
    default_price_gk: Number(formData.get("default_price_gk")),
    default_price_player: Number(formData.get("default_price_player")),
    wa_admin_1: formData.get("wa_admin_1") as string,
    wa_admin_2: (formData.get("wa_admin_2") as string) || null,
    email: (formData.get("email") as string) || null,
    instagram: (formData.get("instagram") as string) || null,
    bank_name: (formData.get("bank_name") as string) || null,
    bank_number: (formData.get("bank_number") as string) || null,
    bank_holder: (formData.get("bank_holder") as string) || null,
    about: (formData.get("about") as string) || null,
  };

  const { error } = await supabase.from("settings").update(payload).eq("id", 1);
  
  if (error) return { ok: false, message: "Gagal menyimpan pengaturan: " + error.message };

  revalidatePath("/admin/pengaturan");
  revalidatePath("/", "layout"); // Revalidate semua halaman karena settings dipake global (header/footer)
  
  return { ok: true, message: "Pengaturan berhasil disimpan!" };
}

// ==========================================
// 6. FINANCE (KEUANGAN) ACTIONS
// ==========================================
export async function saveTransactionAction(prevState: any, formData: FormData) {
  const { supabase } = await requireAdmin();
  
  const payload = {
    type: formData.get("type") as string,
    date: formData.get("date") as string,
    category: formData.get("category") as string,
    amount: Number(formData.get("amount")),
    description: formData.get("description") as string,
  };

  const { error } = await supabase.from("transactions").insert(payload);
  
  if (error) return { ok: false, message: "Gagal menyimpan transaksi: " + error.message };

  revalidatePath("/admin/keuangan");
  revalidatePath("/admin");
  
  return { ok: true, message: "Transaksi berhasil disimpan!" };
}

// ==========================================
// 7. INVENTORY (INVENTARIS) ACTIONS
// ==========================================
export async function saveInventoryAction(prevState: any, formData: FormData) {
  const { supabase } = await requireAdmin();
  
  const payload = {
    name: formData.get("name") as string,
    category: formData.get("category") as string,
    quantity: Number(formData.get("quantity")),
    condition: formData.get("condition") as string,
    purchase_date: (formData.get("purchase_date") as string) || null,
    notes: (formData.get("notes") as string) || null,
  };

  const { error } = await supabase.from("inventories").insert(payload);
  
  if (error) return { ok: false, message: "Gagal menyimpan barang: " + error.message };

  revalidatePath("/admin/inventaris");
  
  return { ok: true, message: "Barang berhasil ditambahkan!" };
}
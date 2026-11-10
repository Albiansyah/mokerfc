import "server-only";
import { redirect } from "next/navigation";
import { createClient } from "./server";

export async function requireAdmin() {
  const supabase = await createClient();
  
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    redirect("/admin/login");
  }

  const { data: isAdmin, error: rpcError } = await supabase.rpc("is_admin");
  
  if (rpcError) {
    console.error("Gagal cek is_admin:", rpcError.message);
    redirect("/admin/login?error=not-admin");
  }
  
  if (!isAdmin) {
    redirect("/admin/login?error=not-admin");
  }

  return { supabase, user };
}
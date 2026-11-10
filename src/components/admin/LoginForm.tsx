"use client";

import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

export function LoginForm() {
  const router = useRouter(); 
  const params = useSearchParams(); 
  const [error, setError] = useState(params.get("error") === "not-admin" ? "Akun ini tidak memiliki akses." : ""); 
  const [pending, setPending] = useState(false);
  
  const input = "mt-1 block w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 focus:border-red focus:outline-none focus:ring-2 focus:ring-red/20 transition-all text-sm";
  const label = "block text-sm font-semibold text-slate-700";

  async function submit(event: FormEvent<HTMLFormElement>) { 
    event.preventDefault(); 
    setPending(true); 
    setError(""); 
    const data = new FormData(event.currentTarget); 
    const { error: loginError } = await createClient().auth.signInWithPassword({ email: String(data.get("email")), password: String(data.get("password")) }); 
    setPending(false); 
    
    if (loginError) return setError("Email atau kata sandi tidak sesuai."); 
    
    router.replace("/admin"); 
    router.refresh(); 
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      <label className={label}>
        <span>Email</span>
        <input name="email" type="email" autoComplete="email" required className={input} placeholder="nama@email.com" />
      </label>
      
      <label className={label}>
        <span>Kata sandi</span>
        <input name="password" type="password" autoComplete="current-password" required className={input} placeholder="••••••••" />
      </label>
      
      {error && <p role="alert" className="text-sm font-semibold text-red">{error}</p>}
      
      {/* Tombol Sejajar */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <Link 
          href="/" 
          className="w-full sm:w-auto inline-flex items-center justify-center min-h-12 rounded-xl border border-slate-300 bg-white px-6 font-bold text-slate-700 hover:bg-slate-50 transition-colors"
        >
          Beranda
        </Link>
        
        <button 
          disabled={pending} 
          className="w-full sm:flex-1 inline-flex items-center justify-center min-h-12 rounded-xl bg-red px-4 font-bold text-white hover:bg-red-700 transition-colors disabled:opacity-50"
        >
          {pending ? "Memeriksa..." : "Masuk"}
        </button>
      </div>
    </form>
  );
}
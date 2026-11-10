import Image from "next/image";
import { LoginForm } from "@/components/admin/LoginForm";

export default function AdminLoginPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center bg-slate-100 p-4">
      
      <section className="w-full max-w-sm bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-8">
          
          {/* Header Login */}
          <div className="mb-8 flex flex-col items-center text-center">
            <Image 
              src="/brand/logo-full.png" 
              alt="Moker FC United" 
              width={48} 
              height={48} 
              className="h-12 w-auto object-contain mb-4 opacity-80" 
            />
            <div className="text-xl font-bold text-slate-800 mb-1">
              Masuk ke Akun Anda
            </div>
            <p className="text-sm text-slate-500">Silakan masukkan kredensial Anda</p>
          </div>

          <LoginForm />
          
        </div>
        
        {/* Footer Login */}
        <div className="bg-slate-50 p-4 border-t border-slate-100 text-center">
          <p className="text-xs text-slate-400">Sistem Informasi Internal</p>
        </div>
      </section>
    </main>
  );
}
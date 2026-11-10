"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { signOutAction } from "@/app/admin/actions";
import { useState } from "react";

const NAV_ITEMS = [
  { 
    label: "Dasbor", 
    href: "/admin", 
    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /> 
  },
  { 
    label: "Acara", 
    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />,
    subItems: [
      { label: "Semua Acara", href: "/admin/acara" },
      { label: "Buat Acara Baru", href: "/admin/acara/baru" }
    ]
  },
  { 
    label: "Galeri", 
    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />,
    subItems: [
      { label: "Semua Album", href: "/admin/galeri" },
      { label: "Buat Album Baru", href: "/admin/galeri/baru" }
    ]
  },
  { 
    label: "Keuangan", 
    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />,
    subItems: [
      { label: "Dasbor Keuangan", href: "/admin/keuangan" },
      { label: "Catat Transaksi", href: "/admin/keuangan/baru" }
    ]
  },
  { 
    label: "Inventaris", 
    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />,
    subItems: [
      { label: "Daftar Barang", href: "/admin/inventaris" },
      { label: "Tambah Barang", href: "/admin/inventaris/baru" }
    ]
  },
  { 
    label: "Setelan", 
    href: "/admin/pengaturan", 
    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /> 
  },
];

export function AdminShell({ children, email }: { children: React.ReactNode; email: string }) {
  const pathname = usePathname();
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});

  const toggleMenu = (label: string) => {
    setOpenMenus((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      
      {/* SIDEBAR (Hanya Muncul di Desktop) */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200 fixed inset-y-0 z-50">
        <div className="p-6 flex items-center gap-3 border-b border-slate-100">
          <Image 
            src="/brand/logo-full.png" 
            alt="Logo" 
            width={32} 
            height={32} 
            className="h-8 w-auto" 
            style={{ width: "auto", height: "auto" }}
          />
          <span className="font-bold text-navy tracking-wider text-sm">ADMIN PANEL</span>
        </div>
        
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const isActive = item.subItems 
              ? item.subItems.some(sub => pathname.startsWith(sub.href))
              : pathname === item.href;
            const isOpen = openMenus[item.label];
            
            return (
              <div key={item.label}>
                {item.subItems ? (
                  <button
                    onClick={() => toggleMenu(item.label)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                      isActive ? "bg-red/10 text-red" : "text-slate-500 hover:bg-slate-50 hover:text-navy"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">{item.icon}</svg>
                      {item.label}
                    </div>
                    <svg className={`w-4 h-4 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                ) : (
                  <Link
                    href={item.href!}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                      isActive ? "bg-red/10 text-red" : "text-slate-500 hover:bg-slate-50 hover:text-navy"
                    }`}
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">{item.icon}</svg>
                    {item.label}
                  </Link>
                )}

                {item.subItems && (
                  <div className={`grid transition-all duration-300 ease-in-out ${isOpen ? "grid-rows-[1fr] opacity-100 mt-1" : "grid-rows-[0fr] opacity-0"}`}>
                    <div className="overflow-hidden">
                      <div className="pl-11 pr-4 py-1 space-y-1">
                        {item.subItems.map((sub) => (
                          <Link
                            key={sub.href}
                            href={sub.href}
                            className={`block px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                              pathname === sub.href ? "bg-slate-100 text-navy font-bold" : "text-slate-500 hover:text-navy hover:bg-slate-50"
                            }`}
                          >
                            {sub.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <p className="text-xs text-slate-500 mb-3 truncate">{email}</p>
          <form action={signOutAction}>
            <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 hover:text-red transition-colors">
              Keluar
            </button>
          </form>
        </div>
      </aside>

      {/* AREA KONTEN UTAMA */}
      <div className="flex-1 md:pl-64 flex flex-col min-h-screen">
        <main className="flex-1 p-4 sm:p-8 pb-24 md:pb-8">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>
      </div>

      {/* BOTTOM NAVIGATION (Hanya Muncul di Mobile/HP) */}
      <nav className="fixed bottom-0 inset-x-0 z-40 bg-white border-t border-slate-200 flex justify-around md:hidden pb-safe shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
        {NAV_ITEMS.map((item) => {
          const isActive = item.subItems 
            ? item.subItems.some(sub => pathname.startsWith(sub.href))
            : pathname === item.href;
            
          return (
            <Link 
              key={item.label} 
              href={item.subItems ? item.subItems[0].href : item.href!} 
              className={`flex flex-col items-center justify-center p-2 w-full ${
                isActive ? "text-red" : "text-slate-400 hover:text-slate-600"
              }`}
            >
              <svg className="w-5 h-5 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">{item.icon}</svg>
              <span className="text-[10px] font-bold">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
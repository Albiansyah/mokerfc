"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "../ui/Button";

export interface NavLink {
  href: string;
  label: string;
}

export interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  links: NavLink[];
  registerHref: string;
  waAdmin1?: string | null;
  waAdmin2?: string | null;
  instagram?: string | null;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
}

export function MobileDrawer({
  isOpen,
  onClose,
  links,
  registerHref,
  waAdmin1,
  waAdmin2,
  instagram,
  triggerRef,
}: MobileDrawerProps) {
  const pathname = usePathname();
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        triggerRef.current?.focus();
      }
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose, triggerRef]);

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="Menu navigasi mobile"
        className={`fixed top-0 right-0 z-50 h-full w-[85%] max-w-sm bg-navy text-white shadow-2xl border-l border-gold/30 flex flex-col justify-between transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-white/10 pt-6 px-6">
            <span className="font-heading font-bold text-xl text-gold uppercase tracking-wider">
              Menu Navigasi
            </span>
            <button
              type="button"
              onClick={() => {
                onClose();
                triggerRef.current?.focus();
              }}
              className="min-h-11 min-w-11 flex items-center justify-center p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              aria-label="Tutup menu navigasi"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <nav className="flex flex-col gap-1 px-4 pt-6">
            {links.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={onClose}
                  className={`min-h-11 px-4 py-3 flex items-center font-heading text-lg font-bold rounded-xl transition-all duration-200 ${
                    isActive 
                      ? "text-gold bg-white/10 translate-x-2" 
                      : "text-slate-300 hover:text-white hover:bg-white/5 hover:translate-x-1"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="pt-6 border-t border-white/10 px-6 pb-8 space-y-4">
          <Button
            href={registerHref}
            onClick={onClose}
            variant="primary"
            className="w-full justify-center shadow-lg shadow-red/20"
          >
            Daftar Main
          </Button>

          {/* Tombol Login yang Jelas */}
          <Link 
            href="/admin/login" 
            onClick={onClose}
            className="flex items-center justify-center gap-2 w-full min-h-11 rounded-xl border border-white/20 text-sm font-semibold text-white hover:bg-white/10 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Masuk Akun
          </Link>

          <div className="pt-4 border-t border-white/10 flex flex-col gap-3 text-xs text-slate-400">
            {waAdmin1 && (
              <a href={`https://wa.me/${waAdmin1}`} target="_blank" rel="noopener noreferrer" className="hover:text-gold transition-colors flex items-center gap-2">
                WhatsApp Admin 1
              </a>
            )}
            {waAdmin2 && (
              <a href={`https://wa.me/${waAdmin2}`} target="_blank" rel="noopener noreferrer" className="hover:text-gold transition-colors flex items-center gap-2">
                WhatsApp Admin 2
              </a>
            )}
            {instagram && (
              <a href={instagram} target="_blank" rel="noopener noreferrer" className="hover:text-gold transition-colors flex items-center gap-2">
                Instagram @mfc.utd
              </a>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
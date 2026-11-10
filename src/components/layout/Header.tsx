"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MobileDrawer } from "./MobileDrawer";
import { Button } from "../ui/Button";

const NAV_LINKS = [
  { href: "/", label: "Beranda" },
  { href: "/acara", label: "Acara" },
  { href: "/galeri", label: "Galeri" },
  { href: "/sparring", label: "Sparring" },
];

export interface HeaderProps {
  registerHref?: string;
  waAdmin1?: string | null;
  waAdmin2?: string | null;
  instagram?: string | null;
}

export function Header({
  registerHref = "/acara",
  waAdmin1 = "6281615334069",
  waAdmin2 = "6281228933141",
  instagram = "https://instagram.com/mfc.utd",
}: HeaderProps) {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 24);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const headerHeight = isScrolled ? "h-14" : "h-[72px]";
  const logoHeight = isScrolled ? 36 : 44;

  return (
    <header
      className={`sticky top-0 z-40 w-full bg-white border-b border-slate-200 transition-all duration-200 select-none ${headerHeight}`}
    >
      <div className="max-w-300 mx-auto px-6 lg:px-8 h-full flex items-center justify-between gap-4">
        
        <Link
          href="/"
          className="flex items-center gap-3 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red flex-shrink-0"
        >
          <div className="relative flex items-center justify-center">
            <Image
              src="/brand/logo-full.png"
              alt="Logo Moker FC United"
              width={logoHeight}
              height={logoHeight}
              priority
              className="object-contain transition-all duration-200"
              style={{ height: `${logoHeight}px`, width: "auto" }}
            />
          </div>
          <span className="hidden min-[400px]:inline-block font-extrabold text-xl sm:text-2xl uppercase tracking-wide text-navy">
            MOKER FC <span className="text-red">UNITED</span>
          </span>
        </Link>

        <nav className="hidden min-[900px]:flex items-center gap-8">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative py-1 text-sm font-semibold transition-colors hover:text-red ${
                  isActive ? "text-red" : "text-slate-600"
                }`}
              >
                {link.label}
                {isActive && (
                  <span
                    aria-hidden="true"
                    className="absolute -bottom-2 left-0 right-0 h-0.5 bg-red"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2 sm:gap-4">
          
          <Link 
            href="/admin/login"
            className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-navy transition-colors px-2 py-1"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Masuk
          </Link>

          <Button
            href={registerHref}
            variant="primary"
            size="sm"
            className="hidden sm:inline-flex"
          >
            Daftar Main
          </Button>

          <button
            ref={triggerRef}
            type="button"
            onClick={() => setIsMobileOpen(true)}
            className="min-[900px]:hidden min-h-11 min-w-11 p-2 flex items-center justify-center border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors"
            aria-label="Buka menu navigasi"
            aria-expanded={isMobileOpen}
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      <MobileDrawer
        isOpen={isMobileOpen}
        onClose={() => setIsMobileOpen(false)}
        links={NAV_LINKS}
        registerHref={registerHref}
        waAdmin1={waAdmin1}
        waAdmin2={waAdmin2}
        instagram={instagram}
        triggerRef={triggerRef}
      />
    </header>
  );
}
"use client";

// ponytail: Mobile drawer with Escape handler and focus return.
import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "../ui/Button";

export interface NavLink {
  href: string;
  label: string;
}

export interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  links: NavLink[];
  adminWaLink: string;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
}

export function MobileMenu({ isOpen, onClose, links, adminWaLink, triggerRef }: MobileMenuProps) {
  const pathname = usePathname();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        triggerRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, triggerRef]);

  if (!isOpen) return null;

  return (
    <div
      id="mobile-menu"
      ref={menuRef}
      className="fixed inset-0 z-40 bg-black/75 md:hidden"
      onClick={onClose}
    >
      <div
        className="w-4/5 max-w-sm h-full bg-[var(--surface)] p-6 shadow-2xl flex flex-col justify-between border-r-2 border-[var(--border-strong)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-[var(--border)] mb-6">
            <span className="font-heading font-extrabold text-xl uppercase tracking-wider text-[var(--fg)]">
              Menu Navigasi
            </span>
            <button
              type="button"
              onClick={() => {
                onClose();
                triggerRef.current?.focus();
              }}
              className="min-h-[44px] min-w-[44px] flex items-center justify-center p-2 text-[var(--fg)] hover:bg-[var(--surface-muted)] chamfer-sm"
              aria-label="Tutup menu navigasi"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <nav className="flex flex-col gap-2">
            {links.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={onClose}
                  className={`min-h-[44px] px-4 py-2.5 flex items-center font-heading text-lg font-bold uppercase tracking-wider transition-colors chamfer-sm ${
                    isActive
                      ? "bg-[var(--navy)] text-white dark:bg-[var(--gold)] dark:text-[var(--navy)]"
                      : "text-[var(--fg)] hover:bg-[var(--surface-muted)]"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="pt-6 border-t border-[var(--border)]">
          <Button href={adminWaLink} variant="primary" className="w-full justify-center">
            Chat Admin
          </Button>
        </div>
      </div>
    </div>
  );
}

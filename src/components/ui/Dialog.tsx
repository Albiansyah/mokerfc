"use client";

// ponytail: Native accessible dialog overlay with focus trap and escape key handler.
import React, { useEffect, useRef } from "react";

export interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  triggerRef?: React.RefObject<HTMLElement | null>;
}

export function Dialog({ isOpen, onClose, title, children, triggerRef }: DialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) {
      if (triggerRef?.current) {
        triggerRef.current.focus();
      }
      return;
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key === "Tab") {
        if (!dialogRef.current) return;
        const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;

        const firstElement = focusable[0];
        const lastElement = focusable[focusable.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    // Auto-focus dialog
    const timer = setTimeout(() => {
      dialogRef.current?.focus();
    }, 50);

    // Lock body scroll
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose, triggerRef]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
      ref={dialogRef}
      tabIndex={-1}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-none"
    >
      <div className="relative w-full max-w-lg bg-[var(--surface)] text-[var(--fg)] border-2 border-[var(--border-strong)] shadow-2xl p-6 chamfer-card">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-[var(--border)]">
          <h2 id="dialog-title" className="text-xl font-heading font-bold uppercase tracking-wider">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-[var(--fg)] hover:bg-[var(--surface-muted)] chamfer-sm min-h-[44px] min-w-[44px] flex items-center justify-center focus-visible:outline-2"
            aria-label="Tutup dialog"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
}

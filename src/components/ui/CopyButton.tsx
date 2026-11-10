"use client";

// ponytail: Clipboard API with execCommand fallback and aria-live status announcement.
import React, { useState } from "react";

export interface CopyButtonProps {
  textToCopy: string;
  label?: string;
  successLabel?: string;
  className?: string;
}

export function CopyButton({
  textToCopy,
  label = "Salin Nomor",
  successLabel = "Tersalin",
  className = "",
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(textToCopy);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = textToCopy;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand("copy");
        textArea.remove();
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback manual jika gagal
      setCopied(false);
    }
  };

  return (
    <div className="inline-flex items-center gap-2">
      <button
        type="button"
        onClick={handleCopy}
        className={`chamfer-btn min-h-[44px] px-4 py-2 text-sm font-heading font-bold uppercase tracking-wider border-2 border-[var(--border-strong)] bg-[var(--surface)] text-[var(--fg)] hover:bg-[var(--surface-muted)] active:opacity-90 focus-visible:outline-2 ${className}`.trim()}
        aria-label={copied ? successLabel : label}
      >
        <span className="inline-flex items-center gap-1.5">
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            {copied ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            )}
          </svg>
          {copied ? successLabel : label}
        </span>
      </button>
      <span className="sr-only" aria-live="polite">
        {copied ? `${label} berhasil disalin ke clipboard.` : ""}
      </span>
    </div>
  );
}

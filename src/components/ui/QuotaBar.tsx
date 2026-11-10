"use client";

// ponytail: Accessible animated quota bar emphasizing remaining spots.
import React, { useEffect, useState, useRef } from "react";

export interface QuotaBarProps {
  total: number | null;
  taken: number;
  label?: string;
  className?: string;
}

export function QuotaBar({ total, taken, label, className = "" }: QuotaBarProps) {
  const [animatedWidth, setAnimatedWidth] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const isUnlimited = total === null || total <= 0;
  const remaining = isUnlimited ? null : Math.max(0, total - taken);
  const isFull = !isUnlimited && remaining === 0;
  const percent = isUnlimited ? 0 : Math.min(100, Math.round((taken / total) * 100));

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setAnimatedWidth(percent);
        }
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    return () => observer.disconnect();
  }, [percent]);

  if (isUnlimited) {
    return (
      <div className={`text-xs font-semibold opacity-80 ${className}`}>
        {label ? `${label}: ` : ""}Kuota Terbuka
      </div>
    );
  }

  return (
    <div ref={containerRef} className={`w-full ${className}`}>
      <div className="flex items-center justify-between text-xs font-heading font-bold uppercase tracking-wider mb-1">
        <span className="text-[var(--ink)] dark:text-[var(--paper)]">
          {label || (isFull ? "Kuota Penuh" : `Sisa ${remaining} dari ${total} Slot`)}
        </span>
        <span className="tabular-nums opacity-75">{percent}%</span>
      </div>

      <div
        className="w-full h-2.5 bg-[var(--border)] overflow-hidden chamfer-sm relative"
        role="progressbar"
        aria-valuenow={taken}
        aria-valuemin={0}
        aria-valuemax={total}
        aria-label={label || "Kapasitas kuota peserta"}
      >
        <div
          className={`h-full transition-all duration-700 ease-[cubic-bezier(0.2,0.7,0.2,1)] ${
            isFull ? "bg-[var(--red)]" : "bg-[var(--gold)]"
          }`}
          style={{ width: `${animatedWidth}%` }}
        />
      </div>
    </div>
  );
}

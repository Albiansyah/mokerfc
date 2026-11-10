"use client";

// ponytail: Scoreboard style live countdown timer without flip animation.
import React, { useEffect, useState } from "react";
import { getTimeRemaining } from "@/lib/dates";

export interface CountdownProps {
  targetDate: string; // YYYY-MM-DD
  startTime?: string; // HH:mm
  className?: string;
  onEnded?: () => void;
}

export function Countdown({ targetDate, startTime = "00:00", className = "" }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    ended: boolean;
  } | null>(null);

  useEffect(() => {
    const tick = () => {
      const rem = getTimeRemaining(targetDate, startTime);
      setTimeLeft(rem);
    };

    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, [targetDate, startTime]);

  if (!timeLeft || timeLeft.ended) {
    return (
      <div className={`text-xs font-heading font-bold uppercase tracking-wider text-[var(--gold)] ${className}`}>
        Kickoff Telah Dimulai / Selesai
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-4 gap-2 text-center select-none ${className}`}>
      <div className="p-2 bg-[var(--surface-muted)] chamfer-sm border border-[var(--border)]">
        <span className="block text-2xl sm:text-3xl font-heading font-extrabold tabular-nums leading-none">
          {String(timeLeft.days).padStart(2, "0")}
        </span>
        <span className="text-[10px] uppercase font-bold tracking-wider opacity-75 mt-1 block">Hari</span>
      </div>
      <div className="p-2 bg-[var(--surface-muted)] chamfer-sm border border-[var(--border)]">
        <span className="block text-2xl sm:text-3xl font-heading font-extrabold tabular-nums leading-none">
          {String(timeLeft.hours).padStart(2, "0")}
        </span>
        <span className="text-[10px] uppercase font-bold tracking-wider opacity-75 mt-1 block">Jam</span>
      </div>
      <div className="p-2 bg-[var(--surface-muted)] chamfer-sm border border-[var(--border)]">
        <span className="block text-2xl sm:text-3xl font-heading font-extrabold tabular-nums leading-none">
          {String(timeLeft.minutes).padStart(2, "0")}
        </span>
        <span className="text-[10px] uppercase font-bold tracking-wider opacity-75 mt-1 block">Menit</span>
      </div>
      <div className="p-2 bg-[var(--surface-muted)] chamfer-sm border border-[var(--border)]">
        <span className="block text-2xl sm:text-3xl font-heading font-extrabold tabular-nums text-[var(--red)] leading-none">
          {String(timeLeft.seconds).padStart(2, "0")}
        </span>
        <span className="text-[10px] uppercase font-bold tracking-wider opacity-75 mt-1 block">Detik</span>
      </div>
    </div>
  );
}

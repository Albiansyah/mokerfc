"use client";

// ponytail: Native accessible tabs component with arrow navigation.
import React, { useRef } from "react";

export interface TabItem {
  id: string;
  label: string;
  count?: number;
}

export interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (tabId: string) => void;
  className?: string;
}

export function Tabs({ tabs, activeTab, onChange, className = "" }: TabsProps) {
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    let nextIndex = -1;

    if (e.key === "ArrowRight") {
      e.preventDefault();
      nextIndex = (index + 1) % tabs.length;
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      nextIndex = (index - 1 + tabs.length) % tabs.length;
    } else if (e.key === "Home") {
      e.preventDefault();
      nextIndex = 0;
    } else if (e.key === "End") {
      e.preventDefault();
      nextIndex = tabs.length - 1;
    }

    if (nextIndex >= 0) {
      tabRefs.current[nextIndex]?.focus();
      onChange(tabs[nextIndex].id);
    }
  };

  return (
    <div
      role="tablist"
      aria-label="Pilihan Kategori"
      className={`inline-flex flex-wrap gap-2 border-b-2 border-[var(--border)] pb-2 ${className}`.trim()}
    >
      {tabs.map((tab, idx) => {
        const isSelected = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            ref={(el) => {
              tabRefs.current[idx] = el;
            }}
            role="tab"
            id={`tab-${tab.id}`}
            aria-selected={isSelected}
            aria-controls={`panel-${tab.id}`}
            tabIndex={isSelected ? 0 : -1}
            onClick={() => onChange(tab.id)}
            onKeyDown={(e) => handleKeyDown(e, idx)}
            className={`min-h-[44px] px-5 py-2 font-heading text-lg font-bold uppercase tracking-wider transition-colors chamfer-sm ${
              isSelected
                ? "bg-[var(--navy)] text-white dark:bg-[var(--gold)] dark:text-[var(--navy)]"
                : "bg-transparent text-[var(--fg)] hover:bg-[var(--surface-muted)]"
            }`}
          >
            {tab.label}
            {typeof tab.count === "number" && (
              <span
                className={`ml-2 text-xs px-2 py-0.5 tabular-nums ${
                  isSelected
                    ? "bg-white/20 text-white dark:bg-black/20 dark:text-[var(--navy)]"
                    : "bg-[var(--surface-muted)] text-[var(--fg)]"
                }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

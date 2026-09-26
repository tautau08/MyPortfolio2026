"use client";

import { useId, useRef, type KeyboardEvent } from "react";
import { cn } from "@/lib/cn";

export interface TabOption<T extends string> {
  value: T;
  label: string;
}

interface SegmentedTabsProps<T extends string> {
  label: string;
  options: TabOption<T>[];
  value: T;
  onChange: (value: T) => void;
  /** Id of the panel these tabs control. */
  controls?: string;
  size?: "sm" | "md";
  className?: string;
}

/** WAI-ARIA tabs with roving focus and arrow-key navigation, styled as a pill switch. */
export function SegmentedTabs<T extends string>({ label, options, value, onChange, controls, size = "md", className }: SegmentedTabsProps<T>) {
  const baseId = useId();
  const refs = useRef<Array<HTMLButtonElement | null>>([]);

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    const last = options.length - 1;
    const next = { ArrowRight: i === last ? 0 : i + 1, ArrowLeft: i === 0 ? last : i - 1, Home: 0, End: last }[e.key];
    if (next === undefined) return;
    e.preventDefault();
    onChange(options[next].value);
    refs.current[next]?.focus();
  };

  return (
    <div role="tablist" aria-label={label} className={cn("no-scrollbar inline-flex max-w-full gap-1 overflow-x-auto rounded-full border border-line bg-paper p-1", className)}>
      {options.map((opt, i) => {
        const selected = opt.value === value;
        return (
          <button
            key={opt.value}
            ref={(el) => {
              refs.current[i] = el;
            }}
            id={`${baseId}-${opt.value}`}
            type="button"
            role="tab"
            aria-selected={selected}
            aria-controls={controls}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(opt.value)}
            onKeyDown={(e) => onKeyDown(e, i)}
            className={cn(
              "rounded-full font-semibold whitespace-nowrap transition-colors duration-200",
              size === "sm" ? "h-9 px-4 text-sm" : "h-11 px-5.5 text-[15px]",
              selected ? "bg-primary text-on-primary" : "text-ink-3 hover:text-ink",
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

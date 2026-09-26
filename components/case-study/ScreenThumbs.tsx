"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { thumbOf, type ScreenView } from "@/data/projects";
import { cn } from "@/lib/cn";

interface ScreenThumbsProps {
  views: ScreenView[];
  index: number;
  onSelect: (index: number) => void;
  smooth: boolean;
}

/** A strip of every page, grouped by app section, that keeps the current page in view. */
export function ScreenThumbs({ views, index, onSelect, smooth }: ScreenThumbsProps) {
  const stripRef = useRef<HTMLOListElement>(null);
  const itemRefs = useRef<Array<HTMLLIElement | null>>([]);

  useEffect(() => {
    const strip = stripRef.current;
    const item = itemRefs.current[index];
    if (!strip || !item) return;
    strip.scrollTo({ left: item.offsetLeft - (strip.clientWidth - item.offsetWidth) / 2, behavior: smooth ? "smooth" : "auto" });
  }, [index, smooth]);

  const grouped = views.some((v) => v.group);

  return (
    <ol ref={stripRef} aria-label="All pages" className="no-scrollbar relative -mx-4 flex gap-3 overflow-x-auto px-5 pt-1 pb-2 [mask-image:linear-gradient(to_right,transparent,black_20px,black_calc(100%-20px),transparent)]">
      {views.map((view, i) => {
        const thumb = thumbOf(view);
        const current = i === index;
        const startsGroup = view.group !== undefined && view.group !== views[i - 1]?.group;
        return (
          <li
            key={`${view.group ?? ""}-${view.label}`}
            ref={(el) => {
              itemRefs.current[i] = el;
            }}
            className={cn("flex shrink-0 flex-col gap-1.5", startsGroup && i > 0 && "ml-3 border-l border-line pl-6")}
          >
            {grouped && (
              <span aria-hidden="true" className={cn("h-4 font-mono text-[11px] tracking-wider text-accent-ink uppercase", !startsGroup && "invisible")}>
                {view.group}
              </span>
            )}
            <button
              type="button"
              onClick={() => onSelect(i)}
              aria-current={current ? "step" : undefined}
              aria-label={`Page ${i + 1}: ${view.group ? `${view.group}, ` : ""}${view.label}`}
              className="group flex w-36 flex-col gap-2 text-left sm:w-40"
            >
              <span
                className={cn(
                  "relative block aspect-[16/10] overflow-hidden rounded-xl border bg-paper-2 transition duration-200",
                  current ? "border-accent ring-2 ring-accent" : "border-line opacity-65 group-hover:opacity-100",
                )}
              >
                {thumb && <Image src={thumb.src} alt="" fill sizes="160px" className="object-cover object-left-top" />}
              </span>
              <span className={cn("truncate text-sm font-semibold", current ? "text-ink" : "text-ink-3 group-hover:text-ink")}>{view.label}</span>
            </button>
          </li>
        );
      })}
    </ol>
  );
}

"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import { highlightLine, type Lang } from "./highlight";

export interface WalkStep {
  /** 1-indexed inclusive line range. */
  lines: [number, number];
  note: string;
}

interface CodeWalkthroughProps {
  file: string;
  lang: Lang;
  code: string;
  steps: WalkStep[];
}

/** Steps through a code excerpt, highlighting one range at a time with a note. */
export function CodeWalkthrough({ file, lang, code, steps }: CodeWalkthroughProps) {
  const [i, setI] = useState(0);
  const lines = code.replace(/\n$/, "").split("\n");
  const [from, to] = steps[i].lines;

  return (
    <div className="flex flex-col bg-code-bg text-code-ink">
      <div className="flex items-center justify-between gap-3 border-b border-code-line px-4 py-2">
        <span className="truncate font-mono text-[11px] text-code-dim">{file}</span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setI((n) => Math.max(0, n - 1))}
            disabled={i === 0}
            aria-label="Previous step"
            className="rounded px-2 py-0.5 font-mono text-[12px] text-code-dim transition-colors hover:text-code-ink disabled:opacity-30"
          >
            ←
          </button>
          <span className="font-mono text-[11px] text-code-dim tabular">
            {i + 1}/{steps.length}
          </span>
          <button
            type="button"
            onClick={() => setI((n) => Math.min(steps.length - 1, n + 1))}
            disabled={i === steps.length - 1}
            aria-label="Next step"
            className="rounded px-2 py-0.5 font-mono text-[12px] text-code-dim transition-colors hover:text-code-ink disabled:opacity-30"
          >
            →
          </button>
        </div>
      </div>

      {/* Focusable so keyboard users can scroll long lines sideways on small screens. */}
      <pre tabIndex={0} aria-label={`Source of ${file}`} className="overflow-x-auto py-3 font-mono text-[12px] leading-[1.65] sm:text-[12.5px]">
        <code>
          {lines.map((line, n) => {
            const on = n + 1 >= from && n + 1 <= to;
            return (
              <div
                key={n}
                className={cn(
                  "flex border-l-2 pr-4 transition-[opacity,background-color] duration-300",
                  on ? "border-code-kw bg-white/[0.04] opacity-100" : "border-transparent opacity-75",
                )}
              >
                <span className="w-10 shrink-0 pr-3 text-right text-code-dim select-none tabular">{n + 1}</span>
                <span className="whitespace-pre">{highlightLine(line, lang)}</span>
              </div>
            );
          })}
        </code>
      </pre>

      <p aria-live="polite" className="min-h-[4.5rem] border-t border-code-line px-4 py-3 text-[13px] leading-relaxed text-code-ink/90">
        {steps[i].note}
      </p>
    </div>
  );
}

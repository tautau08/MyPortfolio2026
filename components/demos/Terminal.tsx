"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { useInView } from "@/lib/useInView";
import { useReducedMotion } from "@/lib/useReducedMotion";

export interface TermLine {
  kind: "cmd" | "out" | "ok" | "err" | "dim" | "info";
  text: string;
  /** Pause before this line appears, in ms. */
  delay?: number;
}

interface TerminalProps {
  title: string;
  lines: TermLine[];
  className?: string;
  /** Fixed body height so replaying never shifts layout. */
  heightClass?: string;
}

const COLOR: Record<TermLine["kind"], string> = {
  cmd: "text-code-ink",
  out: "text-code-ink/85",
  ok: "text-code-str",
  err: "text-code-kw",
  dim: "text-code-dim",
  info: "text-code-ann",
};

/** A scripted terminal that plays once scrolled into view and can be replayed. */
export function Terminal({ title, lines, className, heightClass = "h-72" }: TerminalProps) {
  const { ref, inView } = useInView<HTMLDivElement>();
  const reduced = useReducedMotion();
  const [shown, setShown] = useState(0);
  const [typed, setTyped] = useState(0);
  const [run, setRun] = useState(0);
  const body = useRef<HTMLDivElement>(null);

  const done = shown >= lines.length;

  useEffect(() => {
    if (!inView) return;
    if (reduced) {
      setShown(lines.length);
      return;
    }
    if (shown >= lines.length) return;
    const line = lines[shown];
    // Commands type out; everything else appears whole after its delay.
    if (line.kind === "cmd" && typed < line.text.length) {
      const t = setTimeout(() => setTyped((n) => n + 1), typed === 0 ? (line.delay ?? 350) : 22);
      return () => clearTimeout(t);
    }
    const t = setTimeout(
      () => {
        setShown((n) => n + 1);
        setTyped(0);
      },
      line.kind === "cmd" ? 180 : (line.delay ?? 120),
    );
    return () => clearTimeout(t);
  }, [inView, reduced, shown, typed, lines, run]);

  useEffect(() => {
    const el = body.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [shown, typed]);

  const replay = useCallback(() => {
    setShown(0);
    setTyped(0);
    setRun((r) => r + 1);
  }, []);

  const current = lines[shown];

  return (
    <div ref={ref} className={cn("flex flex-col bg-code-bg text-code-ink", className)}>
      <div className="flex items-center justify-between border-b border-code-line px-4 py-2">
        <span className="font-mono text-[11px] text-code-dim">{title}</span>
        <button
          type="button"
          onClick={replay}
          disabled={!done}
          className="rounded px-2 py-0.5 font-mono text-[11px] text-code-dim transition-colors hover:text-code-ink disabled:opacity-40"
        >
          ↻ replay
        </button>
      </div>
      <div
        ref={body}
        role="log"
        aria-live="polite"
        aria-label={title}
        className={cn("overflow-y-auto px-4 py-3 font-mono text-[12px] leading-[1.7] sm:text-[12.5px]", heightClass)}
      >
        {lines.slice(0, shown).map((l, i) => (
          <Line key={`${run}-${i}`} line={l} />
        ))}
        {current && current.kind === "cmd" && typed > 0 && (
          <div className="break-words whitespace-pre-wrap">
            <span className="text-code-dim select-none">$ </span>
            {current.text.slice(0, typed)}
            <span className="caret ml-px inline-block h-[1.1em] w-[0.55em] translate-y-[0.2em] bg-code-ink/80" />
          </div>
        )}
        {done && (
          <div>
            <span className="text-code-dim select-none">$ </span>
            <span className="caret inline-block h-[1.1em] w-[0.55em] translate-y-[0.2em] bg-code-ink/60" />
          </div>
        )}
      </div>
    </div>
  );
}

function Line({ line }: { line: TermLine }) {
  return (
    <div className={cn("break-words whitespace-pre-wrap", COLOR[line.kind])}>
      {line.kind === "cmd" && <span className="text-code-dim select-none">$ </span>}
      {line.text}
    </div>
  );
}

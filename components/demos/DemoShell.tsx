import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export type Provenance = "interactive" | "replay" | "source";

const PROVENANCE: Record<Provenance, string> = {
  interactive: "Interactive",
  replay: "Replay",
  source: "Source",
};

interface DemoShellProps {
  kind: Provenance;
  /** Where the data or logic comes from, shown under the demo. */
  note: string;
  children: ReactNode;
  className?: string;
  dark?: boolean;
}

/** Common frame for capability demos: a kind label and an honest provenance note. */
export function DemoShell({ kind, note, children, className, dark }: DemoShellProps) {
  return (
    <div className={cn("flex flex-col overflow-hidden rounded-xl border border-line", dark ? "bg-code-bg" : "bg-paper-2", className)}>
      <div className="min-w-0 flex-1">{children}</div>
      <div
        className={cn(
          "flex items-start gap-2 border-t px-4 py-2.5 font-mono text-[11px] leading-relaxed",
          dark ? "border-code-line text-code-dim" : "border-line text-ink-3",
        )}
      >
        <span className={cn("shrink-0 uppercase tracking-wider", kind === "interactive" ? "text-accent" : dark ? "text-code-ink" : "text-ink-2")}>
          {PROVENANCE[kind]}
        </span>
        <span aria-hidden="true">·</span>
        <span className="min-w-0 [overflow-wrap:anywhere]">{note}</span>
      </div>
    </div>
  );
}

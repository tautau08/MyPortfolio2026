import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type Tone = "outline" | "filled" | "solid" | "live" | "demo";

const tones: Record<Tone, string> = {
  outline: "border border-chip",
  filled: "bg-paper",
  solid: "bg-primary text-on-primary font-mono font-normal",
  live: "bg-signal-soft text-signal-ink font-bold",
  demo: "bg-accent-soft text-accent-ink font-bold",
};

/** Small non-interactive label. Interactive pills use buttons instead. */
export function Chip({ children, tone = "outline", className }: { children: ReactNode; tone?: Tone; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[13px] font-semibold", tones[tone], className)}>
      {children}
    </span>
  );
}

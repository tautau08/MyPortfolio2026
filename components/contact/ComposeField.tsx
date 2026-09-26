import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export const composeLabel = "w-12 shrink-0 font-mono text-[13px] text-on-contact-muted";
export const composeInput =
  "h-12 w-full min-w-0 bg-transparent text-base text-on-contact outline-none placeholder:text-on-contact-muted/55";
/** Rows light up with an accent edge while focused, in place of the default focus ring. */
export const composeRow = "border-b border-white/10 transition-shadow focus-within:shadow-[inset_3px_0_0_var(--contact-accent)]";

interface ComposeFieldProps {
  label: string;
  htmlFor: string;
  error?: string;
  errorId?: string;
  className?: string;
  children: ReactNode;
}

/** One header line of the compose window: a short label, the field, and its error underneath. */
export function ComposeField({ label, htmlFor, error, errorId, className, children }: ComposeFieldProps) {
  return (
    <div className={cn(composeRow, className)}>
      <div className="flex min-h-12 items-center gap-4 px-5">
        <label htmlFor={htmlFor} className={composeLabel}>
          {label}
        </label>
        <div className="flex min-w-0 flex-1 items-center">{children}</div>
      </div>
      {error && (
        <p id={errorId} className="-mt-1 pr-5 pb-2.5 pl-[5.25rem] text-sm text-contact-accent">
          {error}
        </p>
      )}
    </div>
  );
}

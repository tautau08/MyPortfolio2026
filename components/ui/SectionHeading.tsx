import { cn } from "@/lib/cn";

interface SectionHeadingProps {
  id?: string;
  eyebrow: string;
  title: string;
  /** Last words of the title, set in the italic serif. */
  accent?: string;
  className?: string;
  size?: "md" | "lg";
}

/** Mono eyebrow over a large heading whose last words switch to italic serif. */
export function SectionHeading({ id, eyebrow, title, accent, className, size = "md" }: SectionHeadingProps) {
  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <span className="font-mono text-[15px] text-accent">{eyebrow}</span>
      <h2
        id={id}
        className={cn(
          "font-extrabold tracking-[-0.04em]",
          size === "lg" ? "text-[clamp(2.5rem,1.5rem+3vw,4rem)] leading-none" : "text-[clamp(2.25rem,1.6rem+2vw,3.25rem)] leading-[1.02]",
        )}
      >
        {title}
        {accent && (
          <>
            {" "}
            <span className="font-serif font-normal tracking-[-0.02em] italic">{accent}</span>
          </>
        )}
      </h2>
    </div>
  );
}

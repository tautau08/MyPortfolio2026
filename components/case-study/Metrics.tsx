import type { Metric } from "@/data/projects";

export function Metrics({ metrics }: { metrics: Metric[] }) {
  if (!metrics.length) return null;
  return (
    <section aria-label="Key numbers" className="grid gap-4 md:grid-cols-3">
      {metrics.map((m) => (
        <div key={m.label} className="rounded-[28px] border-[1.5px] border-ink px-8 py-7">
          <p className="text-[clamp(3rem,2rem+2.5vw,4.5rem)] leading-none font-extrabold tracking-[-0.05em] text-accent">{m.value}</p>
          <p className="mt-2 text-xl font-bold">{m.label}</p>
          {m.context && <p className="mt-2 text-[15px] leading-relaxed text-ink-3">{m.context}</p>}
        </div>
      ))}
    </section>
  );
}

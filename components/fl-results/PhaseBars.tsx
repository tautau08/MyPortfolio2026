import { flBaselineMae, flPhases } from "@/data/fl";
import { cn } from "@/lib/cn";

const SCALE = 4.5;
const pct = (v: number) => `${((v / SCALE) * 100).toFixed(1)}%`;

/** Best MAE per phase against the centralized baseline (marked by the vertical rule). */
export function PhaseBars() {
  return (
    <ul className="flex flex-col gap-3.5">
      {flPhases.map((p) => {
        const tone = p.mae === flBaselineMae ? "base" : p.mae > flBaselineMae ? "worse" : "better";
        return (
          <li key={p.phase} className="grid grid-cols-[minmax(0,150px)_minmax(0,1fr)] items-center gap-3.5 sm:grid-cols-[170px_minmax(0,1fr)]">
            <div>
              <div className="text-sm font-bold">{p.name}</div>
              <div className="text-xs text-ink-3">{p.note}</div>
            </div>
            <div className="relative h-7.5 rounded-lg bg-paper">
              <div
                className={cn(
                  "flex h-full items-center justify-end rounded-lg pr-2.5 font-mono text-xs font-semibold",
                  tone === "base" && "bg-chip text-ink",
                  tone === "worse" && "bg-accent-soft text-accent-ink",
                  tone === "better" && "bg-accent-fill text-white",
                )}
                style={{ width: pct(p.mae) }}
              >
                {p.mae.toFixed(3)}
              </div>
              <span aria-hidden="true" className="absolute -inset-y-1 w-0.5 bg-ink" style={{ left: pct(flBaselineMae) }} />
            </div>
          </li>
        );
      })}
    </ul>
  );
}

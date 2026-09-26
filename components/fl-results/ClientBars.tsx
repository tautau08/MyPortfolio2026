import { flClients } from "@/data/fl";

const SCALE = 15;
const pct = (v: number) => `${((v / SCALE) * 100).toFixed(1)}%`;

/** Per-client MAE before (phase 4) and after (phase 5, log1p target), worst first. */
export function ClientBars() {
  const clients = [...flClients].sort((a, b) => b.p4 - a.p4);
  return (
    <ul className="flex flex-col gap-1.25" aria-label="MAE per client project, phase 4 and phase 5">
      {clients.map((c) => (
        <li key={c.name} className="grid grid-cols-[110px_minmax(0,1fr)_40px] items-center gap-2.5 text-xs sm:grid-cols-[138px_minmax(0,1fr)_44px]">
          <span className="truncate font-mono text-ink-3">{c.name}</span>
          <span className="relative h-3 rounded bg-paper" aria-label={`phase 4 ${c.p4.toFixed(2)}, phase 5 ${c.p5.toFixed(2)}`}>
            <span className="absolute inset-y-0 left-0 rounded bg-chip" style={{ width: pct(c.p4) }} />
            <span className="absolute inset-y-[3px] left-0 rounded-[3px] bg-accent" style={{ width: pct(c.p5) }} />
          </span>
          <span className="text-right font-mono">{c.p5.toFixed(2)}</span>
        </li>
      ))}
    </ul>
  );
}

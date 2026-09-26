import { flRounds } from "@/data/fl";

const W = 600;
const H = 160;
const PAD = { left: 40, right: 10, top: 16, bottom: 22 };
const MIN = 3.05;
const MAX = 3.35;

const x = (i: number) => PAD.left + (i / (flRounds.length - 1)) * (W - PAD.left - PAD.right);
const y = (v: number) => PAD.top + ((MAX - v) / (MAX - MIN)) * (H - PAD.top - PAD.bottom);

/** Global MAE per federated round, from phase4_metrics.json. */
export function RoundsChart() {
  const line = flRounds.map((r, i) => `${i ? "L" : "M"}${x(i).toFixed(1)} ${y(r.mae).toFixed(1)}`).join(" ");
  const area = `${line} L${x(flRounds.length - 1)} ${H - PAD.bottom} L${x(0)} ${H - PAD.bottom} Z`;
  const first = flRounds[0].mae.toFixed(2);
  const last = flRounds[flRounds.length - 1].mae.toFixed(2);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label={`Global MAE falls from ${first} to ${last} across ${flRounds.length} federated rounds`}>
      {[3.3, 3.2, 3.1].map((v) => (
        <g key={v}>
          <line x1={PAD.left} x2={W - PAD.right} y1={y(v)} y2={y(v)} className="stroke-line" strokeDasharray="3 6" />
          <text x={PAD.left - 10} y={y(v) + 4} textAnchor="end" className="fill-ink-3 font-mono text-[11px]">
            {v.toFixed(1)}
          </text>
        </g>
      ))}
      <path d={area} className="fill-accent-soft" />
      <path d={line} fill="none" className="stroke-accent" strokeWidth="3" strokeLinejoin="round" />
      {flRounds.map((r, i) => (
        <circle key={r.round} cx={x(i)} cy={y(r.mae)} r="3.5" className="fill-card stroke-accent" strokeWidth="2" />
      ))}
      <text x={x(0)} y={H - 4} className="fill-ink-3 font-mono text-[11px]">
        round 1
      </text>
      <text x={x(flRounds.length - 1)} y={H - 4} textAnchor="end" className="fill-ink-3 font-mono text-[11px]">
        round {flRounds.length}
      </text>
    </svg>
  );
}

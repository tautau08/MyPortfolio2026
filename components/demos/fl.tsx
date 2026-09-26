"use client";

import { useEffect, useState } from "react";
import { flBaselineMae, flPhases, flRounds } from "@/data/fl";
import { cn } from "@/lib/cn";
import { useInView } from "@/lib/useInView";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { DemoShell } from "./DemoShell";
import { Terminal, type TermLine } from "./Terminal";

/* ── Round player ─────────────────────────────────────────── */

export function FlRoundsDemo() {
  const { ref, inView } = useInView<HTMLDivElement>();
  const reduced = useReducedMotion();
  const [n, setN] = useState(0);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (inView && n === 0) {
      if (reduced) setN(flRounds.length);
      else setPlaying(true);
    }
  }, [inView, reduced, n]);

  useEffect(() => {
    if (!playing) return;
    if (n >= flRounds.length) {
      setPlaying(false);
      return;
    }
    const t = setTimeout(() => setN((v) => v + 1), 420);
    return () => clearTimeout(t);
  }, [playing, n]);

  const w = 600;
  const h = 240;
  const pad = { l: 44, r: 16, t: 16, b: 30 };
  const min = 3.05;
  const max = 3.35;
  const x = (i: number) => pad.l + (i / (flRounds.length - 1)) * (w - pad.l - pad.r);
  const y = (v: number) => pad.t + ((max - v) / (max - min)) * (h - pad.t - pad.b);
  const visible = flRounds.slice(0, Math.max(n, 1));
  const path = visible.map((r, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(r.mae).toFixed(1)}`).join(" ");
  const cur = flRounds[Math.max(n, 1) - 1];

  return (
    <DemoShell kind="replay" note="Values from models/phase4_personalized/phase4_metrics.json (16 of 16 clients fit and evaluated each round).">
      <div ref={ref} className="flex flex-col gap-4 p-5">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <dl className="flex gap-8">
            <div>
              <dt className="font-mono text-[11px] tracking-wider text-ink-3 uppercase">Round</dt>
              <dd className="text-3xl font-semibold tabular">{n === 0 ? "–" : cur.round}</dd>
            </div>
            <div>
              <dt className="font-mono text-[11px] tracking-wider text-ink-3 uppercase">MAE</dt>
              <dd className="text-3xl font-semibold tabular">{n === 0 ? "–" : cur.mae.toFixed(4)}</dd>
            </div>
            <div>
              <dt className="font-mono text-[11px] tracking-wider text-ink-3 uppercase">RMSE</dt>
              <dd className="text-3xl font-semibold text-ink-2 tabular">{n === 0 ? "–" : cur.rmse.toFixed(4)}</dd>
            </div>
          </dl>
          <button
            type="button"
            onClick={() => {
              setN(0);
              setPlaying(true);
            }}
            disabled={playing}
            className="rounded-full border border-line px-3.5 py-1.5 font-mono text-xs text-ink-2 transition-colors hover:border-ink hover:text-ink disabled:opacity-40"
          >
            {playing ? "training…" : "↻ replay rounds"}
          </button>
        </div>

        <svg viewBox={`0 0 ${w} ${h}`} className="h-auto w-full" role="img" aria-label={`Global MAE fell from 3.3272 in round 1 to 3.0985 in round 10.`}>
          {[3.1, 3.2, 3.3].map((v) => (
            <g key={v}>
              <line x1={pad.l} x2={w - pad.r} y1={y(v)} y2={y(v)} className="stroke-line" strokeDasharray="2 4" />
              <text x={pad.l - 8} y={y(v) + 4} textAnchor="end" className="fill-ink-3 font-mono text-[11px]">
                {v.toFixed(1)}
              </text>
            </g>
          ))}
          {flRounds.map((r, i) => (
            <text key={r.round} x={x(i)} y={h - 8} textAnchor="middle" className={cn("font-mono text-[11px]", i < n ? "fill-ink-2" : "fill-ink-3/50")}>
              R{r.round}
            </text>
          ))}
          <path d={path} fill="none" className="stroke-accent transition-all duration-300" strokeWidth="2.5" strokeLinejoin="round" />
          {visible.map((r, i) => (
            <circle key={r.round} cx={x(i)} cy={y(r.mae)} r={i === visible.length - 1 && n > 0 ? 5 : 3} className="fill-paper-2 stroke-accent" strokeWidth="2" />
          ))}
        </svg>
      </div>
    </DemoShell>
  );
}

/* ── Phase comparison ─────────────────────────────────────── */

export function FlPhasesDemo() {
  const max = 4.5;
  const [active, setActive] = useState<string | null>(null);

  return (
    <DemoShell kind="source" note="Best MAE per phase from worktracker.md. Phases 4–5 use local-client evaluation; 5b is macro MAE over all 16 clients.">
      <div className="p-5">
        <ul className="flex flex-col gap-3">
          {flPhases.map((p) => {
            const better = p.mae < flBaselineMae;
            const base = p.phase === "1";
            return (
              <li key={p.phase}>
                <button
                  type="button"
                  onMouseEnter={() => setActive(p.phase)}
                  onMouseLeave={() => setActive(null)}
                  onFocus={() => setActive(p.phase)}
                  onBlur={() => setActive(null)}
                  className="grid w-full grid-cols-[2.25rem_1fr] items-center gap-3 text-left sm:grid-cols-[2.25rem_11rem_1fr]"
                >
                  <span className="font-mono text-xs text-ink-3">P{p.phase}</span>
                  <span className="hidden truncate text-sm sm:block">{p.name}</span>
                  <span className="relative block h-7">
                    <span
                      className={cn(
                        "absolute inset-y-0 left-0 flex items-center justify-end rounded-sm pr-2 font-mono text-[11px] transition-[width,opacity] duration-500",
                        base ? "bg-ink-3/40 text-ink" : better ? "bg-signal-ink text-paper" : "bg-accent-fill text-white",
                        active && active !== p.phase && "opacity-40",
                      )}
                      style={{ width: `${(p.mae / max) * 100}%` }}
                    >
                      {p.mae.toFixed(3)}
                    </span>
                    <span className="absolute inset-y-[-4px] w-px bg-ink" style={{ left: `${(flBaselineMae / max) * 100}%` }} aria-hidden="true" />
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
        <p aria-live="polite" className="mt-4 min-h-[1.5rem] font-mono text-xs text-ink-2">
          {active ? `P${active} · ${flPhases.find((p) => p.phase === active)?.name}: ${flPhases.find((p) => p.phase === active)?.note}` : "Vertical line = centralized baseline (MAE 3.774). Hover or focus a bar."}
        </p>
      </div>
    </DemoShell>
  );
}

/* ── Split federation diagram ─────────────────────────────── */

export function FlSplitDemo() {
  const [shown, setShown] = useState<"shared" | "local">("shared");

  return (
    <DemoShell kind="interactive" note="Architecture from src/client.py and src/simulate_phase4.py.">
      <div className="flex flex-col gap-4 p-5">
        <div role="radiogroup" aria-label="Highlight" className="flex gap-2">
          {(["shared", "local"] as const).map((k) => (
            <button
              key={k}
              type="button"
              role="radio"
              aria-checked={shown === k}
              onClick={() => setShown(k)}
              className={cn(
                "rounded-full border px-3 py-1 font-mono text-xs transition-colors",
                shown === k ? "border-ink bg-ink text-paper" : "border-line text-ink-2 hover:border-ink-3",
              )}
            >
              {k === "shared" ? "sent to server" : "stays on client"}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-[minmax(0,1fr)] gap-3 sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] sm:items-center">
          <div className={cn("rounded-lg border p-4 transition-colors duration-300", shown === "shared" ? "border-accent bg-accent-soft" : "border-line bg-paper")}>
            <p className="font-mono text-[11px] tracking-wider text-ink-3 uppercase">Server · FedProx μ 0.1</p>
            <p className="mt-2 text-sm font-medium">Global deep feature extractors</p>
            <ul className="mt-2 space-y-1 font-mono text-xs text-ink-2">
              <li>LSTM · 1,298,753 params</li>
              <li>MLP · 648,449 params</li>
              <li>→ 96-dim embedding</li>
            </ul>
          </div>

          <div className="flex items-center justify-center gap-2 font-mono text-[11px] text-ink-3 sm:flex-col" aria-hidden="true">
            <span className={cn("transition-colors", shown === "shared" && "font-semibold text-accent-ink")}>weights ⇅</span>
            <span className={cn("transition-colors", shown === "local" && "font-semibold text-ink")}>✕ no data</span>
          </div>

          <div className="grid grid-cols-1 gap-2">
            {["moodle", "springxd", "…14 more"].map((c) => (
              <div key={c} className={cn("rounded-lg border p-3 transition-colors duration-300", shown === "local" ? "border-signal bg-signal/10" : "border-line bg-paper")}>
                <p className="font-mono text-[11px] text-ink-3">client · {c}</p>
                <p className="mt-1 text-xs text-ink-2">
                  issue text + labels · StackingRegressor (RF + LinearSVR → Ridge) · y-scaler
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DemoShell>
  );
}

/* ── Simulation log replay ────────────────────────────────── */

const pad = (s: string | number, n: number) => String(s).padStart(n);

const simLines: TermLine[] = [
  { kind: "cmd", text: "python src/simulate_phase4.py --mu 0.1 --fraction_fit 1.0 --num_rounds 10" },
  { kind: "dim", text: "============================================================", delay: 200 },
  { kind: "out", text: " Federated Agile Effort Estimation" },
  { kind: "out", text: " Phase 4 -- Personalized Federated Ensemble" },
  { kind: "out", text: " Architecture: Split-Federation (Global DL + Local ML)" },
  { kind: "dim", text: "============================================================" },
  { kind: "info", text: "  [1/4] Partitioning data by project ...", delay: 400 },
  { kind: "dim", text: "         Done.", delay: 500 },
  { kind: "info", text: "  [2/4] Initializing global deep models ..." },
  { kind: "out", text: "         1,947,202 total parameters", delay: 400 },
  { kind: "out", text: "         MLP: 648,449 params  |  LSTM: 1,298,753 params" },
  { kind: "info", text: "  [3/4] Configuration:" },
  { kind: "out", text: "         FedProx (mu=0.1) + Split-Federation" },
  { kind: "out", text: "         10 rounds, 16 clients/round (fit)" },
  { kind: "info", text: "  [4/4] Starting training loop ..." },
  { kind: "dim", text: `  ${pad("Round", 6)}  ${pad("Fit OK", 6)}  ${pad("Eval OK", 7)}  ${pad("Avg MAE", 10)}  ${pad("Avg RMSE", 10)}` },
  ...flRounds.map<TermLine>((r) => ({
    kind: "out",
    text: `  R${pad(r.round, 4)}  ${pad(16, 6)}  ${pad(16, 7)}  ${pad(r.mae.toFixed(4), 10)}  ${pad(r.rmse.toFixed(4), 10)}`,
    delay: 380,
  })),
  { kind: "ok", text: " Phase 4 — Training Complete!", delay: 300 },
  { kind: "out", text: "  Final Round (R10):" },
  { kind: "out", text: "    MAE  = 3.0985" },
  { kind: "out", text: "    RMSE = 5.4851" },
];

export function FlTerminalDemo() {
  return (
    <DemoShell kind="replay" note="Output format copied from simulate_phase4.py; per-round numbers from the adopted run. Timing is compressed." dark>
      <Terminal title="colab · T4" lines={simLines} heightClass="h-96" />
    </DemoShell>
  );
}

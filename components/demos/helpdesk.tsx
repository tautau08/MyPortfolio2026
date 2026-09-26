"use client";

import { useState, type FormEvent } from "react";
import { cn } from "@/lib/cn";
import { CodeWalkthrough } from "./CodeWalkthrough";
import { DemoShell } from "./DemoShell";

/* ── Escalation band editor ───────────────────────────────── */

type BandType = "PRE" | "POST";
interface Band {
  id: number;
  type: BandType;
  from: number;
  to: number;
  email: string;
}

const SEED: Band[] = [
  { id: 1, type: "PRE", from: 0, to: 49, email: "l1@support.example" },
  { id: 2, type: "PRE", from: 50, to: 79, email: "lead@support.example" },
  { id: 3, type: "POST", from: 0, to: 30, email: "manager@support.example" },
];

/** Same order and messages as EscalationMatrixService.create. */
function validate(bands: Band[], type: BandType, from: number, to: number): string | null {
  if (from >= to) return "From value must be less than To value";
  // findOverlappingRanges: em.from <= :to AND em.to >= :from, so touching endpoints overlap.
  const same = bands.filter((b) => b.type === type);
  if (same.some((b) => b.from <= to && b.to >= from)) return "Overlapping range exists for the same subcategory and type";
  const total = same.reduce((s, b) => s + (b.to - b.from), 0) + (to - from);
  if (total > 100) return "Total range for subcategory and type cannot exceed 100%";
  return null;
}

export function HelpdeskEscalationDemo() {
  const [bands, setBands] = useState<Band[]>(SEED);
  const [type, setType] = useState<BandType>("PRE");
  const [from, setFrom] = useState(79);
  const [to, setTo] = useState(100);
  const [result, setResult] = useState<{ ok: boolean; text: string } | null>(null);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const err = validate(bands, type, from, to);
    if (err) {
      setResult({ ok: false, text: `400  ${err}` });
      return;
    }
    const id = Math.max(...bands.map((b) => b.id), 0) + 1;
    setBands((b) => [...b, { id, type, from, to, email: "director@support.example" }]);
    setResult({ ok: true, text: `201  Created escalation band #${id} (${type} ${from}–${to}%)` });
  };

  return (
    <DemoShell kind="interactive" note="Validation logic and error messages copied from EscalationMatrixService and its repository query.">
      <div className="flex flex-col gap-5 p-5">
        <p className="font-mono text-[11px] tracking-wider text-ink-3 uppercase">Subcategory · Network / VPN</p>

        {(["PRE", "POST"] as const).map((t) => (
          <div key={t}>
            <div className="mb-1.5 flex items-baseline justify-between">
              <span className="font-mono text-xs text-ink-2">{t === "PRE" ? "PRE: before the deadline" : "POST: after the deadline"}</span>
              <span className="font-mono text-[11px] text-ink-3">% of SLA</span>
            </div>
            <div className="relative h-9 rounded-md border border-line bg-paper">
              {bands
                .filter((b) => b.type === t)
                .map((b) => (
                  <div
                    key={b.id}
                    title={`${b.from}–${b.to}% → ${b.email}`}
                    className={cn(
                      "animate-rise absolute inset-y-1 flex items-center overflow-hidden rounded-sm px-1.5 font-mono text-[10px] whitespace-nowrap",
                      t === "PRE" ? "bg-accent-soft text-accent-ink" : "bg-danger/15 text-danger",
                    )}
                    style={{ left: `${b.from}%`, width: `${b.to - b.from}%` }}
                  >
                    {b.from}–{b.to}
                  </div>
                ))}
            </div>
          </div>
        ))}

        <form onSubmit={submit} className="flex flex-wrap items-end gap-3">
          <label className="flex flex-col gap-1 font-mono text-[11px] text-ink-3">
            type
            <select value={type} onChange={(e) => setType(e.target.value as BandType)} className="rounded-md border border-line bg-paper px-2 py-1.5 text-sm text-ink">
              <option>PRE</option>
              <option>POST</option>
            </select>
          </label>
          <label className="flex flex-col gap-1 font-mono text-[11px] text-ink-3">
            from
            <input type="number" min={0} max={100} value={from} onChange={(e) => setFrom(Number(e.target.value))} className="w-20 rounded-md border border-line bg-paper px-2 py-1.5 text-sm text-ink tabular" />
          </label>
          <label className="flex flex-col gap-1 font-mono text-[11px] text-ink-3">
            to
            <input type="number" min={0} max={200} value={to} onChange={(e) => setTo(Number(e.target.value))} className="w-20 rounded-md border border-line bg-paper px-2 py-1.5 text-sm text-ink tabular" />
          </label>
          <button type="submit" className="rounded-md bg-ink px-3.5 py-1.5 text-sm font-medium text-paper transition-transform duration-150 hover:-translate-y-px">
            POST band
          </button>
          <button
            type="button"
            onClick={() => {
              setBands(SEED);
              setResult(null);
            }}
            className="ml-auto font-mono text-xs text-ink-3 hover:text-ink"
          >
            reset
          </button>
        </form>

        <p aria-live="polite" className={cn("min-h-[1.25rem] font-mono text-xs", result ? (result.ok ? "text-signal" : "text-danger") : "text-ink-3")}>
          {result?.text ?? "Try 79–100. The existing band ends at 79, so it overlaps. Then try 80–100."}
        </p>
      </div>
    </DemoShell>
  );
}

/* ── Role-gated API ───────────────────────────────────────── */

type Role = "SYSTEM" | "ADMIN" | "USER" | "VIEWER";
const ROLES: Role[] = ["SYSTEM", "ADMIN", "USER", "VIEWER"];

const REQUESTS = [
  { method: "GET", path: "/api/tickets" },
  { method: "POST", path: "/api/tickets" },
  { method: "GET", path: "/api/categories" },
  { method: "POST", path: "/api/escalation-matrices" },
  { method: "GET", path: "/api/users" },
];

/** Mirrors SecurityConfig.securityFilterChain. */
function allowed(role: Role, path: string): boolean {
  if (path.startsWith("/api/tickets")) return ["ADMIN", "SYSTEM", "USER"].includes(role);
  return ["ADMIN", "SYSTEM"].includes(role);
}

export function HelpdeskJwtDemo() {
  const [role, setRole] = useState<Role>("USER");

  return (
    <DemoShell kind="interactive" note="Rules from SecurityConfig. JwtAuthenticationFilter maps each role claim to a ROLE_ authority.">
      <div className="flex flex-col gap-4 p-5">
        <div role="radiogroup" aria-label="Log in as" className="flex flex-wrap gap-2">
          {ROLES.map((r) => (
            <button
              key={r}
              type="button"
              role="radio"
              aria-checked={role === r}
              onClick={() => setRole(r)}
              className={cn(
                "rounded-full border px-3 py-1 font-mono text-xs transition-colors",
                role === r ? "border-ink bg-ink text-paper" : "border-line text-ink-2 hover:border-ink-3",
              )}
            >
              {r.toLowerCase()}
            </button>
          ))}
        </div>
        <p className="truncate font-mono text-[11px] text-ink-3">
          Authorization: Bearer eyJhbGciOiJIUzI1NiJ9.{"{"}&quot;sub&quot;:&quot;{role.toLowerCase()}&quot;,&quot;roles&quot;:[&quot;{role}&quot;]{"}"}…
        </p>
        <ul className="divide-y divide-line rounded-lg border border-line bg-paper" aria-live="polite">
          {REQUESTS.map((r) => {
            const ok = allowed(role, r.path);
            return (
              <li key={r.method + r.path} className="flex items-center justify-between gap-3 px-3 py-2.5 font-mono text-xs">
                <span className="min-w-0 truncate">
                  <span className="inline-block w-11 text-ink-3">{r.method}</span>
                  {r.path}
                </span>
                <span className={cn("shrink-0 rounded px-1.5 py-0.5", ok ? "bg-signal/15 text-signal-ink" : "bg-danger/10 text-danger")}>
                  {ok ? "200 OK" : "403 Forbidden"}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </DemoShell>
  );
}

/* ── Two status columns ───────────────────────────────────── */

const ticketCode = `@Entity
public class Ticket extends BaseAuditable {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "submitted_status_id", nullable = false, updatable = false)
    private Status submittedStatus;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "current_status_id", nullable = false)
    private Status currentStatus;
}

// TicketService.create
ticket.setSubmittedStatus(status);
ticket.setCurrentStatus(status);

// TicketService.update: only currentStatus changes
if (dto.getStatusId() != null) {
    ticket.setCurrentStatus(status);
}`;

export function HelpdeskStatusDemo() {
  return (
    <DemoShell kind="source" note="domain/Ticket.java and service/TicketService.java, trimmed to the relevant lines." dark>
      <CodeWalkthrough
        file="domain/Ticket.java · service/TicketService.java"
        lang="java"
        code={ticketCode}
        steps={[
          { lines: [2, 2], note: "Ticket extends BaseAuditable, so it gets created/updated user and timestamp columns filled by @PrePersist and @PreUpdate hooks." },
          { lines: [4, 6], note: "updatable = false makes Hibernate leave this column out of every UPDATE. Even a buggy service can't rewrite the original status." },
          { lines: [8, 10], note: "currentStatus is the one the workflow moves through." },
          { lines: [13, 15], note: "On creation both columns point at the same status." },
          { lines: [17, 20], note: "Updates only touch currentStatus, so reports can compare how tickets were submitted with where they ended up." },
        ]}
      />
    </DemoShell>
  );
}

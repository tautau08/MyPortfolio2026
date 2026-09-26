"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { CodeWalkthrough } from "./CodeWalkthrough";
import { DemoShell } from "./DemoShell";
import { Terminal, type TermLine } from "./Terminal";

/* ── Clarify → generate flow ──────────────────────────────── */

interface Question {
  id: string;
  question: string;
  options: string[];
}

interface Scenario {
  label: string;
  text: string;
  response: { needsClarification: boolean; questions?: Question[] };
  output: string;
}

const SCENARIOS: Scenario[] = [
  {
    label: "Vague",
    text: "write a blog post",
    response: {
      needsClarification: true,
      questions: [
        { id: "q1", question: "What is the blog post about?", options: ["A product launch", "A technical deep-dive", "A personal story"] },
        { id: "q2", question: "Who is the reader?", options: ["Developers", "Customers", "General audience"] },
        { id: "q3", question: "How long should it be?", options: ["~500 words", "~1,200 words"] },
      ],
    },
    output:
      "## Role\nYou are a senior developer advocate who writes clear technical posts.\n\n## Context\nThe reader is a developer. The post is a technical deep-dive of roughly 1,200 words.\n\n## Task\nWrite a blog post that explains one technical decision, the alternatives considered, and the result.\n\n## Output format\nTitle, a two-sentence intro, three H2 sections, and a short conclusion.\n\n## Constraints\nDo NOT use marketing language. Avoid unexplained acronyms.",
  },
  {
    label: "Clear",
    text: "Write a 300-word email to existing B2B customers announcing SSO support. Friendly but professional, one FAQ line, link placeholder.",
    response: { needsClarification: false },
    output:
      "## Role\nYou are a customer-communications writer for a B2B SaaS company.\n\n## Context\nExisting customers are hearing about SSO support for the first time.\n\n## Task\nWrite a 300-word announcement email in a friendly, professional tone.\n\n## Output format\nSubject line, greeting, three short paragraphs, one FAQ line, and a [LINK] placeholder.\n\n## Constraints\nDo NOT promise dates. Avoid jargon beyond \"SSO\".",
  },
];

type Stage = "idle" | "analyzing" | "clarify" | "streaming" | "done";

export function InstructFlowClarifyDemo() {
  const reduced = useReducedMotion();
  const [pick, setPick] = useState(0);
  const [stage, setStage] = useState<Stage>("idle");
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [chars, setChars] = useState(0);
  const s = SCENARIOS[pick];

  const start = (i: number) => {
    setPick(i);
    setAnswers({});
    setChars(0);
    setStage("analyzing");
  };

  useEffect(() => {
    if (stage !== "analyzing") return;
    const t = setTimeout(() => setStage(SCENARIOS[pick].response.needsClarification ? "clarify" : "streaming"), reduced ? 0 : 700);
    return () => clearTimeout(t);
  }, [stage, pick, reduced]);

  useEffect(() => {
    if (stage !== "streaming") return;
    if (reduced || chars >= s.output.length) {
      setChars(s.output.length);
      setStage("done");
      return;
    }
    const t = setTimeout(() => setChars((c) => c + 6), 16);
    return () => clearTimeout(t);
  }, [stage, chars, s.output.length, reduced]);

  return (
    <DemoShell kind="interactive" note="Simulated in the browser with no model call. Response shapes match /api/clarify's Zod schema; the output is sample text.">
      <div className="flex flex-col gap-4 p-5">
        <div className="flex flex-wrap gap-2">
          {SCENARIOS.map((sc, i) => (
            <button
              key={sc.label}
              type="button"
              onClick={() => start(i)}
              disabled={stage === "analyzing" || stage === "streaming"}
              className={cn(
                "rounded-full border px-3 py-1 font-mono text-xs transition-colors disabled:opacity-50",
                pick === i && stage !== "idle" ? "border-ink bg-ink text-paper" : "border-line text-ink-2 hover:border-ink-3",
              )}
            >
              {sc.label} scenario
            </button>
          ))}
        </div>

        <div className="rounded-lg border border-line bg-paper p-3">
          <p className="font-mono text-[11px] text-ink-3">scenario</p>
          <p className="mt-1 text-sm">{stage === "idle" ? "Pick a scenario above." : s.text}</p>
        </div>

        <div aria-live="polite" className="flex min-h-[15rem] flex-col gap-3">
          {stage === "analyzing" && <p className="font-mono text-xs text-ink-3">POST /api/clarify … generateObject</p>}

          {stage !== "idle" && stage !== "analyzing" && (
            <pre tabIndex={0} aria-label="Model response" className="overflow-x-auto rounded-md bg-code-bg px-3 py-2 font-mono text-[11px] leading-relaxed text-code-ink">
              {JSON.stringify(
                s.response.needsClarification
                  ? { needsClarification: true, questions: `[${s.response.questions?.length} items]` }
                  : s.response,
              )}
            </pre>
          )}

          {stage === "clarify" && (
            <div className="flex flex-col gap-3 rounded-lg border border-line bg-paper p-4">
              {s.response.questions?.map((q) => (
                <fieldset key={q.id}>
                  <legend className="text-sm font-medium">{q.question}</legend>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {q.options.map((o) => (
                      <button
                        key={o}
                        type="button"
                        aria-pressed={answers[q.id] === o}
                        onClick={() => setAnswers((a) => ({ ...a, [q.id]: o }))}
                        className={cn(
                          "rounded-full border px-2.5 py-1 text-xs transition-colors",
                          answers[q.id] === o ? "border-ink bg-ink text-paper" : "border-line text-ink-2 hover:border-ink-3",
                        )}
                      >
                        {o}
                      </button>
                    ))}
                  </div>
                </fieldset>
              ))}
              <div className="flex gap-3 pt-1">
                <button type="button" onClick={() => setStage("streaming")} className="rounded-md bg-ink px-3.5 py-1.5 text-sm font-medium text-paper">
                  Generate
                </button>
                <button type="button" onClick={() => setStage("streaming")} className="text-sm text-ink-3 underline-offset-2 hover:text-ink hover:underline">
                  Skip
                </button>
              </div>
            </div>
          )}

          {(stage === "streaming" || stage === "done") && (
            <div className="rounded-lg border border-line bg-paper p-4">
              <p className="mb-2 font-mono text-[11px] text-ink-3">POST /api/chat · streamText</p>
              <p className="font-mono text-xs leading-relaxed whitespace-pre-wrap text-ink-2">
                {s.output.slice(0, chars)}
                {stage === "streaming" && <span className="caret ml-px inline-block h-3 w-1.5 bg-accent align-middle" />}
              </p>
            </div>
          )}
        </div>
      </div>
    </DemoShell>
  );
}

/* ── Typed model output ───────────────────────────────────── */

const clarifyCode = `import { generateObject } from 'ai';
import { google } from '@ai-sdk/google';
import { z } from 'zod';

export async function POST(req) {
  const { scenario } = await req.json();
  if (!scenario) {
    return Response.json({ error: 'Scenario is required' }, { status: 400 });
  }

  const result = await generateObject({
    model: google('gemini-3.5-flash'),
    schema: z.object({
      needsClarification: z.boolean(),
      questions: z.array(z.object({
        id: z.string(),
        question: z.string(),
        options: z.array(z.string()).optional(),
      })).optional(),
    }),
    prompt: \`...5 criteria: target, audience, tone, scope, context
      If 4+ criteria are clear → needsClarification: false
      Never ask more than 4 questions total...\`,
  });

  return Response.json(result.object);
}`;

export function InstructFlowSchemaDemo() {
  return (
    <DemoShell kind="source" note="app/api/clarify/route.js with the prompt text shortened." dark>
      <CodeWalkthrough
        file="app/api/clarify/route.js"
        lang="js"
        code={clarifyCode}
        steps={[
          { lines: [7, 9], note: "Empty input is rejected before any tokens are spent." },
          { lines: [11, 13], note: "generateObject, not generateText: the SDK asks the model for JSON and validates it before returning." },
          { lines: [13, 20], note: "The schema is the contract with the UI. The dialog renders questions and options directly from these fields." },
          { lines: [21, 24], note: "The rubric lives in the prompt: five criteria, a threshold, and a cap of four questions so the dialog never becomes a form." },
          { lines: [27, 27], note: "result.object is already typed and validated, so the route returns it as is." },
        ]}
      />
    </DemoShell>
  );
}

/* ── E2E run ──────────────────────────────────────────────── */

const e2eLines: TermLine[] = [
  { kind: "cmd", text: "npx playwright test" },
  { kind: "out", text: "Running 5 tests", delay: 500 },
  { kind: "dim", text: "  route /api/clarify → { needsClarification: false }   (beforeEach)", delay: 300 },
  { kind: "ok", text: "  ✓  auth.spec.js › Authentication Flow › homepage loads and shows sign in button for unauthenticated users", delay: 700 },
  { kind: "ok", text: "  ✓  auth.spec.js › Authentication Flow › sign in button redirects to auth provider", delay: 400 },
  { kind: "ok", text: "  ✓  prompt-generation.spec.js › Prompt Generation Flow › direct generation - clear scenario skips clarification", delay: 900 },
  { kind: "dim", text: "  route /api/clarify → { needsClarification: true, questions: [q1, q2] }", delay: 300 },
  { kind: "ok", text: "  ✓  prompt-generation.spec.js › Prompt Generation Flow › full generation flow - scenario with clarifying questions", delay: 1100 },
  { kind: "ok", text: "  ✓  prompt-generation.spec.js › Prompt Generation Flow › copy button copies generated prompt", delay: 700 },
  { kind: "ok", text: "  5 passed", delay: 300 },
];

export function InstructFlowE2EDemo() {
  return (
    <DemoShell kind="replay" note="Test names and mocks from tests/*.spec.js. Reporter output is condensed and timings are omitted." dark>
      <Terminal title="instructflow · playwright" lines={e2eLines} heightClass="h-72" />
    </DemoShell>
  );
}

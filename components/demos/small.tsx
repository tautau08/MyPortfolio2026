"use client";

import { useState, type FormEvent } from "react";
import { cn } from "@/lib/cn";
import { CodeWalkthrough } from "./CodeWalkthrough";
import { DemoShell } from "./DemoShell";

/* ── Nike: composition ────────────────────────────────────── */

const appCode = `const App = () => (
  <main className="relative">
    <Nav />
    <section className="xl:padding-l wide:padding-r padding-b">
      <Hero />
    </section>
    <section className="padding">
      <PopularProducts />
    </section>
    <section className="padding">
      <SuperQuality />
    </section>
    <section className="padding-x py-10">
      <Services />
    </section>
    <section className="padding">
      <SpecialOffer />
    </section>
    <section className="bg-pale-blue padding">
      <CustomerReviews />
    </section>
    <section className="padding-x sm:py-32 py-16 w-full">
      <Subscribe />
    </section>
    <section className="bg-black padding-x padding-t pb-8">
      <Footer />
    </section>
  </main>
);`;

export function NikeSectionsDemo() {
  return (
    <DemoShell kind="source" note="src/App.jsx, reformatted. Spacing utilities are defined in src/index.css." dark>
      <CodeWalkthrough
        file="nike/src/App.jsx"
        lang="js"
        code={appCode}
        steps={[
          { lines: [1, 3], note: "The page is a flat list of sections. Nothing is nested more than one level." },
          { lines: [4, 6], note: "The hero only gets side padding from xl up, and right padding past the custom 1440px `wide` breakpoint, so the shoe image can run to the edge." },
          { lines: [7, 18], note: "Most sections reuse one `padding` utility, so the vertical rhythm changes from a single line in index.css." },
          { lines: [22, 27], note: "Sections that need a different rhythm override one axis (sm:py-32) and keep the shared horizontal padding." },
        ]}
      />
    </DemoShell>
  );
}

/* ── DeliveryAnbi: voice commands ─────────────────────────── */

interface Form {
  item: string;
  quantity: string;
  price: string;
}

/** Same branches as PlaceOrderActivity.processVoiceCommand. */
function processVoiceCommand(spoken: string, form: Form): { form: Form; toast?: string } {
  if (spoken.startsWith("item")) return { form: { ...form, item: spoken.slice(4).trim() } };
  if (spoken.startsWith("quantity")) return { form: { ...form, quantity: spoken.slice(8).trim() } };
  if (spoken.startsWith("price")) return { form: { ...form, price: spoken.slice(5).trim() } };
  return { form, toast: "Command not recognized" };
}

const SUGGESTIONS = ["item chicken biryani", "quantity 2", "price 180", "two biryanis please"];

export function DeliveryAnbiVoiceDemo() {
  const [form, setForm] = useState<Form>({ item: "", quantity: "", price: "" });
  const [heard, setHeard] = useState("");
  const [toast, setToast] = useState<string | null>(null);
  const [last, setLast] = useState<keyof Form | null>(null);

  const run = (text: string) => {
    const spoken = text.trim();
    if (!spoken) return;
    const res = processVoiceCommand(spoken, form);
    setToast(res.toast ?? null);
    setLast((Object.keys(form) as (keyof Form)[]).find((k) => res.form[k] !== form[k]) ?? null);
    setForm(res.form);
    setHeard("");
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    run(heard);
  };

  return (
    <DemoShell kind="interactive" note="Parsing rules ported from PlaceOrderActivity.kt. Type what the speech recognizer returned.">
      <div className="grid grid-cols-[minmax(0,1fr)] gap-5 p-5 sm:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)]">
        <div className="flex flex-col gap-3">
          <form onSubmit={submit} className="flex gap-2">
            <label htmlFor="da-heard" className="sr-only">
              Recognized speech
            </label>
            <input
              id="da-heard"
              value={heard}
              onChange={(e) => setHeard(e.target.value)}
              placeholder="item pizza"
              spellCheck={false}
              className="min-w-0 flex-1 rounded-md border border-line bg-paper px-2.5 py-1.5 font-mono text-sm"
            />
            <button type="submit" className="rounded-md bg-ink px-3 py-1.5 text-sm font-medium text-paper">
              Speak
            </button>
          </form>
          <div className="flex flex-wrap gap-1.5">
            {SUGGESTIONS.map((s) => (
              <button key={s} type="button" onClick={() => run(s)} className="rounded-full border border-line px-2.5 py-1 font-mono text-[11px] text-ink-2 hover:border-ink-3">
                “{s}”
              </button>
            ))}
          </div>
          <p aria-live="polite" className={cn("min-h-[1.25rem] font-mono text-xs", toast ? "text-danger" : "text-ink-3")}>
            {toast ? `Toast: ${toast}` : "One field per utterance."}
          </p>
        </div>

        <div className="flex flex-col gap-2 rounded-lg border border-line bg-paper p-4">
          <p className="font-mono text-[11px] text-ink-3">PlaceOrderActivity</p>
          {(["item", "quantity", "price"] as const).map((k) => (
            <div key={k} className={cn("rounded-md border px-3 py-2 transition-colors duration-300", last === k ? "border-accent bg-accent-soft" : "border-line")}>
              <p className="font-mono text-[10px] text-ink-3">{k === "item" ? "foodNameEditText" : `${k}EditText`}</p>
              <p className="min-h-[1.25rem] text-sm">{form[k] || <span className="text-ink-3">—</span>}</p>
            </div>
          ))}
        </div>
      </div>
    </DemoShell>
  );
}

/* ── DeliveryAnbi: recommendation ─────────────────────────── */

const MENU = ["Chicken Biryani", "Beef Tehari", "Fuchka", "Kacchi"];

export function DeliveryAnbiRecommendDemo() {
  const [orders, setOrders] = useState<{ food: string; time: number }[]>([
    { food: "Beef Tehari", time: 1 },
    { food: "Chicken Biryani", time: 2 },
  ]);

  // OrderHistoryAnalyzer.getMostFrequentFood: count, then maxByOrNull (first max wins on ties).
  const counts = new Map<string, number>();
  orders.forEach((o) => counts.set(o.food, (counts.get(o.food) ?? 0) + 1));
  let most: string | null = null;
  let best = 0;
  counts.forEach((v, k) => {
    if (v > best) {
      best = v;
      most = k;
    }
  });
  const lastOrdered = orders.reduce<{ food: string; time: number } | null>((a, o) => (!a || o.time > a.time ? o : a), null)?.food ?? null;
  const recommended = most ?? lastOrdered;

  return (
    <DemoShell kind="interactive" note="Selection logic ported from OrderHistoryAnalyzer.kt and DashboardActivity.kt.">
      <div className="grid grid-cols-[minmax(0,1fr)] gap-5 p-5 sm:grid-cols-2">
        <div>
          <p className="font-mono text-[11px] text-ink-3">add an order</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {MENU.map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setOrders((o) => [...o, { food: f, time: (o.at(-1)?.time ?? 0) + 1 }])}
                className="rounded-full border border-line px-2.5 py-1 text-xs text-ink-2 transition-colors hover:border-ink-3 hover:text-ink"
              >
                + {f}
              </button>
            ))}
          </div>
          <ol className="mt-4 space-y-1 font-mono text-[11px] text-ink-2">
            {orders.map((o, i) => (
              <li key={i}>
                t{o.time} · {o.food}
              </li>
            ))}
          </ol>
          <button type="button" onClick={() => setOrders([])} className="mt-3 font-mono text-xs text-ink-3 hover:text-ink">
            clear history
          </button>
        </div>
        <div className="flex flex-col justify-center rounded-lg border border-line bg-paper p-4" aria-live="polite">
          <p className="font-mono text-[11px] text-ink-3">dialog_food_recommendation</p>
          {recommended ? (
            <>
              <p className="mt-2 text-lg font-semibold">Order {recommended} again?</p>
              <p className="mt-1 font-mono text-[11px] text-ink-3">
                {counts.get(recommended)! > 1 ? `most frequent (${counts.get(recommended)}×)` : "no repeats yet: maxByOrNull picks the first item seen"}
              </p>
            </>
          ) : (
            <p className="mt-2 text-sm text-ink-3">No history, so no dialog.</p>
          )}
        </div>
      </div>
    </DemoShell>
  );
}

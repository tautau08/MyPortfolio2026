import type { Demo } from "@/data/projects";
import { demos as registry } from "@/components/demos";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function DemoList({ demos }: { demos: Demo[] }) {
  if (!demos.length) return null;
  return (
    <section id="demos" aria-labelledby="demos-title" className="flex scroll-mt-8 flex-col gap-7">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <SectionHeading id="demos-title" eyebrow="Live demos" title="Try it" accent="yourself." />
        <p className="max-w-[420px] text-base leading-relaxed text-ink-3">These run in your browser with the same rules as the real code. Filled buttons are clickable.</p>
      </div>
      {demos.map((demo, i) => {
        const Component = registry[demo.id];
        return (
          <article key={demo.id} aria-labelledby={`demo-${demo.id}`} className="grid grid-cols-[minmax(0,1fr)] overflow-hidden rounded-[32px] border-[1.5px] border-ink lg:grid-cols-[360px_minmax(0,1fr)]">
            <div className="flex flex-col gap-4 bg-paper-2 p-7 sm:p-9">
              <span className="font-mono text-sm text-accent">{String(i + 1).padStart(2, "0")}</span>
              <h3 id={`demo-${demo.id}`} className="text-[28px] font-extrabold tracking-[-0.03em]">
                {demo.title}
              </h3>
              <p className="text-base leading-relaxed text-ink-2">{demo.body}</p>
            </div>
            <div className="min-w-0 p-4 sm:p-6">
              <Component />
            </div>
          </article>
        );
      })}
    </section>
  );
}

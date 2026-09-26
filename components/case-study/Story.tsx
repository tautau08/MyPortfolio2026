import type { Project } from "@/data/projects";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function Story({ project }: { project: Project }) {
  const parts = [
    { title: "The problem", body: project.problem },
    { title: "The decision", body: project.decision },
    { title: "The trade-off", body: project.tradeoff },
  ];

  return (
    <section aria-labelledby="story-title" className="flex flex-col gap-8">
      <SectionHeading id="story-title" eyebrow="Engineering" title="Problem, decision," accent="trade-off." />
      <div className="grid gap-4 md:grid-cols-3">
        {parts.map((p, i) => (
          <article key={p.title} className="flex flex-col gap-4 rounded-[28px] bg-paper-2 p-8">
            <span className="grid size-11 place-items-center rounded-xl bg-paper font-mono text-[15px] text-accent">{String(i + 1).padStart(2, "0")}</span>
            <h3 className="text-[26px] font-extrabold tracking-[-0.02em]">{p.title}</h3>
            <p className="text-[17px] leading-relaxed text-ink-2">{p.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

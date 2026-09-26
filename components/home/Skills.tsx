import { skills } from "@/data/profile";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function Skills() {
  return (
    <Container as="section" id="about" aria-labelledby="skills-title" className="grid scroll-mt-8 gap-10 pt-28 lg:grid-cols-[420px_minmax(0,1fr)] lg:gap-20 lg:pt-35">
      <SectionHeading id="skills-title" eyebrow="Skills" title="Core" accent="technologies." />
      <div className="grid gap-4 sm:grid-cols-2">
        {skills.map((group, i) => (
          <article key={group.title} className="flex flex-col gap-3.5 rounded-3xl border border-line bg-paper-2 p-6.5">
            <div className="flex items-center justify-between">
              <h3 className="text-[22px] font-extrabold tracking-[-0.02em]">{group.title}</h3>
              <span className="font-mono text-[13px] text-ink-3">{String(i + 1).padStart(2, "0")}</span>
            </div>
            <ul className="flex flex-wrap gap-1.5">
              {group.items.map((item) => (
                <li key={item} className="rounded-full bg-paper px-3 py-1.75 text-sm font-medium">
                  {item}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </Container>
  );
}

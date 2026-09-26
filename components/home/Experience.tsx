import { achievements, education, experience } from "@/data/profile";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function Experience() {
  return (
    <Container as="section" id="experience" aria-labelledby="experience-title" className="grid scroll-mt-8 gap-10 pt-28 lg:grid-cols-[420px_minmax(0,1fr)] lg:gap-20 lg:pt-30">
      <SectionHeading id="experience-title" eyebrow="Experience" title="Engineering systems that" accent="run in production." />

      <div className="flex flex-col gap-4">
        <article className="flex flex-col gap-5 rounded-[28px] border border-line bg-paper-2 p-6 sm:p-9">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-accent-fill text-[22px] font-extrabold text-white">{experience.initial}</span>
              <div>
                <h3 className="text-[26px] font-extrabold tracking-[-0.02em]">{experience.company}</h3>
                <p className="mt-0.5 text-base text-ink-3">{experience.titles}</p>
              </div>
            </div>
            <span className="rounded-full border border-line px-3.5 py-2 font-mono text-[13px]">{experience.period}</span>
          </div>

          <ul className="grid gap-3 sm:grid-cols-3">
            {experience.highlights.map((h) => (
              <li key={h.label} className="rounded-[18px] bg-paper px-5 py-4.5">
                <span className="block text-[32px] font-extrabold tracking-[-0.04em] text-accent">{h.value}</span>
                <span className="mt-1 block text-sm text-ink-3">{h.label}</span>
              </li>
            ))}
          </ul>

          <ul className="flex flex-col gap-3 text-[17px] leading-relaxed text-ink-2">
            {experience.points.map((p) => (
              <li key={p} className="flex gap-3">
                <span aria-hidden="true" className="mt-2.5 size-1.5 shrink-0 rounded-full bg-accent" />
                {p}
              </li>
            ))}
          </ul>

          <ul aria-label="Stack" className="flex flex-wrap gap-1.5">
            {experience.stack.map((t) => (
              <li key={t} className="rounded-full bg-paper px-3 py-1.5 text-[13px] font-medium">
                {t}
              </li>
            ))}
          </ul>
        </article>

        <div className="grid gap-4 sm:grid-cols-2">
          <article className="flex flex-col gap-2 rounded-3xl border border-line bg-paper-2 p-7">
            <span className="font-mono text-[13px] text-ink-3 uppercase">Education · {education.period}</span>
            <h3 className="text-[22px] font-extrabold tracking-[-0.02em]">{education.degree}</h3>
            <p className="text-base text-ink-3">{education.school}</p>
          </article>
          <article className="flex flex-col gap-2 rounded-3xl border border-line bg-paper-2 p-7">
            <span className="font-mono text-[13px] text-ink-3 uppercase">Achievements</span>
            <p className="text-[17px] leading-relaxed">{achievements}</p>
          </article>
        </div>
      </div>
    </Container>
  );
}

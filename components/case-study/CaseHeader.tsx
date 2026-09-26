import type { Project } from "@/data/projects";
import { ButtonLink } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";

export function CaseHeader({ project }: { project: Project }) {
  const [primaryCode, ...otherCode] = project.code;

  return (
    <header className="flex flex-col gap-9 pt-6">
      <ButtonLink href="/#work" variant="outline" icon="arrowLeft" className="self-start">
        All projects
      </ButtonLink>

      <div className="animate-rise flex flex-col gap-5">
        <div className="flex flex-wrap gap-2">
          <Chip tone="solid">{project.index} / Case study</Chip>
          {project.categories.map((c) => (
            <Chip key={c}>{c}</Chip>
          ))}
          {project.status && <Chip tone="live">● {project.status}</Chip>}
        </div>
        {/* Full width and sized from the viewport, so one-word titles like INSTRUCTFLOW fit a 320px phone. */}
        <h1 className="text-[clamp(2rem,0.25rem+9vw,9.375rem)] leading-[0.86] font-extrabold tracking-[-0.055em] uppercase">
          {project.title}
          <span className="text-accent">.</span>
        </h1>
      </div>

      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_400px] lg:items-end lg:gap-16">
        <div className="flex flex-col gap-5">
          <p className="max-w-[780px] text-[clamp(1.25rem,1rem+0.8vw,1.875rem)] leading-tight tracking-[-0.02em]">{project.tagline}</p>
          <p className="max-w-[780px] text-lg leading-relaxed text-ink-3">{project.summary}</p>
        </div>

        <div className="flex flex-col gap-3">
          <ButtonLink href={primaryCode.href} size="lg" badgeIcon="arrowUpRight" className="justify-between">
            {primaryCode.label === "Code" ? "View code on GitHub" : `${primaryCode.label} on GitHub`}
          </ButtonLink>
          {otherCode.map((c) => (
            <ButtonLink key={c.href} href={c.href} size="lg" variant="outline" external className="justify-between">
              {c.label} on GitHub
            </ButtonLink>
          ))}
          {project.live && (
            <ButtonLink href={project.live} size="lg" variant="outline" external className="justify-between">
              Open live site
            </ButtonLink>
          )}
          {project.demos.length > 0 && (
            <ButtonLink href="#demos" size="lg" variant="outline" className="justify-between">
              Jump to live demos ↓
            </ButtonLink>
          )}
        </div>
      </div>

      <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-[1fr_auto_2fr]">
        <MetaItem term="Role">{project.role}</MetaItem>
        <MetaItem term="Year">{project.year}</MetaItem>
        <MetaItem term="Stack">
          <ul className="flex flex-wrap gap-1.5">
            {project.stack.map((s) => (
              <li key={s} className="rounded-full bg-paper px-2.5 py-1 text-[13px] font-medium">
                {s}
              </li>
            ))}
          </ul>
        </MetaItem>
      </dl>
    </header>
  );
}

function MetaItem({ term, children }: { term: string; children: React.ReactNode }) {
  return (
    <div className="rounded-[20px] bg-paper-2 px-6 py-5">
      <dt className="font-mono text-xs text-ink-3 uppercase">{term}</dt>
      <dd className="mt-2 text-lg font-semibold">{children}</dd>
    </div>
  );
}

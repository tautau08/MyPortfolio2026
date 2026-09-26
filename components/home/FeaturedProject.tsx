import type { Project } from "@/data/projects";
import { ButtonLink } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { PlayIcon } from "@/components/ui/Icon";
import { tintStyle } from "@/lib/tint";
import { FlResults } from "@/components/fl-results/FlResults";
import { ProjectPreview } from "./ProjectPreview";

export function FeaturedProject({ project }: { project: Project }) {
  const secondaryHref = project.live ?? project.code[0].href;

  return (
    <article className="lift-lg grid grid-cols-[minmax(0,1fr)] overflow-hidden rounded-[36px] border border-line bg-paper-2 lg:grid-cols-[440px_minmax(0,1fr)]">
      <div className="flex flex-col gap-4.5 p-6 sm:p-10 lg:py-11">
        <div className="flex flex-wrap gap-2">
          <Chip tone="solid">{project.index}</Chip>
          {project.tags.map((t) => (
            <Chip key={t}>{t}</Chip>
          ))}
          {project.status && <Chip tone="live">● {project.status}</Chip>}
        </div>
        <h3 className="text-[clamp(2rem,1.6rem+1.4vw,2.75rem)] leading-none font-extrabold tracking-[-0.04em]">{project.title}</h3>
        <p className="text-[17px] leading-relaxed text-ink-3">{project.tagline}</p>
        <ul className="flex flex-wrap gap-3">
          {project.highlights.map((m) => (
            <li key={m.label} className="min-w-[8.5rem] flex-1 rounded-[18px] bg-paper px-4.5 py-4">
              <span className="block text-[30px] font-extrabold tracking-[-0.04em] text-accent">{m.value}</span>
              <span className="mt-1 block text-[13px] leading-snug text-ink-3">{m.label}</span>
            </li>
          ))}
        </ul>
        {project.demos.length > 0 && (
          <p className="flex items-center gap-1.5 text-sm font-semibold text-accent-ink">
            <PlayIcon /> {project.demos.length} live demos inside
          </p>
        )}
        <div className="mt-auto flex flex-wrap gap-2.5 pt-2">
          <ButtonLink href={`/work/${project.slug}`} badgeIcon="arrowRight">
            View case study
          </ButtonLink>
          <ButtonLink href={secondaryHref} variant="outline" external>
            {project.live ? "Live site" : "Code"}
          </ButtonLink>
        </div>
      </div>

      <div className="tint flex items-end px-5 pt-6 sm:px-12 sm:pt-10 lg:min-h-[576px]" style={tintStyle(project)}>
        {project.views.length > 0 ? <ProjectPreview project={project} /> : project.distribution && <FlResults distribution={project.distribution} />}
      </div>
    </article>
  );
}

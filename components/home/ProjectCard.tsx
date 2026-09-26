import Link from "next/link";
import type { Project } from "@/data/projects";
import { Icon } from "@/components/ui/Icon";
import { tintStyle } from "@/lib/tint";
import { CardPreview } from "./CardPreview";

/** Compact card for secondary projects. The whole card links to the case study. */
export function ProjectCard({ project }: { project: Project }) {
  return (
    <Link href={`/work/${project.slug}`} className="lift-lg flex flex-col overflow-hidden rounded-[28px] border border-line bg-paper-2">
      <div className="tint relative h-[220px] overflow-hidden" style={tintStyle(project)}>
        {project.card && <CardPreview preview={project.card} />}
      </div>
      <div className="flex flex-1 flex-col gap-3 p-6 pt-6 sm:px-6.5">
        <div className="flex items-center justify-between">
          <h4 className="text-2xl font-extrabold tracking-[-0.02em]">{project.title}</h4>
          <span className="font-mono text-xs text-ink-3">{project.year}</span>
        </div>
        <p className="text-[15px] leading-relaxed text-ink-3">{project.tagline}</p>
        <ul className="flex flex-wrap gap-1.5">
          {project.tags.map((t) => (
            <li key={t} className="rounded-full bg-paper px-2.5 py-1.25 text-xs font-semibold">
              {t}
            </li>
          ))}
        </ul>
        <span className="mt-auto flex h-11.5 items-center justify-between rounded-full border-[1.5px] border-ink pr-1.5 pl-4.5 text-[15px] font-semibold">
          View project
          <span className="grid size-8.5 place-items-center rounded-full bg-primary text-on-primary">
            <Icon name="arrowRight" size={14} strokeWidth={2.2} />
          </span>
        </span>
      </div>
    </Link>
  );
}

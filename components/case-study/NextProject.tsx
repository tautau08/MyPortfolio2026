import Link from "next/link";
import type { Project } from "@/data/projects";
import { Icon } from "@/components/ui/Icon";

export function NextProject({ project }: { project: Project }) {
  return (
    <Link href={`/work/${project.slug}`} className="lift-lg flex items-center justify-between gap-6 rounded-[40px] border border-contact-line bg-contact px-8 py-10 text-on-contact sm:px-14 sm:py-12">
      <span className="flex flex-col gap-2.5">
        <span className="font-mono text-sm text-contact-accent">Next project · {project.index}</span>
        <span className="text-[clamp(2.25rem,1.5rem+2.5vw,3.5rem)] leading-none font-extrabold tracking-[-0.045em]">{project.title}</span>
        <span className="text-lg text-on-contact-muted">{project.tagline}</span>
      </span>
      <span className="hidden size-22 shrink-0 place-items-center rounded-full bg-accent-fill text-white sm:grid">
        <Icon name="arrowRight" size={32} strokeWidth={2.2} />
      </span>
    </Link>
  );
}

import type { Project } from "@/data/projects";
import { FlResults } from "@/components/fl-results/FlResults";
import { tintStyle } from "@/lib/tint";
import { ScreenCarousel } from "./ScreenCarousel";

/** Every page of the project or, for the ML project, its results. */
export function Screens({ project }: { project: Project }) {
  if (project.views.length > 0) return <ScreenCarousel project={project} />;
  if (!project.distribution) return null;
  return (
    <section aria-label="Results" className="tint flex rounded-[40px] px-5 pt-8 sm:px-12 sm:pt-10" style={tintStyle(project)}>
      <FlResults distribution={project.distribution} />
    </section>
  );
}

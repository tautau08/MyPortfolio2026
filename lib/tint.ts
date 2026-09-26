import type { CSSProperties } from "react";
import type { Project } from "@/data/projects";

/** CSS variables read by the `tint` utility, which switches colour with the theme. */
export function tintStyle(project: Pick<Project, "tint">): CSSProperties {
  return { "--tint-light": project.tint.light, "--tint-dark": project.tint.dark } as CSSProperties;
}

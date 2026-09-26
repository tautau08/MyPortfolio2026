"use client";

import { useState } from "react";
import { categories, projects, type Category } from "@/data/projects";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cn } from "@/lib/cn";
import { FeaturedProject } from "./FeaturedProject";
import { ProjectCard } from "./ProjectCard";

type Filter = (typeof categories)[number];

const matches = (filter: Filter) => (p: { categories: Category[] }) => filter === "All" || p.categories.includes(filter);

export function Work() {
  const [filter, setFilter] = useState<Filter>("All");
  const visible = projects.filter(matches(filter));
  const featured = visible.filter((p) => p.featured);
  const more = visible.filter((p) => !p.featured);

  return (
    <Container as="section" id="work" aria-labelledby="work-title" className="flex scroll-mt-8 flex-col gap-10 pt-28 lg:pt-35">
      <div className="flex flex-wrap items-end justify-between gap-8">
        <SectionHeading id="work-title" eyebrow="Selected work" title="Projects and" accent="case studies." size="lg" />
        <div role="group" aria-label="Filter projects" className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              aria-pressed={filter === c}
              onClick={() => setFilter(c)}
              className={cn(
                "h-11 rounded-full border-[1.5px] border-ink px-5 text-[15px] font-semibold transition-colors",
                filter === c ? "bg-primary text-on-primary" : "text-ink hover:bg-paper-2",
              )}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {featured.map((p) => (
        <FeaturedProject key={p.slug} project={p} />
      ))}

      {more.length > 0 && (
        <div className="mt-10 flex flex-col gap-5">
          <div className="flex items-baseline justify-between">
            <h3 className="text-[32px] font-extrabold tracking-[-0.03em]">More projects</h3>
            <span className="font-mono text-sm text-ink-3">{String(more.length).padStart(2, "0")} more</span>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {more.map((p) => (
              <ProjectCard key={p.slug} project={p} />
            ))}
          </div>
        </div>
      )}

      {visible.length === 0 && <p className="text-ink-3">No projects in this category yet.</p>}
    </Container>
  );
}

"use client";

import { useState } from "react";
import type { Project } from "@/data/projects";
import { BrowserFrame } from "@/components/frames/BrowserFrame";
import { PhoneFrame } from "@/components/frames/PhoneFrame";
import { SegmentedTabs } from "@/components/ui/SegmentedTabs";

/**
 * The real screens of a featured project: a browser window with a phone in front.
 * Only pages captured on both desktop and phone are shown here; the case study has the rest.
 */
export function ProjectPreview({ project }: { project: Project }) {
  const views = project.views.filter((v) => v.desktop && v.phone);
  const [label, setLabel] = useState(views[0]?.label);
  const view = views.find((v) => v.label === label) ?? views[0];
  const panelId = `${project.slug}-screens`;
  if (!view) return null;

  return (
    <div className="flex w-full flex-col gap-4">
      {views.length > 1 && (
        <SegmentedTabs
          label={`${project.title} screen`}
          options={views.map((v) => ({ value: v.label, label: v.label }))}
          value={view.label}
          onChange={setLabel}
          controls={panelId}
          size="sm"
          className="self-start"
        />
      )}
      <div id={panelId} role={views.length > 1 ? "tabpanel" : undefined} className="relative sm:pr-24">
        {view.desktop && <BrowserFrame shot={view.desktop} url={view.url} tone={project.frame} screenClassName="h-[260px] sm:h-[450px]" />}
        {view.phone && (
          <PhoneFrame
            shot={view.phone}
            bar={view.phoneBar}
            align={view.phoneAlign}
            className="absolute right-0 bottom-7 hidden w-[184px] sm:block"
          />
        )}
      </div>
    </div>
  );
}

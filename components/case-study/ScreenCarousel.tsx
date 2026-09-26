"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import type { Device, Project } from "@/data/projects";
import { Icon } from "@/components/ui/Icon";
import { SegmentedTabs } from "@/components/ui/SegmentedTabs";
import { cn } from "@/lib/cn";
import { tintStyle } from "@/lib/tint";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { deviceFor, devicesOf, ScreenSlide } from "./ScreenSlide";
import { ScreenThumbs } from "./ScreenThumbs";

const deviceLabels: Record<Device, string> = { desktop: "Desktop", tablet: "Tablet", phone: "Phone" };
const pad = (n: number) => String(n).padStart(2, "0");

function ArrowButton({ dir, disabled, onClick }: { dir: "prev" | "next"; disabled: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={dir === "prev" ? "Previous page" : "Next page"}
      className={cn(
        "absolute top-1/2 z-10 hidden size-13 -translate-y-1/2 place-items-center rounded-full border border-line bg-card text-ink shadow-[0_12px_28px_-12px_rgb(0_0_0/0.5)] transition sm:grid",
        "hover:bg-primary hover:text-on-primary active:scale-95 disabled:pointer-events-none disabled:opacity-0",
        dir === "prev" ? "left-3 lg:left-5" : "right-3 lg:right-5",
      )}
    >
      <Icon name={dir === "prev" ? "arrowLeft" : "arrowRight"} size={20} />
    </button>
  );
}

/** Every page of the app in a swipeable carousel, with a device switch and a thumbnail strip. */
export function ScreenCarousel({ project }: { project: Project }) {
  const { views } = project;
  const trackRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [preferred, setPreferred] = useState<Device>("desktop");

  const view = views[index];
  const available = devicesOf(view);
  const device = deviceFor(view, preferred);
  const multiple = views.length > 1;

  const goTo = (i: number) => {
    const track = trackRef.current;
    if (!track) return;
    const target = Math.min(Math.max(i, 0), views.length - 1);
    track.scrollTo({ left: target * track.clientWidth, behavior: reduced ? "auto" : "smooth" });
  };

  // Arrow keys scroll the snap track natively; Home and End jump to the first and last page.
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "Home" && e.key !== "End") return;
    e.preventDefault();
    goTo(e.key === "Home" ? 0 : views.length - 1);
  };

  const onScroll = () => {
    const track = trackRef.current;
    if (track) setIndex(Math.round(track.scrollLeft / track.clientWidth));
  };

  return (
    <section aria-roledescription="carousel" aria-label={`${project.title} screens`} className="flex flex-col gap-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div aria-live="polite" className="flex min-w-0 flex-col gap-1.5">
          <p className="tabular font-mono text-xs tracking-wider text-ink-3 uppercase">
            {multiple ? `Page ${pad(index + 1)} / ${pad(views.length)}` : "Screen"}
            {view.group && <span className="text-accent-ink"> · {view.group}</span>}
          </p>
          <p className="text-[clamp(1.25rem,1rem+0.6vw,1.625rem)] leading-tight font-bold tracking-[-0.02em]">
            {view.label}
            {view.note && <span className="font-normal text-ink-3"> — {view.note}</span>}
          </p>
        </div>
        {available.length > 1 && (
          <SegmentedTabs label="Device" options={available.map((d) => ({ value: d, label: deviceLabels[d] }))} value={device} onChange={setPreferred} size="sm" />
        )}
      </div>

      <div className="tint relative overflow-hidden rounded-[40px] px-5 pt-8 sm:px-12 sm:pt-10" style={tintStyle(project)}>
        <div
          ref={trackRef}
          onScroll={multiple ? onScroll : undefined}
          onKeyDown={multiple ? onKeyDown : undefined}
          tabIndex={multiple ? 0 : undefined}
          aria-label={multiple ? "Pages. Use the arrow keys or swipe to move between them." : undefined}
          className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain rounded-t-[14px]"
        >
          {views.map((v, i) => (
            <div
              key={`${v.group ?? ""}-${v.label}`}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${views.length}: ${v.label}`}
              className="flex w-full shrink-0 snap-center snap-always items-end justify-center"
            >
              <ScreenSlide view={v} device={deviceFor(v, preferred)} project={project} priority={i === 0} />
            </div>
          ))}
        </div>
        {multiple && (
          <>
            <ArrowButton dir="prev" disabled={index === 0} onClick={() => goTo(index - 1)} />
            <ArrowButton dir="next" disabled={index === views.length - 1} onClick={() => goTo(index + 1)} />
          </>
        )}
      </div>

      {multiple && <ScreenThumbs views={views} index={index} onSelect={goTo} smooth={!reduced} />}
    </section>
  );
}

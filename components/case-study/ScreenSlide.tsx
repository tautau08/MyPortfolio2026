import type { Device, Project, ScreenView } from "@/data/projects";
import { BrowserFrame } from "@/components/frames/BrowserFrame";
import { PhoneFrame } from "@/components/frames/PhoneFrame";
import { TabletFrame } from "@/components/frames/TabletFrame";

const order: Device[] = ["desktop", "tablet", "phone"];
const aspects = { "16/10": "aspect-[16/10]", "16/9": "aspect-video" } as const;

/** Devices a page was captured on, largest first. */
export const devicesOf = (view: ScreenView): Device[] => order.filter((d) => view[d]);

/** The preferred device if the page has it, otherwise its largest capture. */
export const deviceFor = (view: ScreenView, preferred: Device): Device => {
  const available = devicesOf(view);
  return available.includes(preferred) ? preferred : available[0];
};

interface ScreenSlideProps {
  view: ScreenView;
  device: Device;
  project: Pick<Project, "frame" | "desktopAspect">;
  priority?: boolean;
}

/** One page of the app inside the frame for the chosen device. */
export function ScreenSlide({ view, device, project, priority }: ScreenSlideProps) {
  if (device === "tablet" && view.tablet) return <TabletFrame shot={view.tablet} className="mb-10 w-full max-w-[460px]" />;
  if (device === "phone" && view.phone) {
    return <PhoneFrame shot={view.phone} bar={view.phoneBar} align={view.phoneAlign} className="mb-10 w-[min(300px,80vw)]" sizes="300px" />;
  }
  if (!view.desktop) return null;
  return (
    <BrowserFrame
      shot={view.desktop}
      url={view.url}
      tone={project.frame}
      priority={priority}
      className="w-full max-w-[1120px]"
      screenClassName={aspects[project.desktopAspect ?? "16/10"]}
      sizes="(min-width: 1280px) 1120px, 95vw"
    />
  );
}

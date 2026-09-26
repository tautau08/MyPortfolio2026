import Image from "next/image";
import type { Shot } from "@/data/projects";
import { cn } from "@/lib/cn";

const tones = {
  light: { chrome: "bg-[#E6E6E6]", dot: "bg-[#C8C8C8]", url: "bg-white text-[#555555]", screen: "bg-[#F1F1F1]", edge: "" },
  dark: { chrome: "bg-[#26262B]", dot: "bg-[#52525B]", url: "bg-[#0A0A0B] text-[#A1A1AA]", screen: "bg-[#0A0A0B]", edge: "ring-1 ring-white/20" },
};

interface BrowserFrameProps {
  shot: Shot;
  url?: string;
  tone?: keyof typeof tones;
  /** Classes for the screen area, usually a height or aspect ratio. */
  screenClassName?: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
}

/** A desktop browser window around a real screenshot, cropped from the top. */
export function BrowserFrame({ shot, url, tone = "light", screenClassName = "aspect-[16/10]", className, sizes = "(min-width: 1024px) 60vw, 100vw", priority }: BrowserFrameProps) {
  const t = tones[tone];
  return (
    <div className={cn("overflow-hidden rounded-t-[14px] shadow-[0_30px_60px_-30px_rgb(0_0_0/0.55)]", t.screen, t.edge, className)}>
      <div className={cn("flex h-8.5 items-center gap-1.75 px-3.5", t.chrome)} aria-hidden="true">
        <span className={cn("size-2.5 rounded-full", t.dot)} />
        <span className={cn("size-2.5 rounded-full", t.dot)} />
        <span className={cn("size-2.5 rounded-full", t.dot)} />
        {url && <span className={cn("mx-auto max-w-[60%] truncate rounded-[7px] px-10 py-1 font-mono text-[11px]", t.url)}>{url}</span>}
      </div>
      <div className={cn("relative", screenClassName)}>
        <Image src={shot.src} alt={shot.alt} fill sizes={sizes} priority={priority} className="object-cover object-left-top" />
      </div>
    </div>
  );
}

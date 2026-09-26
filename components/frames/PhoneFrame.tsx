import Image from "next/image";
import type { Shot } from "@/data/projects";
import { cn } from "@/lib/cn";
import { isLight } from "@/lib/color";

interface PhoneFrameProps {
  shot: Shot;
  /** Status-bar colour, matched to the top of the screenshot. */
  bar?: string;
  align?: "top" | "bottom";
  /** Sizing and positioning only; the frame scales with the width it is given. */
  className?: string;
  sizes?: string;
}

/** A thin-bezel phone with side buttons, punch-hole camera, status bar and home indicator. */
export function PhoneFrame({ shot, bar = "#FFFFFF", align = "top", className, sizes = "200px" }: PhoneFrameProps) {
  const ink = isLight(bar) ? "#111111" : "#FFFFFF";

  return (
    <div className={cn("@container aspect-[184/407]", className)}>
      <div className="relative size-full rounded-[14%/6.4%] bg-[#111111] p-[2.2%] shadow-[0_0_0_1px_rgb(255_255_255/0.08),0_24px_48px_-20px_rgb(0_0_0/0.6)]">
        <span aria-hidden="true" className="absolute top-[19%] -left-[1%] h-[8%] w-[1.2%] rounded-l-sm bg-[#2A2A2A]" />
        <span aria-hidden="true" className="absolute top-[29%] -left-[1%] h-[8%] w-[1.2%] rounded-l-sm bg-[#2A2A2A]" />
        <span aria-hidden="true" className="absolute top-[24%] -right-[1%] h-[11%] w-[1.2%] rounded-r-sm bg-[#2A2A2A]" />

        <div className="relative flex h-full flex-col overflow-hidden rounded-[12.5%/5.5%]" style={{ background: bar }}>
          <div aria-hidden="true" className="relative flex h-[4.5%] shrink-0 items-center justify-between px-[8%] text-[4.6cqw] font-semibold" style={{ color: ink }}>
            <span>9:41</span>
            <span className="absolute top-[28%] left-1/2 aspect-square h-[45%] -translate-x-1/2 rounded-full bg-[#050505] ring-1 ring-gray-500/30" />
            <span className="flex items-center gap-[1.5cqw]">
              <span className="h-[3.5cqw] w-[5cqw] rounded-[1px] bg-current opacity-80" />
              <span className="h-[3.6cqw] w-[7.5cqw] rounded-[2px] border border-current p-[0.4cqw] opacity-80">
                <span className="block h-full w-3/4 rounded-[1px] bg-current" />
              </span>
            </span>
          </div>
          <div className="relative min-h-0 flex-1">
            <Image src={shot.src} alt={shot.alt} fill sizes={sizes} className={cn("object-cover", align === "bottom" ? "object-bottom" : "object-top")} />
          </div>
          <span aria-hidden="true" className="absolute bottom-[1.3%] left-1/2 h-[0.8%] w-[32%] -translate-x-1/2 rounded-full opacity-55" style={{ background: ink }} />
        </div>
      </div>
    </div>
  );
}

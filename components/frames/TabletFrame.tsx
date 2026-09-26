import Image from "next/image";
import type { Shot } from "@/data/projects";
import { cn } from "@/lib/cn";

/** A tablet in portrait, sized by its container width. */
export function TabletFrame({ shot, className, sizes = "460px" }: { shot: Shot; className?: string; sizes?: string }) {
  return (
    <div className={cn("aspect-[820/1180] rounded-[6%/4.2%] bg-[#111111] p-[3%] shadow-[0_30px_60px_-30px_rgb(0_0_0/0.55)]", className)}>
      <div className="relative h-full overflow-hidden rounded-[3%/2%] bg-white">
        <Image src={shot.src} alt={shot.alt} fill sizes={sizes} className="object-cover object-left-top" />
      </div>
    </div>
  );
}

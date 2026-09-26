import Image from "next/image";
import type { CardPreview as Preview, Shot } from "@/data/projects";
import { PhoneFrame } from "@/components/frames/PhoneFrame";

/** Mini browser/window with a thin title bar, used inside the small project cards. */
function MiniWindow({ shot, className, dark }: { shot: Shot; className: string; dark?: boolean }) {
  return (
    <div className={`absolute overflow-hidden rounded-lg shadow-[0_16px_32px_-14px_rgb(0_0_0/0.5)] ${className}`}>
      <div aria-hidden="true" className={`flex h-2.5 items-center gap-0.75 px-1.5 ${dark ? "bg-[#1B1A21]" : "bg-[#2B2B2B]"}`}>
        <span className="size-1 rounded-full bg-[#777777]" />
        <span className="size-1 rounded-full bg-[#777777]" />
      </div>
      <div className="relative h-[calc(100%-10px)]">
        <Image src={shot.src} alt={shot.alt} fill sizes="360px" className="object-cover object-left-top" />
      </div>
    </div>
  );
}

/** Preview area of a secondary project card; layout comes from the project data. */
export function CardPreview({ preview }: { preview: Preview }) {
  switch (preview.layout) {
    case "browser":
      return <MiniWindow shot={preview.shot} className="inset-x-7 top-7 bottom-0 rounded-b-none" />;
    case "browser-phone":
      return (
        <>
          <MiniWindow shot={preview.shot} dark className="top-5.5 left-5.5 h-[208px] w-[78%]" />
          <PhoneFrame shot={preview.phone} bar="#24252D" className="absolute top-10 right-5 w-[88px]" sizes="90px" />
        </>
      );
    case "phones":
      return (
        <div className="absolute inset-x-0 top-6 flex justify-center gap-3.5">
          {preview.shots.map((s) => (
            <PhoneFrame key={s.src} shot={s} className="w-[96px]" sizes="100px" />
          ))}
        </div>
      );
    case "windows":
      return (
        <>
          <MiniWindow shot={preview.shots[0]} className="top-5.5 left-6 h-[194px] w-[82%]" />
          <MiniWindow shot={preview.shots[1]} className="right-4.5 bottom-3.5 h-[156px] w-[65%]" />
        </>
      );
  }
}

import { Fragment } from "react";
import { marquee } from "@/data/profile";

/** Decorative scrolling band of technologies. The list is repeated twice so the loop is seamless. */
export function Marquee() {
  const row = (
    <div className="flex shrink-0 items-center gap-9 pr-9">
      {marquee.map((item) => (
        <Fragment key={item}>
          <span>{item}</span>
          <span aria-hidden="true">✦</span>
        </Fragment>
      ))}
    </div>
  );
  return (
    <div aria-hidden="true" className="mt-22 overflow-hidden bg-accent py-5.5 text-[clamp(1.25rem,1rem+1vw,1.75rem)] font-extrabold whitespace-nowrap text-white uppercase">
      <div className="animate-marquee flex w-max">
        {row}
        {row}
      </div>
    </div>
  );
}

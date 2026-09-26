import Image from "next/image";
import type { ReactNode } from "react";
import { contact, profile } from "@/data/profile";
import { Biscoot } from "./Biscoot";
import { LocalTime } from "./LocalTime";

function Fact({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex items-baseline gap-4 border-t border-white/10 py-2.5">
      <dt className="w-24 shrink-0 font-mono text-[13px] text-on-contact-muted">{label}</dt>
      <dd className="text-[15px] leading-snug text-on-contact">{children}</dd>
    </div>
  );
}

/**
 * Biscoot on his break, then me "open to work", then a few quick facts. The two captions
 * read as one line, so the cat stays on top. A column beside the form on wide screens;
 * a two-column card under it on tablets.
 */
export function ProfilePanel() {
  const [based, ...rest] = contact.facts;

  return (
    <aside
      aria-label="About me"
      className="flex h-full flex-col justify-between gap-5 rounded-[28px] border border-white/12 bg-white/[0.04] p-6 sm:px-7 md:grid md:grid-cols-2 md:gap-x-10 xl:flex"
    >
      <figure className="flex flex-col items-center gap-0.5 md:col-start-1">
        <Biscoot className="h-auto w-full max-w-[250px]" />
        <figcaption className="font-mono text-xs text-on-contact-muted">{contact.petCaption}</figcaption>
      </figure>

      <div className="flex flex-col items-center gap-2 text-center md:col-start-1">
        <Image src={profile.photo} alt="" width={96} height={96} className="size-24 rounded-full border-4 border-on-contact object-cover object-[50%_28%]" />
        <p className="text-xl leading-tight font-bold tracking-[-0.02em]">{profile.name}</p>
        <p className="flex items-center gap-2 text-[15px] text-on-contact-muted">
          <span aria-hidden="true" className="relative flex size-2">
            <span className="absolute inset-0 animate-ping rounded-full bg-contact-signal opacity-60 motion-reduce:hidden" />
            <span className="size-2 rounded-full bg-contact-signal" />
          </span>
          {contact.status}
        </p>
      </div>

      <dl className="border-b border-white/10 md:col-start-2 md:row-span-2 md:row-start-1 md:self-center">
        <Fact label={based.label}>{based.value}</Fact>
        <Fact label="Local time">
          <LocalTime timeZone={contact.timeZone.id} /> <span className="text-on-contact-muted">({contact.timeZone.label})</span>
        </Fact>
        {rest.map((f) => (
          <Fact key={f.label} label={f.label}>
            {f.value}
          </Fact>
        ))}
      </dl>
    </aside>
  );
}

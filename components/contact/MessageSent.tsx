"use client";

import { useEffect, useRef } from "react";
import { contact } from "@/data/profile";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";

/** Replaces the form once the message is on its way. Takes focus so screen readers announce it. */
export function MessageSent({ email, onReset }: { email: string; onReset: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const [before, after] = contact.form.sentBody.split("{email}");

  useEffect(() => ref.current?.focus(), []);

  return (
    <div ref={ref} tabIndex={-1} role="status" className="animate-rise flex flex-col items-start gap-4 px-6 py-10 outline-none sm:px-8">
      <span className="grid size-14 place-items-center rounded-full bg-contact-signal/15 text-contact-signal">
        <Icon name="check" size={26} strokeWidth={2.5} />
      </span>
      <p className="text-[28px] leading-tight font-extrabold tracking-[-0.03em]">{contact.form.sentTitle}</p>
      <p className="max-w-md text-[17px] leading-relaxed text-on-contact-muted">
        {before}
        <span className="font-semibold break-all text-on-contact">{email}</span>
        {after}
      </p>
      <Button variant="outline-light" onClick={onReset} className="mt-2">
        Write another
      </Button>
    </div>
  );
}

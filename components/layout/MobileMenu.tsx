"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { navLinks } from "./nav";

/** Menu button and full-width sheet for small screens. */
export function MobileMenu() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? "Close menu" : "Open menu"}
        className="grid size-12 place-items-center rounded-full bg-primary text-on-primary"
      >
        <Icon name={open ? "close" : "menu"} size={20} />
      </button>
      {open && (
        <nav id="mobile-menu" aria-label="Mobile" className="animate-rise absolute inset-x-4 top-full z-50 mt-2 flex flex-col rounded-3xl border border-line bg-paper-2 p-3 shadow-[0_24px_48px_-24px_rgb(0_0_0/0.4)]">
          {navLinks.map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="rounded-2xl px-4 py-3.5 text-lg font-semibold hover:bg-paper">
              {l.label}
            </Link>
          ))}
        </nav>
      )}
    </div>
  );
}

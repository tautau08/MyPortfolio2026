import Link from "next/link";
import { profile } from "@/data/profile";
import { ButtonLink } from "@/components/ui/Button";
import { MobileMenu } from "./MobileMenu";
import { ThemeToggle } from "./ThemeToggle";
import { navLinks } from "./nav";

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2.5 text-[22px] font-extrabold tracking-[-0.03em]">
      <span className="grid size-9 place-items-center rounded-[10px] bg-primary text-[17px] text-on-primary">{profile.handle[0].toUpperCase()}</span>
      <span>
        {profile.handle}
        <span className="text-accent">.</span>
      </span>
    </Link>
  );
}

export function AvailabilityPill() {
  return (
    <span className="flex h-12 items-center gap-2 rounded-full border border-line px-4 text-sm text-ink-3">
      <span className="size-2 rounded-full bg-signal shadow-[0_0_0_4px_color-mix(in_srgb,var(--signal)_18%,transparent)]" />
      {profile.availability}
    </span>
  );
}

export function SiteHeader() {
  return (
    <header className="relative mx-auto flex w-full max-w-[1440px] items-center justify-between px-4 py-5 sm:px-8 lg:px-16 lg:py-7">
      <Logo />
      <nav aria-label="Primary" className="hidden gap-1 rounded-full border border-line bg-paper-2 p-1.5 lg:flex">
        {navLinks.map((l, i) => (
          <Link
            key={l.href}
            href={l.href}
            className={i === 0 ? "rounded-full bg-paper px-4.5 py-2.5 text-[15px] font-semibold" : "rounded-full px-4.5 py-2.5 text-[15px] font-medium text-ink-3 transition-colors hover:text-ink"}
          >
            {l.label}
          </Link>
        ))}
      </nav>
      <div className="flex items-center gap-2.5">
        <span className="hidden xl:inline-flex">
          <AvailabilityPill />
        </span>
        <ThemeToggle />
        <span className="hidden sm:block">
          <ButtonLink href="/#contact" badgeIcon="arrowUpRight">
            Let&apos;s talk
          </ButtonLink>
        </span>
        <MobileMenu />
      </div>
    </header>
  );
}

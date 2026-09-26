import { profile } from "@/data/profile";
import { ButtonLink } from "@/components/ui/Button";

export function SiteFooter() {
  return (
    <footer className="mx-auto flex w-full max-w-[1440px] items-center justify-between gap-4 px-4 py-10 text-[15px] text-ink-3 sm:px-8 lg:px-16">
      <span>
        © {new Date().getFullYear()} {profile.name}
      </span>
      <ButtonLink href="#top" variant="outline">
        Back to top ↑
      </ButtonLink>
    </footer>
  );
}

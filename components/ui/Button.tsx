import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Icon, type IconName } from "./Icon";

type Variant = "primary" | "outline" | "accent" | "outline-light";
type Size = "md" | "lg";

interface ButtonStyleProps {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  /** Icon in the round badge at the end of a primary/accent button. */
  badgeIcon?: IconName;
  /** Icon before the label (outline buttons). */
  icon?: IconName;
  className?: string;
  "aria-label"?: string;
}

interface ButtonLinkProps extends ButtonStyleProps {
  href: string;
  /** Arrow after the label, used for off-site links on outline buttons. */
  external?: boolean;
}

interface ButtonProps extends ButtonStyleProps {
  type?: "button" | "submit";
  disabled?: boolean;
  onClick?: () => void;
}

const base = "lift inline-flex items-center rounded-full font-semibold whitespace-nowrap";

const heights: Record<Size, string> = {
  md: "h-12 text-[15px]",
  lg: "h-[60px] text-[17px]",
};

const variants: Record<Variant, string> = {
  primary: "bg-primary text-on-primary",
  accent: "bg-accent-fill text-white",
  outline: "border-[1.5px] border-ink text-ink",
  "outline-light": "border-[1.5px] border-on-contact text-on-contact",
};

const isExternal = (href: string) => /^(https?:|mailto:)/.test(href);

function classesFor({ variant = "primary", size = "md", badgeIcon, className }: ButtonStyleProps) {
  const padding = badgeIcon ? (size === "lg" ? "gap-3 pr-2.5 pl-7" : "gap-2.5 pr-2 pl-5.5") : size === "lg" ? "gap-2.5 px-6.5" : "gap-2 px-5";
  return cn(base, heights[size], variants[variant], padding, className);
}

function Content({ children, variant, size = "md", badgeIcon, icon, external }: ButtonStyleProps & { external?: boolean }) {
  return (
    <>
      {icon && <Icon name={icon} size={18} />}
      {children}
      {external && <Icon name="arrowUpRight" size={16} />}
      {badgeIcon && (
        <span
          className={cn(
            "grid place-items-center rounded-full",
            size === "lg" ? "size-[42px]" : "size-[34px]",
            variant === "accent" ? "bg-on-contact text-contact" : "bg-accent-fill text-white",
          )}
        >
          <Icon name={badgeIcon} size={16} strokeWidth={2.2} />
        </span>
      )}
    </>
  );
}

/**
 * The site's one button shape: a pill. Primary/accent buttons end in a round
 * badge holding an arrow; outline buttons are for secondary actions.
 */
export function ButtonLink({ href, external, "aria-label": ariaLabel, ...style }: ButtonLinkProps) {
  const classes = classesFor(style);
  const content = <Content {...style} external={external} />;

  if (isExternal(href)) {
    return (
      <a href={href} className={classes} aria-label={ariaLabel} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer">
        {content}
      </a>
    );
  }
  return (
    <Link href={href} className={classes} aria-label={ariaLabel}>
      {content}
    </Link>
  );
}

/** Same pill as ButtonLink, for actions that stay on the page, like submitting a form. */
export function Button({ type = "button", disabled, onClick, "aria-label": ariaLabel, ...style }: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      aria-label={ariaLabel}
      className={cn(classesFor(style), "cursor-pointer disabled:cursor-wait disabled:opacity-70 disabled:hover:translate-y-0")}
    >
      <Content {...style} />
    </button>
  );
}

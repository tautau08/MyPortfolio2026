import type { ComponentPropsWithoutRef, ElementType } from "react";
import { cn } from "@/lib/cn";

type ContainerProps<T extends ElementType> = { as?: T } & ComponentPropsWithoutRef<T>;

/** Page-width wrapper with the site's side gutters. */
export function Container<T extends ElementType = "div">({ as, className, ...rest }: ContainerProps<T>) {
  const Tag = as ?? "div";
  return <Tag className={cn("mx-auto w-full max-w-[1440px] px-4 sm:px-8 lg:px-16", className)} {...rest} />;
}

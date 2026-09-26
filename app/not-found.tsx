import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <Container className="flex flex-col items-start gap-6 py-32">
      <p className="font-mono text-sm text-accent">404</p>
      <h1 className="text-[clamp(2.5rem,1.5rem+3vw,4rem)] leading-none font-extrabold tracking-[-0.04em]">Nothing at this address.</h1>
      <ButtonLink href="/" badgeIcon="arrowRight">
        Back to the portfolio
      </ButtonLink>
    </Container>
  );
}

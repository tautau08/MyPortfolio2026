import { contact, profile } from "@/data/profile";
import { ButtonLink } from "@/components/ui/Button";
import { MessageForm } from "@/components/contact/MessageForm";
import { ProfilePanel } from "@/components/contact/ProfilePanel";
import { Container } from "@/components/ui/Container";

export function Contact() {
  const { email, github, linkedin, facebook } = profile.links;
  const socials = [
    { label: "LinkedIn", href: linkedin },
    { label: "GitHub", href: github },
    { label: "Facebook", href: facebook },
  ].filter((s) => s.href);

  return (
    <Container as="section" id="contact" aria-labelledby="contact-title" className="mt-28 scroll-mt-6 lg:mt-35">
      <div className="grid gap-8 rounded-[40px] border border-contact-line bg-contact p-6 text-on-contact sm:p-10 xl:grid-cols-[minmax(0,1fr)_360px] xl:gap-10 xl:p-12">
        <div className="flex min-w-0 flex-col gap-5">
          <span className="font-mono text-[15px] text-contact-accent">Contact</span>
          <h2 id="contact-title" className="text-[clamp(2.75rem,1.75rem+3vw,4.25rem)] leading-[0.95] font-extrabold tracking-[-0.05em]">
            Let&apos;s work <span className="font-serif font-normal text-contact-accent italic">together.</span>
          </h2>
          <p className="max-w-[600px] text-[17px] leading-relaxed text-on-contact-muted">{contact.pitch}</p>
          <MessageForm />
          <div className="flex flex-wrap items-center gap-2.5">
            <p className="mr-1.5 font-mono text-[13px] text-on-contact-muted">Or reach me</p>
            {email && (
              <ButtonLink href={`mailto:${email}`} variant="outline-light">
                {email}
              </ButtonLink>
            )}
            {socials.map((s) => (
              <ButtonLink key={s.label} href={s.href} variant="outline-light" external>
                {s.label}
              </ButtonLink>
            ))}
          </div>
        </div>

        <ProfilePanel />
      </div>
    </Container>
  );
}

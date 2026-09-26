import Image from "next/image";
import { profile } from "@/data/profile";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { publicFileExists } from "@/lib/publicFile";

export function Hero() {
  const hasCv = publicFileExists(profile.links.cv);

  return (
    <Container as="section" aria-labelledby="hero-title" className="grid gap-12 pt-6 lg:grid-cols-[minmax(0,1fr)_440px] lg:items-end lg:gap-14 lg:pt-10">
      <div className="flex flex-col gap-7">
        <div className="flex flex-wrap gap-x-6 gap-y-1 font-mono text-sm text-ink-3 uppercase">
          <span>/ {profile.role}</span>
          <span>/ Based in {profile.location}</span>
        </div>
        <h1 id="hero-title" className="text-display font-extrabold uppercase">
          {profile.firstName}
          <br />
          {profile.lastName}
          <span className="text-accent">.</span>
        </h1>
        <p className="max-w-[660px] text-[clamp(1.125rem,1rem+0.6vw,1.5rem)] leading-[1.45] text-ink-2">
          {profile.intro} <span className="font-serif text-accent italic">{profile.introAccent}</span>
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <ButtonLink href="#work" size="lg" badgeIcon="arrowDown">
            See my work
          </ButtonLink>
          {hasCv && (
            <ButtonLink href={profile.links.cv} size="lg" variant="outline" icon="download">
              Download CV
            </ButtonLink>
          )}
          <a href={profile.links.github} target="_blank" rel="noreferrer" aria-label="GitHub profile" className="lift grid size-[60px] place-items-center rounded-full border-[1.5px] border-ink">
            <Icon name="code" size={20} />
          </a>
        </div>
      </div>

      <div className="relative order-first mx-auto w-full max-w-[440px] pb-2 lg:order-none">
        <figure className="rotate-[2.5deg] rounded-[28px] border border-line bg-card p-3 pb-4.5 shadow-[0_30px_60px_-30px_rgb(0_0_0/0.6)]">
          <div className="relative aspect-[416/500] overflow-hidden rounded-[18px]">
            <Image src={profile.photo} alt={`Portrait of ${profile.firstName}`} fill priority fetchPriority="high" sizes="(min-width: 1024px) 440px, 90vw" className="object-cover object-[50%_30%]" />
          </div>
          <figcaption className="flex justify-between px-2 pt-3.5 font-mono text-[13px] text-ink-3">
            {profile.photoCaption.map((c) => (
              <span key={c}>{c}</span>
            ))}
          </figcaption>
        </figure>
        <span className="absolute bottom-24 -left-11 hidden -rotate-6 rounded-2xl bg-accent-fill px-4.5 py-3 font-mono text-[15px] text-white shadow-[0_14px_28px_-14px_rgb(0_0_0/0.6)] lg:block">
          {profile.heroSticker}
          <span aria-hidden="true" className="caret ml-1 inline-block h-[1.05em] w-2 translate-y-0.5 bg-white" />
        </span>
      </div>
    </Container>
  );
}

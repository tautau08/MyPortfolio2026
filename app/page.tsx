import { Contact } from "@/components/home/Contact";
import { Experience } from "@/components/home/Experience";
import { Hero } from "@/components/home/Hero";
import { Marquee } from "@/components/home/Marquee";
import { Skills } from "@/components/home/Skills";
import { Stats } from "@/components/home/Stats";
import { Work } from "@/components/home/Work";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Stats />
      <Marquee />
      <Experience />
      <Work />
      <Skills />
      <Contact />
    </>
  );
}

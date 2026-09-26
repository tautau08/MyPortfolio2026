import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CaseHeader } from "@/components/case-study/CaseHeader";
import { DemoList } from "@/components/case-study/DemoList";
import { Metrics } from "@/components/case-study/Metrics";
import { NextProject } from "@/components/case-study/NextProject";
import { Reflection } from "@/components/case-study/Reflection";
import { Screens } from "@/components/case-study/Screens";
import { Story } from "@/components/case-study/Story";
import { Container } from "@/components/ui/Container";
import { getNextProject, getProject, projects } from "@/data/projects";
import { shareMetadata } from "@/lib/site";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const project = getProject((await params).slug);
  if (!project) return {};
  return { title: project.title, description: project.tagline, ...shareMetadata(`${project.title} · Case study`, project.tagline, `/work/${project.slug}`) };
}

export default async function CaseStudyPage({ params }: PageProps) {
  const project = getProject((await params).slug);
  if (!project) notFound();

  return (
    <Container as="article" className="flex flex-col gap-18 lg:gap-24">
      <CaseHeader project={project} />
      <Screens project={project} />
      <Metrics metrics={project.metrics} />
      <Story project={project} />
      <DemoList demos={project.demos} />
      <Reflection text={project.change} />
      <NextProject project={getNextProject(project.slug)} />
    </Container>
  );
}

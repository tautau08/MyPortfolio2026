import type { MetadataRoute } from "next";
import { projects } from "@/data/projects";
import { siteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: new URL("/", siteUrl).href, changeFrequency: "monthly", priority: 1 },
    ...projects.map((p) => ({ url: new URL(`/work/${p.slug}`, siteUrl).href, changeFrequency: "yearly" as const, priority: p.featured ? 0.8 : 0.6 })),
  ];
}

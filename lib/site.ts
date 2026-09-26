import type { Metadata } from "next";
import { profile } from "@/data/profile";

/**
 * The deployed origin, used for absolute URLs in share previews, the sitemap and robots.txt.
 * Set NEXT_PUBLIC_SITE_URL to your domain; on Vercel the production URL is picked up automatically.
 */
export const siteUrl = new URL(
  process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000"),
);

/** Open Graph and Twitter tags for a page. Next replaces these objects per page rather than merging them. */
export function shareMetadata(title: string, description: string, path: string): Pick<Metadata, "openGraph" | "twitter" | "alternates"> {
  return {
    alternates: { canonical: path },
    openGraph: { type: "website", siteName: profile.name, locale: "en_US", url: path, title, description },
    twitter: { card: "summary_large_image", title, description },
  };
}

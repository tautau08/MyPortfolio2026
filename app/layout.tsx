import type { Metadata, Viewport } from "next";
import { Archivo, Fragment_Mono, Fraunces } from "next/font/google";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { themeScript } from "@/components/layout/theme";
import { profile } from "@/data/profile";
import { shareMetadata, siteUrl } from "@/lib/site";
import "./globals.css";

const archivo = Archivo({ subsets: ["latin"], variable: "--font-archivo", display: "swap" });
const fraunces = Fraunces({ subsets: ["latin"], style: "italic", variable: "--font-fraunces", display: "swap" });
const fragment = Fragment_Mono({ subsets: ["latin"], weight: "400", variable: "--font-fragment", display: "swap" });

const title = `${profile.name}, ${profile.role}`;
const description = "Spring Boot and Next.js systems that run in production, plus federated learning research. Projects with real screens and live demos.";

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: { default: title, template: `%s · ${profile.firstName}` },
  description,
  authors: [{ name: profile.name, url: profile.links.linkedin }],
  ...shareMetadata(title, description, "/"),
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fffcf5" },
    { media: "(prefers-color-scheme: dark)", color: "#14100e" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${archivo.variable} ${fraunces.variable} ${fragment.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body id="top" className="flex min-h-dvh flex-col">
        <a href="#main" className="sr-only z-50 rounded-lg bg-primary px-3 py-2 text-on-primary focus:not-sr-only focus:fixed focus:top-3 focus:left-3">
          Skip to content
        </a>
        <SiteHeader />
        <main id="main" className="flex-1">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}

import "server-only";
import { readFile } from "node:fs/promises";
import path from "node:path";
import type { ReactNode } from "react";

/** Share images are 1200×630, the size LinkedIn, X, WhatsApp and Slack all expect. */
export const ogSize = { width: 1200, height: 630 };

export const ogColors = { paper: "#fffcf5", ink: "#24130f", ink3: "#6b4a3f", accent: "#d0342c", line: "#e7ddcb", signal: "#2e7d4f" };

/** Archivo, the site's display font (SIL Open Font License), bundled in lib/fonts for the image renderer. */
export async function ogFonts() {
  const load = (weight: 400 | 600 | 800) => readFile(path.join(process.cwd(), "lib", "fonts", `Archivo-${weight}.ttf`));
  const [regular, semibold, bold] = await Promise.all([load(400), load(600), load(800)]);
  return [
    { name: "Archivo", data: regular, weight: 400 as const, style: "normal" as const },
    { name: "Archivo", data: semibold, weight: 600 as const, style: "normal" as const },
    { name: "Archivo", data: bold, weight: 800 as const, style: "normal" as const },
  ];
}

/** Font size that fits an uppercase one-line title into `width` pixels. */
export const fitTitle = (title: string, width: number, max: number) => Math.min(max, Math.floor(width / ((title.length + 1) * 0.68)));

/** A file from /public as a data URL, since the image renderer can't fetch relative paths. */
export async function publicImage(src: string): Promise<string> {
  const file = await readFile(path.join(process.cwd(), "public", src));
  const type = src.endsWith(".png") ? "image/png" : "image/jpeg";
  return `data:${type};base64,${file.toString("base64")}`;
}

/** The "T. tauhid." mark from the site header. */
export function OgLogo({ handle }: { handle: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
      <div style={{ width: 48, height: 48, borderRadius: 12, background: ogColors.ink, color: ogColors.paper, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, fontWeight: 800 }}>
        {handle[0].toUpperCase()}
      </div>
      <div style={{ display: "flex", fontSize: 30, fontWeight: 800, color: ogColors.ink }}>
        {handle}
        <span style={{ color: ogColors.accent }}>.</span>
      </div>
    </div>
  );
}

export function OgChip({ children }: { children: ReactNode }) {
  return (
    <div style={{ display: "flex", padding: "8px 18px", borderRadius: 999, border: `2px solid ${ogColors.ink}`, fontSize: 22, fontWeight: 600, color: ogColors.ink }}>
      {children}
    </div>
  );
}

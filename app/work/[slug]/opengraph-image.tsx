import { ImageResponse } from "next/og";
import { profile } from "@/data/profile";
import { getProject, projects, thumbOf } from "@/data/projects";
import { isLight } from "@/lib/color";
import { OgLogo, fitTitle, ogColors, ogFonts, ogSize, publicImage } from "@/lib/og";

export const alt = "Case study";
export const size = ogSize;
export const contentType = "image/png";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

/** The link preview for a case study: title, tagline and stack on the project's tint, with its first screen. */
export default async function OpengraphImage({ params }: { params: Promise<{ slug: string }> }) {
  const project = getProject((await params).slug);
  if (!project) return new Response("Not found", { status: 404 });

  const light = isLight(project.tint.light);
  const ink = light ? ogColors.ink : ogColors.paper;
  const muted = light ? ogColors.ink3 : "#d9c9bf";
  const first = project.views[0];
  const shot = first ? thumbOf(first) : project.distribution;
  const phoneOnly = Boolean(first && !first.desktop && !first.tablet);
  const [image, fonts] = await Promise.all([shot ? publicImage(shot.src) : null, ogFonts()]);
  // Desktop screens get a landscape frame, phone-only apps a phone-shaped one.
  const frame = phoneOnly ? { width: 250, height: 518 } : { width: 540, height: 360 };
  const textWidth = ogSize.width - 56 * 2 - 48 - (image ? frame.width : 0);

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: project.tint.light, padding: 56, gap: 48, fontFamily: "Archivo" }}>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between", color: ink }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            {light ? <OgLogo handle={profile.handle} /> : <div style={{ display: "flex", fontSize: 30, fontWeight: 800 }}>{`${profile.handle}.`}</div>}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <div style={{ display: "flex", fontSize: 22, fontWeight: 600, color: muted }}>{`${project.index} / Case study · ${project.year}`}</div>
            <div style={{ display: "flex", fontSize: fitTitle(project.title, textWidth, 96), fontWeight: 800, lineHeight: 0.92, letterSpacing: -2 }}>
              {project.title.toUpperCase()}
              <span style={{ color: ogColors.accent }}>.</span>
            </div>
            <div style={{ display: "flex", fontSize: 26, lineHeight: 1.3, color: muted }}>{project.tagline}</div>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {project.stack.slice(0, 4).map((s) => (
              <div key={s} style={{ display: "flex", padding: "6px 16px", borderRadius: 999, border: `2px solid ${ink}`, fontSize: 20, fontWeight: 600 }}>
                {s}
              </div>
            ))}
          </div>
        </div>
        {image && (
          // eslint-disable-next-line @next/next/no-img-element -- rendered to PNG, not the DOM
          <img
            src={image}
            alt=""
            width={frame.width}
            height={frame.height}
            style={{ alignSelf: "center", borderRadius: phoneOnly ? 32 : 18, objectFit: "cover", objectPosition: "left top", border: `8px solid ${ogColors.ink}` }}
          />
        )}
      </div>
    ),
    { ...size, fonts },
  );
}

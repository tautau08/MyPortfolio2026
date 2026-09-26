import { ImageResponse } from "next/og";
import { marquee, profile } from "@/data/profile";
import { OgChip, OgLogo, ogColors, ogFonts, ogSize, publicImage } from "@/lib/og";

export const alt = `${profile.name}, ${profile.role}`;
export const size = ogSize;
export const contentType = "image/png";

/** The link preview for the home page: name, role, availability and portrait. */
export default async function OpengraphImage() {
  const [photo, fonts] = await Promise.all([publicImage(profile.photo), ogFonts()]);

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: ogColors.paper, padding: 64, gap: 56, fontFamily: "Archivo" }}>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <OgLogo handle={profile.handle} />
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={{ display: "flex", flexDirection: "column", fontSize: 104, fontWeight: 800, lineHeight: 0.9, letterSpacing: -5, color: ogColors.ink }}>
              <span>{profile.firstName.toUpperCase()}</span>
              <span>
                {profile.lastName.toUpperCase()}
                <span style={{ color: ogColors.accent }}>.</span>
              </span>
            </div>
            <div style={{ display: "flex", fontSize: 32, color: ogColors.ink3 }}>{`${profile.role} · ${profile.location}`}</div>
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 18px", borderRadius: 999, background: "#dcefe3", color: ogColors.signal, fontSize: 22, fontWeight: 700 }}>
              <div style={{ width: 12, height: 12, borderRadius: 6, background: ogColors.signal }} />
              {profile.availability}
            </div>
            {marquee.slice(0, 2).map((m) => (
              <OgChip key={m}>{m}</OgChip>
            ))}
          </div>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element -- rendered to PNG, not the DOM */}
        <img src={photo} alt="" width={400} height={502} style={{ borderRadius: 28, objectFit: "cover", border: `10px solid ${ogColors.ink}` }} />
      </div>
    ),
    { ...size, fonts },
  );
}

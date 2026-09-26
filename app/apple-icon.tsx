import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/** Home-screen icon for iOS: the same "T." mark as the favicon, on a solid background. */
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#24130f" }}>
        <div style={{ display: "flex", alignItems: "flex-end", color: "#fffcf5", fontSize: 112, fontWeight: 800, lineHeight: 1 }}>
          T<div style={{ width: 20, height: 20, marginLeft: 4, marginBottom: 14, background: "#d0342c" }} />
        </div>
      </div>
    ),
    size,
  );
}

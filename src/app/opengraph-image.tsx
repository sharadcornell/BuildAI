import { ImageResponse } from "next/og";

// Brand-consistent 1200×630 share card, generated at build time via next/og
// (Satori). No external font fetch — uses a heavy system sans so it always builds.
export const alt = "BuildAI — We don't teach AI. We make engineers who ship.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#E4321B",
          color: "#FFFFFF",
          padding: "72px 80px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", fontSize: 44, fontWeight: 800, letterSpacing: "-0.02em" }}>
          <span>BUILD</span>
          <span style={{ color: "#111111" }}>AI</span>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontSize: 104,
            fontWeight: 800,
            lineHeight: 1.0,
            letterSpacing: "-0.03em",
            textTransform: "uppercase",
          }}
        >
          <div style={{ display: "flex" }}>{"We don't teach AI."}</div>
          <div style={{ display: "flex" }}>{"We make engineers"}</div>
          <div style={{ display: "flex" }}>
            <span>who&nbsp;</span>
            <span style={{ color: "#FFD400" }}>ship.</span>
          </div>
        </div>

        <div style={{ display: "flex" }}>
          <div
            style={{
              display: "flex",
              backgroundColor: "#FFD400",
              color: "#111111",
              fontSize: 30,
              fontWeight: 700,
              padding: "12px 22px",
            }}
          >
            13-week AI-native product engineering apprenticeship
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}

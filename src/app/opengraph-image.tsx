import { ImageResponse } from "next/og";
import { site } from "@/data/site";

export const alt = `${site.name} — Full-Stack Developer · AI & IoT`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background:
            "radial-gradient(800px 500px at 15% 10%, rgba(0,132,255,0.35), transparent 60%), radial-gradient(700px 500px at 85% 25%, rgba(142,68,236,0.3), transparent 60%), radial-gradient(700px 500px at 50% 100%, rgba(232,70,124,0.22), transparent 60%), #0a0a0f",
          color: "#f5f5f7",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "56px 88px",
            borderRadius: 48,
            background: "rgba(30,32,44,0.55)",
            border: "1px solid rgba(255,255,255,0.16)",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.2)",
          }}
        >
          <div style={{ fontSize: 76, fontWeight: 800, letterSpacing: -3 }}>
            {site.name}
          </div>
          <div
            style={{
              marginTop: 18,
              fontSize: 34,
              color: "#9fc6ff",
              fontWeight: 600,
            }}
          >
            Full-Stack Developer · AI &amp; ML · IoT
          </div>
          <div style={{ marginTop: 26, fontSize: 24, color: "#a7a7b0" }}>
            deeghayu.netlify.app
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}

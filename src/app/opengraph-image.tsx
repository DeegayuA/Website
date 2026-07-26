import { ImageResponse } from "next/og";
import { site } from "@/data/site";

export const alt = `${site.name} — Software + Electronic Engineer`;
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
            "radial-gradient(760px 520px at 14% 8%, rgba(46,196,210,0.34), transparent 60%), radial-gradient(720px 520px at 86% 24%, rgba(110,110,246,0.30), transparent 60%), radial-gradient(680px 480px at 52% 104%, rgba(241,183,94,0.20), transparent 60%), #070b12",
          color: "#eaeff6",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "56px 92px",
            borderRadius: 48,
            background: "rgba(32,40,56,0.55)",
            border: "1px solid rgba(255,255,255,0.16)",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.2)",
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 22,
              letterSpacing: 8,
              textTransform: "uppercase",
              color: "#5fd6dc",
            }}
          >
            Portfolio
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 14,
              fontSize: 82,
              fontWeight: 800,
              letterSpacing: -3,
            }}
          >
            {site.name}
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 18,
              fontSize: 34,
              color: "#9fd0ff",
              fontWeight: 600,
            }}
          >
            Software + Electronic Engineer
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 24,
              fontSize: 23,
              color: "#93a2b5",
            }}
          >
            AI / ML · IoT & Embedded · Web · deeghayu.netlify.app
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}

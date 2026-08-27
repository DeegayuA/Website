import { ImageResponse } from "next/og";
import { site } from "@/data/site";

export const alt = `${site.name} — Software + Electronic Engineer`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Kanit 900 TTF resolved through the Google Fonts CSS API at build time.
    Fails soft — the card renders in the system font if the fetch dies. */
async function loadKanit(): Promise<ArrayBuffer | null> {
  try {
    const css = await fetch(
      "https://fonts.googleapis.com/css2?family=Kanit:wght@900&display=swap",
      // Plain UA → Google serves TTF URLs instead of woff2 (satori needs TTF/OTF)
      { headers: { "User-Agent": "Mozilla/5.0" } },
    ).then((r) => r.text());
    const url = css.match(/src: url\((.+?)\)/)?.[1];
    if (!url) return null;
    return await fetch(url).then((r) => r.arrayBuffer());
  } catch {
    return null;
  }
}

export default async function OpenGraphImage() {
  const kanit = await loadKanit();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 80px",
          background: "#0C0C0C",
          color: "#D7E2EA",
          fontFamily: kanit ? "Kanit" : "sans-serif",
        }}
      >
        {/* The site's single accent moment, echoed as a top hairline */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: 10,
            background:
              "linear-gradient(123deg, #18011F 7%, #B600A8 37%, #7621B0 72%, #BE4C00 100%)",
          }}
        />

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 24,
            letterSpacing: 6,
            textTransform: "uppercase",
            color: "#8B98A3",
          }}
        >
          <div style={{ display: "flex" }}>Portfolio</div>
          <div style={{ display: "flex" }}>deeghayu.netlify.app</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontSize: 108,
              fontWeight: 900,
              lineHeight: 1.02,
              letterSpacing: -2,
              textTransform: "uppercase",
              color: "#F2F3F5",
            }}
          >
            Deeghayu
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 108,
              fontWeight: 900,
              lineHeight: 1.02,
              letterSpacing: -2,
              textTransform: "uppercase",
              backgroundImage: "linear-gradient(123deg, #B600A8 10%, #7621B0 90%)",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            Adhikari
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 34,
              fontWeight: 900,
              textTransform: "uppercase",
              letterSpacing: 1,
              color: "#D7E2EA",
            }}
          >
            Software + Electronic Engineer
          </div>
          <div style={{ display: "flex", fontSize: 24, color: "#8B98A3" }}>
            AI / ML · IoT · Web · SCADA
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: kanit
        ? [{ name: "Kanit", data: kanit, style: "normal" as const, weight: 900 as const }]
        : undefined,
    },
  );
}

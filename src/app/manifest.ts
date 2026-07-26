import type { MetadataRoute } from "next";
import { site } from "@/data/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${site.name} — Portfolio`,
    short_name: site.name.split(" ")[0],
    description: site.tagline,
    start_url: "/",
    display: "standalone",
    background_color: "#070b12",
    theme_color: "#2eb2c4",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
  };
}

import type { MetadataRoute } from "next";
import { site } from "@/data/site";

/* Everything is public. AI crawlers are listed explicitly so the welcome is
   unambiguous — a portfolio only benefits from being read by assistants and
   answer engines. (CCBot/Bytespider fall under the * rule — also allowed.) */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      { userAgent: "GPTBot", allow: "/" },
      { userAgent: "ClaudeBot", allow: "/" },
      { userAgent: "Claude-Web", allow: "/" },
      { userAgent: "PerplexityBot", allow: "/" },
      { userAgent: "Google-Extended", allow: "/" },
    ],
    sitemap: `${site.url}/sitemap.xml`,
  };
}

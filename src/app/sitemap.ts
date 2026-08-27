import type { MetadataRoute } from "next";
import { site } from "@/data/site";
import { caseStudies } from "@/data/caseStudies";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: site.url,
      lastModified: new Date("2026-08-27"),
      changeFrequency: "monthly",
      priority: 1,
    },
    ...caseStudies.map(({ slug }) => ({
      url: `${site.url}/work/${slug}`,
      lastModified: new Date("2026-08-27"),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}

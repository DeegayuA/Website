import type { MetadataRoute } from "next";
import { site } from "@/data/site";
import { caseStudies } from "@/data/caseStudies";

/* Evaluated once per build — every deploy advertises a fresh lastmod. */
const lastModified = new Date();

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: site.url,
      lastModified,
      changeFrequency: "monthly",
      priority: 1,
    },
    ...caseStudies.map(({ slug }) => ({
      url: `${site.url}/work/${slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}

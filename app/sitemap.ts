import type { MetadataRoute } from "next";
import { resume } from "@/lib/resume-data";
import { absoluteUrl } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: absoluteUrl("/"), lastModified: new Date(), changeFrequency: "monthly", priority: 1 },
    // No lastModified: there's no honest per-case-study date to give.
    ...resume.projects.map((p) => ({ url: absoluteUrl(`/work/${p.slug}`), changeFrequency: "yearly" as const, priority: 0.8 })),
  ];
}

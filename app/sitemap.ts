import type { MetadataRoute } from "next";
import { resume } from "@/lib/resume-data";
import { absoluteUrl } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    // No lastModified anywhere: the build time isn't when the content changed, and there's no honest per-page date to give.
    { url: absoluteUrl("/"), changeFrequency: "monthly", priority: 1 },
    ...resume.projects.map((p) => ({ url: absoluteUrl(`/work/${p.slug}`), changeFrequency: "yearly" as const, priority: 0.8 })),
  ];
}

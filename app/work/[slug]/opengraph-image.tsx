import { ImageResponse } from "next/og";
import { notFound } from "next/navigation";
import { CaseStudyCard } from "@/components/og/share-cards";
import { SHARE_THEME, ogFonts, ogPalettes } from "@/lib/og";
import { resume } from "@/lib/resume-data";
import { siteConfig } from "@/lib/site-config";
import { getProject } from "@/lib/work";

export const alt = `A case study by ${siteConfig.name}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// One card per case study, built with the pages; any other slug is a 404.
export const dynamicParams = false;
export function generateStaticParams() {
  return resume.projects.map((p) => ({ slug: p.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const project = getProject((await params).slug);
  if (!project) notFound();
  return new ImageResponse(<CaseStudyCard project={project} p={ogPalettes[SHARE_THEME]} />, { ...size, fonts: await ogFonts() });
}

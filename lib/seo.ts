import type { Metadata } from "next";
import type { Project } from "@/types/resume";
import { resume } from "@/lib/resume-data";
import { siteConfig } from "@/lib/site-config";
import { skillEvidence } from "@/lib/stack";

/** An absolute URL on the site, from siteConfig.url. */
export const absoluteUrl = (path: string) => new URL(path, siteConfig.url).toString();

/** The Person node's id, so each case study's author points at the same person. */
export const PERSON_ID = absoluteUrl("/#person");

/**
 * A page's metadata: title and description, its canonical URL, and Open Graph
 * and Twitter fields to match. Next merges metadata shallowly, so a page that
 * sets openGraph replaces the layout's whole object; this builds it complete.
 * The share image comes from the route's opengraph-image file.
 */
export function pageMetadata({
  title,
  description,
  path,
  type = "website",
}: {
  title?: string;
  description: string;
  path: string;
  type?: "website" | "article";
}): Metadata {
  const shareTitle = title ? `${title} — ${siteConfig.name}` : siteConfig.title;
  return {
    ...(title ? { title } : {}),
    description,
    alternates: { canonical: path },
    openGraph: { type, url: path, title: shareTitle, description, siteName: siteConfig.name, locale: "en_US" },
    twitter: { card: "summary_large_image", title: shareTitle, description },
  };
}

/** Who the site is about, for search engines. Skills are only those the work shows (lib/stack.ts). */
export function personJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": PERSON_ID,
    name: resume.name,
    jobTitle: resume.role,
    url: absoluteUrl("/"),
    worksFor: { "@type": "Organization", name: resume.experience[0].company },
    sameAs: resume.socials.map((s) => s.href),
    knowsAbout: resume.skillGroups
      .flatMap((g) => g.skills)
      .filter((s) => skillEvidence(s))
      .map((s) => s.name),
  };
}

/** A case study as an Article by the Person. No dates: the site keeps no per-project period. */
export function articleJsonLd(project: Project) {
  const url = absoluteUrl(`/work/${project.slug}`);
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: project.headline,
    description: project.summary,
    url,
    mainEntityOfPage: url,
    image: absoluteUrl(`/work/${project.slug}/opengraph-image`),
    author: { "@type": "Person", "@id": PERSON_ID, name: resume.name, url: absoluteUrl("/") },
  };
}

/** JSON for a <script type="application/ld+json">, with "<" escaped so no string can close the tag (Next's JSON-LD guide). */
export const jsonLdHtml = (data: object) => JSON.stringify(data).replace(/</g, "\\u003c");

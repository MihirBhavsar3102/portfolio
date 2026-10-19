import type { Metadata } from "next";
import type { Project } from "@/types/resume";
import { certIssuers, resume } from "@/lib/resume-data";
import { siteConfig } from "@/lib/site-config";
import { skillEvidence } from "@/lib/stack";

/** An absolute URL on the site, from siteConfig.url. */
export const absoluteUrl = (path: string) => new URL(path, siteConfig.url).toString();

/** Node ids, so every page's structured data points at the same person and the same site. */
export const PERSON_ID = absoluteUrl("/#person");
export const WEBSITE_ID = absoluteUrl("/#website");

/**
 * A page's metadata: title and description, its canonical URL, indexing, and
 * Open Graph and Twitter fields to match. Next merges metadata shallowly, so a
 * page that sets openGraph replaces the layout's whole object; this builds it
 * complete. The share image comes from the route's opengraph-image file.
 * Robots lives here, not in the layout, so the 404 keeps Next's lone noindex.
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
    // Google may show the share card large and quote as much text as it likes.
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
    openGraph: { type, url: path, title: shareTitle, description, siteName: siteConfig.name, locale: "en_US" },
    twitter: { card: "summary_large_image", title: shareTitle, description },
  };
}

/**
 * Who the site is about, for search engines. Every field comes from
 * resume-data and is shown on the site; skills are only those the work shows
 * (lib/stack.ts). No contact details, and no photo: the site has none.
 */
export function personJsonLd() {
  const [givenName, ...family] = resume.name.split(" ");
  const [locality, country] = resume.location.split(", ");
  return {
    "@type": "Person",
    "@id": PERSON_ID,
    name: resume.name,
    givenName,
    familyName: family.join(" "),
    jobTitle: resume.role,
    description: siteConfig.description,
    url: absoluteUrl("/"),
    address: { "@type": "PostalAddress", addressLocality: locality, addressCountry: country },
    worksFor: { "@type": "Organization", name: resume.experience[0].company },
    alumniOf: resume.education.map((e) => ({ "@type": "CollegeOrUniversity", name: e.institution })),
    hasCredential: resume.certifications.map((c) => ({
      "@type": "EducationalOccupationalCredential",
      name: c.name,
      credentialCategory: "certification",
      recognizedBy: { "@type": "Organization", name: certIssuers[c.issuerId] },
      ...(c.verifyUrl ? { url: c.verifyUrl } : {}),
    })),
    sameAs: resume.socials.map((s) => s.href),
    knowsAbout: resume.skillGroups
      .flatMap((g) => g.skills)
      .filter((s) => skillEvidence(s))
      .map((s) => s.name),
  };
}

/**
 * The home page's graph: the site (whose name Google can show as the site
 * name in results), and the page itself as a profile page about the person.
 */
export function homeJsonLd() {
  const home = absoluteUrl("/");
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": WEBSITE_ID,
        url: home,
        name: siteConfig.name,
        description: siteConfig.description,
        inLanguage: "en",
        publisher: { "@id": PERSON_ID },
      },
      {
        "@type": "ProfilePage",
        "@id": absoluteUrl("/#profile"),
        url: home,
        name: siteConfig.title,
        isPartOf: { "@id": WEBSITE_ID },
        mainEntity: personJsonLd(),
      },
    ],
  };
}

/** A case study as an Article by the Person, on the site. No dates: the site keeps no per-project period. */
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
    isPartOf: { "@id": WEBSITE_ID },
  };
}

/** JSON for a <script type="application/ld+json">, with "<" escaped so no string can close the tag (Next's JSON-LD guide). */
export const jsonLdHtml = (data: object) => JSON.stringify(data).replace(/</g, "\\u003c");

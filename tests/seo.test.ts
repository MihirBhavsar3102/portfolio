import { describe, expect, it } from "vitest";
import { certIssuers, resume } from "@/lib/resume-data";
import { siteConfig } from "@/lib/site-config";
import { skillEvidence } from "@/lib/stack";
import { PERSON_ID, WEBSITE_ID, absoluteUrl, articleJsonLd, homeJsonLd, jsonLdHtml, pageMetadata, personJsonLd } from "@/lib/seo";
import sitemap from "@/app/sitemap";

describe("site title and description", () => {
  it("lead with the full name, which a name search matches and bolds", () => {
    expect(siteConfig.title.startsWith(resume.name)).toBe(true);
    expect(siteConfig.description.toLowerCase().startsWith(`${resume.name} is a ${resume.role}`.toLowerCase())).toBe(true);
  });

  it("keep the description short enough not to be cut in results", () => {
    expect(siteConfig.description.length).toBeLessThanOrEqual(160);
  });
});

describe("pageMetadata", () => {
  it("gives a case study its own canonical URL and a complete share block", () => {
    const m = pageMetadata({ title: "A headline", description: "A summary.", path: "/work/x", type: "article" });
    expect(m.title).toBe("A headline");
    expect(m.alternates?.canonical).toBe("/work/x");
    // Metadata merges shallowly: openGraph must carry the site-wide fields itself.
    expect(m.openGraph).toMatchObject({
      type: "article",
      url: "/work/x",
      title: `A headline — ${siteConfig.name}`,
      description: "A summary.",
      siteName: siteConfig.name,
      locale: "en_US",
    });
    expect(m.twitter).toMatchObject({ card: "summary_large_image", title: `A headline — ${siteConfig.name}` });
  });

  it("leaves the home title to the layout and shares the site title", () => {
    const m = pageMetadata({ description: siteConfig.description, path: "/" });
    expect(m.title).toBeUndefined();
    expect(m.openGraph).toMatchObject({ type: "website", title: siteConfig.title });
  });

  it("lets search engines index the page and show its card large", () => {
    const m = pageMetadata({ description: "A summary.", path: "/" });
    expect(m.robots).toMatchObject({ index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large" } });
  });
});

describe("homeJsonLd", () => {
  const graph = homeJsonLd();
  const byType = (t: string) => graph["@graph"].find((n) => n["@type"] === t);

  it("describes the site, named for the person, and the home page as their profile", () => {
    expect(graph["@context"]).toBe("https://schema.org");
    expect(byType("WebSite")).toMatchObject({ "@id": WEBSITE_ID, url: absoluteUrl("/"), name: resume.name, publisher: { "@id": PERSON_ID } });
    expect(byType("ProfilePage")).toMatchObject({ url: absoluteUrl("/"), isPartOf: { "@id": WEBSITE_ID }, mainEntity: { "@type": "Person", "@id": PERSON_ID } });
  });
});

describe("personJsonLd", () => {
  const p = personJsonLd();
  it("names the person, the role, the city and the employer", () => {
    expect(p).toMatchObject({ "@type": "Person", "@id": PERSON_ID, name: resume.name, givenName: "Mihir", familyName: "Bhavsar", jobTitle: resume.role });
    expect(p.address).toEqual({ "@type": "PostalAddress", addressLocality: "Ahmedabad", addressCountry: "India" });
    expect(p.worksFor).toEqual({ "@type": "Organization", name: "Parkar Global Technologies" });
    expect(p.sameAs).toEqual(resume.socials.map((s) => s.href));
  });

  it("lists the education and certifications the site shows, with their proof links", () => {
    expect(p.alumniOf.map((a) => a.name)).toEqual(resume.education.map((e) => e.institution));
    expect(p.hasCredential).toHaveLength(resume.certifications.length);
    resume.certifications.forEach((c, i) => {
      expect(p.hasCredential[i]).toMatchObject({ name: c.name, recognizedBy: { name: certIssuers[c.issuerId] } });
      expect(p.hasCredential[i].url).toBe(c.verifyUrl);
    });
  });

  it("claims only the skills the work shows", () => {
    const evidenced = resume.skillGroups.flatMap((g) => g.skills).filter((s) => skillEvidence(s)).map((s) => s.name);
    expect(p.knowsAbout).toEqual(evidenced);
    expect(p.knowsAbout).toContain("Terraform");
  });

  it("never carries contact details or a photo", () => {
    const json = JSON.stringify(homeJsonLd());
    expect(json).not.toContain("@gmail");
    expect(json).not.toContain("mailto:");
    for (const field of ["email", "telephone", "image"]) expect(p).not.toHaveProperty(field);
  });
});

describe("articleJsonLd", () => {
  it.each(resume.projects.map((p) => [p.slug, p] as const))("%s: headline, absolute URL and card, by the person, on the site", (slug, project) => {
    const a = articleJsonLd(project);
    expect(a).toMatchObject({
      "@type": "Article",
      headline: project.headline,
      description: project.summary,
      url: absoluteUrl(`/work/${slug}`),
      mainEntityOfPage: absoluteUrl(`/work/${slug}`),
      image: absoluteUrl(`/work/${slug}/opengraph-image`),
      isPartOf: { "@id": WEBSITE_ID },
    });
    expect(a.author).toMatchObject({ "@type": "Person", "@id": PERSON_ID, name: resume.name });
  });
});

describe("jsonLdHtml", () => {
  it("escapes < so no string can close the script tag", () => {
    const html = jsonLdHtml({ name: "</script><script>alert(1)</script>" });
    expect(html).not.toContain("</script>");
    expect(JSON.parse(html)).toEqual({ name: "</script><script>alert(1)</script>" });
  });
});

describe("sitemap", () => {
  it("lists home and every case study as absolute URLs", () => {
    const urls = sitemap().map((e) => e.url);
    expect(urls).toEqual([absoluteUrl("/"), ...resume.projects.map((p) => absoluteUrl(`/work/${p.slug}`))]);
  });

  it("claims no modification dates: a build time is not when the content changed", () => {
    for (const entry of sitemap()) expect(entry.lastModified, entry.url).toBeUndefined();
  });
});

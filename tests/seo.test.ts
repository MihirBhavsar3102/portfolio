import { describe, expect, it } from "vitest";
import { resume } from "@/lib/resume-data";
import { siteConfig } from "@/lib/site-config";
import { skillEvidence } from "@/lib/stack";
import { PERSON_ID, absoluteUrl, articleJsonLd, jsonLdHtml, pageMetadata, personJsonLd } from "@/lib/seo";
import sitemap from "@/app/sitemap";

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
});

describe("personJsonLd", () => {
  const p = personJsonLd();
  it("names the person, the role and the employer", () => {
    expect(p).toMatchObject({ "@context": "https://schema.org", "@type": "Person", "@id": PERSON_ID, name: resume.name, jobTitle: resume.role });
    expect(p.worksFor).toEqual({ "@type": "Organization", name: "Parkar Global Technologies" });
    expect(p.sameAs).toEqual(resume.socials.map((s) => s.href));
  });

  it("claims only the skills the work shows", () => {
    const evidenced = resume.skillGroups.flatMap((g) => g.skills).filter((s) => skillEvidence(s)).map((s) => s.name);
    expect(p.knowsAbout).toEqual(evidenced);
    expect(p.knowsAbout).toContain("Terraform");
  });

  it("never carries contact details", () => {
    expect(JSON.stringify(p)).not.toContain("@gmail");
    expect(p).not.toHaveProperty("telephone");
  });
});

describe("articleJsonLd", () => {
  it.each(resume.projects.map((p) => [p.slug, p] as const))("%s: headline, absolute URL and card, by the person", (slug, project) => {
    const a = articleJsonLd(project);
    expect(a).toMatchObject({
      "@type": "Article",
      headline: project.headline,
      description: project.summary,
      url: absoluteUrl(`/work/${slug}`),
      mainEntityOfPage: absoluteUrl(`/work/${slug}`),
      image: absoluteUrl(`/work/${slug}/opengraph-image`),
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
});

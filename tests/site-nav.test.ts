import { describe, expect, it, vi } from "vitest";
import { createElement } from "react";
import { resume } from "@/lib/resume-data";
import { htmlOf } from "./render";

const route = vi.hoisted(() => ({ pathname: "/" }));
vi.mock("next/navigation", () => ({ usePathname: () => route.pathname }));

const { SiteNav } = await import("@/components/site/site-nav");

const navAt = (pathname: string) => {
  route.pathname = pathname;
  return htmlOf(createElement(SiteNav));
};
const homeLink = (html: string) => html.match(/<a[^>]*href="\/"[^>]*>.*?<\/a>/)?.[0] ?? "";

describe("the nav's home link", () => {
  it("is named by what it shows, the monogram and then the full name, with no aria-label to drift from it (WCAG 2.5.3)", () => {
    const link = homeLink(navAt("/"));
    expect(link).not.toContain("aria-label=");
    expect(link).not.toContain('aria-hidden="true"');
    expect(link).toMatch(/>MB<\/span>/);
    expect(link).toContain(`>${resume.name}</span>`);
  });

  it("keeps the name for screen readers on the narrowest phones, where it doesn't fit beside the Resume link", () => {
    expect(homeLink(navAt("/work/avd-automation"))).toContain("max-[359px]:sr-only");
  });

  it("holds the name back on the home page, where the hero already says it", () => {
    expect(homeLink(navAt("/"))).not.toMatch(/ data-shown="/);
  });

  it("shows the name on every other page", () => {
    expect(homeLink(navAt("/work/avd-automation"))).toMatch(/ data-shown="/);
  });
});

describe("the nav's resume link", () => {
  it("is one tap away on phones too, not only from md up", () => {
    const link = navAt("/").match(/<a[^>]*href="\/MihirBhavsar_Resume\.pdf"[^>]*>/)?.[0] ?? "";
    expect(link).toContain("download");
    expect(link).not.toMatch(/class="[^"]*(?<![\w:-])hidden\b/);
  });
});

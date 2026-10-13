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
  it("is a monogram, named for screen readers by the full name", () => {
    const link = homeLink(navAt("/"));
    expect(link).toContain(`aria-label="${resume.name}"`);
    expect(link).toMatch(/>MB<\/span>/);
  });

  it("holds the name back on the home page, where the hero already says it", () => {
    expect(homeLink(navAt("/"))).not.toMatch(/ data-shown="/);
  });

  it("shows the name on every other page", () => {
    expect(homeLink(navAt("/work/avd-automation"))).toMatch(/ data-shown="/);
  });
});

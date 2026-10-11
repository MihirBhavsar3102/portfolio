import { describe, expect, it } from "vitest";
import { createElement } from "react";
import { resume } from "@/lib/resume-data";
import { SelectedWork } from "@/components/sections/selected-work";
import { Experience } from "@/components/sections/experience";
import { htmlOf, textOf } from "./render";

describe("SelectedWork", () => {
  const html = htmlOf(createElement(SelectedWork));
  const text = textOf(createElement(SelectedWork));

  it("is the #work section with a card per case study, each linking to its page", () => {
    expect(html).toContain('id="work"');
    for (const p of resume.projects) expect(html).toContain(`href="/work/${p.slug}"`);
  });

  it("leads each card with its first figure and provenance, or its stages without one", () => {
    for (const p of resume.projects) {
      const lead = p.figures[0];
      if (lead) {
        expect(text, p.slug).toContain(lead.value);
        expect(text, p.slug).toContain(lead.provenance);
      } else for (const s of p.stages ?? []) expect(text, p.slug).toContain(s);
    }
  });

  it("opens repo links in a new tab, safely", () => {
    for (const p of resume.projects.filter((x) => x.repo))
      expect(html).toContain(`href="https://github.com/${p.repo!.owner}/${p.repo!.name}" target="_blank" rel="noopener noreferrer"`);
  });
});

describe("Experience", () => {
  const html = htmlOf(createElement(Experience));
  const text = textOf(createElement(Experience));

  it("prints the legal employer name exactly once", () => {
    expect(text.split("Parkar Global Technologies Pvt Ltd").length - 1).toBe(1);
  });

  it("links each workstream's case study, and the HR assistant no workstream covers", () => {
    for (const slug of ["avd-automation", "aws-web-platform", "hr-policy-assistant"]) expect(html).toContain(`href="/work/${slug}"`);
  });

  it("shows the period, never a duration", () => {
    expect(text).toContain("Dec 2024 – present");
    expect(text).not.toMatch(/\d+ (years?|months?)/);
  });
});

import { describe, expect, it } from "vitest";
import { createElement } from "react";
import { resume } from "@/lib/resume-data";
import { SelectedWork } from "@/components/sections/selected-work";
import { Experience } from "@/components/sections/experience";
import { Stack } from "@/components/sections/stack";
import { Credentials } from "@/components/sections/credentials";
import { monthYear } from "@/lib/format";
import { evidenceLabel, skillEvidence } from "@/lib/stack";
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

describe("Stack", () => {
  const html = htmlOf(createElement(Stack));
  const text = textOf(createElement(Stack));
  const skills = resume.skillGroups.flatMap((g) => g.skills);

  it("is the #stack section with every group and skill", () => {
    expect(html).toContain('id="stack"');
    for (const g of resume.skillGroups) expect(text).toContain(g.name);
    for (const s of skills) expect(text, s.name).toContain(s.name);
  });

  it("names both markers in a key", () => {
    expect(text).toContain(evidenceLabel.work);
    expect(text).toContain(evidenceLabel.project);
  });

  it("marks each skill as derived, for sighted and screen-reader users alike", () => {
    for (const e of ["work", "project"] as const) {
      const n = skills.filter((s) => skillEvidence(s) === e).length;
      expect(html.split(`data-evidence="${e}"`).length - 1, e).toBe(n);
      expect(text.split(`(${evidenceLabel[e]})`).length - 1, e).toBe(n);
    }
  });
});

describe("Credentials", () => {
  const html = htmlOf(createElement(Credentials));
  const text = textOf(createElement(Credentials));

  it("is #credentials with each certification's name, code, issuer and month", () => {
    expect(html).toContain('id="credentials"');
    for (const c of resume.certifications) {
      expect(text).toContain(c.name);
      if (c.code) expect(text).toContain(c.code);
      if (c.earned) expect(text).toContain(monthYear(c.earned));
    }
    for (const issuer of ["Amazon Web Services", "Microsoft", "Google Cloud"]) expect(text).toContain(issuer);
  });

  it("links each verification safely in a new tab, and omits the link where there is none", () => {
    const withUrl = resume.certifications.filter((c) => c.verifyUrl);
    for (const c of withUrl) expect(html).toContain(`href="${c.verifyUrl}" target="_blank" rel="noopener noreferrer"`);
    expect(text.split("Verify").length - 1).toBe(withUrl.length);
  });

  it("lists education and the NCC letter", () => {
    for (const e of resume.education) for (const v of [e.degree, e.institution, e.years, e.score]) expect(text).toContain(v);
    for (const a of resume.achievements) expect(text).toContain(a.detail);
  });
});

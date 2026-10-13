import { describe, expect, it } from "vitest";
import { createElement } from "react";
import { existsSync } from "node:fs";
import { resume } from "@/lib/resume-data";
import { SHARE_THEME, ogPalettes } from "@/lib/og";
import { shortClaim } from "@/lib/format";
import { zoneLabel } from "@/lib/work";
import { CaseStudyCard, HomeCard } from "@/components/og/share-cards";
import { themeTokens } from "./contrast";
import { textOf } from "./render";

describe("share-card palette", () => {
  const css = themeTokens();
  const names = { canvas: "canvas", line: "line", ink: "ink", ink2: "ink-2", ink3: "ink-3", accent: "accent", azure: "cloud-azure", aws: "cloud-aws", ai: "cloud-ai" } as const;
  it.each(["light", "dark"] as const)("mirrors the %s theme tokens in globals.css", (theme) => {
    for (const [key, token] of Object.entries(names)) expect(ogPalettes[theme][key as keyof typeof names], token).toBe(css[theme][token]);
  });
  it("ships the dark card", () => expect(SHARE_THEME).toBe("dark"));
});

describe("share-card fonts", () => {
  it("are static TTFs with their licence", () => {
    for (const f of ["SchibstedGrotesk-Medium.ttf", "SchibstedGrotesk-Bold.ttf", "OFL.txt"]) expect(existsSync(`assets/fonts/${f}`), f).toBe(true);
  });
});

describe("HomeCard", () => {
  const text = textOf(createElement(HomeCard, { p: ogPalettes.dark }));
  it("shows the name, the role and where, and three figures with their claims", () => {
    expect(text).toContain(resume.name);
    expect(text).toContain(`${resume.role} · ${resume.location}`);
    for (const id of ["manual", "spend", "uptime"]) {
      const f = resume.estate.proof.find((p) => p.id === id)!.figure;
      expect(text).toContain(f.value);
      expect(text).toContain(shortClaim(f.label));
    }
  });
});

describe("CaseStudyCard", () => {
  it.each(resume.projects.map((p) => [p.slug, p] as const))("%s: where it ran, the headline and its lead result", (_, project) => {
    const text = textOf(createElement(CaseStudyCard, { project, p: ogPalettes.dark }));
    expect(text).toContain(zoneLabel(project));
    expect(text).toContain(project.headline);
    expect(text).toContain(resume.name);
    const lead = project.figures[0];
    if (lead) expect(text).toContain(lead.value);
    else for (const s of project.stages ?? []) expect(text).toContain(s);
  });
});

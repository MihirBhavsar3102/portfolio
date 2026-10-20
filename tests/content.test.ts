import { describe, expect, it } from "vitest";
import { resume } from "@/lib/resume-data";
import { positioningLine } from "@/lib/format";
import { tech } from "@/lib/tech";
import { diagrams } from "@/content/work/diagrams";
import { listSourceFiles, readSource } from "./source-files";

const { estate } = resume;
const zoneIds = new Set(estate.zones.map((z) => z.id));
const nodeZone = new Map<string, string>();
estate.zones.forEach((z) => z.nodes.forEach((n) => nodeZone.set(n.id, z.id)));
const controlIds = new Set(estate.controlPlane.flatMap((l) => l.nodes.map((n) => n.id)));
const known = (id: string) => zoneIds.has(id as never) || nodeZone.has(id) || controlIds.has(id);
const allFigures = [...estate.proof.map((p) => p.figure), ...resume.projects.flatMap((p) => p.figures)];

describe("estate", () => {
  it("has unique ids across zones, nodes and control tools", () => {
    const ids = [
      ...estate.zones.map((z) => z.id),
      ...estate.zones.flatMap((z) => z.nodes.map((n) => n.id)),
      ...controlIds,
    ];
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("resolves every edge endpoint and cites a source for every edge", () => {
    for (const e of estate.edges) {
      expect(known(e.from), e.from).toBe(true);
      expect(known(e.to), e.to).toBe(true);
      expect(e.source.trim()).not.toBe("");
    }
  });

  it("never joins two different workload zones", () => {
    const workload = (id: string) => nodeZone.get(id) ?? (zoneIds.has(id as never) ? id : undefined);
    for (const e of estate.edges) {
      const a = workload(e.from);
      const b = workload(e.to);
      if (a && b) expect(a, `${e.from}->${e.to}`).toBe(b);
    }
  });

  it("draws exactly the three workloads, each with a plain-text note", () => {
    expect(estate.zones.map((z) => z.id)).toEqual(["azure", "aws", "ai"]);
    for (const z of estate.zones) expect(z.note?.trim(), z.id).toBeTruthy();
  });

  it("carries the client scale on the Azure zone, matching the resume", () => {
    expect(estate.zones.find((z) => z.id === "azure")?.note).toBe("5 clients · 450+ concurrent users");
  });

  it("resolves every proof highlight", () => {
    for (const p of estate.proof) for (const id of p.highlight) expect(known(id), id).toBe(true);
  });

  it("covers the Azure, AWS and AI zones in the proof strip", () => {
    const lit = new Set(estate.proof.flatMap((p) => p.highlight.map((id) => nodeZone.get(id))));
    for (const zone of ["azure", "aws", "ai"]) expect(lit.has(zone), zone).toBe(true);
  });
});

describe("figures", () => {
  it("each carries a provenance sentence", () => {
    for (const f of allFigures) expect(f.provenance.trim().length, f.value).toBeGreaterThan(20);
  });
});

describe("projects", () => {
  it("have unique slugs", () => {
    const slugs = resume.projects.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("show a figure or stages on every card", () => {
    for (const p of resume.projects) expect(p.figures.length + (p.stages?.length ?? 0), p.slug).toBeGreaterThan(0);
  });

  it("name the zone each work project ran in, and none for a personal project", () => {
    for (const p of resume.projects) {
      if (p.kind === "work") expect(zoneIds.has(p.zone as never), p.slug).toBe(true);
      else expect(p.zone, p.slug).toBeUndefined();
    }
  });

  it("link workstreams only to existing case studies", () => {
    const slugs = new Set(resume.projects.map((p) => p.slug));
    for (const w of resume.experience.flatMap((r) => r.workstreams)) {
      if (w.caseStudy) expect(slugs.has(w.caseStudy), w.caseStudy).toBe(true);
    }
  });

  it("link neither unlisted repo: one held employer documents, the other didn't match its case study (2026-10-21)", () => {
    const unlisted = ["Rag-Assistant-Chatbot", "Automatic-Deployment"];
    const hits = [...listSourceFiles(["lib", "components", "app", "content"]), "README.md"].flatMap((f) =>
      unlisted.filter((name) => readSource(f).includes(name)).map((name) => `${f}: ${name}`),
    );
    expect(hits).toEqual([]);
  });

  it("keep every experience line crisp: at most 20 words, opening with its bold result", () => {
    const points = resume.experience.flatMap((r) => r.workstreams.flatMap((w) => w.points));
    expect(points.length).toBeGreaterThan(0);
    for (const p of points) {
      expect(p.text.split(/\s+/).length, p.text).toBeLessThanOrEqual(20);
      if (p.lead) expect(p.text.startsWith(p.lead), p.text).toBe(true);
    }
  });
});

describe("profile", () => {
  it("keeps the positioning line crisp: one sentence of at most 15 words", () => {
    const line = positioningLine(resume.positioning);
    expect(line.split(/\s+/).length).toBeLessThanOrEqual(15);
    expect(line).toMatch(/^[^.]+\.$/);
  });

  it("strips tracking and share parameters from verification links", () => {
    for (const c of resume.certifications) if (c.verifyUrl) expect(c.verifyUrl).not.toMatch(/[?&](ref|utm_|usp)/);
  });

  it("links every certification to its proof", () => {
    for (const c of resume.certifications) expect(c.verifyUrl, c.name).toMatch(/^https:[/][/]/);
  });

  it("names the employer as decided", () => {
    for (const r of resume.experience) {
      expect(r.company).toBe("Parkar Global Technologies");
      expect(r.legalName).toBe("Parkar Global Technologies Pvt Ltd");
    }
  });
});

/** The resume PDF is the source of truth (Mihir, 2026-10-21): where the site said otherwise, it now says what the PDF says. */
describe("agrees with the resume PDF", () => {
  const proof = (id: string) => estate.proof.find((p) => p.id === id)!;
  const workstream = (name: string) => resume.experience[0].workstreams.find((w) => w.name === name)!;

  it("credits the 25% saving to AWS alone, from right-sizing and auto-scaling", () => {
    expect(proof("spend").figure.label).toBe("lower monthly AWS spend");
    expect(proof("spend").highlight).toEqual(["asg"]);
    expect(workstream("AWS environments").points.map((p) => p.lead)).toContain("25% lower monthly AWS spend");
    expect(workstream("Azure Virtual Desktop").points.some((p) => p.text.includes("25%"))).toBe(false);
    expect(resume.projects.find((p) => p.slug === "avd-automation")!.figures.map((f) => f.value)).not.toContain("25%");
  });

  it("credits the 40% faster AVD deployments to Terraform onboarding and Image Builder golden images", () => {
    const { figure, highlight } = proof("deploy");
    expect(figure.provenance).toMatch(/Terraform/);
    expect(figure.provenance).toMatch(/Image Builder/);
    expect(figure.provenance).not.toMatch(/PowerShell/);
    expect(highlight).toContain("terraform");
    expect(highlight).not.toContain("powershell");
  });

  it("notes that the role began as an internship, December 2024 to April 2025", () => {
    expect(resume.experience[0].start).toBe("2024-12");
    expect(resume.experience[0].internUntil).toBe("2025-04");
  });

  it("says the HR assistant shipped as an internal tool, replacing manual lookups and keyword search", () => {
    const { figure } = proof("answers");
    expect(figure.label).toBe("faster HR policy query resolution");
    expect(figure.provenance).toMatch(/internal tool/);
    expect(figure.provenance).toMatch(/keyword search/);
  });

  it("names no Lambda, which the PDF doesn't list, in the map, the stacks, the skills or the diagrams", () => {
    expect("lambda" in tech).toBe(false);
    const named = [
      ...estate.zones.flatMap((z) => z.nodes.map((n) => n.label)),
      ...resume.projects.flatMap((p) => p.stack as string[]),
      ...resume.skillGroups.flatMap((g) => g.skills.map((k) => `${k.name} ${k.detail ?? ""}`)),
      ...resume.experience.flatMap((r) => r.workstreams.flatMap((w) => w.points.map((p) => p.text))),
      ...Object.values(diagrams).flatMap((d) => d.nodes.map((n) => n.label)),
    ];
    expect(named.filter((t) => /lambda/i.test(t))).toEqual([]);
  });

  it("lists Code Vimarsh beside the NCC letter", () => {
    const vimarsh = resume.achievements.find((a) => a.title.includes("Code Vimarsh"));
    expect(vimarsh?.detail).toMatch(/300\+ students/);
  });
});

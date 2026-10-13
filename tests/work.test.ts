import { describe, expect, it } from "vitest";
import type { Project, Role } from "@/types/resume";
import { getProject, pagerFor, repoUrl, unlinkedWorkProjects, whereLabel, zoneLabel } from "@/lib/work";

const make = (slug: string, kind: Project["kind"] = "work"): Project => ({
  slug,
  title: slug,
  headline: slug,
  summary: "s",
  kind,
  role: "r",
  stack: [],
  figures: [],
});
const projects = [make("a"), make("b"), make("c", "personal")];

describe("getProject", () => {
  it("finds a project by slug", () => expect(getProject("b", projects)).toBe(projects[1]));
  it("is undefined for an unknown slug", () => expect(getProject("zzz", projects)).toBeUndefined());
});

describe("pagerFor", () => {
  it("gives the first only a next", () => expect(pagerFor("a", projects)).toEqual({ next: projects[1] }));
  it("gives a middle one both", () => expect(pagerFor("b", projects)).toEqual({ prev: projects[0], next: projects[2] }));
  it("gives the last only a previous", () => expect(pagerFor("c", projects)).toEqual({ prev: projects[1] }));
  it("is empty for an unknown slug", () => expect(pagerFor("zzz", projects)).toEqual({}));
});

describe("whereLabel", () => {
  it("names the employer for work", () => expect(whereLabel(projects[0], "Acme")).toBe("Acme"));
  it("says personal project otherwise", () => expect(whereLabel(projects[2], "Acme")).toBe("Personal project"));
});

describe("repoUrl", () => {
  it("points at the GitHub repo", () =>
    expect(repoUrl({ owner: "o", name: "n" })).toBe("https://github.com/o/n"));
});

describe("zoneLabel", () => {
  it("names the cloud a work project ran on, and a personal project as one", () => {
    expect(zoneLabel({ ...make("a"), zone: "azure" })).toBe("Azure");
    expect(zoneLabel({ ...make("b"), zone: "aws" })).toBe("AWS");
    expect(zoneLabel({ ...make("c"), zone: "ai" })).toBe("Applied AI");
    expect(zoneLabel(make("d", "personal"))).toBe("Personal project");
  });
});

describe("unlinkedWorkProjects", () => {
  const role: Role = {
    title: "t",
    company: "c",
    legalName: "c Ltd",
    location: "l",
    start: "2024-12",
    workstreams: [{ name: "w", summary: "s", points: [], caseStudy: "a" }],
  };

  it("lists work projects no workstream links to, never personal ones", () =>
    expect(unlinkedWorkProjects(projects, [role]).map((p) => p.slug)).toEqual(["b"]));

  it("finds the HR assistant in the real data", () =>
    expect(unlinkedWorkProjects().map((p) => p.slug)).toEqual(["hr-policy-assistant"]));
});

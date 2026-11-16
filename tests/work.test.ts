import { describe, expect, it } from "vitest";
import type { Project, Role } from "@/types/resume";
import {
  cardAnchor,
  getProject,
  groupProjects,
  pagerFor,
  placeLabel,
  repoUrl,
  rowStat,
  unlinkedWorkProjects,
  whereLabel,
  zoneLabel,
} from "@/lib/work";

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

  it("names the cloud a personal project ran on after saying it is personal", () => {
    expect(zoneLabel({ ...make("p", "personal"), zone: "aws" })).toBe("Personal project · AWS");
    expect(zoneLabel(make("d", "personal"))).toBe("Personal project");
    expect(zoneLabel({ ...make("a"), zone: "ai" })).toBe("Applied AI");
  });
});

describe("placeLabel", () => {
  it("is the zone's short name, else where it ran, else Personal", () => {
    expect(placeLabel({ ...make("a"), zone: "ai" })).toBe("AI");
    expect(placeLabel({ ...make("b", "personal"), zone: "aws" })).toBe("AWS");
    expect(placeLabel({ ...make("c", "personal"), ranOn: "Kubernetes" })).toBe("Kubernetes");
    expect(placeLabel(make("d", "personal"))).toBe("Personal");
  });
});

describe("rowStat", () => {
  const f = { value: "99.9%", label: "l", provenance: "p" };
  it("is the lead figure's value, else the highlight's, else nothing", () => {
    expect(rowStat({ ...make("a"), figures: [f], highlight: { value: "x", label: "y" } })).toBe("99.9%");
    expect(rowStat({ ...make("b"), highlight: { value: "3 gates", label: "y" } })).toBe("3 gates");
    expect(rowStat(make("c"))).toBeUndefined();
  });
});

describe("groupProjects", () => {
  it("groups work under the employer and personal projects after, in data order, dropping an empty group", () => {
    expect(groupProjects(projects, "Acme")).toEqual([
      { label: "At Acme", projects: [projects[0], projects[1]] },
      { label: "Personal projects", projects: [projects[2]] },
    ]);
    expect(groupProjects([projects[2]], "Acme").map((g) => g.label)).toEqual(["Personal projects"]);
  });
});

describe("cardAnchor", () => {
  it("is the id a card's anchor carries", () => expect(cardAnchor("x-y")).toBe("work-x-y"));
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

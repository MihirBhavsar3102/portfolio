import { describe, expect, it } from "vitest";
import type { Project, Role, Skill } from "@/types/resume";
import { resume } from "@/lib/resume-data";
import { mentions, skillEvidence } from "@/lib/stack";

const project = (kind: Project["kind"], stack: Project["stack"]): Project => ({
  slug: `${kind}-x`,
  title: "x",
  headline: "x",
  summary: "x",
  kind,
  role: "x",
  stack,
  figures: [],
});
const role = (points: string[]): Role => ({
  title: "x",
  company: "x",
  legalName: "x",
  location: "x",
  start: "2024-12",
  workstreams: [{ name: "Stream", summary: "x", points }],
});

describe("mentions", () => {
  it("matches whole words, ignoring case", () => {
    expect(mentions("User and SSH access", "ssh")).toBe(true);
    expect(mentions("AWS environments", "AWS")).toBe(true);
  });

  it("never matches inside a longer word", () => {
    expect(mentions("Terraform, Ansible and GitHub Actions", "Git")).toBe(false);
    expect(mentions("PostgreSQL", "SQL")).toBe(false);
  });

  it("reads symbols in a name literally", () => {
    expect(mentions("TLS/SSL termination", "TLS/SSL")).toBe(true);
    expect(mentions("TLSxSSL", "TLS/SSL")).toBe(false);
  });
});

describe("skillEvidence", () => {
  const docker: Skill = { name: "Docker", tech: "docker" };

  it("is 'project' when only a personal project's stack has the skill", () => {
    expect(skillEvidence(docker, [project("personal", ["docker"])], [])).toBe("project");
  });

  it("is 'work' as soon as a work project's stack has it", () => {
    expect(skillEvidence(docker, [project("personal", ["docker"]), project("work", ["docker"])], [])).toBe("work");
  });

  it("is 'work' when a workstream names it, with no stack entry", () => {
    expect(skillEvidence({ name: "SSH" }, [], [role(["User and SSH access."])])).toBe("work");
  });

  it("is unmarked when nothing in the work shows it", () => {
    expect(skillEvidence({ name: "Helm" }, [project("work", ["docker"])], [role(["Docker builds."])])).toBeUndefined();
  });
});

describe("stack evidence in the site data", () => {
  const marked = (e: string) =>
    resume.skillGroups
      .flatMap((g) => g.skills)
      .filter((s) => skillEvidence(s) === e)
      .map((s) => s.name)
      .sort();

  it("marks at work exactly what a work project or workstream shows", () => {
    expect(marked("work")).toEqual(
      [
        "AWS",
        "Ansible",
        "Azure",
        "Azure DevOps",
        "Azure Monitor",
        "CloudWatch",
        "GitHub Actions",
        "Grafana",
        "LangChain",
        "Linux administration",
        "PowerShell",
        "Prometheus",
        "Python",
        "SSH",
        "Terraform",
      ].sort(),
    );
  });

  it("marks the personal pipeline's tools as project work", () => {
    expect(marked("project")).toEqual(["Docker", "Jenkins", "Kubernetes"]);
  });

  it("keeps the resume's nine groups", () => {
    expect(resume.skillGroups).toHaveLength(9);
  });
});

import { describe, expect, it } from "vitest";
import { createElement } from "react";
import { resume } from "@/lib/resume-data";
import { getProject } from "@/lib/work";
import { TechMark } from "@/components/ui/tech-mark";
import { Ownership } from "@/components/work/ownership";
import { Pager } from "@/components/work/pager";
import { CaseStudyHeader } from "@/components/work/case-study-header";
import { CaseStudyFacts } from "@/components/work/case-study-facts";
import { htmlOf, textOf } from "./render";

const [first, second, third] = resume.projects;
const last = resume.projects[resume.projects.length - 1];

describe("TechMark", () => {
  it("marks a branded technology with its colour and an unbranded one in Ink Three", () => {
    expect(htmlOf(createElement(TechMark, { id: "terraform" }))).toContain("background-color:#7B42BC");
    expect(htmlOf(createElement(TechMark, { id: "langchain" }))).toContain("bg-ink-3");
    expect(textOf(createElement(TechMark, { id: "terraform" }))).toContain("Terraform");
  });
});

describe("Ownership", () => {
  it("shows only my part when nothing is known about the team's", () => {
    const html = htmlOf(createElement(Ownership, { mine: ["A"] }));
    expect(html).toContain("My part");
    expect(html).not.toContain("The team");
    expect(html).not.toContain("md:grid-cols-2");
  });

  it("sets the team's part beside mine when it is known", () => {
    const html = htmlOf(createElement(Ownership, { mine: ["A"], team: ["B"], teamLabel: "The team of four" }));
    expect(html).toContain("The team of four");
    expect(html).toContain("md:grid-cols-2");
  });
});

describe("Pager", () => {
  it("links the first case study forward and back to all work", () => {
    const html = htmlOf(createElement(Pager, { slug: first.slug }));
    expect(html).toContain(`href="/work/${second.slug}"`);
    expect(html).toContain('href="/#work"');
    expect(html).not.toContain("Previous");
  });

  it("links a middle one both ways", () => {
    const html = htmlOf(createElement(Pager, { slug: second.slug }));
    expect(html).toContain(`href="/work/${first.slug}"`);
    expect(html).toContain(`href="/work/${third.slug}"`);
    expect(html).not.toContain('href="/#work"');
  });

  it("links the last one back and to all work", () => {
    const html = htmlOf(createElement(Pager, { slug: last.slug }));
    expect(html).toContain("Previous");
    expect(html).toContain('href="/#work"');
    expect(html).not.toContain(">Next<");
  });
});

describe("CaseStudyHeader", () => {
  it("pairs every figure with its provenance and, where known, how it was measured", () => {
    const text = textOf(createElement(CaseStudyHeader, { project: first }));
    expect(text).toContain(first.headline);
    for (const f of first.figures) {
      expect(text, f.value).toContain(f.provenance);
      if (f.measuredHow) expect(text, f.value).toContain(f.measuredHow);
    }
  });

  it("shows the stages for the case study without a figure", () => {
    const devsecops = getProject("devsecops-pipeline")!;
    const text = textOf(createElement(CaseStudyHeader, { project: devsecops }));
    expect(text).toContain("Pipeline stages");
    for (const s of devsecops.stages ?? []) expect(text).toContain(s);
  });
});

describe("CaseStudyFacts", () => {
  it("names the employer, not the legal name, and links the repo when there is one", () => {
    const aws = getProject("aws-web-platform")!;
    const html = htmlOf(createElement(CaseStudyFacts, { project: aws }));
    expect(textOf(createElement(CaseStudyFacts, { project: aws }))).toContain("Parkar Global Technologies");
    expect(html).not.toContain("Pvt Ltd");
    expect(html).toContain('href="https://github.com/MihirBhavsar3102/Automatic-Deployment"');
    expect(html).toContain('rel="noopener noreferrer"');
  });

  it("omits the code row without a repo", () => {
    expect(htmlOf(createElement(CaseStudyFacts, { project: getProject("avd-automation")! }))).not.toContain("github.com");
  });
});

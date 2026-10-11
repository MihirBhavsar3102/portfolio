import { describe, expect, it } from "vitest";
import { existsSync } from "node:fs";
import { resume } from "@/lib/resume-data";
import { readSource } from "./source-files";

/** Spec §7's page template. Only these headings may appear. */
const ALLOWED = [
  "Context",
  "Constraints",
  "Architecture",
  "Decisions and trade-offs",
  "What I built",
  "What I built and what the team did",
  "What broke",
  "Results",
  "What I'd do next",
];
const REQUIRED = ["Context", "Architecture", "What I built", "Results"];
const figureValues = [...new Set(resume.projects.flatMap((p) => p.figures.map((f) => f.value)))];
const headings = (text: string) => [...text.matchAll(/^## (.+)$/gm)].map((m) => m[1].trim());

describe.each(resume.projects.map((p) => p.slug))("case study %s", (slug) => {
  const path = `content/work/${slug}.mdx`;
  const exists = existsSync(path);
  const text = exists ? readSource(path).replace(/\r\n/g, "\n") : "";

  it("has its MDX file", () => expect(exists).toBe(true));

  it("names its own slug in meta", () => expect(text).toContain(`export const meta = { slug: "${slug}" };`));

  it("uses only the template's headings, with the required ones in order", () => {
    const h = headings(text);
    for (const x of h) expect(ALLOWED, x).toContain(x);
    const at = REQUIRED.map((r) => h.findIndex((x) => x.startsWith(r)));
    expect(at.every((i) => i >= 0), h.join(" | ")).toBe(true);
    expect([...at].sort((a, b) => a - b)).toEqual(at);
  });

  it("draws its diagram inside Architecture", () => {
    expect(text.split(/^## /m).find((s) => s.startsWith("Architecture"))).toContain("<Diagram />");
  });

  it("says who did what", () => expect(text).toContain("<Ownership"));

  it("keeps facts in resume-data: no figure values and no imports", () => {
    for (const v of figureValues) expect(text, v).not.toContain(v);
    expect(text).not.toMatch(/^import /m);
  });

  it("is written in the first person", () => expect(text).not.toMatch(/\b(Mihir|he|his|him)\b/i));
});

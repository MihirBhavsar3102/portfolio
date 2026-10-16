import { describe, expect, it } from "vitest";
import { createElement } from "react";
import { diagrams } from "@/content/work/diagrams";
import { ArchitectureDiagram } from "@/components/diagram/diagram";
import { DiagramList } from "@/components/diagram/diagram-list";
import { htmlOf, textOf } from "./render";

describe("DiagramList order", () => {
  it("lists a group that is one pipeline in pipeline order, not drawing order", () => {
    const text = textOf(createElement(DiagramList, { diagram: diagrams["devsecops-pipeline"] }));
    const at = ["Maven build", "SonarQube", "Dependency-Check", "Docker image", "Trivy", "Deploy"].map((label) => text.indexOf(label));
    expect(at.every((i) => i >= 0)).toBe(true);
    expect([...at].sort((a, b) => a - b)).toEqual(at);
  });
});

describe.each(Object.entries(diagrams))("rendered diagram %s", (slug, d) => {
  const html = htmlOf(createElement(ArchitectureDiagram, { id: slug, diagram: d }));
  const count = (needle: string) => html.split(needle).length - 1;

  it("draws every group, node and edge twice: once for desktop, once laid out for phones", () => {
    expect(count("data-group=")).toBe(2 * d.groups.length);
    expect(count("data-node=")).toBe(2 * d.nodes.length);
    expect(count(`marker-end="url(#${slug}-arrow)"`)).toBe(d.edges.length);
    expect(count(`marker-end="url(#${slug}-phone-arrow)"`)).toBe(d.edges.length);
    expect(count("data-edge-label")).toBe(2 * d.edges.filter((e) => e.label).length);
  });

  it("offers one toggle chip per step, in order, naming its figure or its step", () => {
    const chips = [...html.matchAll(/<button[^>]*aria-pressed="false"[^>]*>(.*?)<\/button>/g)].map((m) =>
      m[1].replace(/<[^>]+>/g, "").replace(/&lt;/g, "<").replace(/\s+/g, " ").trim(),
    );
    expect(chips).toEqual(d.traces.map((t) => (t.figure ? `${t.figure} ${t.label}` : t.label)));
  });

  it("marks every node in both drawings with the steps that light it", () => {
    for (const n of d.nodes) {
      const want = d.traces.filter((t) => t.lights.includes(n.id)).map((t) => t.id);
      const marks = [...html.matchAll(new RegExp(`data-node="${n.id}" data-lit-by="([^"]*)"`, "g"))].map((m) => m[1]);
      expect(marks, n.id).toEqual([want.join(" "), want.join(" ")]);
    }
  });

  it("hides the drawing from assistive tech and captions the figure", () => {
    expect(html).toMatch(/<svg[^>]*aria-hidden="true"/);
    expect(textOf(createElement(ArchitectureDiagram, { id: slug, diagram: d }))).toContain(d.title);
  });

  it("writes every group, node and connection out as text", () => {
    const listHtml = htmlOf(createElement(DiagramList, { diagram: d }));
    const listText = textOf(createElement(DiagramList, { diagram: d }));
    for (const g of d.groups) expect(listText, g.id).toContain(g.label);
    for (const n of d.nodes) expect(listText, n.id).toContain(n.label);
    expect(listHtml.split("data-edge=").length - 1).toBe(d.edges.length);
  });
});

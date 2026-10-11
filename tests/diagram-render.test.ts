import { describe, expect, it } from "vitest";
import { createElement } from "react";
import { diagrams } from "@/content/work/diagrams";
import { ArchitectureDiagram } from "@/components/diagram/diagram";
import { DiagramList } from "@/components/diagram/diagram-list";
import { htmlOf, textOf } from "./render";

describe.each(Object.entries(diagrams))("rendered diagram %s", (slug, d) => {
  const html = htmlOf(createElement(ArchitectureDiagram, { id: slug, diagram: d }));
  const count = (needle: string) => html.split(needle).length - 1;

  it("draws every group, node and edge", () => {
    expect(count("data-group=")).toBe(d.groups.length);
    expect(count("data-node=")).toBe(d.nodes.length);
    expect(count(`marker-end="url(#${slug}-arrow)"`)).toBe(d.edges.length);
    expect(count("data-edge-label")).toBe(d.edges.filter((e) => e.label).length);
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

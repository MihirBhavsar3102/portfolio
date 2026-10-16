import { describe, expect, it } from "vitest";
import type { Diagram } from "@/types/diagram";
import { resume } from "@/lib/resume-data";
import { getProject } from "@/lib/work";
import { diagrams } from "@/content/work/diagrams";
import {
  SIZE,
  boxOf,
  contains,
  estimateTextWidth,
  groupRect,
  isOrthogonal,
  labelBox,
  labelPoint,
  nodeRect,
  onBoundary,
  overlaps,
  phoneView,
  segmentEntersRect,
  segmentsCross,
  titleBox,
  type Point,
  type Rect,
} from "@/components/diagram/geometry";
import { readSource } from "./source-files";

/** A node's text starts 22 units in and needs 10 clear before the right edge. */
const TEXT_INSET = 32;
const segmentsOf = (path: Point[]) => path.slice(1).map((p, i): [Point, Point] => [path[i], p]);

describe("diagram registry", () => {
  it("has exactly one diagram per case study", () => {
    expect(Object.keys(diagrams).sort()).toEqual(resume.projects.map((p) => p.slug).sort());
  });
});

/** Every drawing a visitor can see: the desktop one and, below md, the phone one. */
const drawings = Object.entries(diagrams).flatMap(([slug, d]): [string, Diagram][] => [
  [slug, d],
  [`${slug} on phones`, phoneView(d)],
]);

describe.each(drawings)("diagram %s", (_, d) => {
  const bounds: Rect = { x: 0, y: 0, w: d.width, h: d.height };
  const groupById = new Map(d.groups.map((g) => [g.id, g]));
  const titles = d.groups.map((g) => ({ id: g.id, box: titleBox(g) }));

  it("has a caption and unique ids", () => {
    expect(d.title.trim()).not.toBe("");
    const ids = [...d.groups.map((g) => g.id), ...d.nodes.map((n) => n.id)];
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("nests every group inside the drawing and its parent", () => {
    for (const g of d.groups) {
      expect(contains(bounds, groupRect(g)), g.id).toBe(true);
      if (!g.parent) continue;
      const parent = groupById.get(g.parent);
      expect(parent, `${g.id} → ${g.parent}`).toBeDefined();
      expect(contains(groupRect(parent!), groupRect(g)), g.id).toBe(true);
    }
  });

  it("puts every node inside the drawing and its group", () => {
    for (const n of d.nodes) {
      expect(contains(bounds, nodeRect(n)), n.id).toBe(true);
      if (!n.group) continue;
      const g = groupById.get(n.group);
      expect(g, `${n.id} → ${n.group}`).toBeDefined();
      expect(contains(groupRect(g!), nodeRect(n)), n.id).toBe(true);
    }
  });

  it("never overlaps two nodes, or a node and a group title", () => {
    for (const [i, a] of d.nodes.entries()) {
      for (const b of d.nodes.slice(i + 1)) expect(overlaps(nodeRect(a), nodeRect(b)), `${a.id} / ${b.id}`).toBe(false);
      for (const t of titles) expect(overlaps(nodeRect(a), t.box), `${a.id} / title of ${t.id}`).toBe(false);
    }
  });

  it("sizes every node for its text", () => {
    for (const n of d.nodes) {
      expect(estimateTextWidth(n.label, SIZE.label) + TEXT_INSET, n.id).toBeLessThanOrEqual(n.w);
      if (n.meta) expect(estimateTextWidth(n.meta, SIZE.meta) + TEXT_INSET, n.id).toBeLessThanOrEqual(n.w);
    }
  });

  it("cites a source for every edge", () => {
    for (const e of d.edges) expect(e.source.trim(), `${e.from}->${e.to}`).not.toBe("");
  });

  it("routes every edge orthogonally from the outline of one box to the outline of another", () => {
    for (const e of d.edges) {
      const key = `${e.from}->${e.to}`;
      const from = boxOf(d, e.from);
      const to = boxOf(d, e.to);
      expect(from, key).toBeDefined();
      expect(to, key).toBeDefined();
      expect(isOrthogonal(e.path), key).toBe(true);
      expect(onBoundary(e.path[0], from!), key).toBe(true);
      expect(onBoundary(e.path[e.path.length - 1], to!), key).toBe(true);
    }
  });

  it("never runs an edge through a node, a group title or off the drawing", () => {
    for (const e of d.edges) {
      const key = `${e.from}->${e.to}`;
      for (const [a, b] of segmentsOf(e.path)) {
        for (const n of d.nodes) expect(segmentEntersRect(a, b, nodeRect(n)), `${key} through ${n.id}`).toBe(false);
        for (const t of titles) expect(segmentEntersRect(a, b, t.box), `${key} through title of ${t.id}`).toBe(false);
        for (const [x, y] of [a, b]) expect(contains(bounds, { x, y, w: 0, h: 0 }), key).toBe(true);
      }
    }
  });

  it("never crosses two edges", () => {
    const all = d.edges.map((e) => ({ key: `${e.from}->${e.to}`, segs: segmentsOf(e.path) }));
    for (const [i, a] of all.entries())
      for (const b of all.slice(i + 1))
        for (const [a1, a2] of a.segs)
          for (const [b1, b2] of b.segs) expect(segmentsCross(a1, a2, b1, b2), `${a.key} × ${b.key}`).toBe(false);
  });

  it("keeps edge labels inside the drawing and clear of nodes and titles", () => {
    for (const e of d.edges.filter((x) => x.label)) {
      const box = labelBox(e.label!, labelPoint(e.path, e.labelAt));
      expect(contains(bounds, box), e.label).toBe(true);
      for (const n of d.nodes) expect(overlaps(box, nodeRect(n)), `${e.label} / ${n.id}`).toBe(false);
      for (const t of titles) expect(overlaps(box, t.box), `${e.label} / title of ${t.id}`).toBe(false);
    }
  });
});

/** The phone drawing's narrowest render: a 360px phone less the 20px page gutters, the frame's 1px border and its 6px padding. */
const PHONE_DRAWING_MIN = 360 - 2 * 20 - 2 * 1 - 2 * 6;

describe.each(Object.entries(diagrams))("diagram %s, phone layout and chips", (slug, d) => {
  const ids = new Set([...d.groups.map((g) => g.id), ...d.nodes.map((n) => n.id)]);
  const nodeIds = new Set(d.nodes.map((n) => n.id));

  it("draws the phone layout narrow enough that its smallest text is 11px on a 360px phone", () => {
    expect((Math.min(...Object.values(SIZE)) * PHONE_DRAWING_MIN) / d.phone.width).toBeGreaterThanOrEqual(11);
  });

  it("places exactly the diagram's boxes and connections on the phone, no strays", () => {
    expect(Object.keys(d.phone.groups).sort()).toEqual(d.groups.map((g) => g.id).sort());
    expect(Object.keys(d.phone.nodes).sort()).toEqual(d.nodes.map((n) => n.id).sort());
    expect(Object.keys(d.phone.edges).sort()).toEqual(d.edges.map((e) => `${e.from}->${e.to}`).sort());
  });

  it("gives every figure the case study shows a chip, in the same order", () => {
    const figures = getProject(slug)!.figures.map((f) => f.value);
    expect(d.traces.flatMap((t) => (t.figure ? [t.figure] : []))).toEqual(figures);
  });

  it("captions every other chip with the case study's own words", () => {
    const prose = readSource(`content/work/${slug}.mdx`);
    for (const t of d.traces.filter((x) => !x.figure)) {
      expect(t.caption, t.id).toBeTruthy();
      expect(prose, t.id).toContain(t.caption);
    }
  });

  it("lights only boxes the diagram has, and at least one part per chip", () => {
    expect(new Set(d.traces.map((t) => t.id)).size).toBe(d.traces.length);
    for (const t of d.traces) {
      expect(t.label.trim(), t.id).not.toBe("");
      for (const id of t.lights) expect(ids.has(id), `${t.id} → ${id}`).toBe(true);
      expect(t.lights.some((id) => nodeIds.has(id)), t.id).toBe(true);
    }
  });
});

import { describe, expect, it } from "vitest";
import { resume } from "@/lib/resume-data";
import { edgeKey } from "@/lib/trace";
import { layoutTopology, type Rect } from "@/components/hero/topology-layout";

const { estate } = resume;
const layout = layoutTopology(estate);
const placedNodes = [...layout.lanes.flatMap((l) => l.nodes), ...layout.zones.flatMap((z) => z.nodes)];

const overlaps = (a: Rect, b: Rect) =>
  a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h;

const inside = (r: Rect) => r.x >= 0 && r.y >= 0 && r.x + r.w <= layout.width && r.y + r.h <= layout.height;

describe("layoutTopology", () => {
  it("places every node and control tool exactly once", () => {
    const expected = [
      ...estate.controlPlane.flatMap((l) => l.nodes.map((n) => n.id)),
      ...estate.zones.flatMap((z) => z.nodes.map((n) => n.id)),
    ].sort();
    expect(placedNodes.map((n) => n.id).sort()).toEqual(expected);
  });

  it("places every zone", () => {
    expect(layout.zones.map((z) => z.id)).toEqual(estate.zones.map((z) => z.id));
  });

  it("keeps every rect inside the drawing", () => {
    for (const r of [...layout.lanes, ...layout.zones, ...placedNodes]) expect(inside(r), JSON.stringify(r)).toBe(true);
  });

  it("never overlaps two nodes", () => {
    for (let i = 0; i < placedNodes.length; i++)
      for (let j = i + 1; j < placedNodes.length; j++)
        expect(overlaps(placedNodes[i], placedNodes[j]), `${placedNodes[i].id} / ${placedNodes[j].id}`).toBe(false);
  });

  it("never overlaps two zones", () => {
    const zones = layout.zones;
    for (let i = 0; i < zones.length; i++)
      for (let j = i + 1; j < zones.length; j++) expect(overlaps(zones[i], zones[j])).toBe(false);
  });

  it("draws every estate edge under the same key Trace lights", () => {
    expect(layout.edges.map((e) => e.key).sort()).toEqual(estate.edges.map(edgeKey).sort());
    for (const e of layout.edges) {
      expect(e.d.startsWith("M")).toBe(true);
      expect(e.length).toBeGreaterThan(0);
    }
  });

  it("marks control-plane edges as control and the rest as data", () => {
    const control = new Set(estate.controlPlane.flatMap((l) => l.nodes.map((n) => n.id)));
    for (const e of layout.edges) expect(e.kind).toBe(control.has(e.from) ? "control" : "data");
  });

  it("routes build edges down into a zone's top and observe edges up into its bottom", () => {
    const build = new Set(estate.controlPlane.find((l) => l.id === "build")!.nodes.map((n) => n.id));
    for (const e of layout.edges.filter((x) => x.kind === "control")) {
      const zone = layout.zones.find((z) => z.id === e.to)!;
      const end = Number(e.d.trim().split(/[\sVHM,]+/).filter(Boolean).at(-1));
      expect(end, e.key).toBe(build.has(e.from) ? zone.y : zone.y + zone.h);
    }
  });
});

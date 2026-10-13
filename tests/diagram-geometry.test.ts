import { describe, expect, it } from "vitest";
import type { Diagram } from "@/types/diagram";
import {
  NODE_H,
  boxOf,
  contains,
  estimateTextWidth,
  isOrthogonal,
  labelBox,
  labelOf,
  labelPoint,
  nodeRect,
  onBoundary,
  overlaps,
  pathD,
  readingOrder,
  chainOrder,
  segmentEntersRect,
  segmentsCross,
  titleBox,
  type Rect,
} from "@/components/diagram/geometry";

const box: Rect = { x: 10, y: 10, w: 100, h: 40 };

describe("nodeRect", () => {
  it("draws a node with meta taller than a plain one", () => {
    expect(nodeRect({ id: "a", label: "A", x: 0, y: 0, w: 50 }).h).toBe(NODE_H.plain);
    expect(nodeRect({ id: "a", label: "A", meta: "m", x: 0, y: 0, w: 50 }).h).toBe(NODE_H.meta);
  });
});

describe("boxOf and labelOf", () => {
  const d: Diagram = {
    title: "t",
    width: 100,
    height: 100,
    groups: [{ id: "g", label: "Group", x: 0, y: 0, w: 100, h: 100 }],
    nodes: [{ id: "n", label: "Node", x: 10, y: 50, w: 40 }],
    edges: [],
  };

  it("finds nodes and groups by id", () => {
    expect(boxOf(d, "n")).toEqual({ x: 10, y: 50, w: 40, h: NODE_H.plain });
    expect(boxOf(d, "g")).toEqual({ x: 0, y: 0, w: 100, h: 100 });
    expect(boxOf(d, "zzz")).toBeUndefined();
  });

  it("names nodes and groups, falling back to the id", () => {
    expect(labelOf(d, "n")).toBe("Node");
    expect(labelOf(d, "g")).toBe("Group");
    expect(labelOf(d, "zzz")).toBe("zzz");
  });
});

describe("onBoundary", () => {
  it("accepts points on each side, corners included", () => {
    for (const [x, y] of [[10, 30], [110, 30], [60, 10], [60, 50], [10, 10]])
      expect(onBoundary([x, y], box), `${x},${y}`).toBe(true);
  });

  it("rejects points inside or outside", () => {
    expect(onBoundary([60, 30], box)).toBe(false);
    expect(onBoundary([5, 30], box)).toBe(false);
    expect(onBoundary([10, 60], box)).toBe(false);
  });
});

describe("segmentEntersRect", () => {
  it("catches a segment through the middle", () => expect(segmentEntersRect([0, 30], [200, 30], box)).toBe(true));
  it("ignores a segment along the outline", () => expect(segmentEntersRect([0, 10], [200, 10], box)).toBe(false));
  it("ignores a segment leaving from an edge", () => expect(segmentEntersRect([60, 50], [60, 90], box)).toBe(false));
  it("catches a segment heading back into its own box", () =>
    expect(segmentEntersRect([60, 50], [60, 20], box)).toBe(true));
});

describe("segmentsCross", () => {
  it("catches a plus-shaped crossing", () => expect(segmentsCross([0, 5], [10, 5], [5, 0], [5, 10])).toBe(true));
  it("ignores segments that only meet at an end", () =>
    expect(segmentsCross([0, 5], [10, 5], [10, 0], [10, 10])).toBe(false));
  it("ignores parallel segments", () => expect(segmentsCross([0, 5], [10, 5], [0, 8], [10, 8])).toBe(false));
});

describe("isOrthogonal", () => {
  it("accepts an L-shaped path", () => expect(isOrthogonal([[0, 0], [0, 10], [10, 10]])).toBe(true));
  it("rejects a diagonal, a zero-length step and a single point", () => {
    expect(isOrthogonal([[0, 0], [10, 10]])).toBe(false);
    expect(isOrthogonal([[0, 0], [0, 0]])).toBe(false);
    expect(isOrthogonal([[0, 0]])).toBe(false);
  });
});

describe("labelPoint", () => {
  it("uses the declared point", () => expect(labelPoint([[0, 0], [0, 10]], [3, 4])).toEqual([3, 4]));
  it("centres on the longest segment", () =>
    expect(labelPoint([[0, 0], [0, 10], [40, 10], [40, 20]])).toEqual([20, 10]));
});

describe("pathD", () => {
  it("writes an SVG path", () => expect(pathD([[0, 0], [0, 10], [40, 10]])).toBe("M0 0 L0 10 L40 10"));
});

describe("text boxes", () => {
  it("estimates width generously from length and size", () => expect(estimateTextWidth("abcd", 10)).toBe(24));

  it("centres an edge label's box on its point", () => {
    const b = labelBox("ab", [100, 50]);
    expect(b.x + b.w / 2).toBe(100);
    expect(b.y + b.h / 2).toBe(50);
  });

  it("covers a group's title, and its note when it has one", () => {
    const g = { id: "g", label: "Group", x: 0, y: 0, w: 300, h: 100 };
    expect(titleBox(g).h).toBeLessThan(titleBox({ ...g, note: "A note" }).h);
  });
});

describe("contains and overlaps", () => {
  it("tells containment from overlap", () => {
    expect(contains(box, { x: 20, y: 20, w: 10, h: 10 })).toBe(true);
    expect(contains(box, { x: 100, y: 20, w: 20, h: 10 })).toBe(false);
    expect(overlaps(box, { x: 100, y: 20, w: 20, h: 10 })).toBe(true);
    expect(overlaps(box, { x: 110, y: 20, w: 20, h: 10 })).toBe(false);
  });
});

describe("readingOrder", () => {
  it("sorts top to bottom, then left to right", () => {
    const items = [{ id: "c", x: 0, y: 20 }, { id: "b", x: 50, y: 0 }, { id: "a", x: 0, y: 0 }];
    expect(readingOrder(items).map((i) => i.id)).toEqual(["a", "b", "c"]);
  });
});

describe("chainOrder", () => {
  const e = (from: string, to: string) => ({ from, to });
  it("follows the edges through ids that form one chain, however they are drawn", () => {
    expect(chainOrder(["d", "c", "a", "b"], [e("a", "b"), e("b", "c"), e("c", "d"), e("x", "a")])).toEqual(["a", "b", "c", "d"]);
  });
  it("returns null when the ids branch, break, loop or stand alone", () => {
    expect(chainOrder(["a", "b", "c"], [e("a", "b"), e("a", "c")])).toBeNull();
    expect(chainOrder(["a", "b", "c"], [e("a", "b")])).toBeNull();
    expect(chainOrder(["a", "b"], [e("a", "b"), e("b", "a")])).toBeNull();
    expect(chainOrder(["a"], [])).toBeNull();
  });
});

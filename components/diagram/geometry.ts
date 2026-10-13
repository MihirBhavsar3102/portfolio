import type { Diagram, DiagramGroup, DiagramNode } from "@/types/diagram";

export interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}
export type Point = [number, number];

/*
 * Type sizes in viewBox units. Diagrams are drawn 760 wide and shown from md
 * up, where the drawing is never narrower than ~680px (a 0.89× scale), so the
 * smallest size here renders at 11px or more.
 */
export const SIZE = { label: 14, meta: 12.5, group: 12.5, note: 12.5, edge: 12.5 } as const;
export const NODE_H = { plain: 32, meta: 46 } as const;
/** A group's title and note baselines, from its top-left corner. */
export const GROUP_TEXT = { x: 12, label: 20, note: 36 } as const;

export const nodeRect = (n: DiagramNode): Rect => ({ x: n.x, y: n.y, w: n.w, h: n.meta ? NODE_H.meta : NODE_H.plain });
export const groupRect = (g: DiagramGroup): Rect => ({ x: g.x, y: g.y, w: g.w, h: g.h });

/** The box an edge endpoint names: a node or a group. */
export function boxOf(diagram: Diagram, id: string): Rect | undefined {
  const node = diagram.nodes.find((n) => n.id === id);
  if (node) return nodeRect(node);
  const group = diagram.groups.find((g) => g.id === id);
  return group && groupRect(group);
}

export function labelOf(diagram: Diagram, id: string): string {
  return diagram.nodes.find((n) => n.id === id)?.label ?? diagram.groups.find((g) => g.id === id)?.label ?? id;
}

/** A deliberately generous width for Mona Sans; the browser check measures the real glyphs. */
export const estimateTextWidth = (text: string, size: number) => text.length * size * 0.6;

/** The area a group's title and note occupy; nothing may be drawn over it. */
export function titleBox(g: DiagramGroup): Rect {
  const w = Math.max(estimateTextWidth(g.label, SIZE.group), g.note ? estimateTextWidth(g.note, SIZE.note) : 0);
  return { x: g.x + GROUP_TEXT.x, y: g.y + 8, w, h: g.note ? 32 : 16 };
}

const segmentLength = (a: Point, b: Point) => Math.abs(b[0] - a[0]) + Math.abs(b[1] - a[1]);

/** Where an edge's label is centred: its declared point, or the middle of its longest segment. */
export function labelPoint(path: Point[], at?: Point): Point {
  if (at) return at;
  let best: [Point, Point] = [path[0], path[1]];
  for (let i = 1; i < path.length - 1; i++) {
    if (segmentLength(path[i], path[i + 1]) > segmentLength(best[0], best[1])) best = [path[i], path[i + 1]];
  }
  return [(best[0][0] + best[1][0]) / 2, (best[0][1] + best[1][1]) / 2];
}

/** The box an edge label covers, centred on its point. */
export function labelBox(text: string, [x, y]: Point): Rect {
  const w = estimateTextWidth(text, SIZE.edge) + 8;
  return { x: x - w / 2, y: y - 9, w, h: 18 };
}

export const pathD = (path: Point[]) => path.map(([x, y], i) => `${i ? "L" : "M"}${x} ${y}`).join(" ");

export const contains = (outer: Rect, inner: Rect) =>
  inner.x >= outer.x &&
  inner.y >= outer.y &&
  inner.x + inner.w <= outer.x + outer.w &&
  inner.y + inner.h <= outer.y + outer.h;

export const overlaps = (a: Rect, b: Rect) => a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h;

/** True when the point lies on the rectangle's outline. */
export function onBoundary([x, y]: Point, r: Rect): boolean {
  const withinX = x >= r.x && x <= r.x + r.w;
  const withinY = y >= r.y && y <= r.y + r.h;
  return ((x === r.x || x === r.x + r.w) && withinY) || ((y === r.y || y === r.y + r.h) && withinX);
}

/** True when an axis-aligned segment passes through the rectangle's interior; touching the outline doesn't count. */
export function segmentEntersRect([x1, y1]: Point, [x2, y2]: Point, r: Rect): boolean {
  return (
    Math.min(x1, x2) < r.x + r.w && Math.max(x1, x2) > r.x && Math.min(y1, y2) < r.y + r.h && Math.max(y1, y2) > r.y
  );
}

/** True when two axis-aligned segments cross inside both; meeting at an end doesn't count. */
export function segmentsCross(a1: Point, a2: Point, b1: Point, b2: Point): boolean {
  const aHorizontal = a1[1] === a2[1];
  if (aHorizontal === (b1[1] === b2[1])) return false;
  const [h1, h2, v1, v2] = aHorizontal ? [a1, a2, b1, b2] : [b1, b2, a1, a2];
  const x = v1[0];
  const y = h1[1];
  return x > Math.min(h1[0], h2[0]) && x < Math.max(h1[0], h2[0]) && y > Math.min(v1[1], v2[1]) && y < Math.max(v1[1], v2[1]);
}

/** Every step moves along exactly one axis. */
export const isOrthogonal = (path: Point[]) =>
  path.length >= 2 && path.slice(1).every((p, i) => (p[0] === path[i][0]) !== (p[1] === path[i][1]));

/** Items in reading order: top to bottom, then left to right. */
export const readingOrder = <T extends { x: number; y: number }>(items: T[]) =>
  [...items].sort((a, b) => a.y - b.y || a.x - b.x);

/**
 * The ids in edge order when the edges between them form one unbranched
 * chain through all of them (a pipeline), else null. A drawing may snake a
 * pipeline across rows; its text form should still read in flow order.
 */
export function chainOrder(ids: string[], edges: { from: string; to: string }[]): string[] | null {
  if (ids.length < 2) return null;
  const set = new Set(ids);
  const inner = edges.filter((e) => set.has(e.from) && set.has(e.to));
  const next = new Map<string, string>();
  const hasIn = new Set<string>();
  for (const e of inner) {
    if (next.has(e.from) || hasIn.has(e.to)) return null;
    next.set(e.from, e.to);
    hasIn.add(e.to);
  }
  const heads = ids.filter((id) => !hasIn.has(id));
  if (heads.length !== 1) return null;
  const order = [heads[0]];
  while (next.has(order[order.length - 1]) && order.length <= ids.length) order.push(next.get(order[order.length - 1])!);
  return order.length === ids.length && new Set(order).size === ids.length ? order : null;
}

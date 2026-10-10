import type { TechId } from "@/lib/tech";
import { edgeKey } from "@/lib/trace";
import type { Estate, EstateNode } from "@/types/resume";

/**
 * Geometry for the service map, in SVG user units. Pure and data-driven: the
 * estate decides what is drawn, these constants decide where. Build tools sit
 * in a band above the workloads and push down into them; observe tools sit in
 * a band below and read up from them. No edge ever joins two workloads.
 */

export interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

export type NodeVariant = "chip" | "service" | "count";

export interface PlacedNode extends Rect {
  id: string;
  label: string;
  meta?: string;
  tech?: TechId;
  variant: NodeVariant;
}

export interface PlacedZone extends Rect {
  id: string;
  label: string;
  tech?: TechId;
  nodes: PlacedNode[];
}

export interface PlacedLane extends Rect {
  id: string;
  label: string;
  nodes: PlacedNode[];
}

export interface PlacedEdge {
  key: string;
  from: string;
  to: string;
  d: string;
  length: number;
  kind: "control" | "data";
}

export interface TopologyLayout {
  width: number;
  height: number;
  lanes: PlacedLane[];
  zones: PlacedZone[];
  edges: PlacedEdge[];
}

const WIDTH = 720;
const PAD = 14; // inner padding of a band
const CHIP_GAP = 8;
const BAND_H = 72; // label row + one chip row
const CHIP_Y = 30; // chip top inside a band
const CHIP_H = 28;
const BUS = 32; // gap between a band and the zones, where control edges run
const ZONE_GAP = 12;
const ZONE_INSET = 12; // node inset from a zone's sides
const FIRST_NODE = 30; // first node's offset below a zone's top (clears the label)
const NODE_H = 38;
const COUNT_H = 56;
const NODE_GAP = 10;
const ZONE_BOTTOM = 10;

/** Column widths in estate zone order. They sum, with the gaps, to WIDTH. */
const ZONE_W: Record<string, number> = { clients: 104, azure: 236, aws: 188, ai: 156 };

interface Point {
  x: number;
  y: number;
}

/** An orthogonal path through the points, with its length for the draw-in. */
function orth(points: Point[]): { d: string; length: number } {
  let d = `M ${points[0].x} ${points[0].y}`;
  let length = 0;
  for (let i = 1; i < points.length; i++) {
    const a = points[i - 1];
    const b = points[i];
    if (a.x === b.x && a.y === b.y) continue;
    d += a.x === b.x ? ` V ${b.y}` : ` H ${b.x}`;
    length += Math.abs(b.x - a.x) + Math.abs(b.y - a.y);
  }
  return { d, length };
}

const nodeHeight = (variant: NodeVariant) => (variant === "count" ? COUNT_H : NODE_H);

function placeChips(nodes: EstateNode[], laneY: number): PlacedNode[] {
  const w = (WIDTH - 2 * PAD - (nodes.length - 1) * CHIP_GAP) / nodes.length;
  return nodes.map((n, i) => ({
    ...n,
    variant: "chip",
    x: PAD + i * (w + CHIP_GAP),
    y: laneY + CHIP_Y,
    w,
    h: CHIP_H,
  }));
}

export function layoutTopology(estate: Estate): TopologyLayout {
  const build = estate.controlPlane.find((l) => l.id === "build");
  const observe = estate.controlPlane.find((l) => l.id === "observe");

  // Zones: one row of columns below the build band.
  const zonesTop = BAND_H + BUS;
  const zoneHeight = Math.max(
    ...estate.zones.map((z) => {
      const variant: NodeVariant = z.id === "clients" ? "count" : "service";
      return FIRST_NODE + z.nodes.length * nodeHeight(variant) + (z.nodes.length - 1) * NODE_GAP + ZONE_BOTTOM;
    }),
  );

  let x = 0;
  const zones: PlacedZone[] = estate.zones.map((z) => {
    const w = ZONE_W[z.id];
    const variant: NodeVariant = z.id === "clients" ? "count" : "service";
    let y = zonesTop + FIRST_NODE;
    const nodes = z.nodes.map((n) => {
      const placed: PlacedNode = { ...n, variant, x: x + ZONE_INSET, y, w: w - 2 * ZONE_INSET, h: nodeHeight(variant) };
      y += placed.h + NODE_GAP;
      return placed;
    });
    const zone: PlacedZone = { id: z.id, label: z.label, tech: z.tech, x, y: zonesTop, w, h: zoneHeight, nodes };
    x += w + ZONE_GAP;
    return zone;
  });

  const zonesBottom = zonesTop + zoneHeight;
  const observeTop = zonesBottom + BUS;

  const lanes: PlacedLane[] = [];
  if (build) lanes.push({ id: build.id, label: build.label, x: 0, y: 0, w: WIDTH, h: BAND_H, nodes: placeChips(build.nodes, 0) });
  if (observe)
    lanes.push({
      id: observe.id,
      label: observe.label,
      x: 0,
      y: observeTop,
      w: WIDTH,
      h: BAND_H,
      nodes: placeChips(observe.nodes, observeTop),
    });

  const chipById = new Map(lanes.flatMap((l) => l.nodes.map((n) => [n.id, { node: n, lane: l.id }] as const)));
  const zoneById = new Map(zones.map((z) => [z.id, z] as const));
  const nodeById = new Map(zones.flatMap((z) => z.nodes.map((n, i) => [n.id, { node: n, zone: z, index: i }] as const)));

  const edges: PlacedEdge[] = estate.edges.map((e) => {
    const key = edgeKey(e);
    const chip = chipById.get(e.from);
    const targetZone = zoneById.get(e.to);

    // Control plane → workload zone.
    if (chip && targetZone) {
      const cx = chip.node.x + chip.node.w / 2;
      const port = targetZone.x + targetZone.w / 2;
      const down = chip.lane === "build";
      const bus = down ? BAND_H + BUS / 2 : zonesBottom + BUS / 2;
      const points = down
        ? [
            { x: cx, y: chip.node.y + chip.node.h },
            { x: cx, y: bus },
            { x: port, y: bus },
            { x: port, y: targetZone.y },
          ]
        : [
            { x: cx, y: chip.node.y },
            { x: cx, y: bus },
            { x: port, y: bus },
            { x: port, y: targetZone.y + targetZone.h },
          ];
      return { key, from: e.from, to: e.to, kind: "control", ...orth(points) };
    }

    const a = nodeById.get(e.from);
    const b = nodeById.get(e.to);
    if (!a || !b) throw new Error(`Topology edge ${key} has an endpoint the map cannot place`);

    // Across the gap between two zones (clients → a workload).
    if (a.zone.id !== b.zone.id) {
      const [left, right] = a.zone.x < b.zone.x ? [a, b] : [b, a];
      const mid = left.zone.x + left.zone.w + ZONE_GAP / 2;
      const points = [
        { x: left.node.x + left.node.w, y: left.node.y + left.node.h / 2 },
        { x: mid, y: left.node.y + left.node.h / 2 },
        { x: mid, y: right.node.y + right.node.h / 2 },
        { x: right.node.x, y: right.node.y + right.node.h / 2 },
      ];
      return { key, from: e.from, to: e.to, kind: "data", ...orth(points) };
    }

    const [upper, lower] = a.index < b.index ? [a, b] : [b, a];

    // Neighbours in a zone: a short link across the gap between them.
    if (lower.index - upper.index === 1) {
      const cx = upper.node.x + upper.node.w / 2;
      const points = [
        { x: cx, y: upper.node.y + upper.node.h },
        { x: cx, y: lower.node.y },
      ];
      return { key, from: e.from, to: e.to, kind: "data", ...orth(points) };
    }

    // Further apart: route down the zone's right margin so it never reads as
    // passing through the node in between.
    const spine = upper.node.x + upper.node.w + ZONE_INSET / 2;
    const points = [
      { x: upper.node.x + upper.node.w, y: upper.node.y + upper.node.h / 2 },
      { x: spine, y: upper.node.y + upper.node.h / 2 },
      { x: spine, y: lower.node.y + lower.node.h / 2 },
      { x: lower.node.x + lower.node.w, y: lower.node.y + lower.node.h / 2 },
    ];
    return { key, from: e.from, to: e.to, kind: "data", ...orth(points) };
  });

  return {
    width: WIDTH,
    height: observe ? observeTop + BAND_H : zonesBottom,
    lanes,
    zones,
    edges,
  };
}

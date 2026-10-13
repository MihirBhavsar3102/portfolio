import type { TechId } from "@/lib/tech";

/*
 * A hand-drawn architecture diagram. Coordinates are viewBox units declared
 * per diagram (no auto-layout); tests/diagrams.test.ts holds every drawing to
 * its geometry rules, and every edge cites where the relationship is stated.
 */

/** A dashed container: a region, VPC, cluster, pipeline or other boundary. */
export interface DiagramGroup {
  id: string;
  label: string;
  /** Short line under the label. */
  note?: string;
  /** The group this one sits inside. */
  parent?: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface DiagramNode {
  id: string;
  label: string;
  /** Short second line; a node with one is drawn taller. */
  meta?: string;
  tech?: TechId;
  /** The innermost group this node sits inside. */
  group?: string;
  x: number;
  y: number;
  w: number;
}

export interface DiagramEdge {
  /** Node or group ids. */
  from: string;
  to: string;
  /** Orthogonal polyline from the outline of `from` to the outline of `to`. */
  path: [number, number][];
  label?: string;
  /** Where the label is centred; defaults to the middle of the longest segment. */
  labelAt?: [number, number];
  /** Where the relationship is stated: "resume: …" or a questionnaire item. */
  source: string;
}

export interface Diagram {
  /** One sentence; the figure caption. */
  title: string;
  width: number;
  height: number;
  groups: DiagramGroup[];
  nodes: DiagramNode[];
  edges: DiagramEdge[];
}

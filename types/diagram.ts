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

/**
 * One chip above the drawing, lighting a step of the story. A figure step
 * names one of the case study's figures by value and takes its caption from
 * that figure's claim and provenance; any other step brings its own caption,
 * a sentence the case study already says.
 */
export interface DiagramTrace {
  id: string;
  /** The chip's words, after the figure's value when there is one. */
  label: string;
  /** The value of one of the case study's figures, e.g. "99.9%". */
  figure?: string;
  /** A step without a figure: what the lit parts do. */
  caption?: string;
  /** The node and group ids it lights; an edge lights when both its ends do. */
  lights: string[];
}

/**
 * The same diagram laid out again for a phone: a tall, narrow drawing whose
 * text stays readable at 360px. Positions only; labels, edges and their
 * sources stay in the Diagram. Edges are keyed "from->to".
 */
export interface DiagramPhoneLayout {
  width: number;
  height: number;
  groups: Record<string, Pick<DiagramGroup, "x" | "y" | "w" | "h">>;
  nodes: Record<string, Pick<DiagramNode, "x" | "y" | "w">>;
  edges: Record<string, Pick<DiagramEdge, "path" | "labelAt">>;
}

export interface Diagram {
  /** One sentence; the figure caption. */
  title: string;
  width: number;
  height: number;
  groups: DiagramGroup[];
  nodes: DiagramNode[];
  edges: DiagramEdge[];
  /** The chips above the drawing, in order. */
  traces: DiagramTrace[];
  /** The drawing below md. */
  phone: DiagramPhoneLayout;
}

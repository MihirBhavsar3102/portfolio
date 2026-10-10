import type { Estate, EstateEdge } from "@/types/resume";

export const edgeKey = (e: Pick<EstateEdge, "from" | "to">) => `${e.from}->${e.to}`;

export interface TraceSelection {
  ids: Set<string>;
  edges: Set<string>;
}

/**
 * The ids and edges one proof figure lights. A zone counts as lit when any of
 * its nodes is lit, so a control-plane edge into a zone lights with the work
 * it produced. An edge lights only when both of its endpoints are lit.
 */
export function traceSelection(estate: Estate, proofId: string | null): TraceSelection {
  const proof = estate.proof.find((p) => p.id === proofId);
  const ids = new Set<string>(proof?.highlight ?? []);
  if (proof) {
    for (const zone of estate.zones) {
      if (zone.nodes.some((n) => ids.has(n.id))) ids.add(zone.id);
    }
  }
  const edges = new Set<string>();
  for (const edge of estate.edges) {
    if (ids.has(edge.from) && ids.has(edge.to)) edges.add(edgeKey(edge));
  }
  return { ids, edges };
}

/** For every id and edge key, the proof ids that light it — precomputed on the server. */
export function litBy(estate: Estate): Map<string, string[]> {
  const map = new Map<string, string[]>();
  for (const proof of estate.proof) {
    const { ids, edges } = traceSelection(estate, proof.id);
    for (const key of [...ids, ...edges]) {
      map.set(key, [...(map.get(key) ?? []), proof.id]);
    }
  }
  return map;
}

export interface TraceState {
  active: string | null;
  pinned: boolean;
}

export type TraceEvent =
  | { type: "enter"; id: string }
  | { type: "leave"; id: string }
  | { type: "toggle"; id: string }
  | { type: "clear" };

const IDLE: TraceState = { active: null, pinned: false };

/** Hover/focus previews, tap pins, a second tap or Escape clears. */
export function nextTraceState(state: TraceState, event: TraceEvent): TraceState {
  switch (event.type) {
    case "enter":
      return state.pinned ? state : { active: event.id, pinned: false };
    case "leave":
      // Only the figure being previewed can end its own preview, so a pointer
      // crossing another figure never clears what keyboard focus lit.
      return state.pinned || state.active !== event.id ? state : IDLE;
    case "toggle":
      return state.pinned && state.active === event.id ? IDLE : { active: event.id, pinned: true };
    case "clear":
      return IDLE;
  }
}

/** The pinned figure named in a URL's query string, if it is a real proof id. */
export function readTraceParam(search: string, ids: string[]): string | null {
  const id = new URLSearchParams(search).get("trace");
  return id && ids.includes(id) ? id : null;
}

/** `href` with `?trace=` set to the pinned figure, or removed when none is pinned. */
export function traceHref(href: string, id: string | null): string {
  const url = new URL(href);
  if (id) url.searchParams.set("trace", id);
  else url.searchParams.delete("trace");
  return url.toString();
}

/** Labels of the nodes and tools a figure lights, in map order — zones left out. */
export function tracedLabels(estate: Estate, proofId: string): string[] {
  const { ids } = traceSelection(estate, proofId);
  const nodes = [...estate.zones.flatMap((z) => z.nodes), ...estate.controlPlane.flatMap((l) => l.nodes)];
  return nodes.filter((n) => ids.has(n.id)).map((n) => n.label);
}

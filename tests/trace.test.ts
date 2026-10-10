import { describe, expect, it } from "vitest";
import type { Estate } from "@/types/resume";
import { edgeKey, litBy, nextTraceState, traceSelection } from "@/lib/trace";

const figure = { value: "1", label: "x", provenance: "y" };
const estate: Estate = {
  zones: [
    { id: "azure", label: "Azure", nodes: [{ id: "pool", label: "Pool" }, { id: "kv", label: "KV" }] },
    { id: "aws", label: "AWS", nodes: [{ id: "alb", label: "ALB" }, { id: "rds", label: "RDS" }] },
  ],
  controlPlane: [{ id: "build", label: "Build", nodes: [{ id: "ps", label: "PowerShell" }] }],
  edges: [
    { from: "ps", to: "azure", source: "resume" },
    { from: "alb", to: "rds", source: "resume" },
    { from: "pool", to: "kv", source: "resume" },
  ],
  proof: [
    { id: "a", figure, highlight: ["ps", "pool"] },
    { id: "b", figure, highlight: ["alb", "rds"] },
  ],
};

describe("traceSelection", () => {
  it("lights nothing when no figure is selected", () => {
    const s = traceSelection(estate, null);
    expect(s.ids.size).toBe(0);
    expect(s.edges.size).toBe(0);
  });

  it("lights an edge from a control tool to a zone that holds a lit node", () => {
    const s = traceSelection(estate, "a");
    expect(s.edges.has(edgeKey({ from: "ps", to: "azure" }))).toBe(true);
  });

  it("does not light an edge with only one lit node endpoint", () => {
    const s = traceSelection(estate, "a");
    expect(s.edges.has(edgeKey({ from: "pool", to: "kv" }))).toBe(false);
  });

  it("lights an edge whose two node endpoints are lit", () => {
    const s = traceSelection(estate, "b");
    expect(s.edges.has(edgeKey({ from: "alb", to: "rds" }))).toBe(true);
    expect(s.ids.has("azure")).toBe(false);
  });

  it("ignores an unknown proof id", () => {
    expect(traceSelection(estate, "nope").ids.size).toBe(0);
  });
});

describe("litBy", () => {
  it("maps every lit node, zone and edge to the proof ids that light it", () => {
    const map = litBy(estate);
    expect(map.get("ps")).toEqual(["a"]);
    expect(map.get("azure")).toEqual(["a"]);
    expect(map.get(edgeKey({ from: "alb", to: "rds" }))).toEqual(["b"]);
    expect(map.has("kv")).toBe(false);
  });
});

describe("nextTraceState", () => {
  const idle = { active: null, pinned: false };

  it("previews on hover or focus and clears on leave or blur", () => {
    const on = nextTraceState(idle, { type: "enter", id: "a" });
    expect(on).toEqual({ active: "a", pinned: false });
    expect(nextTraceState(on, { type: "leave", id: "a" })).toEqual(idle);
  });

  it("pins on tap and unpins on a second tap of the same figure", () => {
    const pinned = nextTraceState(idle, { type: "toggle", id: "a" });
    expect(pinned).toEqual({ active: "a", pinned: true });
    expect(nextTraceState(pinned, { type: "toggle", id: "a" })).toEqual(idle);
  });

  it("keeps a pinned figure through hover elsewhere ending", () => {
    const pinned = { active: "a", pinned: true };
    expect(nextTraceState(pinned, { type: "leave", id: "b" })).toEqual(pinned);
  });

  it("moves a pin to another figure on tap", () => {
    const pinned = { active: "a", pinned: true };
    expect(nextTraceState(pinned, { type: "toggle", id: "b" })).toEqual({ active: "b", pinned: true });
  });

  it("clears everything on escape", () => {
    expect(nextTraceState({ active: "a", pinned: true }, { type: "clear" })).toEqual(idle);
  });
});

import { describe, expect, it } from "vitest";
import { createElement } from "react";
import { Hero } from "@/components/hero/hero";
import { EstatePreview } from "@/components/hero/estate-preview";
import { resume } from "@/lib/resume-data";
import { positioningLine } from "@/lib/format";
import { htmlOf, textOf } from "./render";

const { estate, positioning } = resume;

describe("Hero", () => {
  const html = htmlOf(createElement(Hero));

  it("states the whole positioning line, whatever the rolling word shows", () => {
    expect(textOf(createElement(Hero))).toContain(positioningLine(positioning));
  });

  it("rolls through the verbs in order, hidden from screen readers, who hear the line once", () => {
    expect(html).toMatch(/<span aria-hidden="true" class="hero-rolling">/);
    const words = [...html.matchAll(/class="hero-roll-word">([^<]+)</g)].map((m) => m[1]);
    expect(words).toEqual(positioning.verbs.map((v) => `${v}.`));
  });

  it("renders at rest: no step is lit until the story starts in the browser", () => {
    expect(html).toContain("data-hero");
    expect(html).not.toContain("data-phase");
  });
});

describe("the estate preview", () => {
  const html = htmlOf(createElement(EstatePreview));
  const text = textOf(createElement(EstatePreview));
  const lane = (id: string) => estate.controlPlane.find((l) => l.id === id)!;
  const reached = (laneId: string) =>
    estate.zones
      .filter((z) => estate.edges.some((e) => e.to === z.id && lane(laneId).nodes.some((n) => n.id === e.from)))
      .map((z) => z.id);
  const wires = (step: string) => [...html.matchAll(new RegExp(`data-wire="${step}:([a-z]+)"`, "g"))].map((m) => m[1]);

  it("is decorative: the map section below describes the estate in full", () => {
    expect(html).toMatch(/^<div aria-hidden="true"/);
  });

  it("shows every build and observe tool, and each workload's first three parts", () => {
    for (const l of estate.controlPlane) for (const n of l.nodes) expect(text, n.label).toContain(n.label);
    for (const z of estate.zones) {
      for (const n of z.nodes.slice(0, 3)) expect(text, n.label).toContain(n.label);
      for (const n of z.nodes.slice(3)) expect(text, n.label).not.toContain(n.label);
    }
  });

  it("draws a connector only where the estate has an edge, so nothing implies the AI work runs through the pipelines", () => {
    expect(wires("ship")).toEqual(reached("build"));
    expect(wires("observe")).toEqual(reached("observe"));
    expect(wires("ship")).not.toContain("ai");
  });

  it("lights in three steps, one per verb: build, ship, observe", () => {
    expect(positioning.verbs).toHaveLength(3);
    for (const step of ["build", "ship", "observe"]) expect(html).toContain(`data-step="${step}"`);
  });
});

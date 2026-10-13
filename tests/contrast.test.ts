import { describe, expect, it } from "vitest";
import { mixOklab, over, ratio, themeTokens, type Tokens } from "./contrast";

const { light, dark, darkMedia } = themeTokens();

it("the no-JavaScript dark block matches the toggled dark theme", () => {
  expect(darkMedia).toEqual(dark);
});

/** Every text pairing the components use (DESIGN.md's AA Floor Rule). */
function textPairs(t: Tokens): [string, string, string][] {
  const grounds = ["canvas", "surface-1", "surface-2"];
  // A work card's ground: its cloud at 6% over Surface One (project-card.tsx).
  const card = (tint: string) => mixOklab(t[tint], 6, t["surface-1"]);
  return [
    ...["ink", "ink-2", "ink-3"].flatMap((fg) => grounds.map((bg): [string, string, string] => [`${fg} on ${bg}`, t[fg], t[bg]])),
    ["ink on surface-3", t.ink, t["surface-3"]],
    ["ink-2 on surface-3", t["ink-2"], t["surface-3"]],
    ...grounds.map((bg): [string, string, string] => [`accent on ${bg}`, t.accent, t[bg]]),
    ["accent on an active chip (accent-soft over the map band)", t.accent, over(t["accent-soft"], t["surface-1"])],
    // A lit tool keeps its canvas chip under the wash: accent-soft straight over a lane's Surface Two is 4.47:1.
    ["accent on a lit hero tool or part (accent-soft over canvas)", t.accent, over(t["accent-soft"], t.canvas)],
    ["accent-ink on accent", t["accent-ink"], t.accent],
    ["canvas on ink (pill buttons)", t.canvas, t.ink],
    ...["cloud-azure", "cloud-aws", "cloud-ai"].flatMap((z): [string, string, string][] => [
      [`${z} label on its card`, t[z], card(z)],
      [`ink-2 on the ${z} card`, t["ink-2"], card(z)],
      [`ink-3 on the ${z} card`, t["ink-3"], card(z)],
    ]),
    ["ink-3 on the personal card", t["ink-3"], card("ink-3")],
  ];
}

/** Graphics a reader needs (WCAG 1.4.11): edges, diagram group outlines, arrows, the focus ring. */
function graphicPairs(t: Tokens): [string, string, string][] {
  return ["canvas", "surface-1", "surface-2"].flatMap((bg): [string, string, string][] => [
    [`line-graphic on ${bg}`, t["line-graphic"], t[bg]],
    [`ink-3 strokes on ${bg}`, t["ink-3"], t[bg]],
    [`accent focus ring on ${bg}`, t.accent, t[bg]],
  ]);
}

describe.each([
  ["light", light],
  ["dark", dark],
])("%s theme", (_, t) => {
  it.each(textPairs(t))("%s clears 4.5:1", (_, fg, bg) => {
    expect(ratio(fg, bg)).toBeGreaterThanOrEqual(4.5);
  });
  it.each(graphicPairs(t))("%s clears 3:1", (_, fg, bg) => {
    expect(ratio(fg, bg)).toBeGreaterThanOrEqual(3);
  });
});

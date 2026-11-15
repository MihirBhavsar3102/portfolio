import { describe, expect, it } from "vitest";
import { coverDepth, nearestIndex, obscured } from "@/lib/reel";

describe("nearestIndex", () => {
  const at = [0, 480, 960, 1440, 1920];
  it("is the study whose position is nearest the scroll", () => {
    expect(nearestIndex(at, 0, 1500)).toBe(0);
    expect(nearestIndex(at, 250, 1500)).toBe(1);
    expect(nearestIndex(at, 1000, 1500)).toBe(2);
  });
  it("is the last study at the end of the range, even when its position can't be reached", () => {
    expect(nearestIndex(at, 1500, 1500)).toBe(4);
    expect(nearestIndex(at, 1499.4, 1500)).toBe(4);
  });
  it("lets each study be current at its own position once the range reaches the last (room after the last card)", () => {
    const wide = [0, 428, 856, 1284, 1712];
    wide.forEach((p, i) => expect(nearestIndex(wide, p, 1712)).toBe(i));
  });
  it("folds the studies whose positions lie past the end into the last, which is why the window leaves room after it", () => {
    expect(nearestIndex([0, 428, 856, 1284, 1712], 1263, 1263)).toBe(4);
  });
  it("is the first for an empty list", () => expect(nearestIndex([], 10, 0)).toBe(0));
  it("is the first when nothing scrolls", () => expect(nearestIndex(at, 0, 0)).toBe(0));
});

describe("coverDepth", () => {
  const at = [0, 480, 960, 1440, 1920];
  it("is 0 until the next card starts to slide over, then grows with the scroll", () => {
    expect(coverDepth(at, 0, 1500, 0)).toBe(0);
    expect(coverDepth(at, 240, 1500, 0)).toBe(0.5);
    expect(coverDepth(at, 480, 1500, 0)).toBe(1);
    expect(coverDepth(at, 960, 1500, 2)).toBe(0);
  });
  it("stops at three cards deep", () => expect(coverDepth(at, 1500, 1500, 0)).toBe(3));
  it("counts the last card as fully over the one before at the end of the range", () => {
    expect(coverDepth(at, 1500, 1500, 3)).toBe(1);
  });
  it("is 0 for the last card, which nothing covers", () => expect(coverDepth(at, 1500, 1500, 4)).toBe(0));
});

describe("obscured", () => {
  const view = { top: 100, right: 600, bottom: 680, left: 0 };
  const link = { top: 140, right: 400, bottom: 170, left: 32 };
  it("is false for a link in plain view, with the next card only peeking below it", () => {
    expect(obscured(link, view, [])).toBe(false);
    expect(obscured(link, view, [656, 1180])).toBe(false);
  });
  it("is true for a link the window cuts off on any side", () => {
    expect(obscured({ ...link, top: 90, bottom: 120 }, view, [])).toBe(true);
    expect(obscured({ ...link, top: 670, bottom: 700 }, view, [])).toBe(true);
    expect(obscured({ ...link, left: -20, right: 300 }, view, [])).toBe(true);
    expect(obscured({ ...link, left: 500, right: 760 }, view, [])).toBe(true);
  });
  it("is true for a link a later card has slid over", () => {
    expect(obscured(link, view, [107, 114])).toBe(true);
    expect(obscured(link, view, [160])).toBe(true);
  });
  it("forgives a sub-pixel overlap at an edge", () => {
    expect(obscured({ ...link, top: 99.6 }, view, [])).toBe(false);
    expect(obscured(link, view, [169.5])).toBe(false);
  });
});

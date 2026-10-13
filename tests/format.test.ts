import { describe, expect, it } from "vitest";
import { listOf, monthYear, period, shortClaim, slugify } from "@/lib/format";

describe("monthYear", () => {
  it("formats an ISO month", () => expect(monthYear("2024-12")).toBe("Dec 2024"));
  it("handles January", () => expect(monthYear("2025-01")).toBe("Jan 2025"));
});

describe("period", () => {
  it("runs to present without an end", () => expect(period("2024-12")).toBe("Dec 2024 – present"));
  it("closes with an end month", () => expect(period("2024-12", "2026-03")).toBe("Dec 2024 – Mar 2026"));
});

describe("slugify", () => {
  it("lowercases and hyphenates", () =>
    expect(slugify("What I built and what the team did")).toBe("what-i-built-and-what-the-team-did"));
  it("drops punctuation at the ends", () => expect(slugify("  What broke? ")).toBe("what-broke"));
});

describe("shortClaim", () => {
  it("keeps a figure's claim up to its first comma", () => {
    expect(shortClaim("less manual effort across 5 clients, with configuration errors near zero")).toBe("less manual effort across 5 clients");
    expect(shortClaim("uptime on a multi-AZ WordPress platform")).toBe("uptime on a multi-AZ WordPress platform");
  });
});

describe("listOf", () => {
  it("joins two with and", () => expect(listOf(["built", "shipped"])).toBe("built and shipped"));
  it("joins three with a comma and and, no serial comma", () =>
    expect(listOf(["built", "shipped", "monitored"])).toBe("built, shipped and monitored"));
  it("leaves one alone", () => expect(listOf(["built"])).toBe("built"));
});

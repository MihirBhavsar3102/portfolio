import { describe, expect, it } from "vitest";
import { fragmentId, listOf, monthYear, period, shortClaim, sitePath, slugify, tenure } from "@/lib/format";

describe("sitePath", () => {
  it("reads Vercel's regenerated root, /index, as home", () => expect(sitePath("/index")).toBe("/"));
  it("leaves every other path alone", () => {
    expect(sitePath("/")).toBe("/");
    expect(sitePath("/work/avd-automation")).toBe("/work/avd-automation");
    expect(sitePath("/work/index")).toBe("/work/index");
  });
});

describe("fragmentId", () => {
  it("strips the hash and decodes", () => expect(fragmentId("#what%20broke")).toBe("what broke"));
  it("is empty without a fragment", () => {
    expect(fragmentId("")).toBe("");
    expect(fragmentId("#")).toBe("");
  });
  it("is empty, not a throw, for a malformed escape", () => {
    expect(fragmentId("#%")).toBe("");
    expect(fragmentId("#%E0%A4%A")).toBe("");
  });
});

describe("monthYear", () => {
  it("formats an ISO month", () => expect(monthYear("2024-12")).toBe("Dec 2024"));
  it("handles January", () => expect(monthYear("2025-01")).toBe("Jan 2025"));
});

describe("period", () => {
  it("runs to present without an end", () => expect(period("2024-12")).toBe("Dec 2024 – present"));
  it("closes with an end month", () => expect(period("2024-12", "2026-03")).toBe("Dec 2024 – Mar 2026"));
});

describe("tenure", () => {
  it("counts whole months since the start month, as the resume does", () =>
    expect(tenure("2024-12", new Date(2026, 9, 16))).toBe("1 yr 10 mos"));
  it("drops a zero part and uses singulars", () => {
    expect(tenure("2024-12", new Date(2025, 11, 1))).toBe("1 yr");
    expect(tenure("2024-12", new Date(2026, 0, 31))).toBe("1 yr 1 mo");
    expect(tenure("2024-12", new Date(2025, 3, 2))).toBe("4 mos");
    expect(tenure("2024-12", new Date(2026, 11, 5))).toBe("2 yrs");
  });
  it("is empty within the start month", () => expect(tenure("2024-12", new Date(2024, 11, 20))).toBe(""));
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

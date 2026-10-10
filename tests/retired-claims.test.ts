import { describe, expect, it } from "vitest";
import { listSourceFiles, readSource } from "./source-files";

/** Claims retired by the October 2026 resume (spec §5). Remove one only when Mihir re-confirms it. */
const RETIRED = [
  "Parkar Digital",
  "200+",
  "1.5+ years",
  "Cloud Infrastructure Intern",
  "keyword search",
  "rollback",
  "daily deployment",
  "monthly AWS spend",
  "3+ client",
  "in production",
];

describe("retired claims", () => {
  it("do not appear in site source", () => {
    const hits = listSourceFiles(["lib", "components", "app", "content"]).flatMap((f) => {
      const text = readSource(f).toLowerCase();
      return RETIRED.filter((c) => text.includes(c.toLowerCase())).map((c) => `${f}: ${c}`);
    });
    expect(hits).toEqual([]);
  });
});

import { describe, expect, it } from "vitest";
import { listSourceFiles, readSource } from "./source-files";

/** Claims retired by the October 2026 resume (spec §5). Remove one only when Mihir re-confirms it. */
const RETIRED = [
  "Parkar Digital",
  "200+",
  "1.5+ years",
  "Cloud Infrastructure Intern",
  "rollback",
  "daily deployment",
  "3+ client",
  "in production",
  // The work ran on Azure and AWS client environments; GCP is a skill, not where the work ran (resume PDF, 2026-10-21).
  "AWS, Azure and GCP",
];
// Re-confirmed by Mihir on 2026-10-21 (the resume PDF is the source of truth): "keyword search" (the HR
// assistant replaced manual lookups and keyword search) and "monthly AWS spend" (the 25% saving is AWS spend).

describe("retired claims", () => {
  it("do not appear in site source or the README", () => {
    const hits = [...listSourceFiles(["lib", "components", "app", "content"]), "README.md"].flatMap((f) => {
      const text = readSource(f).toLowerCase();
      return RETIRED.filter((c) => text.includes(c.toLowerCase())).map((c) => `${f}: ${c}`);
    });
    expect(hits).toEqual([]);
  });
});

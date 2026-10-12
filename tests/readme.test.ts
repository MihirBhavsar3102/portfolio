import { describe, expect, it } from "vitest";
import { existsSync, readFileSync } from "node:fs";

const readme = readFileSync("README.md", "utf8");

describe("README", () => {
  it("links only to files that exist", () => {
    const targets = [...readme.matchAll(/\]\(([^)#\s]+)(?:#[^)]*)?\)/g)].map((m) => m[1]).filter((t) => !/^[a-z]+:/.test(t));
    expect(targets.length).toBeGreaterThan(0);
    for (const t of targets) expect(existsSync(t), t).toBe(true);
  });

  it("describes this site, not an earlier one", () => {
    for (const gone of ["Framer Motion", "typewriter", "Inter", "Tooltip", "DropdownMenu", "#0F4C81", "count up"]) {
      expect(readme, gone).not.toContain(gone);
    }
  });
});

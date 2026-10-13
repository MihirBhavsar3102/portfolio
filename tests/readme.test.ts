import { describe, expect, it } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import { resume } from "@/lib/resume-data";

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

  it("is about the site and its author, not a setup guide", () => {
    for (const step of ["npm install", "npm run", "```bash", "docker run"]) expect(readme, step).not.toContain(step);
  });

  it("quotes only figures the site states", () => {
    const stated = new Set(resume.projects.flatMap((p) => p.figures.map((f) => f.value)));
    const quoted = [...readme.matchAll(/\*\*([~<]?\d[\d.]*%?\+?)\*\*/g)].map((m) => m[1]);
    expect(quoted.length).toBeGreaterThan(0);
    for (const q of quoted) expect(stated.has(q), q).toBe(true);
  });
});

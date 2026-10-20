import { describe, expect, it } from "vitest";
import { createElement } from "react";
import { listSourceFiles, readSource } from "./source-files";
import { htmlOf } from "./render";

/** The two Radix pieces, each loaded on first use (a menu tap, a copy) rather than with every page. */
const LAZY = ["components/site/mobile-menu.tsx", "components/ui/copy-toast.tsx"];
const RADIX_HOSTS = [...LAZY, "components/ui/dialog.tsx"];
const norm = (f: string) => f.replace(/\\/g, "/");

describe("the first load", () => {
  const files = listSourceFiles(["app", "components", "lib"]).map(norm);

  it("leaves Radix out: only the lazily loaded menu and toast (and the dialog they use) import it", () => {
    const importers = files.filter((f) => /from "radix-ui"|from "@\/components\/ui\/dialog"/.test(readSource(f)));
    expect(importers.filter((f) => !RADIX_HOSTS.includes(f))).toEqual([]);
  });

  it("reaches the menu and the toast only through a dynamic import", () => {
    for (const lazy of LAZY) {
      const name = lazy.replace(/^components\//, "@/components/").replace(/\.tsx$/, "");
      const statics = files.filter((f) => readSource(f).includes(`from "${name}"`));
      expect(statics, lazy).toEqual([]);
      expect(files.some((f) => readSource(f).includes(`import("${name}")`)), lazy).toBe(true);
    }
  });

  it("renders the menu button alone on the server, saying it opens a dialog", async () => {
    const { MobileNav } = await import("@/components/site/mobile-nav");
    const html = htmlOf(createElement(MobileNav));
    expect(html).toMatch(/<button[^>]*aria-label="Open menu"[^>]*>/);
    expect(html).toContain('aria-haspopup="dialog"');
    expect(html).toContain('aria-expanded="false"');
    expect(html).not.toContain('role="dialog"');
  });
});

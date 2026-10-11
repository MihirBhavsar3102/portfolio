import { describe, expect, it } from "vitest";
import { runInNewContext } from "node:vm";
import { THEME_KEY, themeScript } from "@/lib/theme";

/** Runs the pre-paint script against a fake browser and returns what it set on <html>. */
function boot({ stored, systemDark, storageThrows = false }: { stored?: string | null; systemDark: boolean; storageThrows?: boolean }) {
  const root = { dataset: {} as Record<string, string>, style: {} as Record<string, string> };
  runInNewContext(themeScript, {
    document: { documentElement: root },
    localStorage: {
      getItem: (key: string) => {
        if (storageThrows) throw new Error("blocked");
        return key === THEME_KEY ? (stored ?? null) : null;
      },
    },
    matchMedia: (q: string) => ({ matches: q === "(prefers-color-scheme: dark)" && systemDark }),
  });
  return { theme: root.dataset.theme, scheme: root.style.colorScheme };
}

describe("themeScript", () => {
  it("follows the system setting on a first visit", () => {
    expect(boot({ systemDark: true })).toEqual({ theme: "dark", scheme: "dark" });
    expect(boot({ systemDark: false })).toEqual({ theme: "light", scheme: "light" });
  });

  it("keeps the visitor's stored choice over the system setting", () => {
    expect(boot({ stored: "light", systemDark: true }).theme).toBe("light");
    expect(boot({ stored: "dark", systemDark: false }).theme).toBe("dark");
  });

  it("ignores a stored value it doesn't know", () => {
    expect(boot({ stored: "sepia", systemDark: true }).theme).toBe("dark");
  });

  it("still themes the page when storage is blocked", () => {
    expect(boot({ storageThrows: true, systemDark: true }).theme).toBe("dark");
  });
});

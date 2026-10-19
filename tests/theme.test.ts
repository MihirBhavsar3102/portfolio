import { afterEach, describe, expect, it, vi } from "vitest";
import { runInNewContext } from "node:vm";
import { THEME_KEY, setTheme, themeScript } from "@/lib/theme";

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

describe("setTheme", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("holds colour transitions for the switch and releases them two frames later", () => {
    const root = { dataset: {} as Record<string, string>, style: {} as Record<string, string> };
    const frames: (() => void)[] = [];
    const stored: Record<string, string> = {};
    vi.stubGlobal("document", { documentElement: root });
    vi.stubGlobal("localStorage", { setItem: (k: string, v: string) => (stored[k] = v) });
    vi.stubGlobal("requestAnimationFrame", (cb: () => void) => frames.push(cb));

    setTheme("dark");
    expect(root.dataset).toEqual({ theme: "dark", themeSwitching: "" });
    expect(root.style.colorScheme).toBe("dark");
    expect(stored[THEME_KEY]).toBe("dark");

    frames.shift()!(); // the frame that paints the new theme: still held
    expect(root.dataset).toHaveProperty("themeSwitching");
    frames.shift()!(); // the next: released, with nothing left to animate
    expect(root.dataset).toEqual({ theme: "dark" });
  });

  it("still switches when storage is blocked", () => {
    const root = { dataset: {} as Record<string, string>, style: {} as Record<string, string> };
    vi.stubGlobal("document", { documentElement: root });
    vi.stubGlobal("localStorage", { setItem: () => { throw new Error("blocked"); } });
    vi.stubGlobal("requestAnimationFrame", () => 0);
    expect(() => setTheme("light")).not.toThrow();
    expect(root.dataset.theme).toBe("light");
  });
});

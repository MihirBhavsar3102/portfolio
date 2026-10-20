import { afterEach, describe, expect, it, vi } from "vitest";

/** A fresh copy of the module per test: it keeps the page's choice in memory. */
const load = async () => {
  vi.resetModules();
  return import("@/lib/hero-motion");
};

const storage = (initial: Record<string, string> = {}, throws = false) => {
  const items = new Map(Object.entries(initial));
  const guard = () => {
    if (throws) throw new Error("blocked");
  };
  return {
    items,
    getItem: (k: string) => (guard(), items.get(k) ?? null),
    setItem: (k: string, v: string) => (guard(), void items.set(k, v)),
    removeItem: (k: string) => (guard(), void items.delete(k)),
  };
};

afterEach(() => vi.unstubAllGlobals());

describe("the hero's motion preference", () => {
  it("plays by default", async () => {
    vi.stubGlobal("localStorage", storage());
    const { heroPaused } = await load();
    expect(heroPaused()).toBe(false);
  });

  it("remembers a pause across visits, and forgets it on play", async () => {
    const store = storage();
    vi.stubGlobal("localStorage", store);
    const { setHeroPaused, heroPaused, HERO_MOTION_KEY } = await load();
    setHeroPaused(true);
    expect(store.items.get(HERO_MOTION_KEY)).toBe("paused");
    expect((await load()).heroPaused()).toBe(true);
    (await load()).setHeroPaused(false);
    expect(store.items.has(HERO_MOTION_KEY)).toBe(false);
  });

  it("still pauses for this page view when storage is blocked", async () => {
    vi.stubGlobal("localStorage", storage({}, true));
    const { setHeroPaused, heroPaused } = await load();
    expect(heroPaused()).toBe(false);
    setHeroPaused(true);
    expect(heroPaused()).toBe(true);
  });

  it("tells subscribers when it changes", async () => {
    vi.stubGlobal("localStorage", storage());
    vi.stubGlobal("window", { addEventListener: () => {}, removeEventListener: () => {} });
    const { setHeroPaused, subscribeHeroMotion } = await load();
    const seen = vi.fn();
    const stop = subscribeHeroMotion(seen);
    setHeroPaused(true);
    stop();
    setHeroPaused(false);
    expect(seen).toHaveBeenCalledTimes(1);
  });
});

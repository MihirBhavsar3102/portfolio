/**
 * The visitor's choice to pause the hero's story, remembered across visits.
 * The story would otherwise keep moving for as long as the hero is on screen,
 * and WCAG 2.2.2 asks for a way to stop that.
 */
export const HERO_MOTION_KEY = "hero-motion";

/** This page view's choice, which outlives blocked storage. */
let chosen: boolean | null = null;
const listeners = new Set<() => void>();

/** Whether the story is paused: this page's choice, else the stored one. */
export function heroPaused(): boolean {
  if (chosen !== null) return chosen;
  try {
    return localStorage.getItem(HERO_MOTION_KEY) === "paused";
  } catch {
    return false;
  }
}

export function setHeroPaused(paused: boolean) {
  chosen = paused;
  try {
    if (paused) localStorage.setItem(HERO_MOTION_KEY, "paused");
    else localStorage.removeItem(HERO_MOTION_KEY);
  } catch {
    // Storage blocked: the choice still holds for this page view.
  }
  listeners.forEach((listener) => listener());
}

/** For useSyncExternalStore. */
export function subscribeHeroMotion(onChange: () => void) {
  listeners.add(onChange);
  return () => {
    listeners.delete(onChange);
  };
}

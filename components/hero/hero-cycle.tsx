"use client";

import { useEffect, useRef } from "react";

/**
 * Plays the hero's story: steps data-phase on the enclosing [data-hero]
 * through the given steps, one every `interval` ms, while the hero is on
 * screen and the tab is visible. The attribute drives everything in CSS (the
 * rolling word, the lit preview), so a step costs no re-render. Under reduced
 * motion it never starts, and the hero stays at rest.
 */
export function HeroCycle({ steps, interval = 3200 }: { steps: readonly string[]; interval?: number }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const hero = ref.current?.closest<HTMLElement>("[data-hero]");
    if (!hero || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let step = 0;
    let timer: number | undefined;
    let onScreen = false;
    hero.dataset.phase = steps[0];

    const advance = () => {
      step = (step + 1) % steps.length;
      hero.dataset.phase = steps[step];
    };
    const sync = () => {
      const run = onScreen && !document.hidden;
      if (run && timer === undefined) timer = window.setInterval(advance, interval);
      if (!run && timer !== undefined) {
        window.clearInterval(timer);
        timer = undefined;
      }
    };
    const observer = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      sync();
    });
    observer.observe(hero);
    document.addEventListener("visibilitychange", sync);

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", sync);
      window.clearInterval(timer);
      delete hero.dataset.phase;
    };
  }, [steps, interval]);

  return <span ref={ref} hidden />;
}

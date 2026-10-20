"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { Pause, Play } from "lucide-react";
import { heroPaused, setHeroPaused, subscribeHeroMotion } from "@/lib/hero-motion";

/**
 * Plays the hero's story: steps data-phase on the enclosing [data-hero]
 * through the given steps, one every `interval` ms, while the hero is on
 * screen and the tab is visible. The attribute drives everything in CSS (the
 * rolling word, the lit preview), so a step costs no re-render. Under reduced
 * motion it never starts, and the hero stays at rest.
 *
 * Its button pauses the story where it stands and plays it on from there; the
 * choice is remembered (lib/hero-motion.ts). The button shows only where the
 * story can play: not under reduced motion, nor without JavaScript (globals.css).
 */
export function HeroCycle({ steps, interval = 3200 }: { steps: readonly string[]; interval?: number }) {
  const ref = useRef<HTMLButtonElement>(null);
  const step = useRef(0);
  const paused = useSyncExternalStore(subscribeHeroMotion, heroPaused, () => false);

  useEffect(() => {
    const hero = ref.current?.closest<HTMLElement>("[data-hero]");
    if (!hero || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Read the store too: the first run comes from the hydration render, where
    // `paused` is still the server's false, and a stored pause must not light a step.
    if (paused || heroPaused()) {
      // The lit step stays as it is; data-paused stops the packets.
      hero.dataset.paused = "";
      return () => {
        delete hero.dataset.paused;
      };
    }

    let timer: number | undefined;
    let onScreen = false;
    hero.dataset.phase = steps[step.current];

    const advance = () => {
      step.current = (step.current + 1) % steps.length;
      hero.dataset.phase = steps[step.current];
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
    };
  }, [steps, interval, paused]);

  const Icon = paused ? Play : Pause;
  return (
    <button
      ref={ref}
      type="button"
      onClick={() => setHeroPaused(!paused)}
      aria-label={paused ? "Play animation" : "Pause animation"}
      className="hero-motion absolute right-5 bottom-6 size-8 items-center justify-center rounded-full border border-line-strong text-ink-3 transition-colors hover:bg-surface-2 hover:text-ink sm:right-10"
    >
      <Icon aria-hidden="true" className="size-3.5" strokeWidth={2} />
    </button>
  );
}

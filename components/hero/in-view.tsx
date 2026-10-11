"use client";

import { useEffect, useRef } from "react";

/**
 * Plays the map's one load moment when it first scrolls into view rather than
 * unseen at page load: data-animate holds the start state while it is off
 * screen, data-inview runs it (globals.css). Without JavaScript, or under
 * reduced motion, neither applies and the map simply rests.
 */
export function InView({ className, children }: { className?: string; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.setAttribute("data-animate", "");
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        el.setAttribute("data-inview", "");
        observer.disconnect();
      },
      { threshold: 0.2 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

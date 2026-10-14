"use client";

import { useEffect, useRef } from "react";
import { fragmentId } from "@/lib/format";

/** Whether the element is, or holds, the #fragment the page was opened at. */
function holdsFragment(el: HTMLElement) {
  const id = fragmentId(window.location.hash);
  const target = id ? document.getElementById(id) : null;
  return !!target && (target.contains(el) || el.contains(target));
}

/**
 * A one-time entrance, played when an element first scrolls into view rather
 * than unseen at page load: data-animate holds the start state while it is off
 * screen, data-inview runs it (globals.css). The observer's first report is
 * the state at hydration (read without forcing layout): anything already on
 * screen then is left at rest, so a reload part-way down never blinks. So is
 * the section a #fragment link opens at, which the browser may scroll to only
 * after hydration. Without JavaScript, or under reduced motion, nothing applies.
 */

export function InView({
  className,
  threshold = 0.2,
  rootMargin = "0px",
  children,
}: {
  className?: string;
  threshold?: number;
  rootMargin?: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let first = true;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (first) {
          first = false;
          const { top, bottom } = entry.boundingClientRect;
          if ((top < window.innerHeight && bottom > 0) || holdsFragment(el)) return observer.disconnect();
          el.setAttribute("data-animate", "");
        }
        if (!entry.isIntersecting) return;
        el.setAttribute("data-inview", "");
        observer.disconnect();
      },
      { threshold, rootMargin },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

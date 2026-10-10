"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { MobileNav } from "@/components/mobile-nav";
import { resume } from "@/lib/resume-data";
import { sections } from "@/lib/sections";

/** Tracks which section is currently in view to drive the active nav rule. */
function useActiveSection() {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] }
    );

    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return active;
}

/**
 * The sheet's header strip. It sits on paper above the navy field rather than
 * floating over it, so it never has to fight two grounds for legibility.
 */
export function SiteNav() {
  const active = useActiveSection();
  const reduceMotion = useReducedMotion();

  return (
    <header className="sticky top-0 z-50 border-b border-rule bg-paper/92 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-352 items-center justify-between gap-4 px-5 sm:px-8">
        <a
          href="#"
          className="font-display text-[15px] font-extrabold tracking-[-0.02em] whitespace-nowrap"
        >
          {resume.name}
        </a>

        <div className="flex items-center gap-1.5 md:gap-4">
          <nav aria-label="Sections" className="hidden items-center md:flex">
            {sections.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                aria-current={active === s.id ? "location" : undefined}
                className={`relative px-3 py-4 text-[12px] font-semibold uppercase tracking-widest transition-colors ${
                  active === s.id ? "text-ink" : "text-ink-3 hover:text-ink"
                }`}
              >
                {s.label}
                {active === s.id && (
                  <motion.span
                    layoutId="nav-active-rule"
                    className="absolute inset-x-2 bottom-0 h-0.5 bg-signal"
                    transition={
                      reduceMotion
                        ? { duration: 0 }
                        : { type: "spring", stiffness: 380, damping: 30 }
                    }
                  />
                )}
              </a>
            ))}
          </nav>


          <a
            href={`mailto:${resume.email}?subject=${encodeURIComponent(
              "Cloud/DevOps role — let's talk"
            )}`}
            className="hidden bg-signal px-4 py-2.5 text-[12px] font-semibold uppercase tracking-widest text-signal-ink transition-colors hover:bg-ink lg:inline-flex"
          >
            Book a call
          </a>

          <MobileNav />
        </div>
      </div>
    </header>
  );
}

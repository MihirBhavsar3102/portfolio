"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ThemeToggle } from "@/components/theme-toggle";

const sections = [
  { label: "About", id: "about" },
  { label: "Experience", id: "experience" },
  { label: "Projects", id: "projects" },
  { label: "Skills", id: "skills" },
  { label: "Contact", id: "contact" },
];

/** Tracks which section is currently in view to drive the active nav indicator. */
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

export function SiteNav() {
  const active = useActiveSection();
  const reduceMotion = useReducedMotion();

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-bg/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between gap-4 px-6">
        <a href="#" className="font-display text-base font-bold tracking-tight">
          Mihir Bhavsar
        </a>
        <div className="flex items-center gap-6">
          <nav aria-label="Sections" className="hidden items-center gap-1 md:flex">
            {sections.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                aria-current={active === s.id ? "location" : undefined}
                className={`relative px-3 py-2 text-sm font-medium transition-colors ${
                  active === s.id ? "text-ink" : "text-muted hover:text-ink"
                }`}
              >
                {s.label}
                {active === s.id && (
                  <motion.span
                    layoutId="nav-active-indicator"
                    className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-accent"
                    transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </a>
            ))}
          </nav>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

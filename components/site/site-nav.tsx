"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Download } from "lucide-react";
import { MobileNav } from "@/components/site/mobile-nav";
import { resume } from "@/lib/resume-data";
import { sections } from "@/lib/sections";

/** Which section is in view, to drive the active link and its indicator. */
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
      { rootMargin: "-40% 0px -50% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] },
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
  const pathname = usePathname();
  const base = pathname === "/" ? "" : "/";
  const navRef = useRef<HTMLElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);

  // The indicator is positioned with CSS variables rather than state, so it
  // glides between links on a transition and costs no re-render.
  useEffect(() => {
    const bar = barRef.current;
    const link = active ? navRef.current?.querySelector<HTMLElement>(`[data-section="${active}"]`) : null;
    if (!bar) return;
    if (!link) {
      bar.style.opacity = "0";
      return;
    }
    bar.style.setProperty("--x", `${link.offsetLeft + 12}px`);
    bar.style.setProperty("--w", `${link.offsetWidth - 24}px`);
    bar.style.opacity = "1";
  }, [active]);

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-canvas/85 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-4 px-5 sm:px-8">
        <Link href="/" className="text-base font-semibold tracking-[-0.01em] whitespace-nowrap text-ink">
          {resume.name}
        </Link>

        <div className="flex items-center gap-2 md:gap-3">
          <nav ref={navRef} aria-label="Sections" className="relative hidden items-center md:flex">
            {sections.map((s) => (
              <a
                key={s.id}
                href={`${base}#${s.id}`}
                data-section={s.id}
                aria-current={active === s.id ? "location" : undefined}
                className={`px-3 py-4 text-sm transition-colors ${
                  active === s.id ? "text-ink" : "text-ink-3 hover:text-ink"
                }`}
              >
                {s.label}
              </a>
            ))}
            <span
              ref={barRef}
              aria-hidden="true"
              className="pointer-events-none absolute bottom-0 left-0 h-0.5 w-(--w) translate-x-(--x) rounded-full bg-accent opacity-0 transition-[translate,width,opacity] duration-300 ease-out-expo"
            />
          </nav>

          <a
            href={resume.resumeFile}
            download
            className="hidden items-center gap-2 rounded-md border border-line-strong px-3 py-1.5 text-sm font-medium text-ink transition-colors hover:border-ink-3 hover:bg-surface-2 md:inline-flex"
          >
            <Download aria-hidden="true" className="size-3.5" strokeWidth={2} />
            Resume
          </a>

          <MobileNav />
        </div>
      </div>
    </header>
  );
}

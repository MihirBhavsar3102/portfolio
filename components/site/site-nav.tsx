"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Download } from "lucide-react";
import { MobileNav } from "@/components/site/mobile-nav";
import { ThemeToggle } from "@/components/site/theme-toggle";
import { frame } from "@/components/site/frame";
import { resume } from "@/lib/resume-data";
import { sections } from "@/lib/sections";

/** Which section is in view, to drive the active link and its indicator. */
function useActiveSection(pathname: string) {
  const [active, setActive] = useState<string | null>(null);

  // Re-observe on every route change: coming back from a case study mounts
  // fresh section elements, and an observer on the old ones goes quiet.
  useEffect(() => {
    // Every section currently in the band, so the mark clears when none is
    // (back up at the hero) instead of keeping the last one seen.
    const inView = new Map<string, number>();
    // The last section can be too short to ever reach the band; at the foot
    // of the page it is the one being read.
    const last = sections[sections.length - 1].id;
    let atEnd = false;
    const update = () => {
      if (atEnd && document.getElementById(last)) return setActive(last);
      const [top] = [...inView].sort((a, b) => b[1] - a[1]);
      setActive(top ? top[0] : null);
    };
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) inView.set(entry.target.id, entry.intersectionRatio);
          else inView.delete(entry.target.id);
        }
        update();
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] },
    );
    const onScroll = () => {
      const end = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
      if (end !== atEnd) {
        atEnd = end;
        update();
      }
    };

    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, [pathname]);

  return active;
}

export function SiteNav() {
  const pathname = usePathname();
  const active = useActiveSection(pathname);
  // On a case study the Work link stays marked: that's where the reader is.
  const current = pathname.startsWith("/work/") ? "work" : active;
  const base = pathname === "/" ? "" : "/";
  const navRef = useRef<HTMLElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);

  // The indicator is positioned with CSS variables rather than state, so it
  // glides between links on a transition and costs no re-render.
  useEffect(() => {
    const bar = barRef.current;
    const link = current ? navRef.current?.querySelector<HTMLElement>(`[data-section="${current}"]`) : null;
    if (!bar) return;
    if (!link) {
      bar.style.opacity = "0";
      return;
    }
    bar.style.setProperty("--x", `${link.offsetLeft + 12}px`);
    bar.style.setProperty("--w", `${link.offsetWidth - 24}px`);
    bar.style.opacity = "1";
  }, [current]);

  return (
    <header className="sticky top-0 z-50 bg-canvas/85 backdrop-blur-md">
      <div className={`${frame} flex h-14 items-center justify-between gap-4`}>
        <Link href="/" className="py-1 text-[15px] font-semibold tracking-tight whitespace-nowrap text-ink">
          {resume.name}
        </Link>

        <nav ref={navRef} aria-label="Sections" className="relative hidden items-center md:flex">
          {sections.map((s) => (
            <a
              key={s.id}
              href={`${base}#${s.id}`}
              data-section={s.id}
              aria-current={current === s.id ? (pathname === "/" ? "location" : "true") : undefined}
              className={`px-3 py-4 text-[13px] transition-colors ${current === s.id ? "text-ink" : "text-ink-2 hover:text-ink"}`}
            >
              {s.label}
            </a>
          ))}
          <span
            ref={barRef}
            aria-hidden="true"
            className="pointer-events-none absolute bottom-2 left-0 h-px w-(--w) translate-x-(--x) bg-ink opacity-0 transition-[translate,width,opacity] duration-300 ease-out-expo"
          />
        </nav>

        <div className="flex items-center gap-1">
          <ThemeToggle />
          <a
            href={resume.resumeFile}
            download
            className="hidden items-center gap-1.5 px-2 py-2 text-[13px] font-medium text-accent hover:underline md:inline-flex"
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

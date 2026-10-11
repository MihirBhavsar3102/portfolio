"use client";

import { useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";
import { setTheme, type Theme } from "@/lib/theme";

function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => observer.disconnect();
}

const readTheme = () => (document.documentElement.dataset.theme as Theme | undefined) ?? null;

/**
 * Light or dark, remembered across visits. The icon is chosen by CSS from
 * <html data-theme> so it is right from the first paint; without JavaScript
 * the control hides and the system setting decides (globals.css).
 */
export function ThemeToggle({ className = "" }: { className?: string }) {
  const theme = useSyncExternalStore(subscribe, readTheme, () => null);
  const next: Theme = theme === "dark" ? "light" : "dark";
  return (
    <button
      type="button"
      onClick={() => setTheme(next)}
      aria-label={`Switch to ${next} theme`}
      className={`theme-toggle inline-flex size-9 shrink-0 items-center justify-center rounded-full text-ink-2 transition-colors hover:bg-surface-2 hover:text-ink ${className}`}
    >
      <Moon aria-hidden="true" className="theme-icon-dark size-[18px]" strokeWidth={1.75} />
      <Sun aria-hidden="true" className="theme-icon-light size-[18px]" strokeWidth={1.75} />
    </button>
  );
}

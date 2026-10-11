"use client";

import { useEffect, useState } from "react";
import { ArrowDown, X } from "lucide-react";
import { useTrace } from "@/components/hero/trace-provider";

/**
 * The figures sit a screen above the map they light. When one is pinned and
 * the map is out of view, a small bar says so and offers the way down, so a
 * click on a figure never looks like it did nothing.
 */
export function TraceHint({ targetId, values }: { targetId: string; values: Record<string, string> }) {
  const { state, send } = useTrace();
  const [mapInView, setMapInView] = useState(false);

  useEffect(() => {
    const target = document.getElementById(targetId);
    if (!target) return;
    const observer = new IntersectionObserver(([entry]) => setMapInView(entry.isIntersecting), { threshold: 0.2 });
    observer.observe(target);
    return () => observer.disconnect();
  }, [targetId]);

  const pinned = state.pinned ? state.active : null;
  const show = pinned !== null && !mapInView;

  return (
    <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-5 z-40 flex justify-center px-4">
      {show && (
        <div className="pointer-events-auto flex items-center gap-1 rounded-full border border-line-strong bg-canvas py-1.5 pr-1.5 pl-4 text-sm shadow-[0_12px_32px_-12px_rgb(0_0_0/0.35)]">
          <span className="mr-2 text-ink-2">
            <span className="font-semibold text-ink">{values[pinned]}</span> is lit on the map
          </span>
          <a
            href={`#${targetId}`}
            className="inline-flex items-center gap-1 rounded-full bg-ink px-3 py-1.5 text-[13px] font-semibold text-canvas transition-opacity hover:opacity-85"
          >
            Show me
            <ArrowDown aria-hidden="true" className="size-3.5" strokeWidth={2} />
          </a>
          <button
            type="button"
            onClick={() => send({ type: "clear" })}
            aria-label="Clear the highlighted figure"
            className="flex size-8 items-center justify-center rounded-full text-ink-3 transition-colors hover:bg-surface-2 hover:text-ink"
          >
            <X aria-hidden="true" className="size-3.5" strokeWidth={2} />
          </button>
        </div>
      )}
    </div>
  );
}

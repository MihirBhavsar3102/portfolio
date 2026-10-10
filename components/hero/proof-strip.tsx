"use client";

import { useTrace } from "@/components/hero/trace-provider";

export interface ProofEntry {
  id: string;
  value: string;
  label: string;
  provenance: string;
  measuredHow?: string;
  /** Names of the nodes and tools this figure lights on the map. */
  path: string[];
}

/**
 * The proof ledger: six measured outcomes, each with the sentence that says
 * how it was achieved. Hover or focus previews a figure's path on the map;
 * a tap or click pins it, a second one (or Escape) clears it. On a phone the
 * path is also written out in each cell and lights with it, since the map
 * there is a strip above rather than a drawing beside.
 */
export function ProofStrip({ entries }: { entries: ProofEntry[] }) {
  const { state, send } = useTrace();

  return (
    <section aria-labelledby="proof-heading" className="mt-10 xl:mt-5">
      <div className="mb-2.5 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
        <h2 id="proof-heading" className="text-base font-semibold text-ink">
          Measured outcomes
        </h2>
        <p className="text-sm text-ink-3">
          <span className="hidden md:inline">Hover or select a figure to trace it on the service map.</span>
          <span className="md:hidden">Tap a figure to highlight what produced it.</span>
        </p>
      </div>

      <ul className="grid gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
        {entries.map((entry) => {
          const active = state.active === entry.id;
          const pinned = active && state.pinned;
          return (
            <li
              key={entry.id}
              onPointerEnter={() => send({ type: "enter", id: entry.id })}
              onPointerLeave={() => send({ type: "leave", id: entry.id })}
              className={`relative p-5 transition-colors duration-200 xl:px-5 xl:py-4 ${
                active ? "bg-surface-2" : "bg-surface-1"
              } ${pinned ? "ring-1 ring-accent ring-inset" : ""}`}
            >
              <button
                type="button"
                aria-pressed={pinned}
                aria-describedby={`proof-${entry.id}-how`}
                onFocus={() => send({ type: "enter", id: entry.id })}
                onBlur={() => send({ type: "leave", id: entry.id })}
                onClick={() => send({ type: "toggle", id: entry.id })}
                className="text-left after:absolute after:inset-0 after:content-[''] focus-visible:outline-none focus-visible:after:rounded-[inherit] focus-visible:after:ring-2 focus-visible:after:ring-accent focus-visible:after:ring-inset"
              >
                <span
                  className={`type-figure block text-4xl leading-none transition-colors duration-200 xl:text-[32px] ${
                    active ? "text-accent" : "text-ink"
                  }`}
                >
                  {entry.value}
                </span>
                <span className="mt-1.5 block text-base leading-snug text-ink">{entry.label}</span>
              </button>

              <p id={`proof-${entry.id}-how`} className="mt-2.5 text-sm leading-relaxed text-ink-2 xl:leading-[1.55]">
                {entry.provenance}
                {entry.measuredHow && <span className="text-ink-3"> {entry.measuredHow}</span>}
              </p>

              {/* On a phone the map is a strip above, so the path is written out
                  here and lights with the figure; at md+ the drawing shows it
                  and this stays for screen readers only. */}
              <p
                className={`mt-3 text-xs leading-relaxed transition-colors duration-200 md:sr-only ${
                  active ? "text-accent" : "text-ink-3"
                }`}
              >
                <span className="sr-only">Traces to: </span>
                {entry.path.join(" · ")}
              </p>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

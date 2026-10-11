import type { Figure } from "@/types/resume";

/**
 * A case study's measured outcomes as a ruled grid: each figure with the
 * sentence that says how it was achieved and, where known, how it was
 * measured. An odd last cell spans both columns.
 */
export function FigureLedger({ figures }: { figures: Figure[] }) {
  return (
    <ul className="grid gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-2">
      {figures.map((f) => (
        <li key={f.value} className="bg-surface-1 p-5 sm:last:odd:col-span-2">
          <p className="type-figure text-4xl leading-none text-ink">{f.value}</p>
          <p className="mt-1.5 text-base leading-snug text-ink">{f.label}</p>
          <p className="mt-2.5 text-sm leading-relaxed text-ink-2">
            {f.provenance}
            {f.measuredHow && <span className="text-ink-3"> {f.measuredHow}</span>}
          </p>
        </li>
      ))}
    </ul>
  );
}

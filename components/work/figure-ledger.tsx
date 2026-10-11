import type { Figure } from "@/types/resume";

/**
 * A case study's measured outcomes, set large on fine rules: each figure with
 * the sentence that says how it was achieved and, where known, how it was
 * measured.
 */
export function FigureLedger({ figures }: { figures: Figure[] }) {
  return (
    <ul className="grid gap-x-12 gap-y-10 sm:grid-cols-2">
      {figures.map((f) => (
        <li key={f.value} className="border-t border-line pt-6">
          <p className="type-figure text-[3.25rem] text-ink">{f.value}</p>
          <p className="mt-3 text-lg leading-snug font-medium tracking-tight text-ink">{f.label}</p>
          <p className="mt-2.5 text-[15px] leading-relaxed text-ink-2">
            {f.provenance}
            {f.measuredHow && <span className="text-ink-3"> {f.measuredHow}</span>}
          </p>
        </li>
      ))}
    </ul>
  );
}

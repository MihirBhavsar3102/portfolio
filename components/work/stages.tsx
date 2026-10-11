/** Pipeline stages as a run of steps, for the case-study header that has no single figure. */
export function StageChips({ stages }: { stages: string[] }) {
  return (
    <ol className="flex flex-wrap items-center gap-2">
      {stages.map((stage, i) => (
        <li key={stage} className="flex items-center gap-2">
          {i > 0 && (
            <span aria-hidden="true" className="text-ink-3">
              →
            </span>
          )}
          <span className="rounded-md border border-line-strong bg-canvas px-3 py-1.5 text-sm text-ink">{stage}</span>
        </li>
      ))}
    </ol>
  );
}

/** The same stages as one wrapping line, for a card. */
export function StageLine({ stages }: { stages: string[] }) {
  return (
    <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-sm text-ink-2">
      {stages.map((stage, i) => (
        <li key={stage} className="flex items-center gap-1.5">
          {i > 0 && (
            <span aria-hidden="true" className="text-ink-3">
              →
            </span>
          )}
          {stage}
        </li>
      ))}
    </ol>
  );
}

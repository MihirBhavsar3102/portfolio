interface PipelineProps {
  stages: string[];
  /** "field" draws the chain on a navy ground, "paper" on the sheet */
  tone?: "paper" | "field";
  label: string;
}

/**
 * The system drawn left to right, one plate per real stage. Stacks vertically
 * on narrow widths with the connector rotated, so the sequence never becomes a
 * wrapped row whose reading order has to be guessed.
 */
export function Pipeline({ stages, tone = "paper", label }: PipelineProps) {
  const plate =
    tone === "field"
      ? "border-rule-field bg-field-2 text-on-field"
      : "border-rule bg-plate text-ink";
  const arrow = tone === "field" ? "text-on-field-2" : "text-ink-3";

  return (
    <ol aria-label={label} className="flex flex-col items-start sm:flex-row sm:flex-wrap sm:items-center">
      {stages.map((stage, i) => (
        <li key={stage} className="flex flex-col items-start sm:flex-row sm:items-center">
          {i > 0 && (
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`my-1 ml-4 size-4 shrink-0 rotate-90 sm:mx-2 sm:my-0 sm:rotate-0 ${arrow}`}
            >
              <path d="M4 12h15M13 6l6 6-6 6" />
            </svg>
          )}
          <span
            className={`inline-block border px-3 py-2 font-annot text-[11px] leading-none tracking-[0.01em] ${plate}`}
          >
            {stage}
          </span>
        </li>
      ))}
    </ol>
  );
}

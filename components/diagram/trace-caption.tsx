"use client";

import { useTrace } from "@/components/hero/trace-provider";

export interface TraceStep {
  id: string;
  /** A figure step's value, set in bold ahead of its caption. */
  value?: string;
  caption: string;
}

/** The sentence behind the lit chip, or a hint while none is; announced as it changes. */
export function TraceCaption({ steps, hint }: { steps: TraceStep[]; hint: string }) {
  const { state } = useTrace();
  const step = steps.find((s) => s.id === state.active);
  return (
    <p aria-live="polite" className="mt-3 text-sm leading-relaxed text-ink-2">
      {step ? (
        <>
          {step.value && <strong className="font-semibold text-ink">{step.value} </strong>}
          {step.caption}
        </>
      ) : (
        <span className="text-ink-3">{hint}</span>
      )}
    </p>
  );
}

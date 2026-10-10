import { Sheet } from "@/components/section";
import { resume } from "@/lib/resume-data";

/**
 * The four numbered operations, ruled at full width.
 *
 * Each bar is one original quantity: the solid span is what the work removed,
 * the hatched span is what it still costs. Drawing the whole field rather than
 * only the flattering figure is the point — the denominator is the claim's
 * evidence. The bar itself is aria-hidden because every value it encodes is
 * written out in the description list beside it.
 */
function ProportionBar({ remaining }: { remaining: number }) {
  const removed = 1 - remaining;
  return (
    <div
      aria-hidden="true"
      className="flex h-10 w-full items-stretch gap-0.5 border border-rule bg-plate p-0.5"
    >
      {/*
       * The figured quantity is what was REMOVED, so the solid span matches the
       * headline: "40% faster" sits beside a span that is 40% of the field.
       * Drawing the remainder solid invited exactly the opposite read.
       */}
      <div
        className="rounded-l-[3px] rounded-r-[1px] bg-signal"
        style={{ width: `${(removed * 100).toFixed(2)}%` }}
      />
      <div
        className="ghost-hatch rounded-l-[1px] rounded-r-[3px]"
        style={{ width: `calc(${(remaining * 100).toFixed(2)}% - 0.25rem)` }}
      />
    </div>
  );
}

export function OperationsRecord() {
  const { estate } = resume;

  return (
    <Sheet id="record" title="What I run, and what it changed">
      {/* The sheet's notes, set in two columns rather than stranded in one */}
      <div className="mb-14 grid gap-x-16 gap-y-6 md:grid-cols-2">
        {resume.about.map((paragraph) => (
          <p
            key={paragraph.slice(0, 32)}
            className="max-w-[58ch] text-[17px] leading-relaxed text-ink-2"
          >
            {paragraph}
          </p>
        ))}
      </div>

      <ol className="border-t border-rule">
        {estate.flows.map((flow) => (
          <li
            key={flow.n}
            className="grid gap-x-10 gap-y-6 border-b border-rule py-9 lg:grid-cols-12"
          >
            <div className="lg:col-span-4">
              <div className="flex items-center gap-3">
                <span className="flex size-7 shrink-0 items-center justify-center rounded-full border border-signal font-annot text-[12px] font-semibold text-signal">
                  {flow.n}
                </span>
                <h3 className="font-annot text-[12px] font-semibold uppercase tracking-[0.16em]">
                  {flow.label}
                </h3>
              </div>
              <p className="mt-4 font-display text-[clamp(2rem,4vw,3rem)] font-extrabold leading-none tracking-[-0.035em] text-signal">
                {flow.headline}
              </p>
            </div>

            <div className="lg:col-span-8">
              <p className="max-w-[62ch] text-[15px] leading-relaxed text-ink-2">{flow.detail}</p>

              <div className="mt-6">
                <ProportionBar remaining={flow.remaining} />
                <dl className="mt-3 flex flex-wrap gap-x-8 gap-y-2">
                  <div className="flex items-baseline gap-2">
                    <span
                      aria-hidden="true"
                      className="size-2.5 shrink-0 translate-y-px bg-signal"
                    />
                    <dt className="font-annot text-[10px] uppercase tracking-[0.14em] text-ink-3">
                      Removed
                    </dt>
                    <dd className="font-annot text-[12px] font-semibold">{flow.removedLabel}</dd>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span
                      aria-hidden="true"
                      className="ghost-hatch size-2.5 shrink-0 translate-y-px"
                    />
                    <dt className="font-annot text-[10px] uppercase tracking-[0.14em] text-ink-3">
                      Still costs
                    </dt>
                    <dd className="font-annot text-[12px] font-semibold">{flow.remainingLabel}</dd>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <dt className="font-annot text-[10px] uppercase tracking-[0.14em] text-ink-3">
                      Measured against
                    </dt>
                    <dd className="font-annot text-[12px] font-semibold">{flow.wholeLabel}</dd>
                  </div>
                </dl>
              </div>
            </div>
          </li>
        ))}
      </ol>
    </Sheet>
  );
}

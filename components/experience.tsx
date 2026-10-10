import { Sheet } from "@/components/section";
import { resume } from "@/lib/resume-data";

/**
 * The revision block: every drawing carries one, listing what changed and
 * when. Dates hold their own ruled column so the record scans vertically
 * before any prose is read.
 */
export function Experience() {
  return (
    <Sheet
      id="experience"
      title="Service record"
      intro="Where the estate above was actually built and run."
    >
      <ol className="border-t border-rule">
        {resume.experience.map((entry) => (
          <li
            key={`${entry.role}-${entry.stamp}`}
            className="grid gap-x-10 gap-y-5 border-b border-rule py-9 md:grid-cols-12"
          >
            <div className="md:col-span-3">
              <p className="font-annot text-[12px] font-semibold tracking-[0.04em] text-ink">
                <span className="sr-only">{entry.range}</span>
                <span aria-hidden="true">{entry.stamp}</span>
              </p>
              {entry.current && (
                <p className="mt-2.5 inline-flex items-center gap-2 font-annot text-[10px] font-semibold uppercase tracking-[0.16em] text-signal">
                  <span aria-hidden="true" className="size-1.5 rounded-full bg-signal" />
                  Current
                </p>
              )}
              <p className="mt-3 font-annot text-[11px] text-ink-3">{entry.location}</p>
            </div>

            <div className="md:col-span-9">
              <h3 className="font-display text-xl font-bold tracking-[-0.02em] md:text-2xl">
                {entry.role}
              </h3>
              <p className="mt-1.5 font-annot text-[12px] uppercase tracking-[0.12em] text-signal">
                {entry.company}
              </p>
              <ul className="mt-5 space-y-3">
                {entry.bullets.map((bullet) => (
                  <li
                    key={bullet}
                    className="flex max-w-[74ch] gap-4 text-[15px] leading-relaxed text-ink-2"
                  >
                    <span
                      aria-hidden="true"
                      className="mt-2.5 h-px w-4 shrink-0 bg-rule-strong"
                    />
                    {bullet}
                  </li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ol>
    </Sheet>
  );
}

import { Sheet } from "@/components/section";
import { resume } from "@/lib/resume-data";

/**
 * The legend. Every reference drawing ends with a key that names what its
 * symbols mean; this one names what the estate is built out of, ruled into
 * cells rather than scattered as pills.
 */
export function Skills() {
  return (
    <Sheet
      id="skills"
      title="Capability key"
      intro="What the drawing is made of, grouped the way the work actually divides."
      tone="plate"
    >
      {/* A legend needs a key of its own, and a key names every mark it uses —
          the filled state alone left the hollow one to be guessed at. */}
      <dl className="-mt-4 mb-8 flex flex-wrap gap-x-8 gap-y-2 font-annot text-[11px] uppercase tracking-[0.14em] text-ink-3">
        <div className="flex items-start gap-2.5">
          <dt
            aria-hidden="true"
            className="mt-1 size-1.5 shrink-0 rotate-45 border border-signal bg-signal"
          />
          <dd>Filled — shipped on this page</dd>
        </div>
        <div className="flex items-start gap-2.5">
          <dt
            aria-hidden="true"
            className="mt-1 size-1.5 shrink-0 rotate-45 border border-rule-strong"
          />
          <dd>Hollow — in the toolkit</dd>
        </div>
      </dl>
      {/*
       * One column or three, never two: seven groups divide evenly into both,
       * with two fillers completing the last row. At two columns the grid's
       * rule-coloured ground would show through as an empty half-cell.
       */}
      <div className="grid gap-px border border-rule bg-rule md:grid-cols-3">
        {resume.skillGroups.map((group) => {
          /*
           * Shipped first, original order preserved within each half. Scattering
           * the filled marks down the list made the new signal fight reading
           * order, which is the opposite of what a 30-second skim needs.
           */
          const isShipped = (skill: string) => group.shipped?.includes(skill) ?? false;
          const ordered = [
            ...group.skills.filter(isShipped),
            ...group.skills.filter((s) => !isShipped(s)),
          ];
          const shippedCount = group.shipped?.length ?? 0;

          return (
            <section key={group.key} className="flex flex-col bg-plate p-6">
              <h3 className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 font-annot text-[11px] font-semibold uppercase tracking-[0.16em] text-signal">
                <span className="min-w-0">{group.key}</span>
                {/* The tally is the part a skim actually reads. */}
                <span className="shrink-0 font-normal text-ink-3">
                  {shippedCount} of {group.skills.length} shipped
                </span>
              </h3>
              <ul className="mt-4 space-y-px">
                {ordered.map((skill) => {
                  const shipped = isShipped(skill);
                  return (
                    <li
                      key={skill}
                      className={`flex items-baseline gap-3 border-t border-rule py-2.5 text-[15px] leading-snug first:border-t-0 first:pt-0 ${
                        shipped ? "font-medium text-ink" : "text-ink-2"
                      }`}
                    >
                      <span
                        aria-hidden="true"
                        className={`mt-1.5 size-1.5 shrink-0 rotate-45 border ${
                          shipped ? "border-signal bg-signal" : "border-rule-strong"
                        }`}
                      />
                      {skill}
                      {shipped && <span className="sr-only"> — shipped in the work on this page</span>}
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })}
        {Array.from({
          length: (3 - (resume.skillGroups.length % 3)) % 3,
        }).map((_, i) => (
          <div key={`filler-${i}`} aria-hidden="true" className="hidden bg-plate md:block" />
        ))}
      </div>
    </Sheet>
  );
}

import { resume } from "@/lib/resume-data";
import { frame, sectionHeading } from "@/components/site/frame";
import { TraceButton } from "@/components/hero/trace-button";
import { InView } from "@/components/site/in-view";

/**
 * Screen two: the six measured outcomes, set huge, each with the sentence that
 * says how it was achieved (and how it was measured, where known). Hovering,
 * focusing or selecting one lights what produced it on the map below.
 */
export function Outcomes() {
  return (
    <section id="outcomes" aria-labelledby="outcomes-heading" className="border-t border-line">
      <InView threshold={0} rootMargin="0px 0px -12% 0px" className={`reveal ${frame} py-24 lg:py-28`}>
        <h2 id="outcomes-heading" className={sectionHeading}>
          Measured outcomes
        </h2>
        <ul className="mt-16 grid gap-x-14 gap-y-16 sm:grid-cols-2 lg:mt-20 lg:grid-cols-3 lg:gap-y-20">
          {resume.estate.proof.map(({ id, figure }) => (
            <li key={id} className="relative">
              <TraceButton
                id={id}
                describedBy={`proof-${id}-how`}
                className="group block text-left after:absolute after:-inset-3 after:rounded-2xl after:content-[''] focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-accent"
              >
                <span className="type-figure block text-[clamp(4rem,7vw,5.75rem)] text-ink transition-colors duration-300 group-data-active:text-accent">
                  {figure.value}
                </span>
                <span className="mt-5 block text-xl leading-snug font-medium tracking-tight text-ink">{figure.label}</span>
              </TraceButton>
              <p id={`proof-${id}-how`} className="mt-3 text-[15px] leading-relaxed text-ink-2">
                {figure.provenance}
                {figure.measuredHow && <span className="text-ink-3"> {figure.measuredHow}</span>}
              </p>
            </li>
          ))}
        </ul>
      </InView>
    </section>
  );
}

import { resume } from "@/lib/resume-data";
import { shortClaim } from "@/lib/format";
import { frame, sectionHeading } from "@/components/site/frame";
import { InView } from "@/components/site/in-view";
import { Topology } from "@/components/hero/topology";
import { TopologyStack } from "@/components/hero/topology-stack";
import { TraceButton } from "@/components/hero/trace-button";

/** One sentence a screen reader gets in place of the drawing. */
function mapSummary() {
  const { estate } = resume;
  const workloads = estate.zones.map((z) => `${z.label.replace(" · ", ": ")} (${z.note})`);
  const lane = (id: string) =>
    estate.controlPlane
      .find((l) => l.id === id)
      ?.nodes.map((n) => n.label)
      .join(", ");
  return `Service map. Three workloads — ${workloads.join("; ")}. Built with ${lane("build")}. Watched by ${lane("observe")}.`;
}

/**
 * Screen three: the estate as one drawing, three sibling workloads under one
 * way of building and watching them. A chip per figure lights what produced
 * it; from md the drawing, below it the same map as a list.
 */
export function MapSection() {
  return (
    <section id="map" aria-labelledby="map-section-heading" className="border-t border-line bg-surface-1">
      <div className={`${frame} py-24 lg:py-28`}>
        <div className="grid gap-x-16 gap-y-6 lg:grid-cols-12">
          <h2 id="map-section-heading" className={`${sectionHeading} lg:col-span-6`}>
            How it fits together
          </h2>
          <p className="text-xl leading-relaxed text-ink-2 lg:col-span-6 lg:pt-3">
            Three separate workloads under one way of building and watching them. Pick a figure to light up what produced it.
          </p>
        </div>

        <div role="group" aria-label="Light up a figure" className="mt-12 flex flex-wrap gap-2">
          {resume.estate.proof.map(({ id, figure }) => (
            <TraceButton
              key={id}
              id={id}
              className="rounded-full border border-line-strong px-4 py-2 text-left text-sm text-ink-2 transition-colors hover:border-ink-3 hover:text-ink data-active:border-accent data-active:bg-accent-soft data-active:text-accent"
            >
              <span className="font-semibold">{figure.value}</span> {shortClaim(figure.label)}
            </TraceButton>
          ))}
        </div>

        <InView className="mx-auto mt-12 hidden max-w-[52rem] md:block">
          <figure>
            <Topology />
            <figcaption className="sr-only">{mapSummary()}</figcaption>
          </figure>
        </InView>
        <TopologyStack />
      </div>
    </section>
  );
}

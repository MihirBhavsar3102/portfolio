import { ArrowRight, Download } from "lucide-react";
import { monthYear } from "@/lib/format";
import { resume } from "@/lib/resume-data";
import { tracedLabels } from "@/lib/trace";
import { CopyEmailButton } from "@/components/ui/copy-email-button";
import { ProofStrip, type ProofEntry } from "@/components/hero/proof-strip";
import { Topology } from "@/components/hero/topology";
import { TopologyStack } from "@/components/hero/topology-stack";
import { TraceProvider } from "@/components/hero/trace-provider";

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

export function Hero() {
  const { estate } = resume;
  const role = resume.experience[0];
  const entries: ProofEntry[] = estate.proof.map((p) => ({
    id: p.id,
    value: p.figure.value,
    label: p.figure.label,
    provenance: p.figure.provenance,
    measuredHow: p.figure.measuredHow,
    path: tracedLabels(estate, p.id),
  }));

  return (
    <div className="overflow-x-clip">
      <TraceProvider ids={entries.map((e) => e.id)} className="mx-auto max-w-7xl px-5 pt-10 pb-16 sm:px-8 xl:pt-6">
        <section aria-labelledby="hero-name" className="grid items-center gap-x-12 gap-y-10 xl:grid-cols-12">
          <div className="xl:col-span-5">
            <h1 id="hero-name" className="type-display text-display text-ink">
              {resume.name}
            </h1>
            <p className="mt-4 text-2xl font-medium tracking-[-0.01em] text-ink">{resume.role}</p>
            <p className="mt-5 max-w-[42ch] text-lg leading-relaxed text-ink-2">{resume.positioning}</p>
            <p className="mt-5 text-sm text-ink-3">
              {role.company} since {monthYear(role.start)} · {resume.location}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href="#work"
                className="group inline-flex items-center gap-2 rounded-md bg-accent px-4 py-2.5 text-sm font-semibold text-accent-ink transition-colors hover:bg-ink"
              >
                View work
                <ArrowRight
                  aria-hidden="true"
                  className="size-4 transition-transform duration-200 group-hover:translate-x-0.5"
                  strokeWidth={2}
                />
              </a>
              <a
                href={resume.resumeFile}
                download
                className="inline-flex items-center gap-2 rounded-md border border-line-strong px-4 py-2.5 text-sm font-semibold text-ink transition-colors hover:border-ink-3 hover:bg-surface-2"
              >
                <Download aria-hidden="true" className="size-4" strokeWidth={2} />
                Download resume
              </a>
            </div>
            <CopyEmailButton email={resume.email} className="mt-4" />
          </div>

          <div className="relative hidden max-w-3xl md:block xl:col-span-7 xl:max-w-none">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -inset-x-16 -inset-y-20 -z-10 bg-[radial-gradient(50%_45%_at_55%_45%,rgb(76_141_255/0.09),transparent_75%)]"
            />
            <figure className="rounded-lg border border-line bg-surface-1">
              <figcaption className="flex items-center justify-between gap-4 border-b border-line px-4 py-2">
                <span className="text-sm font-medium text-ink-2">Service map</span>
                <span aria-hidden="true" className="flex items-center gap-4 text-xs text-ink-3">
                  <span className="flex items-center gap-1.5">
                    <span className="h-px w-4 bg-line-strong" />
                    Build and observe
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="h-[1.5px] w-4 bg-ink-3" />
                    Service path
                  </span>
                </span>
              </figcaption>
              <div className="p-2.5">
                <Topology />
              </div>
              <p className="sr-only">{mapSummary()}</p>
            </figure>
          </div>
        </section>

        <TopologyStack />
        <ProofStrip entries={entries} />
      </TraceProvider>
    </div>
  );
}

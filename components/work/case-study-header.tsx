import type { Project } from "@/types/resume";
import { FigureLedger } from "@/components/work/figure-ledger";
import { StageChips } from "@/components/work/stages";

/** The page's lead: headline, summary, then the outcomes or, for a pipeline with no single figure, its stages. */
export function CaseStudyHeader({ project, className = "" }: { project: Project; className?: string }) {
  const hasFigures = project.figures.length > 0;
  return (
    <header className={className}>
      <h1 className="type-display text-[clamp(2.5rem,5vw,4rem)] leading-[1.02] text-ink">{project.headline}</h1>
      <p className="mt-6 max-w-[56ch] text-xl leading-relaxed text-ink-2">{project.summary}</p>
      <section aria-labelledby="outcomes-heading" className="mt-14">
        <h2 id="outcomes-heading" className="mb-6 text-lg font-semibold tracking-tight text-ink">
          {hasFigures ? "Measured outcomes" : "Pipeline stages"}
        </h2>
        {hasFigures ? <FigureLedger figures={project.figures} /> : <StageChips stages={project.stages ?? []} />}
      </section>
    </header>
  );
}

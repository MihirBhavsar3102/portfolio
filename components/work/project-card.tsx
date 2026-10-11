import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import type { Project } from "@/types/resume";
import { repoUrl, whereLabel } from "@/lib/work";
import { TechMark } from "@/components/ui/tech-mark";
import { StageLine } from "@/components/work/stages";

/** How many stack marks a card shows before "+N more". */
const STACK_SHOWN = 5;

/**
 * A case-study card:
 * - the title, summary, and the lead figure with its provenance (or, for a
 *   pipeline with no figure, its stages);
 * - the main stack, and where the work happened.
 * The title link covers the whole card. The code link sits above that
 * overlay so it stays its own target.
 */
export function ProjectCard({ project }: { project: Project }) {
  const lead = project.figures[0];
  const shown = project.stack.slice(0, STACK_SHOWN);
  const more = project.stack.length - shown.length;

  return (
    <article className="group relative flex flex-col bg-surface-1 p-5 transition-colors duration-200 hover:bg-surface-2">
      <h3 className="text-lg font-semibold tracking-[-0.01em] text-ink">
        <Link
          href={`/work/${project.slug}`}
          className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-accent focus-visible:after:ring-inset"
        >
          {project.title}
        </Link>
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-ink-2">{project.summary}</p>

      {lead ? (
        <div className="mt-5">
          <p className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
            <span className="type-figure text-4xl leading-none text-ink">{lead.value}</span>
            <span className="text-base leading-snug text-ink">{lead.label}</span>
          </p>
          <p className="mt-2 text-sm leading-relaxed text-ink-3">{lead.provenance}</p>
        </div>
      ) : (
        <div className="mt-5">
          <StageLine stages={project.stages ?? []} />
        </div>
      )}

      <ul aria-label="Built with" className="mt-5 flex flex-wrap gap-x-3 gap-y-1.5 text-xs text-ink-2">
        {shown.map((id) => (
          <li key={id}>
            <TechMark id={id} />
          </li>
        ))}
        {more > 0 && <li className="text-ink-3">+{more} more</li>}
      </ul>

      <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-6 text-sm">
        <span className="text-ink-3">{whereLabel(project)}</span>
        <span className="flex items-center gap-4">
          {project.repo && (
            <a
              href={repoUrl(project.repo)}
              target="_blank"
              rel="noopener noreferrer"
              className="relative z-10 inline-flex items-center gap-1 text-ink-2 transition-colors hover:text-ink"
            >
              Code
              <ArrowUpRight aria-hidden="true" className="size-3.5" strokeWidth={1.75} />
              <span className="sr-only">for {project.title} on GitHub (opens in new tab)</span>
            </a>
          )}
          <span aria-hidden="true" className="inline-flex items-center gap-1.5 font-medium text-ink">
            Case study
            <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" strokeWidth={2} />
          </span>
        </span>
      </div>
    </article>
  );
}

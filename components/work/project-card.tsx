import type { CSSProperties } from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import type { EstateZone, Project } from "@/types/resume";
import { repoUrl, zoneLabel } from "@/lib/work";
import { TechMark } from "@/components/ui/tech-mark";
import { StageLine } from "@/components/work/stages";

/** How many stack marks a card shows before "+N more". */
const STACK_SHOWN = 4;

/** Colour belongs to where the work ran; a personal project stays neutral. */
const tints: Record<EstateZone["id"], string> = {
  azure: "var(--color-cloud-azure)",
  aws: "var(--color-cloud-aws)",
  ai: "var(--color-cloud-ai)",
};

/**
 * A case-study card, tinted by the cloud the work ran on: the title, where it
 * ran, the summary, the lead figure with its provenance (or, for a pipeline with
 * no figure, its stages), the main stack. The title link covers the whole
 * card; the code link sits above that overlay so it stays its own target.
 */
export function ProjectCard({ project }: { project: Project }) {
  const lead = project.figures[0];
  const tint = project.zone ? tints[project.zone] : "var(--color-ink-3)";
  const shown = project.stack.slice(0, STACK_SHOWN);
  const more = project.stack.length - shown.length;

  return (
    <article
      style={{ "--tint": tint } as CSSProperties}
      className="group relative flex h-full flex-col rounded-2xl border border-[color-mix(in_oklab,var(--tint)_22%,var(--color-line))] bg-[color-mix(in_oklab,var(--tint)_6%,var(--color-surface-1))] p-7 transition-[border-color,translate] duration-300 ease-out-expo hover:-translate-y-0.5 hover:border-[color-mix(in_oklab,var(--tint)_45%,var(--color-line))] sm:p-8"
    >
      <h3 className="text-[1.625rem] leading-tight font-semibold tracking-[-0.02em] text-ink">
        <Link
          href={`/work/${project.slug}`}
          className="after:absolute after:inset-0 after:rounded-2xl after:content-[''] focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-accent"
        >
          {project.title}
        </Link>
      </h3>
      <p className="mt-2 inline-flex items-center gap-2 text-[13px] font-medium text-(--tint)">
        <span aria-hidden="true" className="size-2 rounded-full bg-(--tint)" />
        {zoneLabel(project)}
      </p>
      <p className="mt-4 text-[15px] leading-relaxed text-ink-2">{project.summary}</p>

      {lead ? (
        <div className="mt-8">
          <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span className="type-figure text-[2.75rem] text-ink">{lead.value}</span>
            <span className="text-[15px] leading-snug text-ink-2">{lead.label}</span>
          </p>
          <p className="mt-2.5 text-sm leading-relaxed text-ink-3">{lead.provenance}</p>
        </div>
      ) : (
        <div className="mt-8">
          <StageLine stages={project.stages ?? []} />
        </div>
      )}

      <div className="mt-auto flex flex-wrap items-center justify-between gap-4 pt-8 text-sm">
        <ul aria-label="Built with" className="flex flex-wrap gap-x-3 gap-y-1.5 text-xs text-ink-2">
          {shown.map((id) => (
            <li key={id}>
              <TechMark id={id} />
            </li>
          ))}
          {more > 0 && <li className="text-ink-3">+{more} more</li>}
        </ul>
        <span className="flex items-center gap-4">
          {project.repo && (
            <a
              href={repoUrl(project.repo)}
              target="_blank"
              rel="noopener noreferrer"
              className="relative z-10 inline-flex items-center gap-1 py-1 text-ink-2 transition-colors hover:text-ink"
            >
              Code
              <ArrowUpRight aria-hidden="true" className="size-3.5" strokeWidth={1.75} />
              <span className="sr-only">for {project.title} on GitHub (opens in new tab)</span>
            </a>
          )}
          <span aria-hidden="true" className="inline-flex items-center gap-1.5 font-semibold text-ink">
            Case study
            <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" strokeWidth={2} />
          </span>
        </span>
      </div>
    </article>
  );
}

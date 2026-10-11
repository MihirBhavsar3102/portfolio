import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/types/resume";
import { repoUrl, whereLabel } from "@/lib/work";
import { TechMark } from "@/components/ui/tech-mark";

function Fact({ term, children }: { term: string; children: React.ReactNode }) {
  return (
    <div className="px-4 py-3">
      <dt className="text-xs text-ink-3">{term}</dt>
      <dd className="mt-1 text-sm leading-relaxed text-ink">{children}</dd>
    </div>
  );
}

/** The facts beside a case study, from data: where, my part, what it's built with, and its code. Sticky from xl. */
export function CaseStudyFacts({ project, className = "" }: { project: Project; className?: string }) {
  return (
    <aside aria-label="Project facts" className={className}>
      <dl className="divide-y divide-line overflow-hidden rounded-lg border border-line bg-surface-1 xl:sticky xl:top-20">
        <Fact term="Where">{whereLabel(project)}</Fact>
        <Fact term="My part">{project.role}</Fact>
        <Fact term="Built with">
          <ul className="flex flex-wrap gap-x-3 gap-y-1.5">
            {project.stack.map((id) => (
              <li key={id}>
                <TechMark id={id} />
              </li>
            ))}
          </ul>
        </Fact>
        {project.repo && (
          <Fact term="Code">
            <a
              href={repoUrl(project.repo)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-ink underline decoration-line-strong underline-offset-4 transition-colors hover:decoration-ink"
            >
              {project.repo.name}
              <ArrowUpRight aria-hidden="true" className="size-3.5" strokeWidth={1.75} />
              <span className="sr-only">on GitHub (opens in new tab)</span>
            </a>
          </Fact>
        )}
      </dl>
    </aside>
  );
}

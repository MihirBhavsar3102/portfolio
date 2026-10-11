import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Role } from "@/types/resume";
import { resume } from "@/lib/resume-data";
import { period } from "@/lib/format";
import { getProject, unlinkedWorkProjects } from "@/lib/work";
import { Section } from "@/components/site/section";

const textLink = "font-medium text-ink underline decoration-line-strong underline-offset-4 transition-colors hover:decoration-ink";

function CaseStudyLink({ slug }: { slug: string }) {
  const project = getProject(slug);
  if (!project) return null;
  // Inline, not inline-flex: when the title wraps, the arrow stays with its last word.
  return (
    <p className="mt-3 text-sm">
      <Link href={`/work/${slug}`} className={`group ${textLink}`}>
        Case study: {project.title}
        <ArrowRight
          aria-hidden="true"
          className="ml-1.5 inline size-3.5 align-[-0.125em] transition-transform duration-200 group-hover:translate-x-0.5"
          strokeWidth={2}
        />
      </Link>
    </p>
  );
}

/** The role, with the legal employer name (its one appearance on the site), then each workstream beside its points. */
function RoleEntry({ role }: { role: Role }) {
  const also = unlinkedWorkProjects();
  return (
    <article className="overflow-hidden rounded-lg border border-line bg-surface-1">
      <header className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-line px-5 py-4">
        <div>
          <h3 className="text-lg font-semibold tracking-[-0.01em] text-ink">{role.title}</h3>
          <p className="mt-0.5 text-sm text-ink-2">
            {role.legalName} · {role.location}
          </p>
        </div>
        <p className="text-sm text-ink-3">{period(role.start)}</p>
      </header>

      <ul className="divide-y divide-line">
        {role.workstreams.map((w) => (
          <li key={w.name} className="grid gap-x-12 gap-y-3 px-5 py-5 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <h4 className="text-base font-semibold text-ink">{w.name}</h4>
              <p className="mt-1 text-sm leading-relaxed text-ink-2">{w.summary}</p>
              {w.caseStudy && <CaseStudyLink slug={w.caseStudy} />}
            </div>
            <ul className="space-y-2 lg:col-span-8">
              {w.points.map((point) => (
                <li
                  key={point}
                  className="relative pl-4 text-sm leading-relaxed text-ink-2 before:absolute before:top-[0.7em] before:left-0 before:h-px before:w-2 before:bg-line-strong"
                >
                  {point}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>

      {also.length > 0 && (
        <p className="border-t border-line px-5 py-4 text-sm text-ink-2">
          Also built here:{" "}
          {also.map((p, i) => (
            <span key={p.slug}>
              {i > 0 && ", "}
              <Link href={`/work/${p.slug}`} className={textLink}>
                {p.title}
              </Link>
            </span>
          ))}
          .
        </p>
      )}
    </article>
  );
}

export function Experience() {
  return (
    <Section id="experience" title="Experience">
      {resume.experience.map((role) => (
        <RoleEntry key={`${role.legalName}-${role.start}`} role={role} />
      ))}
    </Section>
  );
}

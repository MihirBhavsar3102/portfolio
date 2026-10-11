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
  // The last word and the arrow never break apart, so a wrapped title keeps its arrow.
  const words = project.title.split(" ");
  const last = words.pop();
  return (
    <p className="mt-6 text-[15px]">
      <Link href={`/work/${slug}`} className={`group ${textLink}`}>
        Case study: {words.join(" ")}{" "}
        <span className="whitespace-nowrap">
          {last}
          <ArrowRight
            aria-hidden="true"
            className="ml-1.5 inline size-4 align-[-0.15em] transition-transform duration-200 group-hover:translate-x-0.5"
            strokeWidth={2}
          />
        </span>
      </Link>
    </p>
  );
}

/** The role, with the legal employer name (its one appearance on the site), then the workstreams side by side. */
function RoleEntry({ role }: { role: Role }) {
  const also = unlinkedWorkProjects();
  return (
    <article>
      <header className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2 border-b border-line pb-8">
        <h3 className="text-2xl font-semibold tracking-tight text-ink">
          {role.title}, <span className="font-normal text-ink-2">{role.legalName}</span>
        </h3>
        <p className="text-ink-3">
          {period(role.start)} · {role.location}
        </p>
      </header>

      <div className="mt-12 grid gap-x-14 gap-y-14 lg:grid-cols-3">
        {role.workstreams.map((w) => (
          <section key={w.name} aria-label={w.name}>
            <h4 className="text-xl font-semibold tracking-tight text-ink">{w.name}</h4>
            <p className="mt-2 leading-relaxed text-ink-2">{w.summary}</p>
            <ul className="mt-6 space-y-4">
              {w.points.map((point) => (
                <li key={point} className="text-[15px] leading-relaxed text-ink-2">
                  {point}
                </li>
              ))}
            </ul>
            {w.caseStudy && <CaseStudyLink slug={w.caseStudy} />}
          </section>
        ))}
      </div>

      {also.length > 0 && (
        <p className="mt-14 border-t border-line pt-8 text-[15px] text-ink-2">
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

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { EstateZone, Role, WorkPoint } from "@/types/resume";
import { resume } from "@/lib/resume-data";
import { period, tenure } from "@/lib/format";
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
    <p className="mt-4 text-[15px]">
      <Link href={`/work/${slug}`} className={`group py-1 ${textLink}`}>
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

/** The dot beside a workstream's name says which cloud it ran on. */
const cloudDot: Record<EstateZone["id"], string> = { azure: "bg-cloud-azure", aws: "bg-cloud-aws", ai: "bg-cloud-ai" };

/** The result in bold, then how, so the eye can run down the results alone. */
function Point({ point }: { point: WorkPoint }) {
  if (!point.lead) return point.text;
  return (
    <>
      <strong className="font-semibold text-ink">{point.lead}</strong>
      {point.text.slice(point.lead.length)}
    </>
  );
}

/**
 * The role, with the legal employer name (its one appearance on the site) and
 * the time in it (and the internship it began as), then the workstreams side by side: one short line per fact,
 * result first. The time is worked out when the page renders (hourly).
 */
function RoleEntry({ role }: { role: Role }) {
  const also = unlinkedWorkProjects();
  const when = [period(role.start), tenure(role.start, new Date())].filter(Boolean).join(" · ");
  return (
    <article>
      <header className="border-b border-line pb-8">
        <h3 className="text-2xl font-semibold tracking-tight text-ink">{role.title}</h3>
        <p className="mt-1 text-lg text-ink-2">{role.legalName}</p>
        {/* On phones the location takes its own line rather than breaking mid-name, as in the hero. */}
        <p className="mt-2 text-ink-3">
          {when}
          <span aria-hidden="true" className="hidden sm:inline">
            {" · "}
          </span>
          <span className="sr-only">, </span>
          <span className="block sm:inline">{role.location}</span>
        </p>
        {role.internUntil && <p className="mt-1 text-ink-3">Joined as an intern, {period(role.start, role.internUntil)}</p>}
      </header>

      <div className="mt-10 grid gap-x-14 gap-y-12 lg:grid-cols-3">
        {role.workstreams.map((w) => (
          <section key={w.name} aria-label={w.name} className="pl-4.5">
            <h4 className="-ml-4.5 flex items-center gap-2.5 text-xl font-semibold tracking-tight text-ink">
              <span aria-hidden="true" className={`size-2 shrink-0 rounded-full ${w.zone ? cloudDot[w.zone] : "bg-ink-3"}`} />
              {w.name}
            </h4>
            {w.summary && <p className="mt-1 text-sm text-ink-3">{w.summary}</p>}
            <ul className="mt-4 space-y-2.5">
              {w.points.map((point) => (
                <li
                  key={point.text}
                  className="relative text-[15px] leading-normal text-ink-2 before:absolute before:top-[0.6em] before:-left-3.75 before:size-1.25 before:rounded-full before:bg-line-graphic"
                >
                  <Point point={point} />
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

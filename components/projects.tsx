import { Pipeline } from "@/components/pipeline";
import { CaseStudyDialog } from "@/components/project-dialog";
import { Sheet } from "@/components/section";
import { resume } from "@/lib/resume-data";

/**
 * One system earns the face-out slot at full width — the service that is
 * actually running in production — and the rest sit behind it. An even grid of
 * three would have said they weigh the same, and they do not.
 */
export function Projects() {
  const [lead, ...rest] = resume.projects;

  return (
    <Sheet
      id="projects"
      title="Systems I've built"
      intro="Three systems, each with the problem it solved, how it was assembled, and what changed once it ran. Open any one to read the full case study."
      tone="plate"
    >
      <article className="on-field border border-rule-field bg-field text-on-field">
        <div className="grid gap-8 p-6 sm:p-9 lg:grid-cols-12 lg:gap-10">
          {/* No label above the heading — the production status is a field in
              the metrics block below, where it is evidence rather than an eyebrow. */}
          <div className="lg:col-span-5">
            <h3 className="font-display text-[clamp(1.75rem,3.6vw,2.75rem)] font-extrabold leading-[1.02] tracking-[-0.035em] text-balance">
              {lead.name}
            </h3>
            <p className="mt-5 max-w-[46ch] text-[15px] leading-relaxed text-on-field-2">
              {lead.description}
            </p>
            <p className="mt-5 max-w-[46ch] text-[15px] font-medium leading-relaxed">
              {lead.outcome}
            </p>
            <div className="mt-8">
              <CaseStudyDialog project={lead} tone="field" />
            </div>
          </div>

          <div className="lg:col-span-7">
            <h4 className="font-annot text-[10px] uppercase tracking-[0.16em] text-on-field-2">
              The system
            </h4>
            <div className="mt-4">
              <Pipeline stages={lead.flow} tone="field" label={`${lead.name} pipeline`} />
            </div>

            <dl className="mt-9 grid gap-px border border-rule-field bg-rule-field sm:grid-cols-2">
              {lead.caseStudy.metrics.map((metric) => (
                <div key={metric.label} className="bg-field px-5 py-4">
                  <dd className="font-display text-3xl font-extrabold tracking-[-0.03em] text-signal-field">
                    {metric.value}
                  </dd>
                  <dt className="mt-1 font-annot text-[10px] uppercase tracking-[0.14em] text-on-field-2">
                    {metric.label}
                  </dt>
                </div>
              ))}
            </dl>

            <ul aria-label="Stack" className="mt-6 flex flex-wrap gap-1.5">
              {lead.stack.map((tech) => (
                <li
                  key={tech}
                  className="border border-rule-field px-2.5 py-1 font-annot text-[10px] text-on-field-2"
                >
                  {tech}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </article>

      <div className="mt-px grid gap-px bg-rule md:grid-cols-2">
        {rest.map((project) => (
          <article key={project.name} className="flex flex-col bg-plate p-6 sm:p-8">
            <h3 className="max-w-[22ch] font-display text-2xl font-bold leading-[1.1] tracking-[-0.03em]">
              {project.name}
            </h3>
            <p className="mt-4 max-w-[52ch] text-[15px] leading-relaxed text-ink-2">
              {project.description}
            </p>
            <p className="mt-4 max-w-[52ch] text-[15px] font-medium leading-relaxed">
              {project.outcome}
            </p>

            <div className="mt-7">
              <h4 className="font-annot text-[10px] uppercase tracking-[0.16em] text-ink-3">
                The system
              </h4>
              <div className="mt-3">
                <Pipeline stages={project.flow} label={`${project.name} pipeline`} />
              </div>
            </div>

            <ul aria-label="Stack" className="mt-6 flex flex-wrap gap-1.5">
              {project.stack.map((tech) => (
                <li
                  key={tech}
                  className="border border-rule px-2.5 py-1 font-annot text-[10px] text-ink-3"
                >
                  {tech}
                </li>
              ))}
            </ul>

            <div className="mt-auto pt-8">
              <CaseStudyDialog project={project} />
            </div>
          </article>
        ))}
      </div>
    </Sheet>
  );
}

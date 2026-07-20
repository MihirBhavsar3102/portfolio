import { Reveal } from "@/components/reveal";
import { Section } from "@/components/section";
import { resume } from "@/lib/resume-data";

export function Projects() {
  return (
    <Section id="projects" eyebrow="Projects" title="What I've built" tone="alt">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {resume.projects.map((project, i) => (
          <Reveal key={project.name} delay={i * 0.08} className="h-full">
            <article className="group flex h-full flex-col rounded-2xl border border-line bg-panel p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md motion-reduce:transition-none motion-reduce:hover:translate-y-0">
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-display text-lg font-semibold leading-snug tracking-tight">
                  {project.name}
                </h3>
                {project.inProduction && (
                  <span className="shrink-0 whitespace-nowrap rounded-full bg-accent/10 px-2.5 py-1 text-xs font-semibold text-accent">
                    In production
                  </span>
                )}
              </div>
              <p className="mt-3 text-sm leading-relaxed text-muted">{project.description}</p>
              <p className="mt-3 text-sm font-medium leading-relaxed">{project.outcome}</p>
              <div className="mt-auto pt-5">
                <ul aria-label="Tech stack" className="flex flex-wrap gap-1.5">
                  {project.stack.map((tech) => (
                    <li
                      key={tech}
                      className="rounded-full border border-line bg-bg px-2.5 py-1 text-xs text-muted"
                    >
                      {tech}
                    </li>
                  ))}
                </ul>
                <a
                  href={project.link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${project.name} on ${project.link.label} (opens in new tab)`}
                  className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-accent transition-colors hover:text-accent-strong"
                >
                  View on {project.link.label}
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
                  >
                    <path d="M7 17 17 7M8 7h9v9" />
                  </svg>
                </a>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

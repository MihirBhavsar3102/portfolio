import { Fragment, type CSSProperties } from "react";
import { resume } from "@/lib/resume-data";
import { cardAnchor, groupProjects, placeLabel, rowStat } from "@/lib/work";
import { ProjectCard, tintOf } from "@/components/work/project-card";

const projects = resume.projects;

/** A link's colour for its study, set inline so a script and the stylesheet can both read it. */
const tinted = (i: number): CSSProperties => ({ "--tint": tintOf(projects[i]) }) as CSSProperties;

/**
 * Selected work as a reel: a guide to the studies (from lg), a story bar of
 * them (below lg), and one scroll window holding every card. All of it is
 * plain markup: the rows and segments are in-page links to their card's
 * anchor, and nothing is marked current until a script can keep that true.
 * `data-reel-go` carries a study's place in the data, not in the guide.
 */
export function WorkReel() {
  return (
    <div data-reel>
      <nav data-reel-guide aria-label="Case studies" className="hidden lg:block">
        <span data-reel-marker aria-hidden="true" />
        {groupProjects().map(({ label, projects: group }) => (
          <div key={label} className="mt-6 first-of-type:mt-0">
            <h3 className="text-sm font-semibold text-ink">{label}</h3>
            <ul className="mt-2">
              {group.map((project) => {
                const i = projects.indexOf(project);
                const stat = rowStat(project);
                return (
                  <li key={project.slug}>
                    <a
                      data-reel-go={i}
                      href={`#${cardAnchor(project.slug)}`}
                      style={tinted(i)}
                      className="flex items-baseline justify-between gap-4 py-2.5 text-[15px] text-ink-2 transition-colors hover:text-ink"
                    >
                      <span className="min-w-0">
                        <span className="block font-medium text-ink">{project.title}</span>
                        <span className="mt-1 inline-flex items-center gap-2 text-[13px] text-ink-3">
                          <span aria-hidden="true" className="size-2 rounded-full bg-(--tint)" />
                          {placeLabel(project)}
                        </span>
                      </span>
                      {stat && <span className="shrink-0 font-medium text-ink">{stat}</span>}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <nav data-reel-story aria-label="Case studies" className="flex gap-2 lg:hidden">
        {projects.map((project, i) => (
          <a
            key={project.slug}
            data-reel-go={i}
            href={`#${cardAnchor(project.slug)}`}
            style={tinted(i)}
            className="flex min-w-0 flex-1 flex-col gap-1.5 py-2 text-xs text-ink-3"
          >
            <span aria-hidden="true" className="h-0.75 rounded-full bg-(--tint)" />
            {placeLabel(project)}
            <span className="sr-only">{project.title}</span>
          </a>
        ))}
      </nav>

      <div
        data-reel-window
        role="region"
        aria-label="Case studies, scrollable"
        tabIndex={0}
        className="mt-6 flex flex-col gap-4 lg:mt-0"
      >
        {projects.map((project, i) => (
          <Fragment key={project.slug}>
            <span data-reel-snap id={cardAnchor(project.slug)} />
            <ProjectCard project={project} index={i} />
          </Fragment>
        ))}
      </div>
    </div>
  );
}

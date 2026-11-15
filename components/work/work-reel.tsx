import { Fragment, type CSSProperties } from "react";
import { resume } from "@/lib/resume-data";
import { cardAnchor, groupProjects, placeLabel, rowStat } from "@/lib/work";
import { ProjectCard, tintOf } from "@/components/work/project-card";
import { ReelSync } from "@/components/work/reel-sync";

const projects = resume.projects;

/** A link's colour for its study, set inline so a script and the stylesheet can both read it. */
const tinted = (i: number): CSSProperties => ({ "--tint": tintOf(projects[i]) }) as CSSProperties;

/**
 * Selected work as a reel: a guide to the studies (from lg), a story bar of
 * them (below lg), and one scroll window holding every card, up and down from
 * lg and sideways below. All of it is plain markup: the rows and segments are
 * in-page links to their card's anchor, and nothing is marked current until a
 * script can keep that true (ReelSync; the window, the marker and the Deck are
 * styled in globals.css). `data-reel-go` carries a study's place in the data,
 * not in the guide.
 */
export function WorkReel() {
  return (
    <div data-reel className="grid gap-3.5 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:items-start lg:gap-12">
      <nav data-reel-guide aria-label="Case studies" className="relative isolate hidden lg:block">
        <span data-reel-marker aria-hidden="true" />
        {groupProjects().map(({ label, projects: group }) => (
          <div key={label} className="mt-8 first-of-type:mt-0">
            <h3 className="mb-2 border-b border-line px-4 pb-2.5 text-[13px] font-medium text-ink-3">{label}</h3>
            <ul className="space-y-0.5">
              {group.map((project) => {
                const i = projects.indexOf(project);
                const stat = rowStat(project);
                return (
                  <li key={project.slug}>
                    <a
                      data-reel-go={i}
                      href={`#${cardAnchor(project.slug)}`}
                      style={tinted(i)}
                      className="group grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 rounded-xl px-4 py-3.5 transition-colors duration-200 ease-out-expo not-aria-[current=true]:hover:bg-[color-mix(in_oklab,var(--tint)_5%,var(--color-canvas))]"
                    >
                      <span className="min-w-0">
                        <span className="block text-xl leading-tight font-semibold tracking-[-0.02em] text-ink">
                          {project.title}
                        </span>
                        <span className="mt-[5px] flex items-center gap-2 text-[13px] font-medium text-(--tint)">
                          <span aria-hidden="true" className="size-2 shrink-0 rounded-full bg-(--tint)" />
                          {placeLabel(project)}
                        </span>
                      </span>
                      {stat && (
                        <span className="type-figure text-[1.625rem] whitespace-nowrap text-ink-3 transition-colors duration-200 ease-out-expo group-hover:text-ink group-aria-[current=true]:text-ink">
                          {stat}
                        </span>
                      )}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <nav data-reel-story aria-label="Case studies" className="flex gap-1.5 lg:hidden">
        {projects.map((project, i) => (
          <a
            key={project.slug}
            data-reel-go={i}
            href={`#${cardAnchor(project.slug)}`}
            style={tinted(i)}
            className="group flex flex-1 flex-col gap-[7px] pt-2 pb-1 text-[11px] font-medium whitespace-nowrap text-ink-3 transition-colors duration-300 ease-out-expo aria-[current=true]:text-(--tint)"
          >
            <span
              aria-hidden="true"
              className="h-[3px] rounded-[2px] bg-line-strong transition-colors duration-300 ease-out-expo group-aria-[current=true]:bg-(--tint)"
            />
            {placeLabel(project)}
            <span className="sr-only">{project.title}</span>
          </a>
        ))}
      </nav>

      <div data-reel-window role="region" aria-label="Case studies, scrollable" tabIndex={0}>
        {projects.map((project, i) => (
          <Fragment key={project.slug}>
            <span data-reel-snap id={cardAnchor(project.slug)} />
            <ProjectCard project={project} index={i} />
          </Fragment>
        ))}
      </div>

      <ReelSync />
    </div>
  );
}

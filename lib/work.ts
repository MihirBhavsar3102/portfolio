import type { EstateZone, Project, Role } from "@/types/resume";
import { resume } from "@/lib/resume-data";

/** The case study for a slug; undefined for an unknown one. */
export function getProject(slug: string, projects: Project[] = resume.projects): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

/**
 * Neighbours in reading order. The first has no previous and the last no
 * next; the pager fills that side with a link back to all work.
 */
export function pagerFor(slug: string, projects: Project[] = resume.projects): { prev?: Project; next?: Project } {
  const i = projects.findIndex((p) => p.slug === slug);
  if (i < 0) return {};
  return { prev: projects[i - 1], next: projects[i + 1] };
}

/** Where the work happened: the employer's name for work, "Personal project" otherwise. */
export function whereLabel(project: Project, company: string = resume.experience[0].company): string {
  return project.kind === "work" ? company : "Personal project";
}

/** Where the work ran, as its card names it. */
export const zoneNames: Record<EstateZone["id"], string> = { azure: "Azure", aws: "AWS", ai: "Applied AI" };
/** The same, short enough for a row of the work list. */
export const zoneShortNames: Record<EstateZone["id"], string> = { azure: "Azure", aws: "AWS", ai: "AI" };

/** A personal project says so first, then names the cloud it ran on, if it ran on one. */
export function zoneLabel(project: Project): string {
  if (!project.zone) return "Personal project";
  const cloud = zoneNames[project.zone];
  return project.kind === "personal" ? `Personal project · ${cloud}` : cloud;
}

/** The short place a project's row names: its cloud, else what it ran on, else just Personal. */
export const placeLabel = (project: Project): string =>
  project.zone ? zoneShortNames[project.zone] : (project.ranOn ?? "Personal");

/** The one short stat on a project's row: the lead figure, else the card's highlight. */
export const rowStat = (project: Project): string | undefined => project.figures[0]?.value ?? project.highlight?.value;

/** The work list's groups: the employer's work, then personal projects, each in data order; an empty group is dropped. */
export function groupProjects(
  projects: Project[] = resume.projects,
  company: string = resume.experience[0].company,
): { label: string; projects: Project[] }[] {
  return [
    { label: `At ${company}`, projects: projects.filter((p) => p.kind === "work") },
    { label: "Personal projects", projects: projects.filter((p) => p.kind === "personal") },
  ].filter((g) => g.projects.length > 0);
}

/** The id a project's card carries, so the page can link straight to it. */
export const cardAnchor = (slug: string): string => `work-${slug}`;

export const repoUrl = (repo: { owner: string; name: string }) => `https://github.com/${repo.owner}/${repo.name}`;

/** Work projects no workstream links to, so the experience entry can still point at them. */
export function unlinkedWorkProjects(projects: Project[] = resume.projects, roles: Role[] = resume.experience): Project[] {
  const linked = new Set(roles.flatMap((r) => r.workstreams.map((w) => w.caseStudy)));
  return projects.filter((p) => p.kind === "work" && !linked.has(p.slug));
}

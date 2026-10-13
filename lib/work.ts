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

/** Where the work ran, as its card names it; a personal project has no cloud. */
export const zoneNames: Record<EstateZone["id"], string> = { azure: "Azure", aws: "AWS", ai: "Applied AI" };
export const zoneLabel = (project: Project) => (project.zone ? zoneNames[project.zone] : "Personal project");

export const repoUrl = (repo: { owner: string; name: string }) => `https://github.com/${repo.owner}/${repo.name}`;

/** Work projects no workstream links to, so the experience entry can still point at them. */
export function unlinkedWorkProjects(projects: Project[] = resume.projects, roles: Role[] = resume.experience): Project[] {
  const linked = new Set(roles.flatMap((r) => r.workstreams.map((w) => w.caseStudy)));
  return projects.filter((p) => p.kind === "work" && !linked.has(p.slug));
}

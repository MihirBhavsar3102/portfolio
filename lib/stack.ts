import type { Project, Role, Skill } from "@/types/resume";
import { resume } from "@/lib/resume-data";

/**
 * Where a skill shows up in the work on this site. Derived, never hand-set:
 * "work" when its technology is in a work project's stack or a workstream
 * names it; "project" when only a personal project's stack has it.
 */
export type Evidence = "work" | "project";

export const evidenceLabel: Record<Evidence, string> = {
  work: "Used at work",
  project: "Used in a project",
};

const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** Whether `text` names `name` as a whole word, ignoring case: "Git" is not in "GitHub". */
export function mentions(text: string, name: string): boolean {
  return new RegExp(`(?<![A-Za-z0-9])${escape(name)}(?![A-Za-z0-9])`, "i").test(text);
}

export function skillEvidence(
  skill: Skill,
  projects: Project[] = resume.projects,
  roles: Role[] = resume.experience,
): Evidence | undefined {
  const id = skill.tech;
  const inStack = (kind: Project["kind"]) => id !== undefined && projects.some((p) => p.kind === kind && p.stack.includes(id));
  const named = roles.some((r) =>
    r.workstreams.some((w) => [w.name, w.summary ?? "", ...w.points.map((p) => p.text)].some((t) => mentions(t, skill.name))),
  );
  if (inStack("work") || named) return "work";
  if (inStack("personal")) return "project";
  return undefined;
}

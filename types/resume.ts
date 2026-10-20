import type { TechId } from "@/lib/tech";

/** A measured outcome. A number without its provenance is resume inflation. */
export interface Figure {
  /** As displayed, qualifiers included: "70%+", "~60%", "450+", "<30 min". */
  value: string;
  /** What the value measures, read straight after it. */
  label: string;
  /** How it was achieved, one sentence. */
  provenance: string;
  /** How it was measured — only when Mihir has said so. */
  measuredHow?: string;
}

export interface EstateNode {
  id: string;
  label: string;
  /** Short second line, e.g. "autoscaling" or a count. */
  meta?: string;
  tech?: TechId;
}

/** A workload zone. Zones are siblings: no edge ever joins two workload zones. */
export interface EstateZone {
  id: "azure" | "aws" | "ai";
  label: string;
  /** One plain-text line under the label: who it serves or what it is. */
  note: string;
  tech?: TechId;
  nodes: EstateNode[];
}

export interface ControlLane {
  id: "build" | "observe";
  label: string;
  nodes: EstateNode[];
}

/** An edge between node or zone ids. `source` cites where the relationship is stated. */
export interface EstateEdge {
  from: string;
  to: string;
  source: string;
}

/** A proof-strip figure and the topology ids its Trace lights. */
export interface ProofItem {
  id: string;
  figure: Figure;
  highlight: string[];
}

export interface Estate {
  zones: EstateZone[];
  controlPlane: ControlLane[];
  edges: EstateEdge[];
  proof: ProofItem[];
}

/** One line of a workstream, read in a glance: the result first, then how. */
export interface WorkPoint {
  /** The whole line, at most 20 words. */
  text: string;
  /** The line's opening words, its result, set in bold. */
  lead?: string;
}

export interface Workstream {
  name: string;
  /** One short line under the name: where it ran and for whom. */
  summary?: string;
  /** The cloud it ran on, which colours the dot beside its name. */
  zone?: EstateZone["id"];
  points: WorkPoint[];
  /** Slug of the case study that tells this workstream's story. */
  caseStudy?: string;
}

export interface Role {
  title: string;
  company: string;
  legalName: string;
  location: string;
  /** ISO month, e.g. "2024-12". A current role has no end. */
  start: string;
  /** ISO month the role's opening internship ended, when it began as one. */
  internUntil?: string;
  workstreams: Workstream[];
}

export type ProjectKind = "work" | "personal";

export interface Project {
  slug: string;
  title: string;
  /** The case-study page's h1; longer than the card `title`. */
  headline: string;
  summary: string;
  kind: ProjectKind;
  /** The estate zone the work ran in; colours its card. A personal project has none. */
  zone?: EstateZone["id"];
  /** What Mihir owned, one line. */
  role: string;
  repo?: { owner: string; name: string };
  stack: TechId[];
  /** First figure is the card's lead figure. */
  figures: Figure[];
  /** Pipeline stages, shown on a card that has no figure. */
  stages?: string[];
}

export interface Skill {
  name: string;
  detail?: string;
  /** Links the skill to project stacks; its evidence marker is derived from them (lib/stack.ts). */
  tech?: TechId;
}

export interface SkillGroup {
  name: string;
  skills: Skill[];
}

export interface Certification {
  name: string;
  code?: string;
  issuerId: "aws" | "microsoft" | "google";
  /** ISO month, e.g. "2025-06". */
  earned?: string;
  verifyUrl?: string;
}

export interface EducationEntry {
  degree: string;
  institution: string;
  years: string;
  score: string;
}

export interface Achievement {
  title: string;
  detail: string;
}

export interface FeaturedRepo {
  owner: string;
  name: string;
  /** Fallback description when the API is unavailable or the repo has none. */
  blurb: string;
  demonstrates: string;
  /** Required for a fork to be shown: what Mihir added. */
  contribution?: string;
  /** Set when the repo is a fork: the upstream's full name ("owner/repo"). Keeps it hidden without a `contribution` even when the API is down. */
  upstream?: string;
  /** Case-study slug this repo belongs to. */
  project?: string;
}

export interface SocialLink {
  label: string;
  href: string;
}

export interface Resume {
  name: string;
  role: string;
  location: string;
  /**
   * Hero line, one crisp sentence: the lead, then three verbs the hero rolls
   * through in order (built, shipped, monitored), one per step of the estate
   * preview's story (build, ship, observe). Read whole with positioningLine().
   */
  positioning: { lead: string; verbs: [string, string, string] };
  summary: string;
  email: string;
  resumeFile: string;
  socials: SocialLink[];
  estate: Estate;
  experience: Role[];
  projects: Project[];
  skillGroups: SkillGroup[];
  certifications: Certification[];
  education: EducationEntry[];
  achievements: Achievement[];
  featuredRepos: FeaturedRepo[];
}

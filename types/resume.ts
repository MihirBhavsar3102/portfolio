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
  id: "clients" | "azure" | "aws" | "ai";
  label: string;
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

export interface Workstream {
  name: string;
  summary: string;
  points: string[];
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
  workstreams: Workstream[];
}

export type ProjectKind = "work" | "personal";

export interface Project {
  slug: string;
  title: string;
  summary: string;
  kind: ProjectKind;
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
  /** Links the skill to evidence in project and workstream stacks (Phase 3). */
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
  /** Hero line, at most 30 words. */
  positioning: string;
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

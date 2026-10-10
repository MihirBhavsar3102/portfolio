export interface SocialLink {
  label: string;
  href: string;
}

export interface ExperienceEntry {
  role: string;
  company: string;
  location: string;
  /** Mono timestamp shown in the log column, e.g. "2025-04 → present" */
  stamp: string;
  /** Human-readable range for screen readers and tooltips */
  range: string;
  current: boolean;
  bullets: string[];
}

export interface Project {
  name: string;
  description: string;
  outcome: string;
  stack: string[];
  /** The system drawn left to right, one plate per stage of the real pipeline */
  flow: string[];
  /** Swap href for a real repo/demo URL when available */
  link: { label: string; href: string };
  inProduction?: boolean;
  /** Case-study detail shown in the project dialog */
  caseStudy: {
    problem: string;
    approach: string;
    impact: string[];
    metrics: { value: string; label: string }[];
  };
}

export interface SkillGroup {
  /** Display label for the group, e.g. "IaC & Automation" */
  key: string;
  skills: string[];
  /**
   * The subset of `skills` that appears in the work documented on this site —
   * the experience bullets, the projects, or the drawn estate. Derived from
   * evidence already on the page, never a self-assessed proficiency rating.
   */
  shipped?: string[];
}

export interface EducationEntry {
  degree: string;
  institution: string;
  years: string;
  score: string;
}

export interface Certification {
  name: string;
  issuer: string;
}

export interface Achievement {
  title: string;
  detail: string;
}

/** One service plate sitting on a zone plane in the estate drawing. */
export interface EstateNode {
  id: string;
  label: string;
  /** Optional second line under the label, e.g. a count */
  meta?: string;
  icon: IconName;
}

/** A zone of the estate, drawn as one isometric plane. */
export interface EstatePlane {
  id: string;
  label: string;
  note: string;
  nodes: EstateNode[];
}

/**
 * A numbered operation on the drawing. `whole` is the original quantity the
 * work acted on and `remaining` is what is left of it — so every bar shows the
 * honest denominator, never only the flattering figure. Both are proportions
 * of the same original, which is what makes the four comparable.
 */
export interface EstateFlow {
  n: number;
  /** Zone plane this operation acts on */
  plane: string;
  label: string;
  detail: string;
  /** The figured result, e.g. "40% faster" — a rate, not always a quantity */
  headline: string;
  /**
   * What the solid span actually is: the share of `wholeLabel` taken away,
   * stated in the same category as `remainingLabel` so the legend's three
   * cells compare like with like. "40% faster" is a rate and cannot sit in a
   * slot the key defines as a removed quantity.
   */
  removedLabel: string;
  wholeLabel: string;
  remainingLabel: string;
  /** 0–1: the share of the original quantity still being spent */
  remaining: number;
}

export interface Estate {
  planes: EstatePlane[];
  rail: { label: string; tools: string[] };
  flows: EstateFlow[];
}

export type IconName =
  | "clients"
  | "users"
  | "hostpool"
  | "profiles"
  | "vault"
  | "identity"
  | "compute"
  | "balancer"
  | "database"
  | "edge"
  | "service"
  | "model"
  | "chain"
  | "vector";

export interface Resume {
  name: string;
  role: string;
  headline: string;
  location: string;
  tagline: string;
  /** The production estate, drawn as the sheet's reference architecture. */
  estate: Estate;
  about: string[];
  quickFacts: { label: string; value: string }[];
  email: string;
  phone: string;
  resumeFile: string;
  socials: SocialLink[];
  experience: ExperienceEntry[];
  projects: Project[];
  skillGroups: SkillGroup[];
  education: EducationEntry[];
  certifications: Certification[];
  achievements: Achievement[];
}

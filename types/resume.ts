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
  /** Swap href for a real repo/demo URL when available */
  link: { label: string; href: string };
  inProduction?: boolean;
}

export interface SkillGroup {
  /** Display label for the group, e.g. "IaC & Automation" */
  key: string;
  skills: string[];
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

export interface Resume {
  name: string;
  role: string;
  headline: string;
  location: string;
  tagline: string;
  /** Headline outcomes shown as the hero stats row, counted up on scroll into view */
  stats: { target: number; decimals?: number; prefix?: string; suffix?: string; label: string }[];
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

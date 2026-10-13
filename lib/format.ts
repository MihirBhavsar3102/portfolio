import type { Resume } from "@/types/resume";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** "2024-12" → "Dec 2024" */
export function monthYear(iso: string): string {
  const [year, month] = iso.split("-").map(Number);
  return `${MONTHS[month - 1]} ${year}`;
}

/** "Dec 2024 – present"; a duration is never printed, because it goes stale. */
export function period(start: string, end?: string): string {
  return `${monthYear(start)} – ${end ? monthYear(end) : "present"}`;
}

/** ["built", "shipped", "monitored"] → "built, shipped and monitored" (no serial comma). */
export function listOf(words: string[]): string {
  return words.length < 2 ? (words[0] ?? "") : `${words.slice(0, -1).join(", ")} and ${words[words.length - 1]}`;
}

/** The hero's positioning as one sentence: "I automate how … is built, shipped and monitored." */
export const positioningLine = ({ lead, verbs }: Resume["positioning"]) => `${lead} ${listOf(verbs)}.`;

/** A figure's claim up to its first comma: short enough for a chip or a share card. */
export const shortClaim = (label: string) => label.split(",")[0];

/** Heading text → URL fragment: "What broke?" → "what-broke". */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

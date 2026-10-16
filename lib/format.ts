import type { Resume } from "@/types/resume";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** "2024-12" → "Dec 2024" */
export function monthYear(iso: string): string {
  const [year, month] = iso.split("-").map(Number);
  return `${MONTHS[month - 1]} ${year}`;
}

/** "Dec 2024 – present". The time in a role is tenure(), worked out when the page renders. */
export function period(start: string, end?: string): string {
  return `${monthYear(start)} – ${end ? monthYear(end) : "present"}`;
}

/**
 * Whole months from an ISO start month to `now`, as the resume counts them:
 * "1 yr 10 mos" from Dec 2024 in Oct 2026. Empty within the start month.
 */
export function tenure(start: string, now: Date): string {
  const [year, month] = start.split("-").map(Number);
  const months = (now.getFullYear() - year) * 12 + now.getMonth() + 1 - month;
  const y = Math.floor(months / 12);
  const m = months % 12;
  return [y && `${y} ${y === 1 ? "yr" : "yrs"}`, m && `${m} ${m === 1 ? "mo" : "mos"}`].filter(Boolean).join(" ");
}

/** ["built", "shipped", "monitored"] → "built, shipped and monitored" (no serial comma). */
export function listOf(words: string[]): string {
  return words.length < 2 ? (words[0] ?? "") : `${words.slice(0, -1).join(", ")} and ${words[words.length - 1]}`;
}

/** The hero's positioning as one sentence: "I automate how … is built, shipped and monitored." */
export const positioningLine = ({ lead, verbs }: Resume["positioning"]) => `${lead} ${listOf(verbs)}.`;

/** A figure's claim up to its first comma: short enough for a chip or a share card. */
export const shortClaim = (label: string) => label.split(",")[0];

/**
 * A location.hash as the element id it names: "#what-broke" → "what-broke".
 * "" when there is none, or when its escapes are malformed ("#%"), on which
 * decodeURIComponent throws.
 */
export function fragmentId(hash: string): string {
  try {
    return decodeURIComponent(hash.replace(/^#/, ""));
  } catch {
    return "";
  }
}

/**
 * usePathname() with the home page always "/". On Vercel, once the root page's
 * ISR copy regenerates, its server render reads "/index" (vercel/next.js#95648),
 * and React keeps that render's attributes through hydration, so a check for
 * "/" would fail for every visitor. Drop it once Next ships the fix (#95973).
 */
export const sitePath = (pathname: string) => (pathname === "/index" ? "/" : pathname);

/** Heading text → URL fragment: "What broke?" → "what-broke". */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

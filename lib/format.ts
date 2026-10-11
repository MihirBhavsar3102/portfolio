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

/** Heading text → URL fragment: "What broke?" → "what-broke". */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

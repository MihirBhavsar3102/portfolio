import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { Project } from "@/types/resume";
import { pagerFor } from "@/lib/work";

// The ring is inset: an outline would be clipped by the ruled grid's overflow.
const cell =
  "group flex flex-col gap-1.5 bg-surface-1 px-6 py-6 transition-colors duration-200 hover:bg-surface-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-inset";

function Neighbour({ project, dir }: { project: Project; dir: "prev" | "next" }) {
  const next = dir === "next";
  const Icon = next ? ArrowRight : ArrowLeft;
  const icon = (
    <Icon
      aria-hidden="true"
      className={`size-4 transition-transform duration-200 ${next ? "group-hover:translate-x-0.5" : "group-hover:-translate-x-0.5"}`}
      strokeWidth={2}
    />
  );
  return (
    <Link href={`/work/${project.slug}`} className={`${cell} ${next ? "sm:items-end sm:text-right" : ""}`}>
      <span className="text-xs text-ink-3">{next ? "Next" : "Previous"}</span>
      <span className="inline-flex items-center gap-1.5 text-xl font-semibold tracking-tight text-ink">
        {!next && icon}
        {project.title}
        {next && icon}
      </span>
    </Link>
  );
}

function AllWork({ end }: { end: boolean }) {
  return (
    <Link href="/#work" className={`${cell} ${end ? "sm:items-end sm:text-right" : ""}`}>
      <span className="text-xs text-ink-3">Back to</span>
      <span className="text-xl font-semibold tracking-tight text-ink">All work</span>
    </Link>
  );
}

/** Previous and next case study; at either end, the empty side links back to all work. */
export function Pager({ slug }: { slug: string }) {
  const { prev, next } = pagerFor(slug);
  return (
    <nav aria-label="More case studies" className="mt-20 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2">
      {prev ? <Neighbour project={prev} dir="prev" /> : <AllWork end={false} />}
      {next ? <Neighbour project={next} dir="next" /> : <AllWork end />}
    </nav>
  );
}

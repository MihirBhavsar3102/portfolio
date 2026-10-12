import { ArrowRight } from "lucide-react";
import { resume } from "@/lib/resume-data";
import { frame } from "@/components/site/frame";

/**
 * Screen one: who and what, as a statement. The name, the role and where,
 * the positioning line set large, and two ways forward. Nothing else.
 */
export function Hero() {
  return (
    <section
      aria-labelledby="hero-name"
      className={`${frame} flex min-h-[min(calc(100svh-3.5rem),56rem)] flex-col justify-center py-20`}
    >
      <h1 id="hero-name" className="type-display text-display text-ink">
        {resume.name}
      </h1>
      {/* On phones the location takes its own line rather than leaving the separator at a line end. */}
      <p className="mt-6 text-[clamp(1.25rem,2.2vw,1.75rem)] font-medium tracking-tight text-ink-2">
        {resume.role}
        <span aria-hidden="true" className="hidden sm:inline"> · </span>
        <span className="sr-only">, </span>
        <span className="block sm:inline">{resume.location}</span>
      </p>
      <p className="mt-10 max-w-[30ch] text-[clamp(1.5rem,3vw,2.375rem)] leading-[1.22] font-medium tracking-[-0.02em] text-ink">
        {resume.positioning}
      </p>
      <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-4">
        <a
          href="#work"
          className="group inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3.5 text-[15px] font-semibold text-canvas transition-opacity hover:opacity-85"
        >
          See the work
          <ArrowRight aria-hidden="true" className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" strokeWidth={2} />
        </a>
        <a href={`mailto:${resume.email}`} className="group inline-flex items-center gap-1.5 py-2 text-[15px] font-medium text-accent">
          Email me
          <ArrowRight aria-hidden="true" className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" strokeWidth={2} />
        </a>
      </div>
    </section>
  );
}

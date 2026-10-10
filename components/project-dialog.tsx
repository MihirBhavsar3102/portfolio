"use client";

import { useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Pipeline } from "@/components/pipeline";
import type { Project } from "@/types/resume";

/**
 * The detail sheet for one system. A dialog rather than a route: the recruiter
 * path is a single page, and the deeper read has to be reachable without
 * leaving it.
 */
export function CaseStudyDialog({
  project,
  tone = "paper",
}: {
  project: Project;
  tone?: "paper" | "field";
}) {
  const { caseStudy } = project;
  const triggerRef = useRef<HTMLButtonElement>(null);

  const trigger =
    tone === "field"
      ? "border-on-field bg-on-field text-field hover:bg-signal hover:border-signal hover:text-signal-ink"
      : "border-ink bg-plate text-ink hover:bg-ink hover:text-plate";

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          ref={triggerRef}
          type="button"
          className={`group inline-flex items-center gap-2 border px-5 py-3 text-[12px] font-semibold uppercase tracking-widest transition-colors ${trigger}`}
        >
          Read case study
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
          >
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </button>
      </DialogTrigger>

      <DialogContent
        closeLabel="Close case study"
        onCloseAutoFocus={(event) => {
          // Return focus to the trigger without scrolling — otherwise smooth
          // scrolling animates the page back to it after every close.
          event.preventDefault();
          triggerRef.current?.focus({ preventScroll: true });
        }}
      >
        <DialogTitle className="pr-10">{project.name}</DialogTitle>
        {project.inProduction && (
          <p className="mt-2 font-annot text-[11px] font-semibold uppercase tracking-[0.16em] text-signal">
            Running in production
          </p>
        )}
        <DialogDescription className="mt-4">{project.description}</DialogDescription>

        <dl className="mt-7 grid grid-cols-2 gap-px border border-rule bg-rule">
          {caseStudy.metrics.map((metric) => (
            <div key={metric.label} className="bg-plate px-5 py-4">
              <dd className="font-display text-2xl font-extrabold tracking-[-0.03em] text-signal">
                {metric.value}
              </dd>
              <dt className="mt-1 font-annot text-[10px] uppercase tracking-[0.14em] text-ink-3">
                {metric.label}
              </dt>
            </div>
          ))}
        </dl>

        <div className="mt-8">
          <h4 className="font-annot text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-3">
            The system
          </h4>
          <div className="mt-3">
            <Pipeline stages={project.flow} label={`${project.name} pipeline`} />
          </div>
        </div>

        <div className="mt-8 space-y-6">
          <section>
            <h4 className="font-annot text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-3">
              The problem
            </h4>
            <p className="mt-2.5 text-[15px] leading-relaxed">{caseStudy.problem}</p>
          </section>
          <section>
            <h4 className="font-annot text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-3">
              What I built
            </h4>
            <p className="mt-2.5 text-[15px] leading-relaxed">{caseStudy.approach}</p>
          </section>
          <section>
            <h4 className="font-annot text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-3">
              Impact
            </h4>
            <ul className="mt-2.5 space-y-2">
              {caseStudy.impact.map((item) => (
                <li key={item} className="flex gap-3 text-[15px] leading-relaxed">
                  <span
                    aria-hidden="true"
                    className="mt-2 size-1.5 shrink-0 rounded-full bg-signal"
                  />
                  {item}
                </li>
              ))}
            </ul>
          </section>
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-4 border-t border-rule pt-6">
          <ul aria-label="Stack" className="flex flex-1 flex-wrap gap-1.5">
            {project.stack.map((tech) => (
              <li
                key={tech}
                className="border border-rule px-2.5 py-1 font-annot text-[10px] text-ink-3"
              >
                {tech}
              </li>
            ))}
          </ul>
          <a
            href={project.link.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${project.name} on ${project.link.label} (opens in new tab)`}
            className="inline-flex items-center gap-2 border border-ink bg-ink px-5 py-3 text-[12px] font-semibold uppercase tracking-widest text-plate transition-colors hover:bg-signal hover:border-signal hover:text-signal-ink"
          >
            View on {project.link.label}
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="size-3.5"
            >
              <path d="M7 17 17 7M8 7h9v9" />
            </svg>
          </a>
        </div>
      </DialogContent>
    </Dialog>
  );
}

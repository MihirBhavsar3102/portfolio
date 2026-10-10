"use client";

import { useState } from "react";
import { EstateDiagram, EstateStack } from "@/components/estate-diagram";
import { resume } from "@/lib/resume-data";

/**
 * The sheet: the estate drawn as a reference architecture, with the title
 * block carrying identity and both primary actions — the way a drafting sheet
 * has always identified its author in the corner of the drawing.
 */
export function EstateSheet() {
  const [activePlane, setActivePlane] = useState<string | null>(null);
  const { estate } = resume;

  return (
    <section
      aria-label="Introduction and production estate"
      className="on-field relative isolate overflow-hidden bg-field text-on-field"
    >
      <div aria-hidden="true" className="sheet-grid absolute inset-0" />

      <div className="relative mx-auto max-w-352 px-5 pb-0 pt-10 sm:px-8 lg:pt-14">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
          {/* ── Title block ── */}
          <div className="lg:col-span-5 lg:pt-6">
            <div className="border border-rule-field bg-plate text-ink">
              <div className="px-6 py-7 sm:px-8">
                <h1 className="font-display text-[clamp(2.5rem,6.2vw,4.25rem)] font-extrabold leading-[0.94] tracking-[-0.035em]">
                  {resume.name}
                </h1>
                <p className="mt-3 font-annot text-[12px] font-semibold uppercase tracking-[0.16em] text-signal">
                  {resume.role}
                </p>
                <p className="mt-5 max-w-[46ch] text-[15px] leading-relaxed text-ink-2">
                  {resume.tagline}
                </p>
              </div>

              <div className="flex flex-wrap gap-px border-t border-rule bg-rule">
                <a
                  href={`mailto:${resume.email}?subject=${encodeURIComponent(
                    "Cloud/DevOps role — let's talk"
                  )}`}
                  className="flex flex-1 items-center justify-center gap-2 bg-signal px-5 py-4 text-[12px] font-semibold uppercase tracking-widest text-signal-ink transition-colors hover:bg-ink"
                >
                  Book a call
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
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </a>
                <a
                  href={resume.resumeFile}
                  download
                  className="flex flex-1 items-center justify-center gap-2 bg-plate px-5 py-4 text-[12px] font-semibold uppercase tracking-widest text-ink transition-colors hover:bg-paper"
                >
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
                    <path d="M12 3v12m0 0 5-5m-5 5-5-5M4 21h16" />
                  </svg>
                  Resume
                </a>
              </div>

              {/* The title block's record strip — author, location, standing */}
              <dl className="grid grid-cols-2 gap-px border-t border-rule bg-rule">
                {resume.quickFacts.map((fact) => (
                  <div key={fact.label} className="bg-plate px-5 py-3.5">
                    <dt className="font-annot text-[10px] uppercase tracking-[0.14em] text-ink-3">
                      {fact.label}
                    </dt>
                    <dd className="mt-1 text-[15px] font-medium leading-snug">{fact.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          {/* ── The drawing ── */}
          <div className="lg:col-span-7">
            <div className="mx-auto hidden max-w-175 md:block">
              <EstateDiagram estate={estate} activePlane={activePlane} />
            </div>
            <div className="md:hidden">
              <p className="mb-3 font-annot text-[10px] uppercase tracking-[0.16em] text-on-field-2">
                {estate.rail.label}
              </p>
              <EstateStack estate={estate} activePlane={activePlane} />
            </div>
          </div>
        </div>

        {/* ── Numbered operations legend ── */}
        <div className="mt-10 border-t border-rule-field pt-5 lg:mt-4">
          <p className="font-annot text-[10px] uppercase tracking-[0.16em] text-on-field-2">
            Operations on this estate — {estate.rail.tools.join(" · ")}
          </p>
          <ul className="mt-4 grid gap-px border border-rule-field bg-rule-field sm:grid-cols-2 lg:grid-cols-4">
            {estate.flows.map((flow) => {
              const active = activePlane === flow.plane;
              return (
                <li key={flow.n} className="bg-field">
                  <a
                    href="#record"
                    onMouseEnter={() => setActivePlane(flow.plane)}
                    onMouseLeave={() => setActivePlane(null)}
                    onFocus={() => setActivePlane(flow.plane)}
                    onBlur={() => setActivePlane(null)}
                    className={`flex h-full flex-col gap-2 px-5 py-4 transition-colors ${
                      active ? "bg-field-2" : "hover:bg-field-2"
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <span
                        className={`flex size-6 shrink-0 items-center justify-center rounded-full border font-annot text-[11px] font-semibold transition-colors ${
                          active
                            ? "border-signal-field bg-signal-field text-signal-field-ink"
                            : "border-signal-field text-signal-field"
                        }`}
                      >
                        {flow.n}
                      </span>
                      <span className="font-annot text-[11px] font-semibold uppercase tracking-[0.14em]">
                        {flow.label}
                      </span>
                    </span>
                    <span className="font-display text-2xl font-bold tracking-[-0.02em] text-on-field">
                      {flow.headline}
                    </span>
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="h-12 lg:h-16" />
      </div>
    </section>
  );
}

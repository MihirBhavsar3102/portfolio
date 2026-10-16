import { ArrowRight, ArrowUpRight } from "lucide-react";
import { resume } from "@/lib/resume-data";
import { listOf, monthYear } from "@/lib/format";
import { tech } from "@/lib/tech";
import { frame } from "@/components/site/frame";
import { EstatePreview } from "@/components/hero/estate-preview";
import { HeroCycle } from "@/components/hero/hero-cycle";

/** The preview's three steps, one per verb of the positioning line. */
const steps = ["build", "ship", "observe"] as const;

/**
 * What a recruiter screens for, on the first screen: the AWS certification,
 * one tap from its proof, and the current role and employer. Both are shown
 * in full further down the page.
 */
function Proof() {
  const cert = resume.certifications.find((c) => c.code === "SAA-C03");
  const role = resume.experience[0];
  const dot = "mt-[0.5em] size-1.75 shrink-0 rounded-full";
  return (
    <ul className="mt-10 max-w-xl space-y-2.5 border-t border-line pt-6 text-[15px] leading-normal text-ink-2">
      {cert && (
        <li className="flex gap-2.5">
          <span aria-hidden="true" className={dot} style={{ backgroundColor: tech.aws.color }} />
          <span>
            <span className="font-semibold text-ink">{cert.name}</span>
            {cert.verifyUrl && (
              <>
                {" · "}
                <a
                  href={cert.verifyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium whitespace-nowrap text-accent"
                >
                  Verify
                  <ArrowUpRight aria-hidden="true" className="ml-0.5 inline size-3.5 align-[-0.15em]" strokeWidth={2} />
                  <span className="sr-only">the certification on Credly (opens in new tab)</span>
                </a>
              </>
            )}
          </span>
        </li>
      )}
      {role && (
        <li className="flex gap-2.5">
          <span aria-hidden="true" className={`${dot} bg-ink-3`} />
          <span>
            {role.title} at <span className="font-semibold text-ink">{role.company}</span>, since {monthYear(role.start)}
          </span>
        </li>
      )}
    </ul>
  );
}

/**
 * Screen one: who and what. The name, the role and where, then one crisp line
 * whose last word rolls through built, shipped and monitored; from lg the
 * estate preview beside it plays the same three steps. Two ways forward.
 *
 * The whole line is always in the page: screen readers, print, reduced motion
 * and JavaScript-off visitors read it as one sentence (globals.css).
 */
export function Hero() {
  const { lead, verbs } = resume.positioning;
  return (
    <section
      data-hero
      aria-labelledby="hero-name"
      className={`${frame} grid min-h-[min(calc(100svh-3.5rem),56rem)] content-center items-center gap-x-12 gap-y-14 py-20 lg:grid-cols-[minmax(0,1fr)_27rem] xl:grid-cols-[minmax(0,1fr)_30rem]`}
    >
      <div>
        <h1 id="hero-name" className="type-display text-display text-ink lg:text-[clamp(3.5rem,6.8vw,6rem)]">
          {resume.name}
        </h1>
        {/* On phones the location takes its own line rather than leaving the separator at a line end. */}
        <p className="mt-6 text-[clamp(1.25rem,2.2vw,1.75rem)] font-medium tracking-tight text-ink-2 lg:text-[clamp(1.125rem,1.7vw,1.5rem)]">
          {resume.role}
          <span aria-hidden="true" className="hidden sm:inline"> · </span>
          <span className="sr-only">, </span>
          <span className="block sm:inline">{resume.location}</span>
        </p>
        <p className="mt-10 max-w-[25ch] text-[clamp(1.5rem,3vw,2.375rem)] leading-[1.22] font-medium tracking-[-0.02em] text-ink-2">
          <span className="hero-static">
            {lead} <span className="font-semibold text-ink">{listOf(verbs)}.</span>
          </span>
          <span aria-hidden="true" className="hero-rolling">
            {lead}{" "}
            <span className="hero-roll font-semibold text-ink">
              {verbs.map((v) => (
                <span key={v} className="hero-roll-word">
                  {v}.
                </span>
              ))}
            </span>
          </span>
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
        <Proof />
      </div>
      <div className="hidden lg:block">
        <EstatePreview />
      </div>
      <HeroCycle steps={steps} />
    </section>
  );
}

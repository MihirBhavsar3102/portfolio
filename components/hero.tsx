import { Reveal } from "@/components/reveal";
import { StatCounter } from "@/components/stat-counter";
import { Typewriter } from "@/components/typewriter";
import { resume } from "@/lib/resume-data";

const roles = resume.headline.split("|").map((s) => s.trim());

export function Hero() {
  return (
    <section aria-label="Introduction">
      <div className="mx-auto max-w-3xl px-6 pb-20 pt-20 text-center md:pb-24 md:pt-28">
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
            {resume.location}
          </p>
        </Reveal>
        <Reveal delay={0.08}>
          <h1 className="mt-5 font-display text-5xl font-bold tracking-tight md:text-6xl">
            Mihir Bhavsar
          </h1>
        </Reveal>
        <Reveal delay={0.16}>
          <p className="mt-4 text-lg font-semibold text-accent md:text-xl">
            <Typewriter words={roles} />
          </p>
        </Reveal>
        <Reveal delay={0.24}>
          <p className="mx-auto mt-5 max-w-2xl leading-relaxed text-muted md:text-lg">
            {resume.tagline}
          </p>
        </Reveal>
        <Reveal delay={0.32}>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <a
              href={resume.resumeFile}
              download
              className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-ink transition hover:-translate-y-0.5 hover:bg-accent-strong motion-reduce:hover:translate-y-0"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="size-4"
              >
                <path d="M12 3v12m0 0 5-5m-5 5-5-5M4 21h16" />
              </svg>
              Download resume
            </a>
            <a
              href="#contact"
              className="inline-flex items-center rounded-full border border-line px-6 py-3 text-sm font-semibold transition hover:-translate-y-0.5 hover:border-accent hover:text-accent motion-reduce:hover:translate-y-0"
            >
              Get in touch
            </a>
          </div>
        </Reveal>
        <Reveal delay={0.4}>
          <dl className="mx-auto mt-16 grid max-w-2xl grid-cols-2 gap-y-10 md:grid-cols-4">
            {resume.stats.map((stat) => (
              <div key={stat.label} className="flex flex-col px-2">
                <dd className="order-1 font-display text-3xl font-bold tracking-tight text-ink">
                  <StatCounter
                    target={stat.target}
                    decimals={stat.decimals}
                    prefix={stat.prefix}
                    suffix={stat.suffix}
                  />
                </dd>
                <dt className="order-2 mt-1.5 text-xs text-muted">{stat.label}</dt>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  );
}

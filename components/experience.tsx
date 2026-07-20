import { Reveal } from "@/components/reveal";
import { Section } from "@/components/section";
import { TimelineConnector } from "@/components/timeline-connector";
import { resume } from "@/lib/resume-data";

export function Experience() {
  return (
    <Section id="experience" eyebrow="Experience" title="Where I've worked">
      <ol>
        {resume.experience.map((entry, i) => {
          const isLast = i === resume.experience.length - 1;
          return (
            <li key={`${entry.role}-${entry.stamp}`} className="relative pl-9 pb-12 last:pb-0">
              {!isLast && <TimelineConnector />}
              <span
                aria-hidden="true"
                className={`absolute left-0 top-1.5 size-2.75 rounded-full ${
                  entry.current ? "bg-accent" : "border-2 border-line bg-bg"
                }`}
              />
              <Reveal delay={i * 0.05}>
                <article aria-label={`${entry.role} at ${entry.company}, ${entry.range}`}>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                    <h3 className="font-display text-xl font-semibold tracking-tight">
                      {entry.role}
                    </h3>
                    {entry.current && (
                      <span className="rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-semibold text-accent">
                        Current
                      </span>
                    )}
                  </div>
                  <p className="mt-1.5 text-sm text-muted">
                    <span className="font-medium text-accent">{entry.company}</span> ·{" "}
                    {entry.location} · <span title={entry.range}>{entry.stamp}</span>
                  </p>
                  <ul className="mt-4 max-w-3xl list-disc space-y-2.5 pl-5 marker:text-accent/70">
                    {entry.bullets.map((bullet) => (
                      <li key={bullet.slice(0, 32)} className="text-sm leading-relaxed text-muted">
                        {bullet}
                      </li>
                    ))}
                  </ul>
                </article>
              </Reveal>
            </li>
          );
        })}
      </ol>
    </Section>
  );
}

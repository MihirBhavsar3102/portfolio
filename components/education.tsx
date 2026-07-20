import { Reveal } from "@/components/reveal";
import { Section } from "@/components/section";
import { resume } from "@/lib/resume-data";

export function Education() {
  return (
    <Section id="education" eyebrow="Education" title="Degrees & certifications" tone="alt">
      <div className="grid gap-12 md:grid-cols-2 md:gap-14">
        <Reveal>
          <h3 className="text-xs font-medium uppercase tracking-wide text-muted">Degrees</h3>
          <ul className="mt-5 space-y-6">
            {resume.education.map((entry) => (
              <li key={entry.degree} className="rounded-2xl border border-line bg-panel p-6">
                <p className="font-display text-lg font-semibold tracking-tight">{entry.degree}</p>
                <p className="mt-1 text-sm text-muted">{entry.institution}</p>
                <p className="mt-2 text-sm text-muted">
                  {entry.years} · <span className="font-medium text-ink">{entry.score}</span>
                </p>
              </li>
            ))}
          </ul>
        </Reveal>
        <Reveal delay={0.1}>
          <h3 className="text-xs font-medium uppercase tracking-wide text-muted">Certifications</h3>
          <ul className="mt-5 space-y-4">
            {resume.certifications.map((cert) => (
              <li key={cert.name} className="flex gap-3 text-sm leading-relaxed">
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mt-0.5 size-4 shrink-0 text-accent"
                >
                  <path d="m5 13 4 4L19 7" />
                </svg>
                <span>
                  <span className="font-medium">{cert.name}</span>
                  <span className="block text-xs text-muted">{cert.issuer}</span>
                </span>
              </li>
            ))}
          </ul>
          <h3 className="mt-10 text-xs font-medium uppercase tracking-wide text-muted">
            Beyond engineering
          </h3>
          <ul className="mt-5 space-y-3">
            {resume.achievements.map((achievement) => (
              <li key={achievement.title} className="text-sm leading-relaxed">
                <span className="font-medium">{achievement.title}</span>
                <span className="block text-muted">{achievement.detail}</span>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </Section>
  );
}

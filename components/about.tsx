import { Reveal } from "@/components/reveal";
import { Section } from "@/components/section";
import { resume } from "@/lib/resume-data";

export function About() {
  return (
    <Section id="about" eyebrow="About" title="Who I am" tone="alt">
      <div className="grid gap-10 md:grid-cols-[1.6fr_1fr] md:gap-14">
        <Reveal className="space-y-5">
          {resume.about.map((paragraph) => (
            <p key={paragraph.slice(0, 32)} className="leading-relaxed text-muted">
              {paragraph}
            </p>
          ))}
        </Reveal>
        <Reveal delay={0.1}>
          <dl className="rounded-2xl border border-line bg-panel p-6">
            {resume.quickFacts.map((fact, i) => (
              <div key={fact.label} className={i === 0 ? "pb-4" : "border-t border-line py-4 last:pb-0"}>
                <dt className="text-xs font-medium uppercase tracking-wide text-muted">
                  {fact.label}
                </dt>
                <dd className="mt-1 text-sm font-medium">{fact.value}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </Section>
  );
}

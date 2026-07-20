import type { ReactNode } from "react";
import { Reveal } from "@/components/reveal";

interface SectionProps {
  id: string;
  eyebrow: string;
  title: string;
  intro?: string;
  /** "alt" gives the section a tinted background — alternate for rhythm */
  tone?: "default" | "alt";
  children: ReactNode;
}

export function Section({ id, eyebrow, title, intro, tone = "default", children }: SectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className={tone === "alt" ? "bg-bg-alt" : undefined}
    >
      <div className="mx-auto max-w-5xl px-6 py-20 md:py-24">
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">{eyebrow}</p>
          <h2
            id={`${id}-title`}
            className="mt-3 font-display text-3xl font-bold tracking-tight md:text-4xl"
          >
            {title}
          </h2>
          {intro && <p className="mt-4 max-w-2xl leading-relaxed text-muted">{intro}</p>}
        </Reveal>
        <div className="mt-10 md:mt-12">{children}</div>
      </div>
    </section>
  );
}

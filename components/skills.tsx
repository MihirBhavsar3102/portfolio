import { Reveal } from "@/components/reveal";
import { Section } from "@/components/section";
import { resume } from "@/lib/resume-data";

export function Skills() {
  return (
    <Section id="skills" eyebrow="Skills" title="What I work with">
      <div>
        {resume.skillGroups.map((group, i) => (
          <Reveal key={group.key} delay={i * 0.04}>
            <div className="grid gap-2 border-t border-line py-5 first:border-t-0 first:pt-0 md:grid-cols-[220px_1fr] md:gap-8">
              <h3 className="text-sm font-semibold">{group.key}</h3>
              <ul className="flex flex-wrap gap-2">
                {group.skills.map((skill) => (
                  <li
                    key={skill}
                    className="rounded-full border border-line bg-bg-alt px-3 py-1 text-xs font-medium text-muted"
                  >
                    {skill}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

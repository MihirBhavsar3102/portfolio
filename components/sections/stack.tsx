import type { Skill } from "@/types/resume";
import { resume } from "@/lib/resume-data";
import { evidenceLabel, skillEvidence, type Evidence } from "@/lib/stack";
import { Section } from "@/components/site/section";

/**
 * Evidence marker: a filled square for work, a hollow one for a personal
 * project. Square and neutral so it never reads as a tech dot or as accent.
 */
function Marker({ evidence, className = "" }: { evidence?: Evidence; className?: string }) {
  const look = evidence === "work" ? "bg-ink-2" : evidence === "project" ? "border border-ink-2" : "";
  return <span aria-hidden="true" className={`size-[7px] shrink-0 ${look} ${className}`} />;
}

function SkillItem({ skill }: { skill: Skill }) {
  const evidence = skillEvidence(skill);
  return (
    <li data-evidence={evidence} className="flex gap-2.5">
      <Marker evidence={evidence} className="mt-[6.5px]" />
      <span className="min-w-0">
        <span className="text-sm text-ink">{skill.name}</span>
        {evidence && <span className="sr-only"> ({evidenceLabel[evidence]})</span>}
        {skill.detail && <span className="block text-xs leading-relaxed text-ink-3">{skill.detail}</span>}
      </span>
    </li>
  );
}

/** The resume's nine skill groups as a ruled grid; markers come from the work, not from a hand-set list. */
export function Stack() {
  return (
    <Section id="stack" title="Stack">
      <ul aria-label="Key" className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-ink-3">
        {(["work", "project"] as const).map((e) => (
          <li key={e} className="flex items-center gap-2">
            <Marker evidence={e} />
            {evidenceLabel[e]}
          </li>
        ))}
        <li>No marker: on my resume, not in the work shown here</li>
      </ul>
      <div className="mt-4 grid gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
        {resume.skillGroups.map((group) => (
          <div key={group.name} className="bg-surface-1 p-5 sm:last:odd:col-span-2 lg:last:odd:col-span-1">
            <h3 className="text-base font-semibold text-ink">{group.name}</h3>
            <ul className="mt-3 space-y-2">
              {group.skills.map((skill) => (
                <SkillItem key={skill.name} skill={skill} />
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  );
}

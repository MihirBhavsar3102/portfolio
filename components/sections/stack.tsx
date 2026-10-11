import type { Skill } from "@/types/resume";
import { resume } from "@/lib/resume-data";
import { evidenceLabel, skillEvidence, type Evidence } from "@/lib/stack";
import { tech } from "@/lib/tech";
import { Section } from "@/components/site/section";

/** A chip's look by evidence: used at work is filled, a personal project outlined, the rest of the resume faint. */
const look: Record<Evidence | "none", string> = {
  work: "border-line-strong bg-surface-3 text-ink",
  project: "border-line-strong text-ink-2",
  none: "border-line text-ink-3",
};

/** The brand dot (Marks Only Rule); Ink Three for a brand with no usable colour, and in the key. */
function Dot({ color }: { color?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`size-1.5 shrink-0 rounded-full ${color ? "" : "bg-ink-3"}`}
      style={color ? { backgroundColor: color } : undefined}
    />
  );
}

/** A skill as a chip. Only skills the work shows carry a dot, so the eye lands on them first. */
function SkillChip({ skill }: { skill: Skill }) {
  const evidence = skillEvidence(skill);
  return (
    <li
      data-evidence={evidence}
      className={`inline-flex max-w-full flex-wrap items-center gap-x-1.5 rounded-md border px-2.5 py-1 text-sm ${look[evidence ?? "none"]}`}
    >
      {evidence && <Dot color={skill.tech && tech[skill.tech].color} />}
      <span>{skill.name}</span>
      {/* Ink Two on the filled chip: small Ink Three never goes on Surface Three. */}
      {skill.detail && <span className={evidence === "work" ? "text-ink-2" : "text-ink-3"}>{skill.detail}</span>}
      {evidence && <span className="sr-only"> ({evidenceLabel[evidence]})</span>}
    </li>
  );
}

/** The resume's nine skill groups as hairline rows of chips; which chips stand out is derived from the work. */
export function Stack() {
  return (
    <Section id="stack" title="Stack">
      <ul aria-label="Key" className="flex flex-wrap items-center gap-2 text-xs">
        {(["work", "project"] as const).map((e) => (
          <li key={e} className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 ${look[e]}`}>
            <Dot />
            {evidenceLabel[e]}
          </li>
        ))}
      </ul>
      <div className="mt-4 divide-y divide-line overflow-hidden rounded-lg border border-line bg-surface-1">
        {resume.skillGroups.map((group) => (
          <div key={group.name} className="grid gap-x-8 gap-y-3 px-5 py-4 md:grid-cols-[12rem_1fr]">
            <h3 className="pt-1 text-sm font-medium text-ink">{group.name}</h3>
            <ul className="flex flex-wrap gap-2">
              {group.skills.map((skill) => (
                <SkillChip key={skill.name} skill={skill} />
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  );
}

import { resume } from "@/lib/resume-data";
import { Section } from "@/components/site/section";
import { ProjectCard } from "@/components/work/project-card";

/** The four case studies in spec §7's order, as one ruled grid. */
export function SelectedWork() {
  return (
    <Section id="work" title="Selected work">
      <div className="grid gap-px overflow-hidden rounded-lg border border-line bg-line md:grid-cols-2">
        {resume.projects.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
    </Section>
  );
}

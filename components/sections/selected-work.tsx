import { resume } from "@/lib/resume-data";
import { Section } from "@/components/site/section";
import { ProjectCard } from "@/components/work/project-card";

/** The four case studies in spec §7's order, each card tinted by where it ran. */
export function SelectedWork() {
  return (
    <Section id="work" title="Selected work" intro="Four case studies, coloured by where they ran.">
      <div className="grid gap-4 md:grid-cols-2">
        {resume.projects.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
    </Section>
  );
}

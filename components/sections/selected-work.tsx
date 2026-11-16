import { Section } from "@/components/site/section";
import { WorkReel } from "@/components/work/work-reel";

/** The case studies as a reel, each tinted by where it ran; the page's one section reveal. */
export function SelectedWork() {
  return (
    <Section id="work" title="Selected work" intro="Case studies, coloured by where they ran." reveal>
      <WorkReel />
    </Section>
  );
}

import { Hero } from "@/components/hero/hero";
import { Outcomes } from "@/components/hero/outcomes";
import { MapSection } from "@/components/hero/map-section";
import { TraceProvider } from "@/components/hero/trace-provider";
import { TraceHint } from "@/components/hero/trace-hint";
import { SelectedWork } from "@/components/sections/selected-work";
import { Experience } from "@/components/sections/experience";
import { Stack } from "@/components/sections/stack";
import { Credentials } from "@/components/sections/credentials";
import { GitHubRepos } from "@/components/sections/github-repos";
import { Contact } from "@/components/sections/contact";
import { resume } from "@/lib/resume-data";

// The GitHub section's live fields refresh hourly. Set on the route too, so a
// build that couldn't reach GitHub (and so registered no fetch) still revalidates.
export const revalidate = 3600;

const proof = resume.estate.proof;

export default function Home() {
  return (
    <>
      <Hero />
      {/* The figures and the map they light share one Trace. */}
      <TraceProvider ids={proof.map((p) => p.id)}>
        <Outcomes />
        <MapSection />
        <TraceHint targetId="map" values={Object.fromEntries(proof.map((p) => [p.id, p.figure.value]))} />
      </TraceProvider>
      <SelectedWork />
      <Experience />
      <Stack />
      <Credentials />
      <GitHubRepos />
      <Contact />
    </>
  );
}

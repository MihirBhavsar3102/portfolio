import type { Metadata } from "next";
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
import { JsonLd } from "@/components/site/json-ld";
import { resume } from "@/lib/resume-data";
import { homeJsonLd, pageMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";

// Re-rendered hourly, so the time in the role (Experience) and any featured
// repo's live fields stay current. Set on the route itself: with no repo to
// fetch, nothing else would make the page revalidate.
export const revalidate = 3600;

export const metadata: Metadata = pageMetadata({ description: siteConfig.description, path: "/" });

const proof = resume.estate.proof;

export default function Home() {
  return (
    <>
      <JsonLd data={homeJsonLd()} />
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

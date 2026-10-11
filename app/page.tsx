import { Hero } from "@/components/hero/hero";
import { SelectedWork } from "@/components/sections/selected-work";
import { Experience } from "@/components/sections/experience";
import { Stack } from "@/components/sections/stack";
import { Credentials } from "@/components/sections/credentials";
import { GitHubRepos } from "@/components/sections/github-repos";
import { Contact } from "@/components/sections/contact";

// The GitHub section's live fields refresh hourly. Set on the route too, so a
// build that couldn't reach GitHub (and so registered no fetch) still revalidates.
export const revalidate = 3600;

export default function Home() {
  return (
    <>
      <Hero />
      <SelectedWork />
      <Experience />
      <Stack />
      <Credentials />
      <GitHubRepos />
      <Contact />
    </>
  );
}

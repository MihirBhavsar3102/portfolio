import { Hero } from "@/components/hero/hero";
import { SelectedWork } from "@/components/sections/selected-work";
import { Experience } from "@/components/sections/experience";
import { Stack } from "@/components/sections/stack";
import { Credentials } from "@/components/sections/credentials";

export default function Home() {
  return (
    <>
      <Hero />
      <SelectedWork />
      <Experience />
      <Stack />
      <Credentials />
    </>
  );
}

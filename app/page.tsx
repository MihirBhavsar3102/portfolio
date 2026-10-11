import { Hero } from "@/components/hero/hero";
import { SelectedWork } from "@/components/sections/selected-work";
import { Experience } from "@/components/sections/experience";

export default function Home() {
  return (
    <>
      <Hero />
      <SelectedWork />
      <Experience />
    </>
  );
}

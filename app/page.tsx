import { EstateSheet } from "@/components/estate-sheet";
import { OperationsRecord } from "@/components/operations-record";
import { Projects } from "@/components/projects";
import { Experience } from "@/components/experience";
import { Skills } from "@/components/skills";
import { Credentials } from "@/components/education";
import { Contact } from "@/components/contact";

export default function Home() {
  return (
    <>
      <EstateSheet />
      <OperationsRecord />
      <Projects />
      <Experience />
      <Skills />
      <Credentials />
      <Contact />
    </>
  );
}

import { ArrowUpRight, Download } from "lucide-react";
import { resume } from "@/lib/resume-data";
import { Section } from "@/components/site/section";
import { CopyEmailButton } from "@/components/ui/copy-email-button";

const quiet = "inline-flex items-center gap-1 py-1 text-ink-2 transition-colors hover:text-ink";

/** The close: email first (there is no booking link), set large; then LinkedIn, GitHub and the resume. */
export function Contact() {
  const social = (label: string) => resume.socials.find((s) => s.label === label);
  const links = [social("LinkedIn"), social("GitHub")].filter((s) => s !== undefined);
  return (
    <Section id="contact" title="Let's talk." intro={`Email is the best way to reach me. I'm based in ${resume.location}.`}>
      <CopyEmailButton email={resume.email} variant="display" />
      <ul className="mt-10 flex flex-wrap gap-x-8 gap-y-2 text-[15px]">
        {links.map((s) => (
          <li key={s.label}>
            <a href={s.href} target="_blank" rel="noopener noreferrer" className={quiet}>
              {s.label}
              <ArrowUpRight aria-hidden="true" className="size-3.5" strokeWidth={1.75} />
              <span className="sr-only">(opens in new tab)</span>
            </a>
          </li>
        ))}
        <li>
          <a href={resume.resumeFile} download className={quiet}>
            <Download aria-hidden="true" className="size-3.5" strokeWidth={1.75} />
            Resume (PDF)
          </a>
        </li>
      </ul>
    </Section>
  );
}

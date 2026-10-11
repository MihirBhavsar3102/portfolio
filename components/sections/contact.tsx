import { ArrowUpRight, Download, Mail } from "lucide-react";
import { resume } from "@/lib/resume-data";
import { Section } from "@/components/site/section";
import { CopyEmailButton } from "@/components/ui/copy-email-button";

const external = "inline-flex items-center gap-1 py-1 text-ink-2 transition-colors hover:text-ink";

/** Email first (there is no booking link), then LinkedIn, GitHub and the resume. */
export function Contact() {
  const social = (label: string) => resume.socials.find((s) => s.label === label);
  const links = [social("LinkedIn"), social("GitHub")].filter((s) => s !== undefined);
  return (
    <Section id="contact" title="Contact">
      <p className="max-w-[42ch] text-lg leading-relaxed text-ink-2">
        Email is the best way to reach me. I&apos;m based in {resume.location}.
      </p>
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <a
          href={`mailto:${resume.email}`}
          className="inline-flex items-center gap-2 rounded-md bg-accent px-4 py-2.5 text-sm font-semibold text-accent-ink transition-colors hover:bg-ink"
        >
          <Mail aria-hidden="true" className="size-4" strokeWidth={2} />
          Email me
        </a>
        <CopyEmailButton email={resume.email} />
      </div>
      <ul className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm">
        {links.map((s) => (
          <li key={s.label}>
            <a href={s.href} target="_blank" rel="noopener noreferrer" className={external}>
              {s.label}
              <ArrowUpRight aria-hidden="true" className="size-3.5" strokeWidth={1.75} />
              <span className="sr-only">(opens in new tab)</span>
            </a>
          </li>
        ))}
        <li>
          <a href={resume.resumeFile} download className={external}>
            <Download aria-hidden="true" className="size-3.5" strokeWidth={1.75} />
            Resume (PDF)
          </a>
        </li>
      </ul>
    </Section>
  );
}

import { ArrowUpRight } from "lucide-react";
import { resume } from "@/lib/resume-data";

export function SiteFooter() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 py-10 sm:px-8 md:flex-row md:items-end md:justify-between">
        <div className="space-y-1.5">
          <p className="text-sm font-semibold text-ink">{resume.name}</p>
          <p className="text-sm text-ink-3">
            {resume.role} · {resume.location}
          </p>
        </div>

        <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
          <li>
            <a href={`mailto:${resume.email}`} className="text-ink-2 transition-colors hover:text-ink">
              {resume.email}
            </a>
          </li>
          {resume.socials.map((social) => (
            <li key={social.label}>
              <a
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-ink-2 transition-colors hover:text-ink"
              >
                {social.label}
                <ArrowUpRight aria-hidden="true" className="size-3.5" strokeWidth={1.75} />
                <span className="sr-only">(opens in new tab)</span>
              </a>
            </li>
          ))}
          <li>
            <a href={resume.resumeFile} download className="text-ink-2 transition-colors hover:text-ink">
              Resume (PDF)
            </a>
          </li>
        </ul>
      </div>
      <div className="mx-auto max-w-7xl px-5 pb-8 text-xs text-ink-3 sm:px-8">
        Built with Next.js. Every figure on this site comes from my resume.
      </div>
    </footer>
  );
}

import { ArrowUpRight } from "lucide-react";
import { resume } from "@/lib/resume-data";
import { frame } from "@/components/site/frame";
import { vercelInsights } from "@/lib/insights";

const link = "inline-flex items-center gap-1 py-0.5 text-ink-2 transition-colors hover:text-ink";

export function SiteFooter() {
  return (
    <footer className="border-t border-line">
      <div className={`${frame} flex flex-col gap-6 py-12 md:flex-row md:items-end md:justify-between`}>
        <div className="space-y-1">
          <p className="text-[15px] font-semibold tracking-tight text-ink">{resume.name}</p>
          <p className="text-sm text-ink-3">
            {resume.role} · {resume.location}
          </p>
        </div>
        <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
          <li>
            <a href={`mailto:${resume.email}`} className={link}>
              {resume.email}
            </a>
          </li>
          {resume.socials.map((social) => (
            <li key={social.label}>
              <a href={social.href} target="_blank" rel="noopener noreferrer" className={link}>
                {social.label}
                <ArrowUpRight aria-hidden="true" className="size-3.5" strokeWidth={1.75} />
                <span className="sr-only">(opens in new tab)</span>
              </a>
            </li>
          ))}
          <li>
            <a href={resume.resumeFile} download className={link}>
              Resume (PDF)
            </a>
          </li>
        </ul>
      </div>
      <p className={`${frame} pb-10 text-xs text-ink-3`}>
        Built with Next.js. Every figure on this site comes from my resume.
        {vercelInsights && " Visits and page speed are measured anonymously by Vercel, without cookies."}
      </p>
    </footer>
  );
}

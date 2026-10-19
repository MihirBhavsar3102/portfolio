import { ArrowUpRight } from "lucide-react";
import type { Certification } from "@/types/resume";
import { monthYear } from "@/lib/format";
import { certIssuers as issuers, resume } from "@/lib/resume-data";
import { Section } from "@/components/site/section";

/** A titled, hairline-ruled list panel. */
function Panel({ title, className = "", children }: { title: string; className?: string; children: React.ReactNode }) {
  return (
    <div className={className}>
      <h3 className="mb-4 text-lg font-semibold tracking-tight text-ink">{title}</h3>
      <ul className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-surface-1">{children}</ul>
    </div>
  );
}

/** A certification: name, then code · issuer · month; fields not provided are simply left out. */
function CertificationItem({ cert }: { cert: Certification }) {
  return (
    <li className="flex items-start justify-between gap-4 px-5 py-4 sm:items-center">
      <div className="min-w-0">
        <p className="text-sm font-medium text-ink">{cert.name}</p>
        <p className="mt-1 text-xs text-ink-3">
          {cert.code && `${cert.code} · `}
          {issuers[cert.issuerId]}
          {cert.earned && (
            <>
              {" · Earned "}
              <time dateTime={cert.earned}>{monthYear(cert.earned)}</time>
            </>
          )}
        </p>
      </div>
      {cert.verifyUrl && (
        <a
          href={cert.verifyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex shrink-0 items-center gap-1 py-1 text-sm text-ink-2 transition-colors hover:text-ink"
        >
          Verify
          <ArrowUpRight aria-hidden="true" className="size-3.5" strokeWidth={1.75} />
          <span className="sr-only">{cert.name} (opens in new tab)</span>
        </a>
      )}
    </li>
  );
}

/** Certifications beside education and the NCC letter (from lg). */
export function Credentials() {
  return (
    <Section id="credentials" title="Credentials">
      <div className="grid gap-x-12 gap-y-10 lg:grid-cols-12">
        <Panel title="Certifications" className="lg:col-span-7">
          {resume.certifications.map((c) => (
            <CertificationItem key={c.name} cert={c} />
          ))}
        </Panel>
        <div className="space-y-10 lg:col-span-5">
          <Panel title="Education">
            {resume.education.map((e) => (
              <li key={e.degree} className="px-5 py-4">
                <p className="text-sm font-medium text-ink">{e.degree}</p>
                <p className="mt-1 text-sm text-ink-2">{e.institution}</p>
                <p className="mt-1 text-xs text-ink-3">
                  {e.years} · {e.score}
                </p>
              </li>
            ))}
          </Panel>
          <Panel title="Recognition">
            {resume.achievements.map((a) => (
              <li key={a.title} className="px-5 py-4">
                <p className="text-sm font-medium text-ink">{a.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-ink-2">{a.detail}</p>
              </li>
            ))}
          </Panel>
        </div>
      </div>
    </Section>
  );
}

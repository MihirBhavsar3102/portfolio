import { CopyEmailButton } from "@/components/copy-email-button";
import { resume } from "@/lib/resume-data";

/*
 * The issue date is resolved once, at build time, in a fixed locale and zone —
 * the page is statically generated, so this is genuinely the date the sheet was
 * issued, and pinning both keeps it from drifting with the reader's machine.
 */
const ISSUED = new Intl.DateTimeFormat("en-GB", {
  month: "long",
  year: "numeric",
  timeZone: "UTC",
}).format(new Date());

/**
 * The title block, closing the sheet the way a drafting sheet closes: who
 * prepared it, where, how to reach them, and the actions that matter — set in
 * ruled cells rather than centred in a tinted box.
 */
export function Contact() {
  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
      className="on-field bg-field text-on-field"
    >
      <div className="mx-auto max-w-352 px-5 py-16 sm:px-8 md:py-20">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-5">
            <h2
              id="contact-title"
              className="font-display text-[clamp(1.75rem,3.4vw,2.75rem)] font-extrabold leading-[1.03] tracking-[-0.03em]"
            >
              Let&rsquo;s talk
            </h2>
            <p className="mt-5 max-w-[46ch] text-[17px] leading-relaxed text-on-field-2">
              Email is the fastest route — I usually reply within a day. For cloud, automation,
              or anything at the seam of infrastructure and AI, the inbox is open.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href={`mailto:${resume.email}`}
                className="break-all font-display text-xl font-bold tracking-[-0.02em] underline decoration-signal-field decoration-2 underline-offset-[6px] transition-colors hover:text-signal-field md:text-2xl"
              >
                {resume.email}
              </a>
              <CopyEmailButton email={resume.email} />
            </div>
          </div>

          {/* Title block record */}
          <div className="lg:col-span-7">
            <dl className="grid gap-px border border-rule-field bg-rule-field sm:grid-cols-2">
              <div className="bg-field-2 px-5 py-4">
                <dt className="font-annot text-[10px] uppercase tracking-[0.14em] text-on-field-2">
                  Prepared by
                </dt>
                <dd className="mt-1.5 text-[15px] font-medium">{resume.name}</dd>
              </div>
              <div className="bg-field-2 px-5 py-4">
                <dt className="font-annot text-[10px] uppercase tracking-[0.14em] text-on-field-2">
                  Discipline
                </dt>
                <dd className="mt-1.5 text-[15px] font-medium">{resume.role}</dd>
              </div>
              <div className="bg-field-2 px-5 py-4">
                <dt className="font-annot text-[10px] uppercase tracking-[0.14em] text-on-field-2">
                  Based in
                </dt>
                <dd className="mt-1.5 text-[15px] font-medium">{resume.location}</dd>
              </div>
              <div className="bg-field-2 px-5 py-4">
                <dt className="font-annot text-[10px] uppercase tracking-[0.14em] text-on-field-2">
                  Open to
                </dt>
                <dd className="mt-1.5 text-[15px] font-medium">
                  Cloud, DevOps &amp; platform roles
                </dd>
              </div>
            </dl>

            <div className="mt-px flex flex-wrap gap-px bg-rule-field">
              <a
                href={resume.resumeFile}
                download
                className="flex flex-1 items-center justify-center gap-2 bg-signal px-5 py-4 text-[12px] font-semibold uppercase tracking-widest text-signal-ink transition-colors hover:bg-on-field hover:text-field"
              >
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="size-3.5"
                >
                  <path d="M12 3v12m0 0 5-5m-5 5-5-5M4 21h16" />
                </svg>
                Download resume
              </a>
              {resume.socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${social.label} (opens in new tab)`}
                  className="flex flex-1 items-center justify-center gap-2 bg-field-2 px-5 py-4 text-[12px] font-semibold uppercase tracking-widest transition-colors hover:bg-on-field hover:text-field"
                >
                  {social.label}
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="size-3"
                  >
                    <path d="M7 17 17 7M8 7h9v9" />
                  </svg>
                </a>
              ))}
            </div>

            {/* The issue block. A title block names its author; an issue block
                is what makes the sheet a published one. */}
            <dl className="mt-px flex flex-wrap gap-x-8 gap-y-2 border border-rule-field bg-field-2 px-5 py-3.5 font-annot text-[10px] uppercase tracking-[0.14em] text-on-field-2">
              <div className="flex gap-2">
                <dt>Sheet</dt>
                <dd className="text-on-field">01 of 01</dd>
              </div>
              <div className="flex gap-2">
                <dt>Issued</dt>
                <dd className="text-on-field">{ISSUED}</dd>
              </div>
              <div className="flex gap-2">
                <dt>Scale</dt>
                <dd className="text-on-field">Measured, not to scale</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}

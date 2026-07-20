import { Reveal } from "@/components/reveal";
import { resume } from "@/lib/resume-data";

export function Contact() {
  return (
    <section id="contact" aria-labelledby="contact-title">
      <div className="mx-auto max-w-5xl px-6 py-20 md:py-24">
        <Reveal>
          <div className="rounded-3xl bg-accent/5 px-6 py-14 text-center md:px-12 md:py-16">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">Contact</p>
            <h2
              id="contact-title"
              className="mt-3 font-display text-3xl font-bold tracking-tight md:text-4xl"
            >
              Get in touch
            </h2>
            <p className="mx-auto mt-4 max-w-xl leading-relaxed text-muted">
              The fastest way to reach me is email — I usually reply within a day. For roles,
              collaborations, or anything cloud and automation, my inbox is open.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <a
                href={`mailto:${resume.email}`}
                className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-ink transition hover:-translate-y-0.5 hover:bg-accent-strong motion-reduce:hover:translate-y-0"
              >
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="size-4"
                >
                  <rect x="3" y="5" width="18" height="14" rx="2" />
                  <path d="m3 7 9 6 9-6" />
                </svg>
                {resume.email}
              </a>
              {resume.socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${social.label} (opens in new tab)`}
                  className="inline-flex items-center gap-2 rounded-full border border-line bg-bg px-6 py-3 text-sm font-semibold transition hover:-translate-y-0.5 hover:border-accent hover:text-accent motion-reduce:hover:translate-y-0"
                >
                  {social.label}
                </a>
              ))}
              <a
                href={resume.resumeFile}
                download
                className="inline-flex items-center gap-2 rounded-full border border-line bg-bg px-6 py-3 text-sm font-semibold transition hover:-translate-y-0.5 hover:border-accent hover:text-accent motion-reduce:hover:translate-y-0"
              >
                Download resume
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

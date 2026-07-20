import { resume } from "@/lib/resume-data";

export function SiteFooter() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-5xl flex-col gap-6 px-6 py-10 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium">
            © {new Date().getFullYear()} {resume.name}
          </p>
          <p className="mt-1 text-sm text-muted">Cloud &amp; DevOps Engineer · Ahmedabad, India</p>
        </div>
        <ul className="flex items-center gap-2" aria-label="Social links">
          <li>
            <a
              href={resume.socials.find((s) => s.label === "GitHub")?.href ?? "#"}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub (opens in new tab)"
              className="flex size-9 items-center justify-center rounded-full border border-line text-muted transition-colors hover:border-accent hover:text-ink"
            >
              <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" className="size-4">
                <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.55 0-.27-.01-1.17-.02-2.12-3.2.7-3.87-1.36-3.87-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.03 1.76 2.69 1.25 3.35.96.1-.75.4-1.25.72-1.54-2.55-.29-5.23-1.28-5.23-5.68 0-1.26.45-2.28 1.18-3.09-.12-.29-.51-1.46.11-3.04 0 0 .96-.31 3.16 1.18a11 11 0 0 1 5.76 0c2.2-1.49 3.16-1.18 3.16-1.18.62 1.58.23 2.75.11 3.04.74.81 1.18 1.83 1.18 3.09 0 4.41-2.69 5.38-5.25 5.67.41.35.77 1.05.77 2.12 0 1.53-.01 2.76-.01 3.14 0 .3.2.67.8.55A10.52 10.52 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
              </svg>
            </a>
          </li>
          <li>
            <a
              href={resume.socials.find((s) => s.label === "LinkedIn")?.href ?? "#"}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn (opens in new tab)"
              className="flex size-9 items-center justify-center rounded-full border border-line text-muted transition-colors hover:border-accent hover:text-ink"
            >
              <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" className="size-4">
                <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.72v20.55C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.72C24 .77 23.2 0 22.22 0Z" />
              </svg>
            </a>
          </li>
          <li>
            <a
              href={`mailto:${resume.email}`}
              aria-label={`Email ${resume.name}`}
              className="flex size-9 items-center justify-center rounded-full border border-line text-muted transition-colors hover:border-accent hover:text-ink"
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
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
}

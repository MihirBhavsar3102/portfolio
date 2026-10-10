import { resume } from "@/lib/resume-data";

/**
 * The sheet's bottom edge. The title block above already carries identity and
 * every action, so this stays a single ruled strip rather than repeating it.
 */
export function SiteFooter() {
  return (
    <footer className="border-t border-rule bg-paper">
      <div className="mx-auto flex max-w-352 flex-col gap-3 px-5 py-6 text-[12px] text-ink-3 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <p>
          © {new Date().getFullYear()} {resume.name} · {resume.role}
        </p>
        <p>Built with Next.js and Tailwind CSS</p>
      </div>
    </footer>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

// noindex here too, so the layout's "index, follow" doesn't contradict the noindex Next adds.
export const metadata: Metadata = { title: "Page not found", robots: { index: false } };

/** Any unknown URL, including a case study that doesn't exist: a way home and a way to the work. */
export default function NotFound() {
  return (
    <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8">
      <h1 className="type-display text-4xl leading-[1.08] tracking-[-0.025em] text-ink">Page not found</h1>
      <p className="mt-4 max-w-[52ch] text-lg leading-relaxed text-ink-2">
        Error 404: there&apos;s nothing at this address. It may have moved, or the link may be mistyped.
      </p>
      <div className="mt-8 flex flex-wrap items-center gap-3">
        <Link
          href="/"
          className="group inline-flex items-center gap-2 rounded-md bg-accent px-4 py-2.5 text-sm font-semibold text-accent-ink transition-colors hover:bg-ink"
        >
          Back to home
          <ArrowRight
            aria-hidden="true"
            className="size-4 transition-transform duration-200 group-hover:translate-x-0.5"
            strokeWidth={2}
          />
        </Link>
        <Link
          href="/#work"
          className="inline-flex items-center gap-2 rounded-md border border-line-strong px-4 py-2.5 text-sm font-semibold text-ink transition-colors hover:border-ink-3 hover:bg-surface-2"
        >
          See the work
        </Link>
      </div>
    </div>
  );
}

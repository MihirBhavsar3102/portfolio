import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { frame } from "@/components/site/frame";

// noindex here too, so the layout's "index, follow" doesn't contradict the noindex Next adds.
export const metadata: Metadata = { title: "Page not found", robots: { index: false } };

/** Any unknown URL, including a case study that doesn't exist: a way home and a way to the work. */
export default function NotFound() {
  return (
    <div className={`${frame} flex min-h-[min(70svh,40rem)] flex-col justify-center py-24`}>
      <h1 className="type-display text-[clamp(3rem,7vw,5rem)] leading-[0.95] text-ink">Page not found</h1>
      <p className="mt-6 max-w-[44ch] text-xl leading-relaxed text-ink-2">
        Error 404: there&apos;s nothing at this address. It may have moved, or the link may be mistyped.
      </p>
      <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
        <Link
          href="/"
          className="group inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3.5 text-[15px] font-semibold text-canvas transition-opacity hover:opacity-85"
        >
          Back to home
          <ArrowRight aria-hidden="true" className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" strokeWidth={2} />
        </Link>
        <Link href="/#work" className="group inline-flex items-center gap-1.5 py-2 text-[15px] font-medium text-accent">
          See the work
          <ArrowRight aria-hidden="true" className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" strokeWidth={2} />
        </Link>
      </div>
    </div>
  );
}

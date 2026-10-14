"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { frame } from "@/components/site/frame";

/**
 * A page that failed to render, inside the nav and footer, in the 404's
 * voice: try again, or go home. The error itself is never shown; React
 * already logs it to the console.
 */
export default function ErrorPage({ retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return (
    <div className={`${frame} flex min-h-[min(70svh,40rem)] flex-col justify-center py-24`}>
      <h1 className="type-display text-[clamp(3rem,7vw,5rem)] leading-[0.95] text-ink">Something went wrong</h1>
      <p className="mt-6 max-w-[44ch] text-xl leading-relaxed text-ink-2">
        This page didn&apos;t load properly. Trying again usually fixes it.
      </p>
      <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
        <button
          type="button"
          onClick={() => retry()}
          className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3.5 text-[15px] font-semibold text-canvas transition-opacity hover:opacity-85"
        >
          Try again
        </button>
        <Link href="/" className="group inline-flex items-center gap-1.5 py-2 text-[15px] font-medium text-accent">
          Back to home
          <ArrowRight aria-hidden="true" className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" strokeWidth={2} />
        </Link>
      </div>
    </div>
  );
}

"use client";

import { frame } from "@/components/site/frame";
import "./globals.css";

/**
 * The last resort, for an error in the root layout itself. It replaces the
 * whole document, so it brings its own html, body and stylesheet; the
 * layout's fonts and theme script don't run, so the system theme applies
 * (globals.css). Home is a plain link: a full load, not the broken layout.
 */
export default function GlobalError({ retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return (
    <html lang="en">
      <body className="flex min-h-svh flex-col justify-center">
        <title>Something went wrong — Mihir Bhavsar</title>
        <main className={`${frame} py-24`}>
          <h1 className="type-display text-[clamp(3rem,7vw,5rem)] leading-[0.95] text-ink">Something went wrong</h1>
          <p className="mt-6 max-w-[44ch] text-xl leading-relaxed text-ink-2">
            The site didn&apos;t load properly. Trying again usually fixes it.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
            <button
              type="button"
              onClick={() => retry()}
              className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3.5 text-[15px] font-semibold text-canvas transition-opacity hover:opacity-85"
            >
              Try again
            </button>
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- a full load, past the broken layout */}
            <a href="/" className="inline-flex items-center gap-1.5 py-2 text-[15px] font-medium text-accent">
              Back to home
            </a>
          </div>
        </main>
      </body>
    </html>
  );
}

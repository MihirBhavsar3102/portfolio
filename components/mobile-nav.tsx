"use client";

import { useRef } from "react";
import { Dialog, DialogClose, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { resume } from "@/lib/resume-data";
import { sections } from "@/lib/sections";

export function MobileNav() {
  const triggerRef = useRef<HTMLButtonElement>(null);

  return (
    <Dialog>
      <DialogTrigger
        ref={triggerRef}
        aria-label="Open menu"
        className="flex size-9 items-center justify-center border border-rule text-ink-3 transition-colors hover:border-ink hover:text-ink md:hidden"
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          className="size-4"
        >
          <path d="M4 7h16M4 12h16M4 17h16" />
        </svg>
      </DialogTrigger>

      <DialogContent
        variant="sheet"
        closeLabel="Close menu"
        onCloseAutoFocus={(event) => {
          // A section link inside the menu has just moved the page; letting
          // focus return scroll the trigger into view would yank it back.
          event.preventDefault();
          triggerRef.current?.focus({ preventScroll: true });
        }}
      >
        <DialogTitle className="text-lg">Menu</DialogTitle>

        <nav aria-label="Sections" className="mt-8 flex flex-col">
          {sections.map((section) => (
            <DialogClose key={section.id} asChild>
              <a
                href={`#${section.id}`}
                className="border-b border-rule py-3 text-base font-medium transition-colors hover:text-signal"
              >
                {section.label}
              </a>
            </DialogClose>
          ))}
        </nav>

        <div className="mt-8 flex flex-col gap-3">
          <DialogClose asChild>
            <a
              href={resume.resumeFile}
              download
              className="inline-flex items-center justify-center gap-2 rounded-full bg-signal px-5 py-2.5 text-sm font-semibold text-signal-ink transition-colors hover:bg-ink"
            >
              Download resume
            </a>
          </DialogClose>
          {resume.socials.map((social) => (
            <a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${social.label} (opens in new tab)`}
              className="inline-flex items-center justify-center gap-2 border border-rule px-5 py-2.5 text-sm font-semibold transition-colors hover:border-ink hover:text-signal"
            >
              {social.label}
            </a>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

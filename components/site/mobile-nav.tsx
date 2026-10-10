"use client";

import { useRef } from "react";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Download, Menu } from "lucide-react";
import { Dialog, DialogClose, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CopyEmailButton } from "@/components/ui/copy-email-button";
import { resume } from "@/lib/resume-data";
import { sections } from "@/lib/sections";

export function MobileNav() {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();
  const base = pathname === "/" ? "" : "/";

  return (
    <Dialog>
      <DialogTrigger
        ref={triggerRef}
        aria-label="Open menu"
        className="flex size-11 items-center justify-center rounded-md text-ink-2 transition-colors hover:bg-surface-2 hover:text-ink md:hidden"
      >
        <Menu aria-hidden="true" className="size-5" strokeWidth={1.75} />
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
        <DialogTitle className="text-base">Menu</DialogTitle>

        <nav aria-label="Sections" className="mt-6 flex flex-col">
          {sections.map((section) => (
            <DialogClose key={section.id} asChild>
              <a
                href={`${base}#${section.id}`}
                className="border-b border-line py-3.5 text-base text-ink transition-colors hover:text-accent"
              >
                {section.label}
              </a>
            </DialogClose>
          ))}
        </nav>

        <div className="mt-8 flex flex-col gap-3">
          <a
            href={resume.resumeFile}
            download
            className="inline-flex items-center justify-center gap-2 rounded-md bg-accent px-4 py-2.5 text-sm font-semibold text-accent-ink transition-colors hover:bg-ink"
          >
            <Download aria-hidden="true" className="size-4" strokeWidth={2} />
            Download resume
          </a>
          <CopyEmailButton email={resume.email} />
          <div className="flex gap-4 pt-2">
            {resume.socials.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm text-ink-2 transition-colors hover:text-ink"
              >
                {social.label}
                <ArrowUpRight aria-hidden="true" className="size-3.5" strokeWidth={1.75} />
                <span className="sr-only">(opens in new tab)</span>
              </a>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

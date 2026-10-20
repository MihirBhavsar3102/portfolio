"use client";

import { useRef, useState } from "react";
import dynamic from "next/dynamic";
import { Menu } from "lucide-react";

/*
 * The menu itself (a Radix dialog, components/site/mobile-menu.tsx) stays out
 * of every page's first load: a hover, focus or press on the button starts
 * loading it, and the tap opens it as soon as it has arrived.
 */
const loadMenu = () => import("@/components/site/mobile-menu");
const MobileMenu = dynamic(loadMenu, { ssr: false });
const warm = () => void loadMenu();

export function MobileNav() {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  // Mounted from the first tap on, so closing returns focus and reopening is instant.
  const [wanted, setWanted] = useState(false);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-label="Open menu"
        aria-haspopup="dialog"
        aria-expanded={open}
        onPointerEnter={warm}
        onPointerDown={warm}
        onFocus={warm}
        onClick={() => {
          setWanted(true);
          setOpen(true);
        }}
        className="flex size-10 items-center justify-center rounded-full text-ink-2 transition-colors hover:bg-surface-2 hover:text-ink md:hidden"
      >
        <Menu aria-hidden="true" className="size-5" strokeWidth={1.75} />
      </button>
      {wanted && <MobileMenu open={open} onOpenChange={setOpen} triggerRef={triggerRef} />}
    </>
  );
}

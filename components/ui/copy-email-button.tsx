"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { Check, Copy } from "lucide-react";

/**
 * The address as a mailto link, with a copy control beside it. Copying is
 * announced through a Radix toast (an aria-live region, components/ui/copy-toast.tsx),
 * which stays out of the first load: hovering or focusing the control starts
 * loading it, and the first copy shows it. Where the Clipboard API is missing
 * (plain-http origins, locked-down browsers) or the write is refused, the
 * control selects the address and says how to copy it, so it never dead-ends.
 */
const loadToast = () => import("@/components/ui/copy-toast");
const CopyToast = dynamic(loadToast, { ssr: false });
const warm = () => void loadToast();

/** `display` sets the address large, as the close of the page, with a round copy button beside it; on phones the type steps down so the button stays on the address's line. */
const looks = {
  default: {
    box: "inline-flex items-center rounded-md border border-line bg-surface-1",
    link: "min-w-0 truncate py-2 pr-2 pl-3 font-mono text-[13px] text-ink-2 transition-colors hover:text-ink",
    button: "flex size-9 shrink-0 items-center justify-center border-l border-line text-ink-3 transition-colors hover:bg-surface-2 hover:text-ink",
  },
  display: {
    box: "inline-flex flex-wrap items-center gap-x-3 gap-y-3 sm:gap-x-4",
    link: "min-w-0 font-mono text-[clamp(1rem,4.3vw,1.125rem)] break-all sm:text-[clamp(1.125rem,2.6vw,2rem)] text-accent underline decoration-accent/40 underline-offset-[0.25em] transition-colors hover:decoration-accent",
    button: "flex size-11 shrink-0 items-center justify-center rounded-full border border-line-strong text-ink-2 transition-colors hover:bg-surface-2 hover:text-ink",
  },
};

export function CopyEmailButton({
  email,
  className,
  variant = "default",
}: {
  email: string;
  className?: string;
  variant?: keyof typeof looks;
}) {
  const look = looks[variant];
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [copied, setCopied] = useState(false);
  const [toastWanted, setToastWanted] = useState(false);
  const timerRef = useRef(0);
  const linkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => () => window.clearTimeout(timerRef.current), []);

  // Reset the check icon a moment after a successful copy
  useEffect(() => {
    if (!copied) return;
    const id = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(id);
  }, [copied]);

  /** Radix re-announces a toast only on a fresh open, so close before reopening. */
  function announce(text: string) {
    setToastWanted(true);
    setMessage(text);
    setOpen(false);
    window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => setOpen(true), 80);
  }

  /** Select the address so the reader's own copy shortcut takes it. */
  function selectAddress() {
    const link = linkRef.current;
    const selection = window.getSelection();
    if (link && selection) {
      const range = document.createRange();
      range.selectNodeContents(link);
      selection.removeAllRanges();
      selection.addRange(range);
    }
    announce("Address selected. Press Ctrl+C (⌘C on a Mac) to copy it.");
  }

  async function handleCopy() {
    if (!navigator.clipboard) return selectAddress();
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      announce("Email address copied");
    } catch {
      selectAddress();
    }
  }

  return (
    <>
      <div
        className={`${look.box} ${className ?? ""}`}
      >
        <a
          ref={linkRef}
          href={`mailto:${email}`}
          className={look.link}
        >
          {email}
        </a>
        <button
          type="button"
          onClick={handleCopy}
          onPointerEnter={warm}
          onFocus={warm}
          aria-label="Copy email address"
          className={look.button}
        >
          {copied ? (
            <Check aria-hidden="true" className="size-4 text-accent" strokeWidth={2.25} />
          ) : (
            <Copy aria-hidden="true" className="size-3.5" strokeWidth={1.75} />
          )}
        </button>
      </div>

      {toastWanted && <CopyToast open={open} onOpenChange={setOpen} message={message} />}
    </>
  );
}

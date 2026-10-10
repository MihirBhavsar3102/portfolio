"use client";

import { useEffect, useRef, useState } from "react";
import { Toast } from "radix-ui";
import { Check, Copy, X } from "lucide-react";

/**
 * The address as a mailto link, with a copy control beside it. Copying is
 * announced through a Radix toast (an aria-live region); where the Clipboard
 * API is missing — locked-down corporate browsers — the control opens the
 * mail client instead, so it never dead-ends.
 */
export function CopyEmailButton({ email, className }: { email: string; className?: string }) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [copied, setCopied] = useState(false);
  const timerRef = useRef(0);

  useEffect(() => () => window.clearTimeout(timerRef.current), []);

  // Reset the check icon a moment after a successful copy
  useEffect(() => {
    if (!copied) return;
    const id = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(id);
  }, [copied]);

  /** Radix re-announces a toast only on a fresh open, so close before reopening. */
  function announce(text: string) {
    setMessage(text);
    setOpen(false);
    window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => setOpen(true), 80);
  }

  async function handleCopy() {
    if (!navigator.clipboard) {
      window.location.href = `mailto:${email}`;
      return;
    }
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      announce("Email address copied");
    } catch {
      announce("Your browser blocked copying. Select the address to copy it.");
    }
  }

  return (
    <Toast.Provider swipeDirection="right" duration={3200}>
      <div
        className={`inline-flex items-center rounded-md border border-line bg-surface-1 ${className ?? ""}`}
      >
        <a
          href={`mailto:${email}`}
          className="min-w-0 truncate py-2 pr-2 pl-3 font-mono text-[13px] text-ink-2 transition-colors hover:text-ink"
        >
          {email}
        </a>
        <button
          type="button"
          onClick={handleCopy}
          aria-label="Copy email address"
          className="flex size-9 shrink-0 items-center justify-center border-l border-line text-ink-3 transition-colors hover:bg-surface-2 hover:text-ink"
        >
          {copied ? (
            <Check aria-hidden="true" className="size-4 text-accent" strokeWidth={2.25} />
          ) : (
            <Copy aria-hidden="true" className="size-3.5" strokeWidth={1.75} />
          )}
        </button>
      </div>

      <Toast.Root
        open={open}
        onOpenChange={setOpen}
        className="anim-toast flex items-center justify-between gap-3 rounded-lg border border-line-strong bg-surface-2 px-4 py-3 shadow-[0_18px_44px_-18px_rgb(0_0_0/0.7)]"
      >
        <Toast.Title className="text-sm text-ink">{message}</Toast.Title>
        <Toast.Close aria-label="Dismiss" className="shrink-0 text-ink-3 transition-colors hover:text-ink">
          <X aria-hidden="true" className="size-3.5" strokeWidth={2} />
        </Toast.Close>
      </Toast.Root>

      <Toast.Viewport
        label="Notifications ({hotkey})"
        className="fixed right-4 bottom-4 z-100 flex w-80 max-w-[calc(100vw-2rem)] flex-col gap-2 outline-none"
      />
    </Toast.Provider>
  );
}

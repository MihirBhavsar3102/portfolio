"use client";

import { useEffect, useRef, useState } from "react";
import { Toast } from "radix-ui";

export function CopyEmailButton({ email }: { email: string }) {
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
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      announce("Email copied");
    } catch {
      announce("Your browser blocked the clipboard. Select the address to copy it.");
    }
  }

  return (
    <Toast.Provider swipeDirection="right" duration={3200}>
      <button
        type="button"
        onClick={handleCopy}
        aria-label={`Copy email address ${email}`}
        className="flex size-10 shrink-0 items-center justify-center border border-rule text-ink-3 transition-colors hover:border-ink hover:text-signal"
      >
        {copied ? (
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="size-4 text-signal"
          >
            <path d="m5 13 4 4L19 7" />
          </svg>
        ) : (
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="size-4"
          >
            <rect x="9" y="9" width="12" height="12" rx="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
        )}
      </button>

      <Toast.Root
        open={open}
        onOpenChange={setOpen}
        className="anim-toast flex items-center justify-between gap-3 border border-rule bg-plate px-4 py-3 shadow-[0_18px_44px_-18px_rgb(11_31_51_/_0.45)]"
      >
        <Toast.Title className="text-sm font-medium">{message}</Toast.Title>
        <Toast.Close
          aria-label="Dismiss"
          className="shrink-0 text-ink-3 transition-colors hover:text-ink"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            className="size-3.5"
          >
            <path d="M6 6l12 12M18 6 6 18" />
          </svg>
        </Toast.Close>
      </Toast.Root>

      <Toast.Viewport
        label="Notifications ({hotkey})"
        className="fixed bottom-4 right-4 z-100 flex w-80 max-w-[calc(100vw-2rem)] flex-col gap-2 outline-none"
      />
    </Toast.Provider>
  );
}

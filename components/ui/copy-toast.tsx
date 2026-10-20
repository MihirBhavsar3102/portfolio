"use client";

import { Portal, Toast } from "radix-ui";
import { X } from "lucide-react";

/**
 * The copy confirmation, a Radix toast (an aria-live region). Loaded on first
 * use by CopyEmailButton, which decides what it says and when it opens.
 */
export default function CopyToast({
  open,
  onOpenChange,
  message,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  message: string;
}) {
  return (
    <Toast.Provider swipeDirection="right" duration={3200}>
      <Toast.Root
        open={open}
        onOpenChange={onOpenChange}
        className="anim-toast flex items-center justify-between gap-3 rounded-xl border border-line-strong bg-surface-2 px-4 py-3 shadow-[0_18px_44px_-18px_rgb(0_0_0/0.45)]"
      >
        <Toast.Title className="text-sm text-ink">{message}</Toast.Title>
        <Toast.Close aria-label="Dismiss" className="flex size-6 shrink-0 items-center justify-center rounded-full text-ink-3 transition-colors hover:bg-surface-3 hover:text-ink">
          <X aria-hidden="true" className="size-3.5" strokeWidth={2} />
        </Toast.Close>
      </Toast.Root>

      {/* At the end of <body>: a transformed ancestor (the section reveal, mid-rise) would otherwise become the fixed viewport's containing block. */}
      <Portal.Root>
        <Toast.Viewport
          label="Notifications ({hotkey})"
          className="fixed right-4 bottom-4 z-100 flex w-80 max-w-[calc(100vw-2rem)] flex-col gap-2 outline-none"
        />
      </Portal.Root>
    </Toast.Provider>
  );
}

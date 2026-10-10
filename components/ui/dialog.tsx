"use client";

import { Dialog as DialogPrimitive } from "radix-ui";
import { useRef, type ComponentPropsWithoutRef } from "react";

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogClose = DialogPrimitive.Close;

/** Centered detail sheet for reading; right-hand sheet for navigation. */
type DialogVariant = "modal" | "sheet";

/*
 * Deliberately no CSS animation on the overlay/content nodes. Radix's Presence
 * calls getComputedStyle() on them to detect a running animation before it may
 * unmount; on a subtree this large those forced style recalculations were the
 * second-biggest cost of opening (measured ~330ms under CPU throttling) and
 * made the open feel laggy. Opening instantly is both cheaper and snappier.
 */
const variantClasses: Record<DialogVariant, string> = {
  modal:
    "fixed left-1/2 top-1/2 z-50 max-h-[86vh] w-[calc(100%-1.5rem)] max-w-2xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto border border-rule bg-plate p-6 shadow-[0_28px_70px_-24px_rgb(11_31_51_/_0.5)] md:p-9",
  sheet:
    "fixed right-0 top-0 z-50 flex h-full w-80 max-w-[85vw] flex-col overflow-y-auto border-l border-rule bg-plate p-6",
};

interface DialogContentProps extends ComponentPropsWithoutRef<typeof DialogPrimitive.Content> {
  variant?: DialogVariant;
  /** Accessible label for the close button, e.g. "Close menu" */
  closeLabel?: string;
}

export function DialogContent({
  variant = "modal",
  closeLabel = "Close",
  className,
  children,
  onOpenAutoFocus,
  ...props
}: DialogContentProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-field/70" />
      <DialogPrimitive.Content
        ref={contentRef}
        onOpenAutoFocus={(event) => {
          onOpenAutoFocus?.(event);
          if (event.defaultPrevented) return;
          // Two things matter here. preventScroll: scroll-behavior is smooth
          // globally, so a focus-driven scroll becomes an animated page slide
          // behind the dialog. And the deferral: focusing forces a synchronous
          // layout of the whole document, so doing it after the next frame lets
          // the dialog paint first rather than freezing before it appears.
          event.preventDefault();
          requestAnimationFrame(() => contentRef.current?.focus({ preventScroll: true }));
        }}
        className={`${variantClasses[variant]} ${className ?? ""}`}
        {...props}
      >
        {children}
        <DialogPrimitive.Close
          aria-label={closeLabel}
          className="absolute right-4 top-4 flex size-8 items-center justify-center border border-rule text-ink-3 transition-colors hover:border-ink hover:text-ink"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            className="size-3.5"
          >
            <path d="M6 6l12 12M18 6 6 18" />
          </svg>
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}

export function DialogTitle({
  className,
  ...props
}: ComponentPropsWithoutRef<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      className={`font-display text-2xl font-extrabold leading-[1.08] tracking-[-0.03em] md:text-3xl ${className ?? ""}`}
      {...props}
    />
  );
}

export function DialogDescription({
  className,
  ...props
}: ComponentPropsWithoutRef<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      className={`text-[15px] leading-relaxed text-ink-2 ${className ?? ""}`}
      {...props}
    />
  );
}

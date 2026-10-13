"use client";

import { useTrace } from "@/components/hero/trace-provider";

/**
 * A control that lights one figure's path: hover or focus previews it, a
 * click pins it (aria-pressed), a second click or Escape clears it. It marks
 * itself data-active and data-pinned so its own styles can follow.
 */
export function TraceButton({
  id,
  describedBy,
  className,
  children,
}: {
  id: string;
  describedBy?: string;
  className?: string;
  children: React.ReactNode;
}) {
  const { state, send } = useTrace();
  const active = state.active === id;
  const pinned = active && state.pinned;
  return (
    <button
      type="button"
      aria-pressed={pinned}
      aria-describedby={describedBy}
      data-active={active ? "" : undefined}
      data-pinned={pinned ? "" : undefined}
      onPointerEnter={() => send({ type: "enter", id })}
      onPointerLeave={() => send({ type: "leave", id })}
      onFocus={() => send({ type: "enter", id })}
      onBlur={() => send({ type: "leave", id })}
      onClick={() => send({ type: "toggle", id })}
      className={className}
    >
      {children}
    </button>
  );
}

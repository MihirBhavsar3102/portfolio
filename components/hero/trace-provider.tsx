"use client";

import { createContext, useCallback, useContext, useEffect, useReducer, useRef } from "react";
import { nextTraceState, readTraceParam, traceHref, type TraceEvent, type TraceState } from "@/lib/trace";

const TraceContext = createContext<{ state: TraceState; send: (e: TraceEvent) => void } | null>(null);

export function useTrace() {
  const ctx = useContext(TraceContext);
  if (!ctx) throw new Error("useTrace must be used inside <TraceProvider>");
  return ctx;
}

/**
 * Holds which proof figure is lit and marks the server-rendered map: elements
 * carry `data-lit-by="id id"`, and the active id sets `data-lit` on them. The
 * SVG never re-renders, so it ships no JavaScript of its own.
 *
 * A pinned figure is mirrored into `?trace=` so a link can carry exactly the
 * number someone meant, and opening that link pins it again.
 */
export function TraceProvider({
  ids,
  children,
  className,
}: {
  ids: string[];
  children: React.ReactNode;
  className?: string;
}) {
  const [state, dispatch] = useReducer(nextTraceState, { active: null, pinned: false });
  const send = useCallback((e: TraceEvent) => dispatch(e), []);
  const root = useRef<HTMLDivElement>(null);
  const restored = useRef(false);

  // Restore a shared pin once, after hydration (never during render, so the
  // server and client markup agree).
  useEffect(() => {
    const id = readTraceParam(window.location.search, ids);
    const frame = requestAnimationFrame(() => {
      restored.current = true;
      if (id) dispatch({ type: "toggle", id });
    });
    return () => cancelAnimationFrame(frame);
  }, [ids]);

  useEffect(() => {
    root.current?.querySelectorAll<Element>("[data-lit-by]").forEach((el) => {
      const lit = state.active !== null && (el.getAttribute("data-lit-by") ?? "").split(" ").includes(state.active);
      el.toggleAttribute("data-lit", lit);
    });
  }, [state.active]);

  useEffect(() => {
    if (!restored.current) return;
    const next = traceHref(window.location.href, state.pinned ? state.active : null);
    if (next !== window.location.href) window.history.replaceState(window.history.state, "", next);
  }, [state.active, state.pinned]);

  return (
    <TraceContext.Provider value={{ state, send }}>
      <div
        ref={root}
        className={className}
        data-tracing={state.active ? "" : undefined}
        onKeyDown={(e) => {
          if (e.key === "Escape") send({ type: "clear" });
        }}
      >
        {children}
      </div>
    </TraceContext.Provider>
  );
}

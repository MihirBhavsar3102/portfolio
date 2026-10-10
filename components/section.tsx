import type { ReactNode } from "react";

interface SheetProps {
  id: string;
  title: string;
  intro?: string;
  /** "plate" lifts the sheet off the paper ground for rhythm */
  tone?: "paper" | "plate";
  children: ReactNode;
}

/**
 * One sheet of the drawing set. The heading carries its own weight — there is
 * no label above it — and the top rule is what separates one sheet from the
 * next, in place of a card or a tinted band.
 */
export function Sheet({ id, title, intro, tone = "paper", children }: SheetProps) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className={tone === "plate" ? "bg-plate" : "bg-paper"}
    >
      <div className="mx-auto max-w-352 border-t border-rule-strong px-5 py-16 sm:px-8 md:py-20">
        <h2
          id={`${id}-title`}
          className="max-w-[20ch] font-display text-[clamp(1.75rem,3.4vw,2.75rem)] font-extrabold leading-[1.03] tracking-[-0.03em] text-balance"
        >
          {title}
        </h2>
        {intro && (
          <p className="mt-5 max-w-[68ch] text-[17px] leading-relaxed text-ink-2">{intro}</p>
        )}
        <div className="mt-10 md:mt-14">{children}</div>
      </div>
    </section>
  );
}

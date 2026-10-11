/** A home-page section: full-bleed hairline above, the 1280px frame, a 24px heading. */
export function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-heading`} className="border-t border-line">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <h2 id={`${id}-heading`} className="text-2xl font-semibold tracking-[-0.01em] text-ink">
          {title}
        </h2>
        <div className="mt-6">{children}</div>
      </div>
    </section>
  );
}

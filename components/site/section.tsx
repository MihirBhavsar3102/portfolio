import { frame, sectionHeading } from "@/components/site/frame";
import { InView } from "@/components/site/in-view";

/**
 * A home-page section: a full-bleed hairline above, the shared measure, a
 * heading set as a statement, an optional one-line intro, then the content.
 * `reveal` makes it the page's one section reveal: the content rises into
 * place once, as it first scrolls into view (spec §9 allows one).
 */
export function Section({
  id,
  title,
  intro,
  reveal = false,
  className = "",
  children,
}: {
  id: string;
  title: string;
  intro?: string;
  reveal?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  const inner = (
    <>
      <h2 id={`${id}-heading`} className={sectionHeading}>
        {title}
      </h2>
      {intro && <p className="mt-6 max-w-[56ch] text-xl leading-relaxed text-ink-2">{intro}</p>}
      <div className="mt-14 lg:mt-16">{children}</div>
    </>
  );
  return (
    <section id={id} aria-labelledby={`${id}-heading`} className={`border-t border-line ${className}`}>
      {reveal ? (
        <InView threshold={0} rootMargin="0px 0px -80px 0px" className={`reveal ${frame} py-24 lg:py-28`}>
          {inner}
        </InView>
      ) : (
        <div className={`${frame} py-24 lg:py-28`}>{inner}</div>
      )}
    </section>
  );
}

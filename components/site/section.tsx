import { frame, sectionHeading } from "@/components/site/frame";
import { InView } from "@/components/site/in-view";

/**
 * A home-page section: a full-bleed hairline above, the shared measure, a
 * heading set as a statement, an optional one-line intro, then the content.
 * The content rises into place once, as it first scrolls into view.
 */
export function Section({
  id,
  title,
  intro,
  className = "",
  children,
}: {
  id: string;
  title: string;
  intro?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-heading`} className={`border-t border-line ${className}`}>
      <InView threshold={0} rootMargin="0px 0px -12% 0px" className={`reveal ${frame} py-24 lg:py-28`}>
        <h2 id={`${id}-heading`} className={sectionHeading}>
          {title}
        </h2>
        {intro && <p className="mt-6 max-w-[56ch] text-xl leading-relaxed text-ink-2">{intro}</p>}
        <div className="mt-14 lg:mt-16">{children}</div>
      </InView>
    </section>
  );
}

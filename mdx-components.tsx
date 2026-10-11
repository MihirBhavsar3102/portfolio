import type { MDXComponents } from "mdx/types";
import { slugify } from "@/lib/format";
import { Ownership } from "@/components/work/ownership";

/*
 * Case-study prose in the Service Map Console voice: Mona Sans throughout,
 * Ink Two body text at a reading measure, Ink headings, hairline-dash list
 * markers. <Diagram /> is bound per page by app/work/[slug]/page.tsx.
 */
const components: MDXComponents = {
  h2: ({ children }) => (
    <h2 id={slugify(String(children))} className="mt-14 text-2xl font-semibold tracking-[-0.01em] text-ink first:mt-0">
      {children}
    </h2>
  ),
  p: ({ children }) => <p className="mt-4 max-w-[68ch] text-base leading-[1.7] text-ink-2">{children}</p>,
  ul: ({ children }) => <ul className="mt-4 max-w-[68ch] space-y-2">{children}</ul>,
  li: ({ children }) => (
    <li className="relative pl-4 text-base leading-[1.7] text-ink-2 before:absolute before:top-[0.8em] before:left-0 before:h-px before:w-2 before:bg-line-strong">
      {children}
    </li>
  ),
  strong: ({ children }) => <strong className="font-semibold text-ink">{children}</strong>,
  a: ({ href, children }) => (
    <a href={href} className="text-ink underline decoration-line-strong underline-offset-4 transition-colors hover:decoration-ink">
      {children}
    </a>
  ),
  Ownership,
};

export function useMDXComponents(): MDXComponents {
  return components;
}

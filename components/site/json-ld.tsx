import { jsonLdHtml } from "@/lib/seo";

/** Structured data for search engines: a native script tag, as Next's JSON-LD guide recommends. */
export function JsonLd({ data }: { data: object }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdHtml(data) }} />;
}

import type { ReactElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

/** Server-rendered markup, for checking hrefs and attributes. */
export const htmlOf = (el: ReactElement) => renderToStaticMarkup(el);

/** The rendered text: tags stripped, entities decoded, whitespace collapsed. For checking copy. */
export const textOf = (el: ReactElement) =>
  htmlOf(el)
    .replace(/<[^>]+>/g, " ")
    .replace(/&#x27;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ");

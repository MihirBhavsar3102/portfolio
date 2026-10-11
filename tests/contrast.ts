import { readFileSync } from "node:fs";

/** WCAG 2.x contrast, plus the CSS colour maths the tokens use: alpha over a ground and color-mix in oklab. */
type RGB = [number, number, number];
export type Tokens = Record<string, string>;

const hex = (h: string): RGB => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16)) as RGB;
const toHex = (c: number[]) => "#" + c.map((v) => Math.round(Math.min(255, Math.max(0, v))).toString(16).padStart(2, "0")).join("");
const lin = (v: number) => ((v /= 255) <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
const delin = (v: number) => 255 * (v <= 0.0031308 ? 12.92 * v : 1.055 * v ** (1 / 2.4) - 0.055);
const luminance = (c: string) => {
  const [r, g, b] = hex(c).map(lin);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

export function ratio(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

/** `rgb(r g b / a)` painted over an opaque hex ground. */
export function over(rgba: string, ground: string): string {
  const [r, g, b, a] = rgba.match(/[\d.]+/g)!.map(Number);
  return toHex(hex(ground).map((v, i) => [r, g, b][i] * a + v * (1 - a)));
}

function toOklab(c: string): RGB {
  const [r, g, b] = hex(c).map(lin);
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ];
}

function fromOklab([L, a, b]: RGB): string {
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  return toHex(
    [
      4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
      -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
      -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
    ].map(delin),
  );
}

/** CSS `color-mix(in oklab, a pct%, b)`. */
export function mixOklab(a: string, pct: number, b: string): string {
  const [A, B] = [toOklab(a), toOklab(b)];
  return fromOklab(A.map((v, i) => (v * pct + B[i] * (100 - pct)) / 100) as RGB);
}

/** The colour tokens of each theme block in app/globals.css. */
export function themeTokens(): { light: Tokens; dark: Tokens; darkMedia: Tokens } {
  const css = readFileSync("app/globals.css", "utf8").replace(/\r\n/g, "\n");
  const block = (selector: string, from = 0) => {
    const start = css.indexOf(selector, from);
    if (start < 0) throw new Error(`no ${selector} block in globals.css`);
    const body = css.slice(css.indexOf("{", start) + 1, css.indexOf("}", start));
    return Object.fromEntries([...body.matchAll(/--color-([a-z0-9-]+):\s*([^;]+);/g)].map((m) => [m[1], m[2].trim()]));
  };
  return {
    light: block("@theme {"),
    dark: block(':root[data-theme="dark"] {'),
    darkMedia: block(":root:not([data-theme]) {", css.indexOf("@media (prefers-color-scheme: dark)")),
  };
}

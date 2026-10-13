import { readFile } from "node:fs/promises";
import { join } from "node:path";

/*
 * Satori renders the share cards without the stylesheet, so each theme's
 * palette is mirrored here as literals; tests/og.test.ts holds them to
 * app/globals.css so a card can't drift from the site it advertises.
 */
export const ogPalettes = {
  light: { canvas: "#ffffff", line: "#e9e9e7", ink: "#0a0a0b", ink2: "#47484c", ink3: "#68696e", accent: "#b93b0a", azure: "#0b6bcb", aws: "#8a5c00", ai: "#12703a" },
  dark: { canvas: "#0a0a0a", line: "#232323", ink: "#f4f4f3", ink2: "#a9a9a6", ink3: "#858582", accent: "#fb7a3c", azure: "#4ea1f0", aws: "#f2b33d", ai: "#4cc38a" },
};
export type OgPalette = (typeof ogPalettes)["dark"];

/** A shared image can't follow the viewer's theme. Black holds its edge in a white feed, where a white card dissolves into the post. */
export const SHARE_THEME: keyof typeof ogPalettes = "dark";

/** Schibsted Grotesk at the cards' two weights: static TTFs (OFL, assets/fonts), as Satori reads neither WOFF2 nor variable fonts. */
export async function ogFonts() {
  const read = (file: string) => readFile(join(process.cwd(), "assets/fonts", file));
  const [medium, bold] = await Promise.all([read("SchibstedGrotesk-Medium.ttf"), read("SchibstedGrotesk-Bold.ttf")]);
  return [
    { name: "Schibsted Grotesk", data: medium, weight: 500 as const, style: "normal" as const },
    { name: "Schibsted Grotesk", data: bold, weight: 700 as const, style: "normal" as const },
  ];
}

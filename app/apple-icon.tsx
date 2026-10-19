import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/**
 * The home-screen icon: app/icon.svg's monogram, built with the site so the
 * two never drift. Square, since iOS rounds the corners itself; a rounded
 * tile would show dark corners inside Apple's mask.
 */
export default async function AppleIcon() {
  const svg = (await readFile(join(process.cwd(), "app/icon.svg"), "utf8")).replace(/ rx="[\d.]+"/, "");
  const src = `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
  // eslint-disable-next-line @next/next/no-img-element -- Satori renders a plain <img>; next/image has no meaning here.
  return new ImageResponse(<img src={src} width={size.width} height={size.height} alt="" />, size);
}

import { ImageResponse } from "next/og";
import { HomeCard } from "@/components/og/share-cards";
import { SHARE_THEME, ogFonts, ogPalettes } from "@/lib/og";
import { siteConfig } from "@/lib/site-config";

export const alt = `${siteConfig.title}: name, role and three measured outcomes`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  return new ImageResponse(<HomeCard p={ogPalettes[SHARE_THEME]} />, { ...size, fonts: await ogFonts() });
}

import type { Metadata, Viewport } from "next";
import { Archivo, Azeret_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { siteConfig } from "@/lib/site-config";
import "./globals.css";

/*
 * Archivo carries the plates and the prose — a grotesque with a width axis, so
 * the display sizes can be set slightly expanded like poster lettering without
 * a second family. Azeret Mono is the drafting hand: annotation, ratings,
 * callout numbers and tabular figures only, never prose and never code.
 */
const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
  display: "swap",
  axes: ["wdth"],
});

const azeret = Azeret_Mono({
  subsets: ["latin"],
  variable: "--font-azeret",
  display: "swap",
});

/**
 * The direction contract. Emitted into the production markup so the built page
 * can be audited against the decision it was built from.
 */
const DIRECTION_CONTRACT = `<!--
THESIS: One career drawn as a published reference architecture — zones, numbered
flows, legend, title block — refusing the centred hero and card grid this
category always ships.
OWN-WORLD: A plotted architecture sheet. Cool paper ground, deep navy ink, navy
zone fields owning whole regions, hairline rules instead of shadows, white
service plates with extruded edges, Archivo plates, Azeret Mono annotation.
STORY: A recruiter reads the drawing and the title block in under a minute and
acts; an engineer opens any system into its own detail sheet.
FIRST VIEWPORT: Full-bleed navy field. Isometric estate of four stacked zone
planes right, automation rail and numbered callouts down its left edge; white
title block plate lower left carrying name, role, both actions and the record
strip; numbered operations legend ruled across the foot.
FORM: Reference architecture poster; candidate 1 of 7 on the grounded list,
taken as IMPECCABLE'S PICK over roll assignment 7; seed key 7543e52e.
FINISH: unreviewed and undocumented is unfinished; this build ends with the
finish review, the verdict, and DESIGN.md
-->`;

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: `%s — ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "Cloud Engineer",
    "DevOps Engineer",
    "Azure Virtual Desktop",
    "Terraform",
    "PowerShell",
    "AWS",
    "RAG",
    "Infrastructure as Code",
    "Ahmedabad",
  ],
  authors: [{ name: siteConfig.name, url: siteConfig.url }],
  creator: siteConfig.name,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: siteConfig.title,
    description: siteConfig.description,
    siteName: siteConfig.name,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#edf0f4" },
    { media: "(prefers-color-scheme: dark)", color: "#071320" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${archivo.variable} ${azeret.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col font-sans">
        {/* React cannot emit a bare comment node, so the contract rides in an
            empty hidden element as the document body's first child. */}
        <div hidden dangerouslySetInnerHTML={{ __html: DIRECTION_CONTRACT }} />
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <a href="#main" className="skip-link">
            Skip to content
          </a>
          <SiteNav />
          <main id="main" className="flex-1">
            {children}
          </main>
          <SiteFooter />
        </ThemeProvider>
      </body>
    </html>
  );
}

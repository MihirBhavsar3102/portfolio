import type { Metadata, Viewport } from "next";
import { Archivo, Azeret_Mono } from "next/font/google";
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
THESIS: A product page for an engineer: the estate Mihir runs drawn as a console
service map, every number traceable to the infrastructure that produced it.
Refuses the centred hero, skill-icon grid and screenshot cards.
OWN-WORLD: Blue-tinted near-black, three lifted surfaces split by hairlines, one
console blue for action, focus and lit paths; tech colours only as marks. Mona
Sans speaks, Fragment Mono labels data.
STORY: A recruiter reads name, role and six measured figures in ten seconds; a
DevOps lead traces any figure to its path; both email or take the resume.
FIRST VIEWPORT: Sticky nav. Left 5/12: name, role, positioning, View work and
Download resume, copy email. Right 7/12: service map, control plane over Azure,
AWS and AI zones. Below: the proof ledger, figure first, provenance beside it.
FORM: Service Map Console; candidate 1 of 7, IMPECCABLE'S PICK over roll
assignment 6; seed key 957454d0.
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
          <a href="#main" className="skip-link">
            Skip to content
          </a>
          <SiteNav />
          <main id="main" className="flex-1">
            {children}
          </main>
          <SiteFooter />
      </body>
    </html>
  );
}

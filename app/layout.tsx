import type { Metadata, Viewport } from "next";
import { Fragment_Mono, Mona_Sans } from "next/font/google";
import { SiteNav } from "@/components/site/site-nav";
import { SiteFooter } from "@/components/site/site-footer";
import { siteConfig } from "@/lib/site-config";
import "./globals.css";

/*
 * Mona Sans speaks: headings, prose, interface, map labels, and the figures
 * (set slightly condensed through its width axis). Fragment Mono is kept for
 * literal, copyable strings — today only the email address — never prose,
 * never chrome, never names dressed up to look technical.
 */
const mona = Mona_Sans({
  subsets: ["latin"],
  variable: "--font-mona",
  display: "swap",
  axes: ["wdth"],
});

const fragment = Fragment_Mono({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-fragment",
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
OWN-WORLD: Blue-tinted near-black, lifted surfaces split by hairlines, one console
blue for action, focus and lit paths; tech colours only as marks. Mona Sans
speaks, figures included; Fragment Mono only for the literal email.
STORY: A recruiter reads name, role and six measured figures in ten seconds; a
DevOps lead traces any figure to its path; both email or take the resume.
FIRST VIEWPORT: Sticky nav. From xl, left 5/12: name, role, positioning, both
actions, copy email; right 7/12: service map, build band over Azure, AWS and AI
zones, observe band beneath. Below: the proof ledger, figure first.
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
    "AWS",
    "CI/CD",
    "Kubernetes",
    "RAG",
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
  themeColor: "#0a0d12",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${mona.variable} ${fragment.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
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

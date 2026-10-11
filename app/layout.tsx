import type { Metadata, Viewport } from "next";
import { Fragment_Mono, Schibsted_Grotesk } from "next/font/google";
import { SiteNav } from "@/components/site/site-nav";
import { SiteFooter } from "@/components/site/site-footer";
import { siteConfig } from "@/lib/site-config";
import { themeScript } from "@/lib/theme";
import "./globals.css";

/*
 * Schibsted Grotesk carries everything a person reads, from 15px body to the
 * 96px name, set tight and heavy for the statements. Fragment Mono is kept
 * for the literal, copyable email address only.
 */
const schibsted = Schibsted_Grotesk({
  subsets: ["latin"],
  variable: "--font-schibsted",
  display: "swap",
});

const fragment = Fragment_Mono({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-fragment",
  display: "swap",
});

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
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
  colorScheme: "light dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // The theme script sets data-theme on <html> before hydration, so React is told to expect it.
    <html lang="en" suppressHydrationWarning className={`${schibsted.variable} ${fragment.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        {/* Before anything paints: the stored theme, else the system's (lib/theme.ts). */}
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
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

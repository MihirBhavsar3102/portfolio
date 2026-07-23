export const siteConfig = {
  name: "Mihir Bhavsar",
  title: "Mihir Bhavsar — Cloud & DevOps Engineer",
  description:
    "Cloud & DevOps Engineer specializing in Azure Virtual Desktop, Terraform/PowerShell automation, AWS cost optimization, and AI-native tooling (RAG, LLM inference).",
  // No real domain yet — this is only a base for resolving metadata URLs
  // (Open Graph tags, sitemap, robots). It is never fetched. Use || (not ??)
  // so an empty-string build arg also falls back instead of breaking new URL().
  // Set NEXT_PUBLIC_SITE_URL to your real URL / ALB DNS to override this.
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3001",
};

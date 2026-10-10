export const siteConfig = {
  name: "Mihir Bhavsar",
  title: "Mihir Bhavsar — Cloud & DevOps Engineer",
  description:
    "Cloud & DevOps engineer automating Azure and AWS with Terraform, CI/CD pipelines and monitoring, plus applied AI. Based in Ahmedabad, India.",
  // Base for resolving metadata URLs only; never fetched. `||` so an empty
  // build arg also falls back instead of breaking new URL().
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3001",
};

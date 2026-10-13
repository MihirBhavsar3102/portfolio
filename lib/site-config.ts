/**
 * The site's canonical origin, used to resolve metadata, the sitemap, robots
 * and JSON-LD URLs; never fetched. NEXT_PUBLIC_SITE_URL wins when set (a
 * custom domain, or the Docker build arg). Else, on Vercel, the project's
 * production domain, which Vercel sets on every deployment, previews included,
 * so a preview's links and share cards still point at production. Else the
 * local server. Empty values fall through, and a trailing slash is dropped so
 * joined paths never double up.
 */
export function resolveSiteUrl(publicUrl: string | undefined, vercelProductionHost: string | undefined): string {
  const pick = publicUrl?.trim() || vercelProductionHost?.trim();
  if (!pick) return "http://localhost:3001";
  const url = /^https?:\/\//.test(pick) ? pick : `https://${pick}`;
  return url.replace(/\/+$/, "");
}

export const siteConfig = {
  name: "Mihir Bhavsar",
  title: "Mihir Bhavsar — Cloud & DevOps Engineer",
  description:
    "Cloud & DevOps engineer automating Azure and AWS with Terraform, CI/CD pipelines and monitoring, plus applied AI. Based in Ahmedabad, India.",
  // Each variable is named in full: Next inlines NEXT_PUBLIC_SITE_URL at build
  // time only when it is written out, so a Docker server regenerating the page
  // at runtime (without the build arg) still gets the built-in value.
  url: resolveSiteUrl(process.env.NEXT_PUBLIC_SITE_URL, process.env.VERCEL_PROJECT_PRODUCTION_URL),
};

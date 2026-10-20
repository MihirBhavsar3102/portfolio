/*
 * Vercel Web Analytics (cookieless page views) and Speed Insights (Core Web
 * Vitals from real visits) run only in a production build on Vercel, which
 * serves their scripts and intake from this origin, so the CSP stands.
 * Elsewhere they would misfire: dev loads debug scripts from another origin,
 * which the CSP blocks, and the Docker image has no route to serve them. Both
 * scripts ignore headless browsers, so the post-deploy checks never count.
 * The footer says so only where they run.
 */
export const vercelInsights = process.env.VERCEL === "1" && process.env.NODE_ENV === "production";

import type { NextConfig } from "next";
import createMDX from "@next/mdx";
import { securityHeaders } from "./lib/security-headers";

const nextConfig: NextConfig = {
  // Emit a self-contained `.next/standalone` server (with a minimal server.js
  // and only the traced node_modules) for a small production Docker image.
  output: "standalone",
  // X-Powered-By only advertises the framework and its version family.
  poweredByHeader: false,
  // /work has no page of its own (every case study lives under it); a trimmed
  // URL lands on the work section rather than the 404. Temporary, so a future
  // index page can take the path back.
  async redirects() {
    return [{ source: "/work", destination: "/#work", permanent: false }];
  },
  async headers() {
    // On Vercel, also the commit this build came from (VERCEL_GIT_COMMIT_SHA), so
    // the post-deploy workflow can tell when production serves the commit it checks.
    const commit = process.env.VERCEL_GIT_COMMIT_SHA;
    return [
      { source: "/:path*", headers: securityHeaders(process.env.NODE_ENV === "development") },
      ...(commit ? [{ source: "/:path*", headers: [{ key: "X-Commit", value: commit }] }] : []),
    ];
  },
};

// Case studies are MDX files imported by app/work/[slug]/page.tsx, not MDX
// routes, so pageExtensions stays at its default. @next/mdx requires
// mdx-components.tsx at the project root.
const withMDX = createMDX({});

export default withMDX(nextConfig);

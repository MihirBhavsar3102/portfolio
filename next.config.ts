import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const nextConfig: NextConfig = {
  // Emit a self-contained `.next/standalone` server (with a minimal server.js
  // and only the traced node_modules) for a small production Docker image.
  output: "standalone",
};

// Case studies are MDX files imported by app/work/[slug]/page.tsx, not MDX
// routes, so pageExtensions stays at its default. @next/mdx requires
// mdx-components.tsx at the project root.
const withMDX = createMDX({});

export default withMDX(nextConfig);

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Emit a self-contained `.next/standalone` server (with a minimal server.js
  // and only the traced node_modules) for a small production Docker image.
  output: "standalone",
};

export default nextConfig;

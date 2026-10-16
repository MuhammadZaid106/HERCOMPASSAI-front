import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  // Emits a minimal .next/standalone server for the production Docker image.
  output: "standalone",
};

export default nextConfig;

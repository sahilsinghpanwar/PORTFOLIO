import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    resolveAlias: {
      // Force a single Three.js instance across all packages
      three: "./node_modules/three",
    },
  },
};

export default nextConfig;

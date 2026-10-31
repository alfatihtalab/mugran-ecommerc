import type { NextConfig } from "next";

// STATIC_EXPORT=1 builds a fully static site (used for GitHub Pages).
// NEXT_PUBLIC_BASE_PATH="/repo-name" serves it from a sub-path.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig: NextConfig = {
  ...(process.env.STATIC_EXPORT ? { output: "export" as const, trailingSlash: true } : {}),
  basePath,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;

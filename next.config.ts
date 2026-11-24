import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Do not let `next dev` write its own block into the shared AGENTS.md.
  agentRules: false,
  // cacheComponents / partialPrefetching are intentionally OFF for now: keep the
  // build simple until the core features work, then tighten.
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

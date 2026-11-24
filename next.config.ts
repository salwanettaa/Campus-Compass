import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Do not let `next dev` write its own block into the shared AGENTS.md.
  agentRules: false,
  poweredByHeader: false,
  // NOTE: cacheComponents / partialPrefetching are intentionally OFF for now:
  // keep the build simple until the core features work, then tighten.
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
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

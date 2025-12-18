import type { NextConfig } from "next";
import path from "path";

// Global security headers for all routes
const securityHeaders = [
  // Prevent MIME-type sniffing
  { key: "X-Content-Type-Options", value: "nosniff" },

  // Prevent clickjacking
  { key: "X-Frame-Options", value: "DENY" },

  // HSTS - enforce HTTPS (1 year, include subdomains)
  {
    key: "Strict-Transport-Security",
    value: "max-age=31536000; includeSubDomains",
  },

  // Referrer policy - balance privacy and functionality
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },

  // Permissions Policy - disable unused browser features
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },

  // Content Security Policy (enforced)
  // Verified: No violations on homepage, /contact, /quiz pages
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://challenges.cloudflare.com https://www.googletagmanager.com https://static.cloudflareinsights.com",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob:",
      "font-src 'self'",
      "connect-src 'self' https://api.web3forms.com https://challenges.cloudflare.com https://www.google-analytics.com https://analytics.google.com",
      "frame-src https://challenges.cloudflare.com",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self' https://api.web3forms.com",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    loader: "custom",
    loaderFile: "./src/lib/cloudflare-image-loader.ts",
  },
  outputFileTracingRoot: path.resolve(__dirname),
  devIndicators: {
    position: "bottom-right",
  },

  async headers() {
    return [
      // Apply security headers to all routes
      {
        source: "/:path*",
        headers: securityHeaders,
      },

      // Quiz result routes - additional privacy headers (no caching, no indexing)
      {
        source: "/quiz/results/:resultId*",
        headers: [
          { key: "Cache-Control", value: "no-store, no-cache, must-revalidate" },
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
          { key: "Referrer-Policy", value: "no-referrer" },
        ],
      },
      {
        source: "/quiz/p/:slug*",
        headers: [
          { key: "Cache-Control", value: "no-store, no-cache, must-revalidate" },
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
          { key: "Referrer-Policy", value: "no-referrer" },
        ],
      },
    ];
  },
};

export default nextConfig;

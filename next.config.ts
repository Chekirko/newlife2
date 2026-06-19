import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

// Content Security Policy. Shipped as **Report-Only** first (non-blocking) so it
// can be validated against the live site — homepage/JSON-LD scripts, Sanity image
// CDN, the Google Maps embed, and the /studio app — before being flipped to the
// enforcing `Content-Security-Policy` header. See context/improvement-roadmap.md (C2).
const csp = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  // Next.js needs inline scripts for hydration; dev (HMR) additionally needs eval.
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https://cdn.sanity.io",
  "font-src 'self' data:",
  "connect-src 'self' https://*.sanity.io",
  "frame-src 'self' https://www.google.com https://maps.google.com",
  "frame-ancestors 'self'",
  "form-action 'self'",
].join("; ");

// Zero-risk hardening headers — enforced on every route immediately.
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), browsing-topics=()" },
];

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
      {
        // CSP everywhere EXCEPT the embedded Sanity Studio (it needs eval/blob/ws
        // that a strict policy would break).
        source: "/((?!studio).*)",
        headers: [{ key: "Content-Security-Policy-Report-Only", value: csp }],
      },
    ];
  },
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone", // habilita Dockerfile multi-stage com node_modules mínimo
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async rewrites() {
    return [
      // v2 (Cowork) servida como static one-pager pra comparativo A/B
      { source: "/lp2", destination: "/lp2/index.html" },
    ];
  },
  async headers() {
    // CSP relaxada só pra rota /lp2 — Tailwind via CDN + Google Fonts inline da v2
    const lp2Headers = [
      { key: "X-Frame-Options", value: "DENY" },
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
      {
        key: "Content-Security-Policy",
        value: [
          "default-src 'self'",
          "script-src 'self' 'unsafe-inline' https://cdn.tailwindcss.com",
          "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
          "font-src 'self' https://fonts.gstatic.com",
          "img-src 'self' data:",
          "connect-src 'self'",
          "frame-ancestors 'none'",
        ].join("; "),
      },
    ];
    return [
      // 2 matchers porque /lp2/:path* não casa com /lp2 puro (sem trailing slash + sem path)
      { source: "/lp2", headers: lp2Headers },
      { source: "/lp2/:path*", headers: lp2Headers },
      {
        // Catch-all exceto /lp2 e /lp2/* (que já têm CSP própria acima) — sintaxe path-to-regexp precisa de named param
        source: "/:path((?!lp2(?:$|/)).*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          // CSP básica — reforçar quando GA4 e fontes externas estiverem fixos
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: https://www.google-analytics.com",
              "connect-src 'self' https://www.google-analytics.com https://*.analytics.google.com https://*.g.doubleclick.net",
              "frame-ancestors 'none'",
            ].join("; "),
          },
        ],
      },
    ];
  },
};

export default nextConfig;

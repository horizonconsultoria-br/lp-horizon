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
      // v2 (Cowork azul) é a oficial agora — serve em / a partir de public/v2/index.html
      // Pasta interna se chama "v2" (não "lp2") pra não conflitar com app/lp2/page.tsx que é a v1
      { source: "/", destination: "/v2/index.html" },
    ];
  },
  async headers() {
    // CSP relaxada pra v2 (raiz) — Tailwind via CDN + Google Fonts inline
    // Também aplica em /v2/* pra cobrir os assets servidos diretamente (logos, etc)
    const v2Headers = [
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
      // Raiz (v2) + assets internos — CSP relaxada
      { source: "/", headers: v2Headers },
      { source: "/v2/:path*", headers: v2Headers },
      {
        // Catch-all CSP estrita pra resto — exceto raiz (já tratada acima) e assets v2
        // /lp2 (v1 Next.js) cai aqui e ganha CSP estrita normalmente, igual a v1 antes em /
        source: "/:path((?!v2(?:$|/)).+)",
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

import type { NextConfig } from "next";
import createMDX from "@next/mdx";

// O react-refresh do modo dev roda via eval; sem liberar 'unsafe-eval' SÓ em
// desenvolvimento, a CSP estrita mata a hidratação inteira no `next dev` e
// qualquer ilha de cliente (ex.: a rotação de abas da home) fica morta no
// ambiente local. Produção continua sem eval.
const dev = process.env.NODE_ENV === "development";

// CSP RELAXADA, da página comercial (a v2 "Cowork azul", que era a home até
// agora): ela carrega Tailwind por CDN e Google Fonts, exatamente o que a CSP
// estrita proíbe. Vale em /comercial e nos assets internos de /v2.
const cabecalhosComercial = [
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

// CSP ESTRITA, da home e de todo o resto. A home é rota Next com as fontes
// self-hosted pelo next/font, então não precisa de host de terceiro para nada
// além do GA. O frame-src do Calendly é o calendário embutido na última dobra.
const cabecalhosEstritos = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      `script-src 'self' 'unsafe-inline'${dev ? " 'unsafe-eval'" : ""} https://www.googletagmanager.com https://www.google-analytics.com`,
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: https://www.google-analytics.com",
      "connect-src 'self' https://www.google-analytics.com https://*.analytics.google.com https://*.g.doubleclick.net",
      "frame-src 'self' https://calendly.com https://*.calendly.com",
      "frame-ancestors 'none'",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  output: "standalone", // habilita Dockerfile multi-stage com node_modules mínimo
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async redirects() {
    return [
      // A home nova morou em /prova enquanto era rascunho, e esse endereço
      // circulou em conversa de venda e está no Lighthouse dos relatórios.
      // Agora ela É a raiz, então o endereço antigo aponta para lá em vez de
      // virar 404. Só o caminho exato: os arquivos em /prova/* continuam
      // sendo os assets da página (logo, fotos, vídeo) e não podem redirecionar.
      { source: "/prova", destination: "/", permanent: true },
    ];
  },
  async rewrites() {
    return [
      // A página comercial antiga (v2) sai da raiz e passa a viver em
      // /comercial, servida do estático public/v2/index.html. A pasta interna
      // se chama "v2" (não "lp2") pra não conflitar com app/lp2/page.tsx, que
      // é a v1. A raiz não é mais reescrita: virou rota Next de verdade,
      // em app/(home)/page.tsx.
      { source: "/comercial", destination: "/v2/index.html" },
    ];
  },
  async headers() {
    return [
      { source: "/comercial", headers: cabecalhosComercial },
      { source: "/v2/:path*", headers: cabecalhosComercial },
      // A raiz precisa de entrada própria: o catch-all abaixo exige ao menos
      // um caractere depois da barra, então "/" não casa com ele.
      { source: "/", headers: cabecalhosEstritos },
      {
        // Todo o resto. Exclui v2 e comercial de propósito: se casassem aqui
        // também, o navegador receberia DUAS CSPs e aplicaria a interseção
        // das duas, o que derruba o Tailwind por CDN da página comercial.
        source: "/:path((?!v2(?:$|/)|comercial(?:$|/)).+)",
        headers: cabecalhosEstritos,
      },
    ];
  },
};

// Só habilita o loader de .mdx para import. Os artigos NÃO são rotas (vivem
// em content/), então `pageExtensions` continua intocado de propósito.
const withMDX = createMDX({});

export default withMDX(nextConfig);

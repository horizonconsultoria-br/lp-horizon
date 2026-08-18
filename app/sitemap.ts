import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://consultoriahorizon.com.br";
  // Só a raiz. /comercial existe e responde, mas é a página anterior: anunciar
  // as duas no sitemap poria dois textos sobre a mesma empresa competindo pela
  // mesma busca. /lp2 é a v1 e segue fora daqui pelo mesmo motivo.
  return [
    {
      url: `${base}/`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
  ];
}

import type { MetadataRoute } from "next";
import { artigos } from "@/content/blog";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://consultoriahorizon.com.br";
  // /comercial existe e responde, mas é a página anterior: anunciar as duas
  // no sitemap poria dois textos sobre a mesma empresa competindo pela mesma
  // busca. /lp2 é a v1 e segue fora daqui pelo mesmo motivo. Os artigos do
  // blog ENTRAM porque são conteúdo próprio, não variação da mesma página.
  return [
    {
      url: `${base}/`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${base}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...artigos.map((a) => ({
      url: `${base}/blog/${a.slug}`,
      lastModified: new Date(a.atualizadoEm),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}

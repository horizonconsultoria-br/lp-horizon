import { z } from "zod";

/**
 * Clusters do discovery F0. Cada artigo pertence a exatamente um.
 *
 * `servico` é o Cluster 5 do discovery, "Serviço em campo aberto"
 * (`melhor agencia de marketing` 97 · `melhor agencia de marketing digital`
 * 75). NÃO é "agência para vertical": essa hipótese foi medida e falhou
 * inteira — cinco termos, todos zero (`melhor agencia para clinicas`,
 * `melhor agencia para advogados`, `agencia de marketing para clinicas`,
 * `agencia de marketing para advogados`, `marketing para dentistas`).
 * O que existe é a consulta de decisão sobre serviço onde a categoria já é
 * comprada assim, e é isso que este cluster nomeia.
 */
export const CLUSTERS = [
  "vertical-sistema",
  "ia-juridica",
  "servico",
  "ferramentas",
] as const;

const ISO_DATA = /^\d{4}-\d{2}-\d{2}$/;

export const artigoMetaSchema = z.object({
  /** Vira a URL: /blog/<slug>. Precisa bater com o nome da pasta. */
  slug: z.string().min(3).regex(/^[a-z0-9-]+$/, "slug só aceita minúsculas, números e hífen"),
  titulo: z.string().min(10),
  /** Resposta direta, renderizada no topo do artigo e usada na description.
   *  O piso de 80 caracteres existe porque resumo curto demais não serve de
   *  resposta para mecanismo de resposta — que é o motivo do blog existir. */
  resumo: z.string().min(80).max(320),
  cluster: z.enum(CLUSTERS),
  /** Termo monitorado que este artigo ataca. É a chave que liga conteúdo
   *  publicado a medição de citação no motor do F1. */
  termoAlvo: z.string().min(3),
  publicadoEm: z.string().regex(ISO_DATA, "use AAAA-MM-DD"),
  atualizadoEm: z.string().regex(ISO_DATA, "use AAAA-MM-DD"),
  /** Vira JSON-LD FAQPage quando não estiver vazio. */
  faq: z
    .array(z.object({ pergunta: z.string().min(5), resposta: z.string().min(20) }))
    .default([]),
});

export type ArtigoMeta = z.infer<typeof artigoMetaSchema>;

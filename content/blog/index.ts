import { artigoMetaSchema, type ArtigoMeta } from "./schema";
import { meta as melhorSistemaParaClinicas } from "./melhor-sistema-para-clinicas/meta";

// Uma linha por artigo. Publicar = criar a pasta com meta.ts + corpo.mdx e
// acrescentar aqui. Nenhuma outra mudança de código é necessária.
const registrados: ArtigoMeta[] = [melhorSistemaParaClinicas];

// A validação roda no import: um meta inválido derruba o build em vez de
// publicar artigo sem os ganchos que o blog existe para ter.
export const artigos: ArtigoMeta[] = registrados.map((a) => artigoMetaSchema.parse(a));

export function slugs(): string[] {
  return artigos.map((a) => a.slug);
}

export function buscarArtigo(slug: string): ArtigoMeta | undefined {
  return artigos.find((a) => a.slug === slug);
}

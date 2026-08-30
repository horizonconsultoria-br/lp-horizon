import { artigos } from "@/content/blog";

export const dynamic = "force-static";

// Convenção emergente: um índice em texto do que o site tem, para quem
// consome a página por modelo em vez de navegador.
export function GET() {
  const base = "https://consultoriahorizon.com.br";
  const linhas = [
    "# HorizonConsultoria",
    "",
    "> Avaliação e implementação de ferramentas de IA e automação para pequenas e médias empresas, por vertical.",
    "",
    "## Blog",
    "",
    ...artigos.map((a) => `- [${a.titulo}](${base}/blog/${a.slug}): ${a.resumo}`),
    "",
  ];
  return new Response(linhas.join("\n"), {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}

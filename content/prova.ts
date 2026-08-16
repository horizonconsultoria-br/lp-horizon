export type Destaque = { valor: string; legenda: string; fonte: string };
export type Item = { nome: string; descricao: string };

export type Bloco = {
  id: string;
  eyebrow: string;
  titulo: string;
  paragrafos: string[];
  destaque?: Destaque;
  itens?: Item[];
};

export type Acao = { rotulo: string; href: string; primaria: boolean };
// Só as ações. O bloco "cta" já carrega título e parágrafos como qualquer outro
// bloco; um segundo par título/subtítulo aqui seria dado que ninguém renderiza.
export type CTA = { acoes: Acao[] };

export type ConteudoProva = { blocos: Bloco[]; cta: CTA };

const semente = (id: string): Bloco => ({
  id,
  eyebrow: id,
  titulo: `Título de ${id}`,
  paragrafos: ["Parágrafo semente."],
});

export const conteudoProva: ConteudoProva = {
  blocos: [
    semente("abertura"),
    semente("crm-proprio"),
    semente("numeros"),
    {
      ...semente("para-outros"),
      paragrafos: ["Demo hi-fi construída para a DocsGrowth, no ar."],
    },
    semente("como-entramos"),
    semente("antes-de-assinar"),
    semente("objecoes"),
    semente("cta"),
  ],
  cta: {
    acoes: [{ rotulo: "Agendar conversa", href: "#", primaria: true }],
  },
};

import { describe, it, expect } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
// Relativo, não "@/": o alias do tsconfig é resolvido pelo Next, e o Vitest
// roda sem ele; com "@/" o arquivo nem coleta.
import nextConfig from "../next.config";

const HOST = "https://tracker.metricool.com";

// Por que esta guarda existe, em uma frase: o tracker do Metricool tem DUAS
// pernas na CSP e a segunda é invisível.
//
// O `be.js` inteiro é isto:
//   beTracker={t:function(a){ … var d=new Image; d.src=HOST+"/c3po.jpg?"+… }}
//
// Ou seja, medir é carregar um SCRIPT de terceiro e depois disparar uma
// IMAGEM de terceiro. Quem só libera `script-src` produz o pior resultado
// possível: o script baixa, `beTracker.t()` roda, nada lança (atribuir `.src`
// a uma Image bloqueada por CSP falha calado), a página fica 100% verde — e
// nenhuma visita chega ao painel. O erro só apareceria dias depois, como
// ausência de dado, que é o sintoma mais caro de diagnosticar.
//
// Estas asserções são sobre o objeto de config de verdade (importado, não
// lido como texto), então sobrevivem a alguém reescrever o arquivo.

async function cspDaRota(rota: string): Promise<string> {
  const headers = await nextConfig.headers!();
  const entrada = headers.find((h) => h.source === rota);
  if (!entrada) throw new Error(`sem entrada de headers para "${rota}"`);
  const csp = entrada.headers.find((h) => h.key === "Content-Security-Policy");
  if (!csp) throw new Error(`entrada "${rota}" não tem CSP`);
  return csp.value;
}

function diretiva(csp: string, nome: string): string {
  const achada = csp
    .split(";")
    .map((d) => d.trim())
    .find((d) => d.startsWith(`${nome} `));
  if (!achada) throw new Error(`CSP sem diretiva "${nome}": ${csp}`);
  return achada;
}

// A raiz tem entrada própria na config (o catch-all exige ao menos um
// caractere depois da barra, então "/" não casa com ele). As duas precisam
// liberar o tracker: a primeira serve a home, a segunda serve /lp2.
const ROTAS_ESTRITAS = ["/", "/:path((?!v2(?:$|/)|comercial(?:$|/)).+)"];

describe.each(ROTAS_ESTRITAS)("CSP estrita de %s", (rota) => {
  it("libera o tracker em script-src", async () => {
    expect(diretiva(await cspDaRota(rota), "script-src")).toContain(HOST);
  });

  // A que ninguém lembra. Se cair, o tracker está morto em produção sem
  // nenhum sintoma visível.
  it("libera o tracker em img-src — é assim que o be.js mede", async () => {
    expect(diretiva(await cspDaRota(rota), "img-src")).toContain(HOST);
  });

  // O contrapeso: o `be.js` não faz fetch, XHR nem sendBeacon. Liberar
  // connect-src seria abrir superfície por palpite, sem nada do outro lado.
  it("não abre connect-src para o tracker — ele não faz requisição de dados", async () => {
    expect(diretiva(await cspDaRota(rota), "connect-src")).not.toContain(HOST);
  });
});

// A /comercial ficou de fora da medição por decisão do founder. Se alguém
// colar o snippet lá sem trazer a CSP junto, o tracker cai calado do mesmo
// jeito — então a decisão fica gravada como teste, nos dois sentidos.
describe("CSP relaxada de /comercial", () => {
  it("segue sem o tracker, coerente com o escopo decidido", async () => {
    const csp = await cspDaRota("/comercial");
    expect(csp).not.toContain(HOST);

    const html = join(process.cwd(), "public", "v2", "index.html");
    if (existsSync(html)) {
      expect(readFileSync(html, "utf-8")).not.toContain("metricool");
    }
  });
});

// MEDIDO em 2026-09-05, e o resultado importa pra quem ler isto depois:
// não existe tag `<script id="metricool-tracker">` no HTML servido. O
// snippet sai DENTRO do `self.__next_f.push([...])`, o payload do Flight —
// exatamente onde o JSON-LD raiz desta casa foi parar.
//
// A diferença é o que cada um precisa pra valer: o JSON-LD precisa ser lido
// por crawler que NÃO executa JS, então estar no Flight o mata. O tracker
// precisa de JS de qualquer jeito — o React hidrata, o next/script injeta o
// be.js e o pixel dispara. Provado com navegador de verdade: `be.js` 200 e
// `c3po.jpg?hash=…` 200, zero erro de console.
//
// Então o que a asserção abaixo prova é ENTREGA, não execução: o snippet
// chega ao cliente com o hash certo. Ela pega remoção acidental e hash
// trocado, que é o que muda com frequência. Ela NÃO substitui a prova de
// execução — essa mora no README de verificação e se refaz com navegador.
const HTML = join(process.cwd(), ".next", "server", "app", "index.html");
const disponivel = existsSync(HTML);

describe.skipIf(!disponivel)("snippet entregue ao cliente na raiz", () => {
  const html = disponivel ? readFileSync(HTML, "utf-8") : "";

  it("o payload traz o be.js e o hash da conta", () => {
    expect(html).toContain(`${HOST}/resources/be.js`);
    expect(html).toContain("72ddce77b7b68578987e264b6ef45e77");
  });

  // Guarda contra a leitura errada deste arquivo. Se um dia aparecer uma tag
  // real, ótimo — mas aí alguém mudou a estratégia do next/script, e a
  // afirmação do comentário acima precisa ser remedida, não herdada.
  it("documenta que hoje NÃO há tag script real — só o payload do Flight", () => {
    expect(html).not.toMatch(/<script[^>]*id="metricool-tracker"/);
    expect(html).toContain("self.__next_f.push");
  });
});

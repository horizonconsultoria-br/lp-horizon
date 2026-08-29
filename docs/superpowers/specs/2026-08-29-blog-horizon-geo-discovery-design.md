# Discovery F0 — Blog da Horizon: posicionamento decidido por citação em IA (GEO/AEO)

- **Data:** 2026-08-29
- **Status:** discovery concluído · aguardando revisão do founder
- **Cliente/projeto:** `_horizon-internal` · `lp-horizon` (`consultoriahorizon.com.br`)
- **Fase:** F0 de 4 (F1 motor GEO multi-tenant · F2 blog + conteúdo · F3 loop)
- **Custo de medição:** US$ 2,21 (teto do F0: US$ 10)
- **Fonte de todo número deste documento:** API DataForSEO, Brasil (`location_code` 2076) / português (`pt`), medido em 2026-08-29. Endpoint e custo de cada chamada no Apêndice A.

---

## 1. O que foi decidido nesta sessão

| # | Decisão | Quem decidiu |
|---|---|---|
| D1 | KPI primário do blog = **ser citado por IA (GEO/AEO)**, não tráfego nem posição | founder |
| D2 | Escopo = **produto de medição GEO multi-tenant**, Horizon como cliente zero | founder |
| D3 | Sequência = **F0 hoje · F1 e F2 em paralelo** | founder |
| D4 | Posicionamento **decidido pelos dados**, não a priori | founder |
| D5 | Frente Tech-Legal (ADR-038) **fora** do posicionamento comercial desta rodada | founder |
| D6 | Blog em **`consultoriahorizon.com.br/blog`** (subpasta via Traefik), não em subdomínio | founder, após recomendação |
| D7 | Cluster educacional (n8n/Python + comunidade) **realocado para a marca pessoal** | founder, após medição |
| D8 | **A meta é ENTRAR.** Manter é decisão futura, tomada com a curva de latência na mão | founder |
| D9 | O motor do F1 mora como **módulo do `horizon-crm`**, com tela de acompanhamento de keywords, adaptando o desenho do módulo de blog do Teachflow | founder |

---

## 2. O instrumento de medição

### 2.1 Credencial
A conta DataForSEO usada é da **CodeUP** (`teachflow-backend`, provisionada no EPIC-BLOG-1 em jun/2026). Saldo verificado: **US$ 43,02** de US$ 51 depositados; limite de 1.000 chamadas/dia; timezone `America/Sao_Paulo`.

> **Pendência de governança (não bloqueante):** usar credencial da CodeUP para trabalho da Horizon cruza a regra de ownership da casa (2026-04-21). Para um discovery de US$ 1,70, seguiu-se com aval do founder. **Se o F1 virar operação contínua com rastreamento diário, a Horizon precisa de conta própria** — ou a credencial sobe para a camada ecossistema.

### 2.2 Superfícies disponíveis na conta
`ai_optimization` (`llm_responses`, `ai_keyword_data`, `llm_mentions`, `llm_scraper`) · `dataforseo_labs` · `keywords_data` · `serp` · `backlinks` · `on_page` · `business_data` · `content_analysis` · `domain_analytics` · `app_data` · `merchant` · `appendix`.

### 2.3 Restrição que muda o que o F1 pode prometer
A documentação do endpoint `llm_mentions/target_metrics` declara:

> *"ChatGPT data is limited to United States (2840) and English only."*

**Consequência:** para Brasil/pt só existe a plataforma `google` (AI Overview / AI Mode). Toda medição de citação neste documento é dessa plataforma. **O F1 não pode prometer rastreamento de citação em ChatGPT em português** com esta fonte — precisaria da sonda própria (`hermes-agent/src/diagnostic/aiPresence.ts`, que a casa já tem em produção) ou do `llm_responses`.

`ai_keyword_data` e `llm_mentions` confirmaram cobertura **Brasil (2076) + `pt`**.

### 2.4 Ativos que a casa já possui e que o F1 deve reusar
- **`hermes-agent/src/diagnostic/aiPresence.ts`** — sonda de presença em IA já em produção, monta "perguntas de dinheiro" e registra quem foi citado. É o KPI, construído e vendido a terceiros.
- **EPIC-BLOG-1** (`teachflow-backend`/`teachflow-grid`) — motor de conteúdo com DataForSEO + Jina + RAG pgvector + publicação.
- **EPIC-SEODASH-1** — rank tracking com cron diário e endpoint `GET /api/seo/rank-tracking`.

---

## 3. Baseline da Horizon

**Baseline: zero menções.** Datado 2026-08-29. Toda medição futura compara contra este número.

### 3.1 Como foi medido (e por que o método mudou)

A primeira tentativa usou `llm_mentions/target_metrics` com `domain: consultoriahorizon.com.br` e devolveu `total_count: 0`. **Esse resultado foi descartado como inválido**, porque um teste de controle o reprovou:

| Alvo testado em `target_metrics` (BR/pt, platform `google`) | Retorno | Verdade conhecida |
|---|---|---|
| `youtube.com` | **0** | 149-273 menções em `top_mentioned_domains` |
| `adtail.ag` | **0** | 5 menções em `melhor crm` |
| `juridico.ai` | **0** | 3 menções em `ia juridica` |
| `adtail.ag` + `search_scope: any` | **0** | idem |
| `adtail.ag` + universo de keyword `melhor crm` | **0** | idem |

O endpoint devolve zero **para tudo**, inclusive para domínios provadamente citados. Ou a semântica difere do que a documentação sugere, ou não há cobertura BR/pt nessa rota apesar de `locations_and_languages` listar Brasil. **`target_metrics` não é instrumento confiável de baseline neste contexto e não deve ser usado no F1.**

### 3.2 Baseline válido, por endpoint que funciona

`llm_mentions/top_mentioned_domains` funciona e devolve conjuntos ricos. Somando os universos consultados nesta sessão:

| Universo (keyword) | Domínios citados |
|---|---:|
| `n8n` | 534 |
| `agente de ia` | 496 |
| `kommo` | 476 |
| `melhor crm` | 71 |
| `ia juridica` | 12 |
| `melhor agencia de marketing` | 9 |
| `melhor sistema para clinicas` | 2 |
| `melhor sistema de gestao` | 1 |
| **Total de posições observadas** | **~1.601** |

**`consultoriahorizon.com.br` não aparece em nenhuma delas.** Ausência em ~1.601 posições, através de 8 universos que cobrem todos os clusters-alvo, é evidência medida de baseline zero — obtida por instrumento validado, ao contrário da primeira tentativa.

---

## 4. Panorama competitivo orgânico

`dataforseo_labs/google/ranked_keywords/live`, BR/pt, 2026-08-29:

| Domínio | KWs | Pos. 1 | 2-3 | 4-10 | Tráfego est./mês |
|---|---:|---:|---:|---:|---:|
| br.hubspot.com | 7.536 | 132 | 415 | 1.919 | US$ 370.884 |
| v4company.com | 2.720 | 27 | 102 | 516 | US$ 58.795 |
| outmarketing.com.br | 551 | 10 | 27 | 114 | US$ 51.338 |
| gilbertosales.com.br | 210 | 0 | 0 | 2 | US$ 1.117 |
| nextleads.com.br | 19 | 0 | 0 | 0 | US$ 40 |
| playbooklab.com.br | 1 | 0 | 0 | 0 | US$ 27 |
| stechlabs.com.br | 2 | 0 | 0 | 0 | US$ 1 |
| danxis.com.br | 0 | — | — | — | — |
| codeup.dev.br | 0 | — | — | — | — |

**Leituras:**

1. **As referências nichadas não têm presença orgânica.** danxis, stechlabs, playbooklab e nextleads somam 22 keywords e menos de US$ 70/mês. Servem como referência de **voz**, nunca como prova de que aquele posicionamento ranqueia.
2. **A maior delas ranqueia pelo motivo errado.** A V4 aparece com `google ads`, `facebook ads`, `elon musk`, `jeff bezos`, `bit.ly` — volume genérico, não intenção de compra. No termo que tem intenção (`trafego pago`, CPC US$ 5,38) está em **48º**. Copiá-la é escrever sobre Elon Musk.
3. **`outmarketing` é o único padrão replicável:** ranqueia **13º para `hubspot`** (49.500 buscas, CPC US$ 2). Agência que vira autoridade na ferramenta do cliente.
4. **`gilbertosales` desmente o próprio exemplo.** O artigo `hubspot-vale-a-pena` que motivou a referência não sustenta o site — o tráfego dele vem de `afiliado mercado livre` (60.500 buscas).
5. **O experimento natural da casa não deu sinal.** `codeup.dev.br` tem zero keywords, então a comparação subpasta × subdomínio da CodeUP não responde nada. **A recomendação do item D6 é baseada em princípio, não em medição desta casa** — registrado como tal.

---

## 5. A forma do mercado: intenção cara, volume mínimo

`keywords_data/google_ads/search_volume/live`, BR/pt:

| Keyword | Volume | CPC | Competição |
|---|---:|---:|---|
| crm com inteligencia artificial | 30 | US$ 16,03 | média |
| desenvolvimento de software sob medida | 40 | US$ 12,90 | baixa |
| consultoria hubspot | 30 | US$ 11,97 | alta |
| melhor crm | 480 | US$ 10,09 | alta |
| ia para vendas | 320 | US$ 9,31 | alta |
| sdr com ia | 70 | US$ 9,00 | alta |
| fabrica de software | 720 | US$ 6,92 | média |
| implementacao de crm | 90 | US$ 6,42 | média |
| automacao de marketing | 480 | US$ 5,39 | média |
| agente de ia | 8.100 | US$ 4,58 | média |
| chatbot para whatsapp | 720 | US$ 4,08 | média |
| agente de ia para whatsapp | 720 | US$ 3,70 | alta |
| consultoria de inteligencia artificial | 20 | US$ 2,13 | alta |
| n8n | 165.000 | US$ 0,40 | média |

Sem volume mensurável: `hubspot vale a pena`, `alternativa ao hubspot`, `automacao de atendimento`.

**Conclusão:** a intenção de compra existe e é caríssima (CPC de US$ 16 ≈ R$ 85 por clique), mas o volume é ínfimo. Ranqueando em 1º em `crm com inteligencia artificial` com CTR excelente, o retorno é **~9 visitas/mês**. **Como jogada de tráfego, o orgânico nesses termos tem ROI ruim, e nenhum volume de esforço conserta isso.** O volume mora onde a intenção não está (`n8n` 165.000 com CPC US$ 0,40).

É exatamente por isso que o KPI de citação (D1) salva a tese: citação não depende de volume de busca, e o comprador de CPC US$ 16 é o comprador de contrato de R$ 7-40K/mês.

---

## 6. O achado central: a IA cita ferramenta, não prestador

Comparação de duas consultas de decisão (`llm_mentions/top_mentioned_domains`, platform `google`, BR/pt):

**`melhor crm` → 71 domínios citados.**
youtube 17 · rdstation 9 · bitrix24 8 · monday 7 · sults 7 · salesforce 5 · kommo 5 · **adtail.ag 5** · agendor 5 · blog.pluga.co 3 · leads360 3 · imobibrasil 3 · zoho 3 · reddit 3 · br.hubspot 2 · helenacrm 2 · jornaldobras 2

**`melhor empresa de automacao` → 0 domínios.**

E na demanda dentro de assistentes (`ai_keyword_data`):

| Termo | Volume IA | Volume Google |
|---|---:|---:|
| melhor crm / melhores crms | **370** | 480 |
| melhor agencia de marketing | **97** | — |
| fabrica de software | **2** | 720 |
| desenvolvimento de software sob medida | **1** | 40 |
| consultoria de inteligencia artificial | **0** | 20 |

**Conclusões:**

1. **Ninguém pede a uma IA que escolha um fornecedor de software sob medida.** Cinco medições independentes concordam. A frente enterprise / software house está **morta para GEO** — cortada por dado, não por opinião.
2. **`adtail.ag` prova que dá para entrar como terceiro.** Uma agência aparece 5 vezes em respostas sobre "melhor CRM", ao lado dos fabricantes. Ela não vende CRM — publica conteúdo de decisão sobre CRM. **É a vaga que a Horizon pode ocupar.**
3. **Correção registrada:** durante a sessão afirmei que "consulta de decisão sobre serviço praticamente não existe". Está **errado como generalização**. `melhor agencia de marketing` tem 97. O correto: consultas de decisão sobre serviço existem **onde a categoria já é comprada assim** (agência de marketing) e não existem onde a categoria não é reconhecida (fábrica de software, empresa de automação).

---

## 7. Mapa de clusters medido

### Cluster 1 · Decisão de CRM e ferramentas
`melhores crms` **370** (hub) · `kommo` 169 · `manychat` 141 · `rd station` 111 · `blip` 98 · `hubspot` 63 · `pipedrive` 42 · `zapier` 38 · `zoho crm` 25 · `digisac` 23 · `botconversa` 21

> ⚠️ **`salesforce` é o maior termo isolado medido (394) e está EXCLUÍDO de propósito:** atrai leitor enterprise para uma oferta de PME. Decisão do founder, sustentada pelos dados da §6.

### Cluster 2 · Automação e agentes — **REALOCADO** (D7)
`n8n` 298 · `zapier` 38 · `como criar um agente de ia` 16 · `typebot` 14
**Vai para a propriedade de marca pessoal**, onde o CTA de comunidade é coerente. Motivos medidos: 534 domínios competindo, liderados por YouTube (194) e pelas plataformas educacionais que já operam esse modelo (Alura 25, Hora de Codar 21, Asimov Academy 17).

> Nota: `hermes agent` é ferramenta privada da casa — sem demanda de busca, portanto tutorial sobre ela não gera citação (serve como prova de capacidade, que é outro objetivo). `openclaw` **não foi medido**; nenhuma afirmação sobre ele neste documento.

### Cluster 3 · Vertical + sistema
`melhor sistema de gestao` **118** · `melhor crm para imobiliarias` **105** · `melhor sistema para clinicas` **84** · `melhor software para clinicas` **44** · `melhor chatbot para whatsapp` 36 · `melhor crm para whatsapp` 23 · `melhor sistema para restaurantes` 21 · `melhor sistema para contabilidade` 13 · `melhor crm para clinicas` 12 · `melhor sistema para oticas` 11

**Este cluster emergiu da medição, não da hipótese.** A hipótese testada era "melhor agência para [vertical]" e ela **falhou inteira**: `melhor agencia para clinicas` 0 · `melhor agencia para advogados` 0 · `agencia de marketing para clinicas` 0 · `agencia de marketing para advogados` 0 · `marketing para dentistas` 0.

**O padrão real: as pessoas perguntam pelo melhor SISTEMA para a vertical, nunca pela melhor AGÊNCIA para a vertical.** Casa com a taxonomia `Vertical` que o Horizon CRM já usa (Clínicas / Óticas / Contabilidade / Advocacia).

### Cluster 4 · IA jurídica
`ia juridica` 61 · `ia para advogados` 52 · `software juridico` 43 · `melhor ia para advogados` 41 · `melhor software juridico` 35 · `chatgpt para advogados` 25 · `legaltech` 16 · `jurimetria` 15 → **~288 agregado**

**O direito é o único vertical onde "IA + profissão" tem demanda real.** Contraste medido: `ia para contabilidade` 15 · `ia para imobiliarias` 9 · `ia para clinicas` **2**.

> **Compatível com o guardrail da ADR-038.** Escrever sobre ferramentas jurídicas de IA não é emitir parecer. A frente comercial Tech-Legal segue cortada (D5); isto é território de conteúdo, não oferta de serviço jurídico.

### Cluster 5 · Serviço em campo aberto
`melhor agencia de marketing` 97 · `melhor agencia de marketing digital` 75

**É o único lugar onde a Horizon pode ser A RESPOSTA**, e não apenas a fonte citada.

### Cortados por medição
`tendencias de ia` 1 · `ia na industria` 0 · `marketing e vendas` 29 · `diferenca entre marketing e vendas` 0 · `harvey ai` 4 · `ia no direito` 18 · `ia na saude` 18.

---

## 8. Ranking por facilidade de entrada

Contestação medida via `llm_mentions/top_mentioned_domains`:

| Cluster | Vol IA agregado | Domínios citados | Líder tem | Veredito |
|---|---:|---:|---:|---|
| **3 · Vertical + sistema** | ~246 | **1-2** | 1 menção | 🟢🟢 vácuo |
| **4 · IA jurídica** | ~288 | **12** | 3 menções | 🟢🟢 quase vazio |
| **5 · Agência** | 172 | **9** | 1 menção | 🟢 aberto |
| 1 · CRM / ferramentas | ~1.000 | 71 (`melhor crm`) a 476 (`kommo`) | 17 a 273 | 🟡 contestado, vaga de terceiro provada |
| 2 · n8n / automação | ~350 | **534** | 194 | 🔴 saturado (realocado) |

Detalhe dos vazios:
- `melhor sistema para clinicas` → **2 domínios** (`labfdiniz.com.br` 1, `polifdiniz.com.br` 1 — um laboratório, nem fornecedor de software)
- `melhor sistema de gestao` → **1 domínio** (`music.apple.com` 1 — ruído)
- `ia juridica` → **12 domínios**, todos legaltechs pequenas empatadas em 1-3 menções (judit.io 3, juridico.ai 3, doc9 2, ia.jusbrasil 2, turivius 2, juridicoagil 2)
- `melhor agencia de marketing` → **9 domínios**, 1 menção cada

**A ordem de ataque é quase o inverso da intuição:** os temas grandes e óbvios (n8n, CRM) são os caros; os específicos e sem glamour (`melhor sistema para clínicas`) estão vazios com volume real.

---

## 9. Linha editorial e sequência

> **Linha editorial:** *a Horizon é a casa que avalia e implementa ferramentas de IA e automação para PME, por vertical.*

Isso amarra os clusters numa entidade só: o Cluster 3 é a espinha (maior encaixe com a capacidade real e com a taxonomia do CRM), o 1 traz volume, o 4 é território aberto de alto valor, o 5 é onde a venda acontece.

| Onda | Clusters | Artigos (est.) | Racional |
|---|---|---:|---|
| **1** | 3 + 5 | ~5 | Espaços vazios com volume real. Prova o loop de citação com o menor custo. |
| **2** | 4 | ~8 | Cluster coerente de 288, 12 domínios, líder com 3 menções. |
| **3** | 1 | ~6 | Contestado — entra quando o domínio já tiver autoridade. Sem Salesforce. |
| — | 2 | — | Realocado para marca pessoal. |

**O custo real não é a quantidade de artigos, é a profundidade.** Citação vai para o que o modelo julga autoritativo; cobertura rasa de 30 temas perde para cobertura densa de 10.

---

## 10. Arquitetura de entidades

| Propriedade | Entidade | Justificativa |
|---|---|---|
| `consultoriahorizon.com.br` **+ `/blog`** | Horizon (consultoria B2B) | Subpasta via Traefik: blog é aplicação/deploy próprios, mas autoridade e entidade ficam consolidadas no domínio que se quer ranquear. Resolve a tensão entre "quero ranquear o site" e "quero o blog separado". |
| Domínio próprio por produto (ex.: GuardAngel) | Produto | Marca distinta merece entidade própria. **Validado por dado:** `converzap.com` e `zapia.com` — produtos pequenos — são citados, enquanto nenhuma consultoria BR aparece no topo. Produto é estruturalmente mais citável que prestador. |
| Marca pessoal | Rodrigo | Recebe o Cluster 2 realocado. Entidades se citam mutuamente — isso é força, não diluição. |

---

## 11. Ressalvas de método

1. **Toda medição é de 2026-08-29 e da plataforma `google` (AI Overview/AI Mode).** Citação em IA muda; medição sem data é anedota.
2. **`partial_match` introduz ruído.** Na consulta `kommo`, `pokemon.fandom.com` apareceu com 23 menções. As medições de contestação dos Clusters 2, 3 e 4 usaram `word_match`; as dos Clusters 1 e 5 usaram `partial_match` e devem ser **refeitas com `word_match`** antes de virarem baseline do F1.
3. **Contagem baixa de domínios poderia refletir cobertura rala do dataset**, não só oportunidade. Argumento contrário: o mesmo endpoint e o mesmo `word_match` devolveram 534 (`n8n`) e 476 (`kommo`) — quando há disputa, ele mostra. O vazio do Cluster 3 é tratado como real, mas **confirmar com uma segunda fonte é item da Onda 1**.
4. **Nenhum número deste documento veio de espelho não sincronizado.** Fonte é a API, com endpoint e custo registrados no Apêndice A. (Regra criada após o erro de 13× de 29/08 na inadimplência da CodeUP.)
5. **A recomendação de subpasta (D6) não foi provada com dado da casa** — `codeup.dev.br` tem zero keywords. É princípio declarado.
6. **`llm_mentions/target_metrics` foi reprovado por teste de controle** (§3.1) e está fora do ferramental. O baseline vale porque foi refeito com `top_mentioned_domains`. **Lição de método: a primeira versão deste documento trazia o zero do `target_metrics` como medição — ele coincidia com a expectativa e por isso quase passou sem controle.** Número que confirma a hipótese é o que mais precisa de controle, não o que menos precisa.

---

## 12. O que o F0 NÃO respondeu

- **Quanto tempo leva** para uma página nova aparecer em resposta de IA. Ninguém mediu; é a incógnita que a Onda 1 existe para responder.
- **Qual formato de página ganha citação.** `llm_mentions/top_mentioned_pages` não foi consultado — fica como primeira medição da F2.
- **Se `openclaw` tem demanda.** Não medido.
- **Contestação dos Clusters 1 e 5 com `word_match`.** Medidos com `partial_match`.
- **Se orgânico bate mídia paga** para o mesmo orçamento. O founder considerou a pergunta e optou por seguir com citação; a comparação não foi feita.

---

## 13. Como o F0 alimenta F1 e F2

**F1 — motor GEO multi-tenant.** Recebe: o baseline zero como marco inicial, a lista de termos-alvo por cluster como carteira de rastreamento, a restrição de plataforma da §2.3 (ChatGPT só EUA/inglês → sonda própria via `aiPresence` para cobrir português), e a pendência de conta própria da §2.1.

> ⛔ **Restrição de ferramental herdada do F0:** o motor **não pode** ser construído sobre `llm_mentions/target_metrics` — reprovado em teste de controle (§3.1). O instrumento validado é `llm_mentions/top_mentioned_domains`, que mede por **universo de keyword** e exige varrer a lista de alvos e procurar o domínio próprio no resultado. Isso muda o desenho do rastreamento: não é uma chamada por cliente, é uma chamada por termo monitorado. Impacta custo (US$ 0,10-0,20 por termo por rodada) e arquitetura. **Dimensionar antes de prometer SLA.**

Arquitetura (módulo do `horizon-crm` × serviço próprio) fica para a sessão de design do F1.

**F2 — blog e conteúdo.** Recebe: a linha editorial da §9, o mapa de clusters da §7, a sequência de ondas, a decisão de subpasta da §10, e o padrão `adtail.ag` como molde (terceiro que publica conteúdo de decisão e é citado ao lado dos fabricantes).

---

## 14. Cadência, volume e horizonte

### 14.1 Horizonte — não medido, e por quê

**Quanto tempo até aparecer numa resposta de IA é a pergunta que este discovery NÃO respondeu.** Ironia registrada: o campo que responderia (`first_response_at`) vive no `llm_mentions/target_metrics`, o endpoint reprovado em §3.1.

**O que é medição:** a plataforma observável é o AI Overview do Google, cujas citações saem do que o Google indexou e ranqueia.

**O que é raciocínio, não medição:** isso impõe um piso de latência de indexação e ranqueamento. Dois fatores favorecem a Horizon — `consultoriahorizon.com.br` já existe e é indexado (a decisão D6 de subpasta importa exatamente aqui: `/blog` herda a confiança do domínio, subdomínio começaria frio), e nos clusters-alvo a IA quase não tem o que citar (em `melhor sistema de gestao` o único domínio citado é `music.apple.com`, ruído). Preencher vácuo é mais rápido que desbancar incumbente.

**Estimativa, explicitamente rotulada como estimativa:** primeiras citações em **1 a 3 meses** nos termos vazios; prazo bem maior nos contestados. Não é base para compromisso comercial.

**Como se descobre de verdade:** publicar a Onda 1 e re-medir mensalmente. ~US$ 0,15 por termo; com 15 termos monitorados, **~US$ 2,25/mês** para ter a curva real. **A Onda 1 tem 6 páginas e não 30 justamente porque ela é o experimento que responde a isto.**

### 14.2 Volume — a concorrência define, e ela é minúscula

| Onda | Cobertura | Páginas |
|---|---|---:|
| 1 | Cluster 3 (3 termos) + Cluster 5 (2 termos) + 1 hub | **6** |
| 2 | Cluster 4 (8 termos) + 1 hub | 9 |
| 3 | Cluster 1 (6 ferramentas) + 1 hub | 7 |
| | **Total** | **~22** |

Nos Clusters 3, 4 e 5 o líder citado tem **1 a 3 menções**. Não são necessários 30 artigos para superar 1 menção — isto não é disputa de volume, é preenchimento de vácuo. O contraste é o `n8n`, onde seria preciso superar 534 domínios liderados por YouTube com 194; foi por isso que ele saiu (D7).

**A restrição que morde é profundidade, não contagem.** Citação vai para o que o modelo julga autoritativo — é o que separa `adtail.ag` (citada 5×) de `danxis.com.br` (zero keywords, zero citações).

### 14.3 Continuidade — entrar não exige; manter provavelmente sim

**Para entrar, não é preciso cadência contínua.** Evidência: os concorrentes não a têm. Nove domínios com uma menção cada é a assinatura de um campo que ninguém trabalha.

**Para manter, provavelmente sim** — e a pista está na própria API: existe um campo `last_response_at`. Citação é **estado que muda**, não posição conquistada; o AI Overview re-consulta e substitui.

**Por D8, isto fica fora de escopo agora.** A Onda 1 é um **experimento de entrada com critério de parada**, não o início de uma operação perpétua. Se e quando manter vira meta, a recomendação registrada é cadência baixa e constante (2-4 peças densas/mês + revisão das existentes) em vez de rajada seguida de silêncio — porque só o ciclo publicar → medir → publicar revela a latência de §14.1.

---

## 15. Desenho de medição — instrumento duplo

A falha do `target_metrics` (§3.1) somada à restrição de plataforma (§2.3) deixa um buraco real: **não há como medir citação em ChatGPT em português via DataForSEO.** O ativo que a casa já tem preenche exatamente esse buraco.

### 15.1 `hermes-agent/src/diagnostic/aiPresence.ts` — o que é

Sonda em produção que monta "perguntas de dinheiro", consulta um modelo **com busca web ligada** e devolve, por schema estruturado: `resposta`, `empresasCitadas`, `empresaAlvoCitada`. Roda via Codex com auth de assinatura compartilhada — **custo marginal ≈ zero**.

### 15.2 Comparação dos dois instrumentos

| | Hermes `aiPresence` | DataForSEO `top_mentioned_domains` |
|---|---|---|
| Cobre | Português, resposta generativa, nossas perguntas exatas | AI Overview do Google, BR/pt |
| Custo por rodada | ~zero (assinatura) | US$ 0,10-0,20 por termo |
| Entrega | Fomos citados? para quem perdemos? | Paisagem competitiva agregada |
| Limite | Simulação por um único modelo | Sem ChatGPT em pt; `target_metrics` reprovado |

**Conclusão de arquitetura: Hermes é o instrumento primário, DataForSEO o secundário.** Isso barateia muito a operação do F1 frente a um desenho só-DataForSEO.

### 15.3 Três lacunas do Hermes que o F1 precisa fechar

1. **Perguntas fixas e locais.** `buildMoneyQuestions` gera apenas duas, no molde *"melhores {categoria} em {cidade}"*, e **retorna vazio se faltar categoria ou cidade**. A Horizon é nacional e as perguntas-alvo são do tipo *"melhor sistema para clínicas"*. Sem generalizar a função para aceitar conjuntos arbitrários de perguntas, a sonda não roda para o nosso caso.
2. **Não há rota autônoma.** `probeAiPresence` só é invocado dentro de `analyze.ts:180`, no fluxo do diagnóstico completo. Não existe `POST /ai-presence`.
3. **Não há persistência histórica.** Hoje o resultado vive dentro de um relatório. Para virar curva de latência, precisa de série temporal.

### 15.4 Achado colateral sobre artefato comercial vivo

O prompt declara: *"Você está simulando como um assistente de IA (ChatGPT, Gemini, Perplexity) responderia"*. **É um modelo com busca web pedindo que se comporte como assistente — correlaciona com a saída real, mas não é ela.**

O **Diagnóstico Profundo v4, que a Horizon vende**, apresenta seção de "ranqueamento por IA (GEO/AEO)" alimentada por essa sonda (`render.ts`, `aiPresenceSectionHtml`, ~linha 719). **A redação da promessa ao cliente deve refletir que é simulação.** Não é defeito de engenharia; é precisão de afirmação comercial. Item para o founder.

---

## 16. Tela de acompanhamento no Horizon CRM (D9)

O motor do F1 vira **módulo do `horizon-crm`** com tela de acompanhamento das keywords em trabalho, adaptando o desenho do módulo de blog do Teachflow.

### 16.1 O que "adaptar" significa — e o que não significa

| Camada | `teachflow-backend` | `horizon-crm` | Reuso |
|---|---|---|---|
| Backend | TypeScript hexagonal (`application/` · `infrastructure/dataforseo/` · `infrastructure/postgres/` · `interface/http/`) | **.NET**, monólito modular, 15 módulos `Horizon.Crm.Modules.*` | ⛔ **Reescrita, não port.** Atravessa o *desenho*: forma hexagonal, contrato do cliente DataForSEO, upsert idempotente, desenho dos crons |
| Frontend | React (`teachflow-grid`) | React 18 + Vite | ✅ Padrões de tela reaproveitáveis |
| Crons | `seo-rank-tracking`, `seo-ga4-ingest`, `seo-gsc-ingest`, `blog-scheduled-publish` | Hangfire | ✅ Desenho reaproveitável |

> Descoberta lateral: o Teachflow também ingere **GA4 e Google Search Console**, não só DataForSEO. Vale avaliar se entram no escopo do F1 ou ficam para depois.

### 16.2 Armadilha conhecida — módulo novo no `horizon-crm`

⚠️ **`deploy/Dockerfile` copia os `.csproj` um a um.** Em 24/08 o módulo `Engajamento` entrou sem sua linha e **quebrou o deploy da `main`** — e nenhuma das 6 revisões pegou, porque revisão baseada em diff é estruturalmente cega para arquivo que não mudou. **Adicionar módulo é mudança em pelo menos dois lugares: `Horizon.Crm.slnx` e `deploy/Dockerfile`.** O plano do F1 precisa enumerá-los explicitamente.

⚠️ **Migrations não são aplicadas pelo deploy** e a checagem do workflow é **falso negativo** (roda no runner, que não alcança o banco). ⚠️ **`config/horizon.env` aponta para a Contabo legada**, não para a KVM2. Ambas são pendências abertas da ficha `_horizon-internal` desde 25/08 e mordem quem for aplicar migration do módulo novo.

---

## Apêndice A — Registro de medições

Todas em 2026-08-29, `location_code` 2076, `language_code` `pt`.

| Endpoint | Alvo | Custo |
|---|---|---:|
| `dataforseo_labs/google/ranked_keywords/live` | danxis.com.br (×2, reverificação) | US$ 0,024 |
| idem | stechlabs.com.br | US$ 0,012 |
| idem | v4company.com | US$ 0,016 |
| idem | nextleads.com.br | US$ 0,014 |
| idem | playbooklab.com.br | US$ 0,012 |
| idem | lote (blog.codeup / lps.v4company) | US$ 0,012 |
| idem | codeup.dev.br | US$ 0,012 |
| idem | outmarketing.com.br | US$ 0,015 |
| idem | gilbertosales.com.br | US$ 0,015 |
| idem | br.hubspot.com | US$ 0,013 |
| `keywords_data/google_ads/search_volume/live` | cesta de 24 termos | US$ 0,090 |
| `ai_optimization/ai_keyword_data/keywords_search_volume/live` | 6 lotes | US$ 0,072 |
| `ai_optimization/llm_mentions/target_metrics/live` | consultoriahorizon.com.br (**descartado**, §3.1) | US$ 0,101 |
| idem | adtail.ag · juridico.ai · **youtube.com (controle)** · adtail c/ `search_scope` · adtail c/ universo de keyword — **5 chamadas, todas retornaram 0, reprovando o endpoint** | US$ 0,505 |
| `ai_optimization/llm_mentions/top_mentioned_domains/live` | agente de ia | US$ 0,200 |
| idem | melhor crm | US$ 0,171 |
| idem | melhor empresa de automacao | US$ 0,100 |
| idem | melhor agencia de marketing | US$ 0,109 |
| idem | kommo | US$ 0,200 |
| idem | n8n | US$ 0,200 |
| idem | ia juridica | US$ 0,112 |
| idem | melhor sistema para clinicas | US$ 0,102 |
| idem | melhor sistema de gestao | US$ 0,101 |
| `appendix/user_data`, `*/locations_and_languages`, `*/available_filters` | verificações | US$ 0 |
| | **Total** | **US$ 2,21** |

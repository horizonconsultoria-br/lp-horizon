# lp-horizon

LP institucional **consultoriahorizon.com.br** — Next.js 15 + Tailwind + shadcn (manual, sem CLI), deploy em VPS CodeUP via GitHub Actions + GHCR + Traefik file-provider.

> Plano fonte: `Business/Code-Ecosystem/HorizonConsultoria/clientes/_horizon-internal/briefings/planos-aprovados/2026-04-28-lp-consultoriahorizon.md`
>
> Posicionamento: *IA-native ou ser engolido pela concorrência.*

---

## Stack

- **Next.js 15** (App Router, output: standalone)
- **React 19**
- **Tailwind 3** + tokens CSS custom (`design/tokens.css`)
- **TypeScript** estrito
- **Resend** pra email transacional do formulário
- **Zod** pra validação de payload
- **@next/third-parties/google** pra GA4
- **Lucide React** pra ícones
- **Docker** multi-stage + **Traefik** (file-provider)

## Estrutura

```
.
├── app/
│   ├── api/lead/route.ts     # POST handler do formulário (Zod + Resend)
│   ├── globals.css           # Tailwind + import dos tokens
│   ├── layout.tsx            # Metadata + Schema.org JSON-LD + GA4 wrapper
│   ├── page.tsx              # Monta as 6 sections + Footer + CookieBanner
│   ├── robots.ts             # Next metadata API
│   └── sitemap.ts            # Next metadata API
├── components/
│   ├── sections/{Hero,Cases,Diferencial,Ofertas,ComoComecamos,FAQ,Footer}.tsx
│   ├── LeadForm.tsx          # Formulário com honeypot + estados loading/error/success
│   └── CookieBanner.tsx      # LGPD consent mínimo (Consent Mode v2)
├── lib/
│   ├── analytics.ts          # Wrapper GA4 + scroll depth tracker
│   └── utils.ts              # cn() + CAL_URL
├── design/
│   ├── tokens.css            # Design tokens Horizon (dark-only v1)
│   └── lp-overview.svg       # Wireframe overview de toda a página
├── public/
│   ├── og-image.png          # OG 1200×630 (gerado em 4.3, prontíssimo)
│   └── illustrations/{advocacia,estetica,varejo}.svg
├── content/copy.md           # Copy oficial v1 (fonte de verdade textual)
├── research/landscape.md     # Benchmark 8 LPs + 3 cases + takeaways
├── infra/traefik/
│   └── lp-horizon.yml        # Config file-provider Traefik (sincronizado pra VPS no deploy)
├── docs/
│   └── handoff-claudecode-local.md  # ← LEIA ESTE para subir a LP em prod
├── .github/workflows/deploy.yml
├── Dockerfile                # Multi-stage Next standalone
├── compose.yml               # Runtime VPS
├── next.config.ts            # CSP, headers, output standalone
├── tailwind.config.ts        # Theme com tokens Horizon
└── package.json
```

## Setup local

```bash
npm install
cp .env.example .env.local   # preencher GA_ID, CAL_URL, RESEND_API_KEY
npm run dev                  # http://localhost:3000
```

## Deploy

Push to `main` → GitHub Actions roda automaticamente. Detalhes em [`docs/handoff-claudecode-local.md`](./docs/handoff-claudecode-local.md).

## Decisões locais relevantes

- **Dark-only v1.** Sem toggle light/dark. Light fica P2.
- **Tokens reaproveitados** do demo DocsGrowth (paleta âmbar/grafite Horizon) — não inventar paleta nova.
- **Cookie banner** com Consent Mode v2 (analytics_storage condicional ao consent).
- **DNS:** APEX preferencial (redirect www → apex). Se não der pra configurar APEX, inverter.
- **Schema.org JSON-LD** inline no `<head>` cobrindo Organization + 4 Services + FAQPage + WebSite.
- **CSP básica** habilitada via `next.config.ts` headers — reforçar quando GA4 estiver fixo.
- **Healthcheck IPv4 explícito** (lição DocsGrowth: nginx não bindava ::1 com hostname `localhost`).
- **Honeypot** no formulário (campo `_hp` invisível) — reduz spam sem captcha.

## TODOs antes de publicar (founder fornece)

- [ ] **CNPJ Horizon razão social + endereço fiscal** → atualizar `components/sections/Footer.tsx`
- [ ] **Link Google Calendar** do CTO → `NEXT_PUBLIC_CAL_URL` no compose
- [ ] **Resend API key** confirmada → `RESEND_API_KEY` no compose
- [ ] **GA4 Measurement ID** → `NEXT_PUBLIC_GA_ID` no compose (não bloqueia deploy v1, vira ativo em commit posterior)
- [ ] **Logo SVG vetorial** Horizon → substituir o "H" estilizado no header/footer (placeholder está OK pra v1)
- [ ] **DNS APEX** `consultoriahorizon.com.br` → 31.97.93.85 (já tem WWW; falta apex)
- [ ] **Política de privacidade** em `/legal/privacidade` (P2 v1.1)

## Plano de execução

| Etapa | Status |
|---|---|
| 4.1 Pesquisa de mercado | ✅ `research/landscape.md` |
| 4.2 Copy completo | ✅ `content/copy.md` |
| 4.3 Design assets (OG + tokens + ilustrações) | ✅ `design/` + `public/` |
| 4.4 Build Next.js | ✅ Estrutura completa neste repo (executar `npm install` local) |
| 4.5 Deploy + DNS + TLS | 🟡 Pendente — ver `docs/handoff-claudecode-local.md` |
| 4.6 GA4 + tracking validation | 🟡 Pendente — depende de Property criada |
| 4.7 Polimento Lighthouse ≥90 + a11y | 🟡 Pendente — checkpoint v1.1 (29/04) |
| 4.8 Brand review final + status delivered | 🟡 Pendente — checkpoint v1.1 (29/04) |

---
title: Handoff — pegar o repo daqui e deployar em produção
audience: Rodrigo (founder) rodando Claude Code local no Windows
created: 2026-04-28
estimativa-tempo: ~1h15 (depois dos 4 inputs B prontos)
---

# Handoff Claude Code local

Esta sessão Cowork produziu **estrutura completa em `outputs/lp-horizon/`**. Faltam os passos que dependem de credenciais (GitHub, SSH VPS, DNS, GA4) — esses rodam em **Claude Code local** na sua máquina Windows.

## TL;DR — 7 comandos pra subir a LP

```bash
# 1. Move estrutura pra fora do outputs (irreversível — faz isso DEPOIS de revisar a v1)
cp -r outputs/lp-horizon ~/horizon/lp-horizon
cd ~/horizon/lp-horizon

# 2. Inicializar git + criar repo público
git init -b main
gh repo create horizonconsultoria-br/lp-horizon --public --source=. --remote=origin --push

# 3. Configurar branch protection
gh api -X PUT repos/horizonconsultoria-br/lp-horizon/branches/main/protection \
  --input - <<'EOF'
{
  "required_status_checks": null,
  "enforce_admins": false,
  "required_pull_request_reviews": null,
  "restrictions": null,
  "allow_force_pushes": false,
  "allow_deletions": false
}
EOF

# 4. Setar 3 secrets (reusar os do DocsGrowth)
gh secret set VPS_HOST    --body "31.97.93.85"
gh secret set VPS_USER    --body "root"
gh secret set VPS_SSH_KEY < ~/.ssh/id_ed25519

# 5. Validar build local
npm install
cp .env.example .env.local   # preencher CAL_URL e RESEND_API_KEY
npm run build && npm start   # smoke local em http://localhost:3000

# 6. Push trigga o deploy
git add . && git commit -m "feat: lp v1 inicial"
git push

# 7. Verificar smoke em prod (após ~3min de build + Let's Encrypt)
curl -I https://consultoriahorizon.com.br/
```

---

## Pré-requisitos antes de comprometer com 4.5

### Inputs B do plano (do anexo do plano fonte)

- [x] **DNS WWW** — feito (screenshot conferido em 28/04)
- [ ] **DNS APEX** — `consultoriahorizon.com.br` (sem www) → `31.97.93.85` no registro.br
   - Sem isso, Traefik não consegue emitir TLS LE pro apex
   - Se não der, ver "Decisão DNS" abaixo
- [ ] **Google Calendar link** — copiar URL do appointment scheduling (formato `https://calendar.app.google/...`)
- [ ] **Resend API key** — pegar a da Horizon (Carol da CodeUP usa uma; reaproveitar)
- [ ] **CNPJ — razão social + endereço fiscal** — pra atualizar Footer.tsx e Schema.org Organization
- [ ] **Email forwarder `contato@consultoriahorizon.com.br`** — configurar no registro.br ou Cloudflare se DNS migrar

### Decisão DNS — APEX vs. WWW

**Opção preferencial (e a config Traefik atual implementa):**
- `consultoriahorizon.com.br` (apex) → `31.97.93.85` (criar A record)
- `www.consultoriahorizon.com.br` → 301 redirect pro apex
- **URL canônica:** sem www

**Alternativa (se registro.br não permitir A no apex):**
- Inverter: deixar só www como produção
- Editar `infra/traefik/lp-horizon.yml`: trocar `lp-horizon-apex` rule pra `Host(\`www.consultoriahorizon.com.br\`)`, e `lp-horizon-www` pra fazer redirect apex → www
- Editar `app/sitemap.ts`, `app/robots.ts`, `app/layout.tsx` (canonical) pra apontar pra www
- Editar metadataBase em `app/layout.tsx`

---

## Checklist 4.5 — Deploy + DNS + TLS

- [ ] DNS APEX configurado e propagado (`dig consultoriahorizon.com.br +short` retorna `31.97.93.85`)
- [ ] Repo `horizonconsultoria-br/lp-horizon` público criado via `gh repo create`
- [ ] 3 secrets adicionados ao repo (VPS_HOST, VPS_USER, VPS_SSH_KEY)
- [ ] Branch protection `main` ativo
- [ ] Primeira push em `main` triga GitHub Actions
- [ ] Workflow `deploy.yml` passa nas 2 jobs (build-and-push + deploy)
- [ ] VPS recebe `infra/traefik/lp-horizon.yml` em `/etc/easypanel/traefik/config/`
- [ ] Container `lp-horizon` aparece em `docker ps` na VPS
- [ ] Traefik emite TLS Let's Encrypt (esperar 1-3min após primeiro request)
- [ ] `curl -I https://consultoriahorizon.com.br/` retorna 200 + cert válido
- [ ] `curl -I http://consultoriahorizon.com.br/` retorna 301 → https
- [ ] `curl -I https://www.consultoriahorizon.com.br/` retorna 301 → apex
- [ ] Smoke `/api/lead` POST com payload válido retorna 200 + email chega no inbox

---

## Checklist 4.6 — GA4 + tracking

- [ ] Founder cria GA4 Property "consultoriahorizon" no console Google Analytics
- [ ] Pega Measurement ID `G-XXXXXXX`
- [ ] `gh secret set NEXT_PUBLIC_GA_ID --body "G-XXXXXXX"` ou setar no compose VPS
- [ ] Push commit habilitando GA4 (já está no layout — só precisa do env var)
- [ ] Abrir LP em modo anônimo + DebugView do GA4 → ver "view_hero" disparar
- [ ] Validar 7 events (FR-009): view_hero, scroll_50, scroll_90, cta_form_open, lead_form_submit_success, cta_calendly_open, case_card_click

---

## Checklist 4.7 — Polimento Lighthouse ≥90 (v1.1, alvo 29/04)

```bash
# Local após deploy
npx lighthouse https://consultoriahorizon.com.br --preset=desktop --output=json --output-path=./reports/desktop.json
npx lighthouse https://consultoriahorizon.com.br --output=json --output-path=./reports/mobile.json
```

Se algum score <90, atacar nesta ordem (maior leverage primeiro):

1. **Performance** — checar:
   - `next/image` em todas as imagens raster (já tá no Hero/Cases)
   - `font-display: swap` (Inter já tá assim via next/font)
   - Diferir GA4 (já tá via `@next/third-parties` + scripts beforeInteractive)
   - CSS crítico inline pra LCP (Next 15 faz por padrão)
2. **A11y** — rodar `npx @axe-core/cli https://consultoriahorizon.com.br`
   - Contraste âmbar/grafite tem que bater WCAG AA (validar #f59e0b sobre #0b0d12)
   - Skip-link já implementado
   - aria-labels nos botões com só ícones (verificar)
3. **Best Practices** — zero console errors, HTTPS only, sem mixed content
4. **SEO** — meta description, h1 único, canonical, sitemap, robots — tudo já implementado

---

## Checklist 4.8 — Brand review final + status delivered

- [ ] Founder navega manualmente em mobile + desktop, smoke visual completo
- [ ] Brand review pass: voz Horizon, sem jargão big consulting, claims com fonte
- [ ] OG render check: [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/), [Twitter Card Validator](https://cards-dev.twitter.com/validator)
- [ ] [Google Rich Results Test](https://search.google.com/test/rich-results) no Schema.org
- [ ] Atualizar progress.md Horizon: mover plano pra "Completado", entrada nova em changelog.md
- [ ] Atualizar plano `2026-04-28-lp-consultoriahorizon.md`: `status: delivered`
- [ ] Decidir se LP vira precedente "Padrão de captação digital Horizon" → entrada em `Code-Ecosystem/decisions.md`

---

## Resiliência a corte por token

Esta sessão Cowork entregou **S1 + S2 + S3 + parte do S4 (estrutura)**. Próxima sessão Claude Code local executa **S4 final (npm install + build local) + S5 + S6 + S7 + S8**.

Pra retomar onde paramos: ler este arquivo + `git log --oneline -20` + `progress.md` Horizon. Reposiciona em <2min.

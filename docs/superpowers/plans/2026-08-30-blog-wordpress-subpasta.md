# Blog WordPress da Horizon em `/blog` — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Servir o blog da Horizon em `https://consultoriahorizon.com.br/blog` a partir de um WordPress próprio, alimentado pelo motor multi-blog que já roda no `teachflow-backend`.

**Architecture:** WordPress vanilla na raiz de um container na VPS. O Traefik roteia `Host(consultoriahorizon.com.br) && PathPrefix(/blog)` com prioridade acima do apex, remove o prefixo com `stripPrefix`, e entrega ao container pela rede interna. O `wp-config` devolve o `/blog` virtualizando o `REQUEST_URI`, de modo que o Apache roteia na raiz enquanto o WordPress gera todas as URLs sob `/blog`. Réplica do EPIC-BLOG-2 da CodeUP, sem o hop externo e sem host bruto público.

**Tech Stack:** WordPress 6 (php8.3-apache) · MariaDB 11 · Docker Compose · Traefik (file provider) · Next.js 15 (o apex, que perde as rotas de blog) · o motor multi-blog em `teachflow-backend` (Node/TS + Postgres).

**Spec:** `docs/superpowers/specs/2026-08-30-blog-wordpress-subpasta-design.md`

## Global Constraints

- **Idioma:** todo conteúdo, comentário de código e mensagem de commit em **português**.
- **Domínio canônico:** `https://consultoriahorizon.com.br` (sem `www`).
- **Prefixo público:** `/blog` — o mesmo da CodeUP, então `inject-uri.php` copia sem alteração de código.
- **VPS:** `31.97.93.85`, porta SSH **2289** (a 22 foi fechada no hardening de 18/06). Rede Docker `easypanel`, Traefik com resolver `letsencrypt`. É a **mesma VPS** que serve o `lp-horizon`.
- **Diretório do blog na VPS:** `/srv/blog-horizon/`.
- **Nomes de container:** `blog-horizon-wp` e `blog-horizon-db`.
- **NÃO expor host bruto.** Sem router Traefik por Host para o WordPress, sem certificado próprio, sem subdomínio. O container é alcançado só pelo nome na rede interna. É o que dispensa o mu-plugin de robots da CodeUP.
- **NÃO alterar as regras de CSP em `next.config.ts`** nem os routers existentes do apex no `infra/traefik/lp-horizon.yml`.
- **Imports em teste:** caminho **relativo**, nunca `@/`. Arquivos de teste com extensão `.test.ts`.
- **Segredos:** senha do admin do WP e senhas do MariaDB vão para `/srv/blog-horizon/.env` na VPS. **Nunca** no repositório, **nunca** com valor no vault — só ponteiro. (A Application Password é exceção documentada: o motor exige que ela viva na tabela `blogs`; ver spec §11.)
- **GA4:** o id vem do `.env` da VPS na chave `HORIZON_GA_ID`. Se estiver vazio, o mu-plugin não emite nada — comportamento definido, não pendência.

> ⛔ **GATE DE PERMISSÃO — leia antes de começar.** As Tasks 2, 4 e 5 exigem **SSH na VPS** e **escrita no banco de produção da CodeUP**. Operações desse tipo vêm sendo **negadas pelo classificador de auto-mode** nesta casa desde 20/08, e só passam com autorização explícita do founder no chat. Se uma delas for negada: **pare a task, relate, e siga para a próxima que não dependa dela.** Não tente contornar.

> ⚠️ **O `deploy.yml` do `lp-horizon` sincroniza o `infra/traefik/lp-horizon.yml` para a VPS.** Editar esse arquivo mexe no roteamento do **apex** no mesmo movimento em que adiciona o `/blog`. Toda task que o toca precisa verificar **as duas coisas** depois do deploy: o site institucional e o blog. Errar ali derruba a porta de entrada da empresa.

---

## File Structure

| Arquivo | Responsabilidade | Task |
|---|---|---|
| `app/blog/**`, `content/blog/**`, `mdx-components.tsx`, `mdx.d.ts` | **removidos** — andaime MDX superseded | 1 |
| `app/sitemap.ts` | volta a anunciar só a raiz; o blog passa a ter sitemap próprio no WP | 1 |
| `app/robots.ts` | aponta para os **dois** sitemaps | 1 |
| `next.config.ts` | perde o wrapper `createMDX` | 1 |
| `app/sitemap.test.ts` | mantém a guarda de `/comercial` e `/lp2`; perde as asserções de artigo | 1 |
| `/srv/blog-horizon/Dockerfile` | imagem WP + `a2enmod` + conf do Apache | 2 |
| `/srv/blog-horizon/blog-alias.conf` | WP vanilla na raiz, permalinks, cache de assets | 2 |
| `/srv/blog-horizon/docker-compose.yml` | WP + MariaDB na rede `easypanel`, **sem labels de router** | 2 |
| `/srv/blog-horizon/inject-uri.php` | virtualiza `REQUEST_URI` no `wp-config` | 2 |
| `infra/traefik/lp-horizon.yml` | router `/blog` prioridade 30 + `stripPrefix` + service | 3 |
| `wp-content/mu-plugins/horizon-*.php` | cache headers, GA4, filtro do sitemap | 4 |
| `wp-content/themes/horizon-blog/` | tema clássico com a identidade Horizon | 4 |
| tabela `blogs` no Postgres da CodeUP | registro da Horizon como terceiro blog | 5 |

---

### Task 1: Remover o andaime MDX e devolver o sitemap

**Files:**
- Delete: `app/blog/page.tsx` · `app/blog/[slug]/page.tsx` · `app/blog/layout.tsx` · `app/blog/blog.css` · `app/blog/blog-build-output.test.ts` · `content/blog/` (pasta inteira) · `mdx-components.tsx` · `mdx.d.ts` · `app/llms.txt/route.ts`
- Modify: `app/sitemap.ts` · `app/robots.ts` · `app/sitemap.test.ts` · `next.config.ts` · `package.json`
- Test: `app/sitemap.test.ts`

**Interfaces:**
- Consumes: nada.
- Produces: uma árvore sem nenhuma referência a blog no app Next. O `/blog` passa a ser 404 até a Task 3.

- [ ] **Step 1: Ajustar o teste do sitemap para o estado pós-revert**

Substituir o conteúdo de `app/sitemap.test.ts` por:

```ts
import { describe, it, expect } from "vitest";
// Relativo, não "@/": o alias do tsconfig é resolvido pelo Next, e o Vitest
// roda sem ele; com "@/" o arquivo nem coleta.
import sitemap from "./sitemap";

describe("sitemap", () => {
  const urls = sitemap().map((e) => e.url);

  it("anuncia a raiz", () => {
    expect(urls).toContain("https://consultoriahorizon.com.br/");
  });

  // Guarda que nasceu antes do blog e sobrevive a ele: /comercial e /lp2 são
  // outros textos sobre a MESMA empresa. Anunciar os três poria a Horizon
  // competindo consigo mesma pela mesma busca.
  it("nunca anuncia /comercial nem /lp2", () => {
    expect(urls.some((u) => u.includes("/comercial"))).toBe(false);
    expect(urls.some((u) => u.includes("/lp2"))).toBe(false);
  });

  // O blog agora é WordPress atrás do proxy, com sitemap PRÓPRIO em
  // /blog/wp-sitemap.xml. Anunciá-lo aqui também criaria duas fontes para a
  // mesma URL. Se alguém tentar "completar" o sitemap com o blog, isto
  // fica vermelho.
  it("não anuncia o blog — ele tem sitemap próprio no WordPress", () => {
    expect(urls.some((u) => u.includes("/blog"))).toBe(false);
  });
});
```

- [ ] **Step 2: Rodar o teste e confirmar que falha**

Run: `npx vitest run app/sitemap.test.ts`
Expected: FAIL no terceiro caso — o sitemap atual ainda anuncia `/blog` e o artigo.

- [ ] **Step 3: Devolver o sitemap ao estado de raiz-só**

Substituir o conteúdo de `app/sitemap.ts` por:

```ts
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://consultoriahorizon.com.br";
  // Só a raiz. /comercial existe e responde, mas é a página anterior: anunciar
  // as duas poria dois textos sobre a mesma empresa competindo pela mesma
  // busca. /lp2 é a v1 e segue fora pelo mesmo motivo. O blog é WordPress e
  // publica o próprio sitemap em /blog/wp-sitemap.xml.
  return [
    {
      url: `${base}/`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
  ];
}
```

- [ ] **Step 4: Apontar o robots para os dois sitemaps**

Substituir o conteúdo de `app/robots.ts` por:

```ts
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/"],
    },
    // Dois sitemaps: o do Next cobre o site institucional; o do WordPress
    // cobre o blog, que é servido pelo proxy em /blog.
    sitemap: [
      "https://consultoriahorizon.com.br/sitemap.xml",
      "https://consultoriahorizon.com.br/blog/wp-sitemap.xml",
    ],
  };
}
```

- [ ] **Step 5: Apagar os arquivos do andaime**

```bash
git rm -r "app/blog" "content/blog" "app/llms.txt"
git rm mdx-components.tsx mdx.d.ts
```

- [ ] **Step 6: Remover o wrapper do MDX do `next.config.ts`**

Apagar a linha de import do topo:

```ts
import createMDX from "@next/mdx";
```

E substituir o bloco final por apenas:

```ts
export default nextConfig;
```

- [ ] **Step 7: Remover as dependências de MDX**

```bash
npm uninstall @next/mdx @mdx-js/loader @mdx-js/react remark-gfm
```

- [ ] **Step 8: Rodar build e suíte completa**

Run: `npm run build && npx vitest run`
Expected: build passa e não lista mais nenhuma rota `/blog` nem `/llms.txt`. Suíte verde. A contagem cai (os testes de schema, corpos e build-output do blog foram apagados junto com seus alvos) — isso é esperado, não regressão.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "revert(blog): remove andaime MDX, superseded pelo WordPress em subpasta"
```

---

### Task 2: Subir o WordPress na VPS

**Files:**
- Create na VPS: `/srv/blog-horizon/Dockerfile` · `/srv/blog-horizon/blog-alias.conf` · `/srv/blog-horizon/docker-compose.yml` · `/srv/blog-horizon/inject-uri.php` · `/srv/blog-horizon/.env`

**Interfaces:**
- Consumes: nada do repositório.
- Produces: container `blog-horizon-wp` respondendo na porta 80 dentro da rede `easypanel`, alcançável pelo nome `blog-horizon-wp`. É o alvo do service Traefik da Task 3.

⛔ **Esta task exige SSH na VPS.** Se a conexão for negada pelo classificador, pare e relate — não improvise.

- [ ] **Step 1: Criar o diretório e o `.env`**

Conectar: `ssh -p 2289 root@31.97.93.85`

```bash
mkdir -p /srv/blog-horizon && cd /srv/blog-horizon
```

Gerar segredos e escrever o `.env` (as senhas nascem aleatórias e **não** são ecoadas no chat):

```bash
umask 077
{
  echo "WP_DB_NAME=bloghorizon"
  echo "WP_DB_USER=bhuser"
  echo "WP_DB_PASSWORD=$(openssl rand -hex 24)"
  echo "WP_DB_ROOT_PASSWORD=$(openssl rand -hex 24)"
  echo "HORIZON_GA_ID="
} > .env
chmod 600 .env
```

> O `HORIZON_GA_ID` fica vazio de propósito: o mu-plugin da Task 4 não emite nada sem ele. O founder preenche depois com o mesmo valor de `NEXT_PUBLIC_GA_ID` do apex.

- [ ] **Step 2: Escrever o `blog-alias.conf`**

Cópia verbatim do as-built da CodeUP (vault: `2026-06-14-EPIC-BLOG-2-infra/blog-alias.conf`):

```apache
# WordPress vanilla na raiz (/var/www/html). O prefixo publico /blog e tratado
# no proxy (strip no Traefik) + wp-config (virtualiza REQUEST_URI). SEM Alias —
# evita o problema classico de mod_rewrite per-directory sob Alias.

<Directory /var/www/html>
    Options FollowSymLinks
    AllowOverride All
    Require all granted

    # Pretty permalinks vanilla (server-config, nao depende de .htaccess)
    RewriteEngine On
    RewriteBase /
    RewriteRule ^index\.php$ - [L]
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule . /index.php [L]
</Directory>

# Assets estaticos: cache longo e imutavel (WP versiona via ?ver=)
<FilesMatch "\.(css|js|jpg|jpeg|png|gif|webp|svg|woff2?|ttf|ico)$">
    Header set Cache-Control "public, max-age=31536000, immutable"
</FilesMatch>
```

- [ ] **Step 3: Escrever o `Dockerfile`**

```dockerfile
FROM wordpress:6-php8.3-apache
RUN a2enmod headers rewrite
COPY blog-alias.conf /etc/apache2/conf-enabled/zz-blog-alias.conf
```

- [ ] **Step 4: Escrever o `inject-uri.php`**

Cópia verbatim do as-built, com o comentário adaptado. O prefixo `/blog` é o mesmo, então o código não muda:

```php
<?php
// Injeta a virtualizacao de REQUEST_URI (/blog) no wp-config.php.
// Replica do EPIC-BLOG-2 da CodeUP: o proxy remove /blog e o wp-config devolve,
// para o Apache rotear na raiz enquanto o WP gera URLs sob /blog.
$f = '/var/www/html/wp-config.php';
$c = file_get_contents($f);
if (strpos($c, 'Horizon REQUEST_URI') !== false) { echo "already\n"; exit; }
$snip = "/* Horizon REQUEST_URI virtualization */\n"
  . "if (PHP_SAPI !== 'cli' && isset(\$_SERVER['REQUEST_URI']) && strpos(\$_SERVER['REQUEST_URI'], '/blog') !== 0) {\n"
  . "    \$_SERVER['REQUEST_URI'] = '/blog' . \$_SERVER['REQUEST_URI'];\n"
  . "}\n\n";
$marker = "/* That's all, stop editing!";
$pos = strpos($c, $marker);
if ($pos === false) { fwrite(STDERR, "marker not found\n"); exit(1); }
$c = substr($c, 0, $pos) . $snip . substr($c, $pos);
file_put_contents($f, $c);
echo "injected\n";
```

- [ ] **Step 5: Escrever o `docker-compose.yml`**

Diferença deliberada frente ao as-built: **nenhum label de Traefik**. O container não tem router por Host, não tem certificado e não é alcançável de fora — só pelo nome na rede interna, o que dispensa o mu-plugin de robots que a CodeUP precisou.

```yaml
services:
  blog-horizon-db:
    image: mariadb:11
    container_name: blog-horizon-db
    restart: unless-stopped
    command: ["--innodb-buffer-pool-size=128M","--max-connections=50","--performance-schema=OFF"]
    environment:
      MARIADB_DATABASE: ${WP_DB_NAME}
      MARIADB_USER: ${WP_DB_USER}
      MARIADB_PASSWORD: ${WP_DB_PASSWORD}
      MARIADB_ROOT_PASSWORD: ${WP_DB_ROOT_PASSWORD}
    volumes:
      - blog-horizon-db-data:/var/lib/mysql
    networks: [easypanel]

  blog-horizon-wp:
    build: .
    container_name: blog-horizon-wp
    restart: unless-stopped
    depends_on: [blog-horizon-db]
    environment:
      WORDPRESS_DB_HOST: blog-horizon-db
      WORDPRESS_DB_NAME: ${WP_DB_NAME}
      WORDPRESS_DB_USER: ${WP_DB_USER}
      WORDPRESS_DB_PASSWORD: ${WP_DB_PASSWORD}
      HORIZON_GA_ID: ${HORIZON_GA_ID}
      WORDPRESS_CONFIG_EXTRA: |
        define('WP_HOME', 'https://consultoriahorizon.com.br/blog');
        define('WP_SITEURL', 'https://consultoriahorizon.com.br/blog');
        define('WP_MEMORY_LIMIT', '256M');
        if (isset($$_SERVER['HTTP_X_FORWARDED_PROTO']) && $$_SERVER['HTTP_X_FORWARDED_PROTO'] === 'https') { $$_SERVER['HTTPS'] = 'on'; }
    volumes:
      - blog-horizon-wp-data:/var/www/html
    networks: [easypanel]

volumes:
  blog-horizon-db-data:
  blog-horizon-wp-data:

networks:
  easypanel:
    external: true
```

- [ ] **Step 6: Subir os containers**

```bash
cd /srv/blog-horizon && docker compose up -d --build
docker compose ps
```

Expected: `blog-horizon-db` e `blog-horizon-wp` ambos `Up`.

- [ ] **Step 7: Instalar o WordPress e injetar a virtualização**

```bash
docker exec blog-horizon-wp bash -lc 'ls -1 /var/www/html/wp-config.php'
docker cp /srv/blog-horizon/inject-uri.php blog-horizon-wp:/tmp/inject-uri.php
docker exec blog-horizon-wp php /tmp/inject-uri.php
```

Expected: a última linha imprime `injected`.

> Se imprimir `marker not found`, o `wp-config.php` ainda não foi gerado — o WordPress só o cria no primeiro request. Fazer um `curl` interno (Step 8) e repetir.

- [ ] **Step 8: Provar que o container responde na rede interna**

```bash
docker run --rm --network easypanel curlimages/curl:latest -s -o /dev/null -w "%{http_code}\n" http://blog-horizon-wp/
```

Expected: `200` ou `302` (o WP redireciona para o instalador na primeira vez). **Qualquer coisa fora disso é falha da task**, não algo a contornar na Task 3.

- [ ] **Step 9: Registrar o ponteiro do segredo no vault**

Criar `C:\Pessoal\Obsidian\Business\Code-Ecosystem\HorizonConsultoria\clientes\_horizon-internal\secrets\blog-horizon-wp.md` com **ponteiros, nunca valores**:

```markdown
---
title: Segredos — WordPress do blog da Horizon
tags: [horizonconsultoria, secrets, blog, wordpress]
status: active
---

# Segredos — `blog-horizon-wp`

**Fonte de verdade:** `/srv/blog-horizon/.env` na VPS `31.97.93.85` (SSH porta 2289), modo 600.

| Chave | O que é |
|---|---|
| `WP_DB_NAME` / `WP_DB_USER` / `WP_DB_PASSWORD` | banco do WordPress (MariaDB 11) |
| `WP_DB_ROOT_PASSWORD` | root do MariaDB |
| `HORIZON_GA_ID` | id do GA4; vazio = mu-plugin não emite nada |

**Admin do WP:** criado no instalador em `https://consultoriahorizon.com.br/blog/wp-admin`. Senha **não** fica aqui.

⚠️ **A Application Password que o motor usa vive na tabela `blogs` do Postgres da CodeUP, em texto claro** — exigência de desenho do motor, registrada como dívida na D15. Ela é escopada e revogável sem tocar na senha do admin.

**Nunca** gravar valor neste arquivo. O EPIC-BLOG-2 da CodeUP gravou, e a pendência de rotação está aberta desde junho.
```

---

### Task 3: Roteamento `/blog` no Traefik

**Files:**
- Modify: `infra/traefik/lp-horizon.yml`

**Interfaces:**
- Consumes: o container `blog-horizon-wp` da Task 2, alcançável na rede `easypanel`.
- Produces: `https://consultoriahorizon.com.br/blog` servindo o WordPress; o apex intacto.

⚠️ **Este arquivo governa o roteamento do site institucional.** Leia o cabeçalho dele antes de editar — ele carrega o registro do incidente de TLS de 15/08 e a regra derivada sobre SANs. Não estamos adicionando SAN nenhum, mas quem mexe precisa ter lido.

- [ ] **Step 1: Adicionar o router do blog**

Em `infra/traefik/lp-horizon.yml`, dentro de `http.routers`, **antes** do router `https-lp-horizon-apex`, acrescentar:

```yaml
    # Blog WordPress sob /blog. Prioridade 30 > 20 do apex: sem isso o router
    # do apex (que casa o Host inteiro) captura /blog e entrega ao Next.
    # O stripPrefix remove /blog antes do container; o wp-config devolve o
    # prefixo virtualizando o REQUEST_URI, para o Apache rotear na raiz
    # enquanto o WordPress gera URLs sob /blog.
    https-horizon-blog:
      rule: "Host(`consultoriahorizon.com.br`) && PathPrefix(`/blog`)"
      entryPoints:
        - https
      service: horizon-blog-svc
      tls:
        certResolver: letsencrypt
      middlewares:
        - horizon-blog-strip
        - secure-headers
      priority: 30
```

- [ ] **Step 2: Adicionar o middleware de strip**

Dentro de `http.middlewares`:

```yaml
    horizon-blog-strip:
      stripPrefix:
        prefixes:
          - "/blog"
```

- [ ] **Step 3: Adicionar o service**

Dentro de `http.services`:

```yaml
    horizon-blog-svc:
      loadBalancer:
        servers:
          - url: "http://blog-horizon-wp:80"
        passHostHeader: true
```

- [ ] **Step 4: Commit e deploy**

```bash
git add infra/traefik/lp-horizon.yml
git commit -m "feat(blog): roteia /blog para o WordPress no Traefik"
git push origin main
```

O `deploy.yml` sincroniza o arquivo para a VPS e reinicia o serviço.

- [ ] **Step 5: Verificar as DUAS coisas, servindo**

```bash
curl -s -o /dev/null -w "apex   %{http_code}\n" https://consultoriahorizon.com.br/
curl -s -o /dev/null -w "blog   %{http_code}\n" https://consultoriahorizon.com.br/blog/
curl -s -o /dev/null -w "admin  %{http_code}\n" https://consultoriahorizon.com.br/blog/wp-admin/
```

Expected: apex **200** · blog **200** ou **302** · admin **200** ou **302**.

**Se o apex sair do 200, reverter o commit imediatamente** — a porta de entrada da empresa tem precedência sobre o blog.

- [ ] **Step 6: Provar que o WordPress gera URLs sob `/blog`**

```bash
curl -s https://consultoriahorizon.com.br/blog/ | grep -oE 'href="https://consultoriahorizon\.com\.br/blog[^"]*"' | head -n 5
```

Expected: pelo menos uma URL, todas com `/blog` no caminho. **Se aparecerem URLs sem `/blog`, o `inject-uri.php` não pegou** — voltar à Task 2 Step 7 em vez de remendar aqui.

---

### Task 4: Tema e mu-plugins

**Files:**
- Create no volume do WP: `wp-content/mu-plugins/horizon-cache-headers.php` · `wp-content/mu-plugins/horizon-ga4.php` · `wp-content/mu-plugins/horizon-sitemap-fix.php` · `wp-content/themes/horizon-blog/` (baseado em `2026-06-14-EPIC-BLOG-2-infra/codeup-blog-theme/`)

**Interfaces:**
- Consumes: o WordPress da Task 2, servido pela Task 3.
- Produces: blog com identidade Horizon e sitemap funcionando em `/blog/wp-sitemap.xml`.

⛔ **Exige SSH.** Mesmo gate da Task 2.

- [ ] **Step 1: Escrever o mu-plugin do sitemap**

Este é o que evita o loop 301 que a CodeUP mediu — o `REQUEST_URI` virtualizado confunde o `redirect_canonical`, que 301a o sitemap para ele mesmo.

```php
<?php
/**
 * Plugin Name: Horizon Blog Sitemap Fix
 * Description: Evita loop de redirect no sitemap. O REQUEST_URI virtualizado (/blog)
 *              confunde o redirect_canonical do WP, que 301a o sitemap pra ele mesmo.
 *              Medido pela CodeUP no EPIC-BLOG-2.
 * Version: 1.0.0
 */
if (!defined('ABSPATH')) { exit; }

add_filter('redirect_canonical', function ($redirect, $requested) {
    if (stripos((string) $requested, 'sitemap') !== false) { return false; }
    return $redirect;
}, 10, 2);
```

- [ ] **Step 2: Escrever o mu-plugin de cache**

```php
<?php
/**
 * Plugin Name: Horizon Blog Cache Headers
 * Description: Anonimo = cacheavel; logado/admin/REST write = no-store.
 * Version: 1.0.0
 */
if (!defined('ABSPATH')) { exit; }
add_action('send_headers', function () {
    $noStore = 'Cache-Control: private, no-store, max-age=0';
    if (is_admin() || is_user_logged_in()) { header($noStore); return; }
    foreach (array_keys($_COOKIE) as $c) {
        if (strpos($c, 'wordpress_logged_in_') === 0 || strpos($c, 'comment_author_') === 0 || $c === 'wp-postpass') {
            header($noStore); return;
        }
    }
    if (defined('REST_REQUEST') && REST_REQUEST && (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'GET')) { header($noStore); return; }
    header('Cache-Control: public, s-maxage=300, stale-while-revalidate=86400');
}, 100);
```

- [ ] **Step 3: Escrever o mu-plugin do GA4**

Lê o id do ambiente. Vazio = não emite nada.

```php
<?php
/**
 * Plugin Name: Horizon Blog GA4
 * Description: Google Analytics 4 (gtag). O id vem de HORIZON_GA_ID no ambiente;
 *              vazio = nao emite nada.
 * Version: 1.0.0
 */
if (!defined('ABSPATH')) { exit; }
add_action('wp_head', function () {
    $id = getenv('HORIZON_GA_ID');
    if (!$id) { return; }
    $id = esc_attr($id);
    echo "<!-- Google tag (gtag.js) — Horizon GA4 -->\n";
    echo "<script async src=\"https://www.googletagmanager.com/gtag/js?id={$id}\"></script>\n";
    echo "<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','{$id}');</script>\n";
}, 1);
```

- [ ] **Step 4: Instalar os três mu-plugins**

```bash
docker exec blog-horizon-wp mkdir -p /var/www/html/wp-content/mu-plugins
docker cp horizon-sitemap-fix.php blog-horizon-wp:/var/www/html/wp-content/mu-plugins/
docker cp horizon-cache-headers.php blog-horizon-wp:/var/www/html/wp-content/mu-plugins/
docker cp horizon-ga4.php blog-horizon-wp:/var/www/html/wp-content/mu-plugins/
docker exec blog-horizon-wp ls -1 /var/www/html/wp-content/mu-plugins/
```

Expected: os três arquivos listados.

- [ ] **Step 5: Verificar o sitemap do core**

```bash
curl -s -o /dev/null -w "%{http_code}\n" https://consultoriahorizon.com.br/blog/wp-sitemap.xml
curl -s https://consultoriahorizon.com.br/blog/wp-sitemap.xml | head -n 5
```

Expected: **200**, XML, e as URLs internas contendo `/blog`. A CodeUP mediu que o sitemap do **RankMath não registra** — usamos o do core, que funciona.

- [ ] **Step 6: Instalar o tema com a identidade Horizon**

O tema de origem tem 8 arquivos: `style.css` · `functions.php` · `header.php` · `footer.php` · `front-page.php` · `index.php` · `archive.php` · `single.php`. Copiar a pasta inteira do vault (`2026-06-14-EPIC-BLOG-2-infra/codeup-blog-theme/`) para `wp-content/themes/horizon-blog/` e fazer **exatamente estas cinco trocas**, sem redesenhar:

1. **`style.css`, cabeçalho do tema:** `Theme Name: Horizon Blog`, `Text Domain: horizon-blog`.
2. **`style.css`, paleta:** substituir os valores da CodeUP (dourado `#FFB800`, fundo `#0e121c`) pelos tokens da Horizon. Ler `design/tokens.css` do `lp-horizon` e usar os **valores resolvidos** de `--hzn-brand-400` (accent de links e bordas), `--hzn-bg-base`, `--hzn-bg-raised`, `--hzn-text-primary`, `--hzn-text-secondary`, `--hzn-border-default`. O WordPress não carrega o `tokens.css` do Next — copiar os valores, não as referências `var()`.
3. **`header.php`:** wordmark e menu da Horizon no lugar dos da CodeUP. O menu do apex hoje é a própria LP; usar links para `/` e para a âncora de agendamento, não para as rotas de curso da CodeUP.
4. **`single.php`:** o rótulo de autor E-E-A-T ao fim do artigo — foto, nome, bio e links — com a assinatura da Horizon. **Trocar os 3 banners laterais da CodeUP** (que apontam para `/games`, `/formacao-jovem-futuro`, `/formacao-inteligencia-artificial`) por um CTA único para o agendamento da Horizon; aqueles slugs não existem neste domínio e virariam 404.
5. **`functions.php`:** o enqueue versionado por `filemtime` (abaixo).

⚠️ **Gotcha medido pela CodeUP, replicar a defesa:** o `blog-alias.conf` serve `.css` como `immutable` por **1 ano**.

⚠️ **Gotcha medido pela CodeUP, replicar a defesa:** o `blog-alias.conf` serve `.css` como `immutable` por **1 ano**. No `functions.php`, versionar o CSS por `filemtime` no enqueue:

```php
wp_enqueue_style(
    'horizon-blog',
    get_stylesheet_uri(),
    [],
    (string) filemtime(get_stylesheet_directory() . '/style.css')
);
```

Sem isso, qualquer alteração de tema fica invisível por um ano no navegador de quem já visitou.

- [ ] **Step 7: Ativar o tema e conferir servindo**

```bash
docker exec blog-horizon-wp wp theme activate horizon-blog --allow-root
curl -s https://consultoriahorizon.com.br/blog/ | grep -oE 'horizon-blog[^"]*\.css\?ver=[0-9]+' | head -n 2
```

Expected: o CSS do tema aparece com `?ver=` numérico (o `filemtime`), não sem versão.

---

### Task 5: Registrar a Horizon como terceiro blog no motor

**Files:**
- Modify: tabela `blogs` no Postgres do `teachflow-backend` (produção)

**Interfaces:**
- Consumes: o WordPress das Tasks 2-4.
- Produces: `project=horizon` disponível no seletor de blog da tela `/content/blog-ia`.

⛔ **Esta task escreve no banco de produção da CodeUP.** É a materialização da dívida D15. Exige autorização explícita do founder. Se negada, pare e relate.

- [ ] **Step 1: Criar a Application Password no WordPress**

No `wp-admin` da Horizon: Usuários → o usuário admin → Application Passwords → nome `motor-teachflow`. Guardar o valor gerado; ele vai para o banco no Step 3 e **não** para o vault.

- [ ] **Step 2: Conferir o schema antes de escrever**

```sql
\d blogs
```

Expected: colunas `id`, `project`, `name`, `wp_base_url`, `wp_user`, `wp_app_password`, `active`, `created_at`, com índice único em `project`.

- [ ] **Step 3: Inserir a linha da Horizon**

```sql
INSERT INTO blogs (project, name, wp_base_url, wp_user, wp_app_password, active)
VALUES (
  'horizon',
  'Blog Horizon',
  'https://consultoriahorizon.com.br/blog',
  '<usuario admin do WP>',
  '<application password do Step 1>',
  true
);
```

- [ ] **Step 4: Provar pela aplicação, não pelo INSERT**

Um `INSERT` que retorna `INSERT 0 1` prova que a linha entrou, não que o motor a enxerga. Verificar pelos dois lados:

```sql
SELECT project, name, wp_base_url, active FROM blogs ORDER BY created_at;
```

Expected: três linhas — `conteudo`, `codeup` e `horizon`, esta última com `wp_base_url = https://consultoriahorizon.com.br/blog` e `active = true`.

Depois, abrir a tela `/content/blog-ia` no CRM do Teachflow e confirmar que **"Blog Horizon" aparece no seletor de blog**. Esse é o teste que importa: o seletor é alimentado por `GET /api/blog/blogs`, então vê-lo na lista prova o caminho inteiro (banco → API → UI) sem precisar descobrir o host do backend.

- [ ] **Step 5: Criar as categorias no WordPress espelhando os clusters do F0**

```bash
docker exec blog-horizon-wp wp term create category "Vertical e sistemas" --allow-root
docker exec blog-horizon-wp wp term create category "IA juridica" --allow-root
docker exec blog-horizon-wp wp term create category "Servico em campo aberto" --allow-root
docker exec blog-horizon-wp wp term create category "Ferramentas e CRM" --allow-root
```

- [ ] **Step 6: Provisionar o acesso de quem vai escrever**

Criar/ajustar no CRM da CodeUP o usuário da pessoa não-técnica com papel `copywriter` — a tela `/content/blog-ia` é gated em `admin`/`copywriter`/`head_producao`. **Sem isso o fluxo não existe para ela**, por mais que tudo o resto funcione.

---

### Task 6: Verificação fim-a-fim

**Files:** nenhum — verificação.

**Interfaces:**
- Consumes: tudo das Tasks 1-5.
- Produces: prova de que o fluxo do founder funciona de ponta a ponta.

- [ ] **Step 1: Gerar e publicar um artigo pela grid**

Na tela `/content/blog-ia`, selecionar o blog **Horizon**, gerar um artigo de um termo do cluster `vertical-sistema`, revisar no WYSIWYG e publicar.

- [ ] **Step 2: Conferir o artigo servido**

```bash
curl -s https://consultoriahorizon.com.br/blog/ | grep -oE 'href="https://consultoriahorizon\.com\.br/blog/[a-z0-9-]+/"' | head -n 3
```

Expected: o slug do artigo publicado aparece, sob `/blog/`.

- [ ] **Step 3: Conferir capa automática e dado estruturado**

```bash
ART=<url do artigo>
curl -s "$ART" | grep -c 'application/ld+json'
curl -s "$ART" | grep -oE '"@type":"[A-Za-z]+"' | sort -u
curl -s "$ART" | grep -oE '<img[^>]+wp-content/uploads[^>]*>' | head -n 1
```

Expected: pelo menos uma tag `ld+json` real **no HTML** (o RankMath emite `BlogPosting` server-side — ao contrário do apex, cujo JSON-LD só existe no payload do Flight), e uma imagem de capa gerada pelo motor.

- [ ] **Step 4: Conferir que o apex continua íntegro**

```bash
curl -s -o /dev/null -w "apex %{http_code}\n" https://consultoriahorizon.com.br/
curl -s https://consultoriahorizon.com.br/sitemap.xml | grep -c "<loc>"
```

Expected: apex **200**, e o sitemap do Next com **exatamente 1** `<loc>` (só a raiz).

- [ ] **Step 5: Registrar o resultado**

Colar no PR (ou no ledger, se em execução por subagentes) a saída real de cada comando acima — não a afirmação de que passaram.

---

## Notas para quem executa

- **Ordem importa.** A Task 1 tira o `/blog` do ar; a Task 3 o devolve apontando para o WordPress. Entre as duas, `/blog` é 404. Como o único artigo que existia era uma semente de 196 palavras publicada ontem, a janela é aceitável — mas não inverta a ordem, porque o router do Traefik com prioridade 30 sobre um Next que ainda serve `/blog` produz comportamento confuso de depurar.
- **O que NÃO se replica da CodeUP:** o `codeup-robots.php` (não temos host bruto público) e o page-cache na origem (não temos hop externo). Os dois existiam para resolver limitações da Vercel que não são nossas.
- **Se o `wp-admin` não abrir pelo path público**, não crie um subdomínio para contornar. Isso reintroduz o problema de conteúdo duplicado que a arquitetura evita. Investigue o `stripPrefix` e a virtualização.

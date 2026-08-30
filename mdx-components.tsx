// Arquivo exigido pelo @next/mdx para o App Router (ver node_modules/@next/mdx/readme.md,
// seção "App directory"). Sem ele, o alias de fallback que o @next/mdx registra para
// 'next-mdx-import-source-file' tenta, nesta ordem: src/mdx-components → mdx-components
// (raiz) → @mdx-js/react → o useMDXComponents() trivial embutido no próprio @next/mdx
// (que só retorna {}). Como este projeto instalou @mdx-js/react (Task 2, peer dependency
// do @next/mdx), sem este arquivo o terceiro candidato resolve — e o useMDXComponents do
// @mdx-js/react usa React.createContext/useContext para permitir override via provider.
// Isso quebra o build: app/blog/[slug]/page.tsx é Server Component, e sob a condição de
// export "react-server" do React 19, createContext não existe (é API só de cliente).
// Resultado observado sem este arquivo: "TypeError: e.createContext is not a function" ao
// prerenderizar /blog/[slug]. Este arquivo faz o alias resolver aqui em vez de cair no
// @mdx-js/react, com um useMDXComponents que apenas repassa os componentes recebidos —
// sem contexto, sem createContext, seguro em Server Component.
export function useMDXComponents(components: Record<string, unknown>) {
  return components;
}

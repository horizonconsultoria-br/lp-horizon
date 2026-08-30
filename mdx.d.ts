declare module "*.mdx" {
  import type { ComponentType } from "react";
  const componente: ComponentType<Record<string, unknown>>;
  export default componente;
}

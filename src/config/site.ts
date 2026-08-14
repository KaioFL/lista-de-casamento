/**
 * Configuração central da identidade do produto.
 * Ponto único de verdade para nome, descrição e metadados de SEO.
 */
export const siteConfig = {
  name: "Enlace",
  tagline: "Sua lista de casamento, do jeito de vocês",
  description:
    "Crie a lista de presentes do seu casamento, receba contribuições e mensagens dos convidados e acompanhe tudo em tempo real.",
  url: "https://enlace.app",
  locale: "pt-BR",
  themeColor: "#7a1f2b",
} as const;

export type SiteConfig = typeof siteConfig;

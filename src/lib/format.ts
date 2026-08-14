/**
 * Formatadores puros e reutilizáveis (i18n pt-BR).
 * Sem dependências de React — podem rodar no servidor ou no cliente.
 */

const BRL = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

/** Formata um valor numérico (em reais) como moeda brasileira. */
export function formatCurrency(value: number | null | undefined): string {
  if (value == null || Number.isNaN(value)) return BRL.format(0);
  return BRL.format(value);
}

/** Converte centavos (inteiro) para moeda brasileira. */
export function formatCentsToCurrency(cents: number | null | undefined): string {
  return formatCurrency((cents ?? 0) / 100);
}

const DATE_LONG = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "long",
  year: "numeric",
});

const DATE_SHORT = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

function toDate(value: string | number | Date): Date {
  return value instanceof Date ? value : new Date(value);
}

/** Ex.: "23 de julho de 2026". */
export function formatDateLong(value: string | number | Date): string {
  return DATE_LONG.format(toDate(value));
}

/** Ex.: "23/07/2026". */
export function formatDateShort(value: string | number | Date): string {
  return DATE_SHORT.format(toDate(value));
}

/** Iniciais para avatares. Ex.: "Ana Clara" -> "AC". */
export function getInitials(name: string | null | undefined): string {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
  return (parts[0]![0]! + parts[parts.length - 1]![0]!).toUpperCase();
}

/** Percentual inteiro seguro (0–100) a partir de parte/total. */
export function toPercent(part: number, total: number): number {
  if (!total || total <= 0) return 0;
  return Math.min(100, Math.max(0, Math.round((part / total) * 100)));
}

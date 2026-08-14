/**
 * Converte um texto em slug seguro para URL (sem acentos, minúsculo, hifenizado).
 * Ex.: "Ana & João" -> "ana-joao".
 */
export function slugify(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // remove acentos (diacríticos combinantes)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-") // não-alfanumérico vira hífen
    .replace(/^-+|-+$/g, "") // remove hífens das pontas
    .slice(0, 60);
}

/** Sufixo curto aleatório para desambiguar slugs (ex.: "ana-joao-4f2a"). */
export function randomSlugSuffix(length = 4): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let out = "";
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  for (let i = 0; i < length; i++) out += chars[bytes[i]! % chars.length];
  return out;
}

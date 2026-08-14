import { createBrowserClient } from "@supabase/ssr";

import { env } from "@/lib/env";

import type { Database } from "./database.types";

/**
 * Cliente Supabase para uso no browser (Client Components).
 * Usa a chave publishable — toda leitura/escrita respeita as políticas de RLS.
 *
 * Cada chamada cria uma instância nova de propósito: o `createBrowserClient`
 * do @supabase/ssr é memoizado internamente por singleton de cookies, então
 * é seguro chamar em qualquer componente sem vazar estado.
 */
export function createClient() {
  return createBrowserClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  );
}

export type SupabaseBrowserClient = ReturnType<typeof createClient>;

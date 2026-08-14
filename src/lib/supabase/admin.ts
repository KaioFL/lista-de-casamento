import "server-only";

import { createClient as createSupabaseClient } from "@supabase/supabase-js";

import { env } from "@/lib/env";

import type { Database } from "./database.types";

/**
 * Cliente administrativo (service role / secret key).
 *
 * ⚠️ IGNORA RLS — acesso total ao banco. Use SOMENTE em código de servidor
 * confiável (Server Actions/Route Handlers administrativas, webhooks, cron).
 * O import de "server-only" garante erro de build se vazar para o client.
 */
export function createAdminClient() {
  if (!env.SUPABASE_SECRET_KEY) {
    throw new Error(
      "SUPABASE_SECRET_KEY não configurada — client admin indisponível.",
    );
  }

  return createSupabaseClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.SUPABASE_SECRET_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  );
}

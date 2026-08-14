import { cookies } from "next/headers";

import { createServerClient } from "@supabase/ssr";

import { env } from "@/lib/env";

import type { Database } from "./database.types";

/**
 * Cliente Supabase para uso no servidor (Server Components, Route Handlers,
 * Server Actions). Lê e escreve a sessão nos cookies da requisição.
 *
 * IMPORTANTE: nunca cache o retorno desta função entre requisições — os
 * cookies são específicos por request. Chame-a dentro do escopo de cada request.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // `setAll` foi chamado a partir de um Server Component.
            // Isso pode ser ignorado quando há um middleware fazendo o refresh
            // da sessão do usuário — que é o nosso caso (ver middleware.ts).
          }
        },
      },
    },
  );
}

export type SupabaseServerClient = Awaited<ReturnType<typeof createClient>>;

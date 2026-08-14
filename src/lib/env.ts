import { z } from "zod";

/**
 * Validação centralizada das variáveis de ambiente.
 * Falha cedo (no boot) com mensagem clara se algo estiver ausente/errado,
 * evitando erros obscuros em runtime. Exporta um objeto tipado e imutável.
 */

const clientSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.url("URL do Supabase inválida"),
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: z
    .string()
    .min(1, "Chave publishable do Supabase ausente"),
});

const serverSchema = z.object({
  SUPABASE_SECRET_KEY: z.string().optional(),
  SUPABASE_PROJECT_REF: z.string().optional(),
});

/**
 * Só as variáveis com prefixo NEXT_PUBLIC_ existem no bundle do browser.
 * Precisamos referenciá-las estaticamente para o Next injetá-las.
 */
const clientEnv = clientSchema.safeParse({
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY:
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
});

if (!clientEnv.success) {
  const issues = clientEnv.error.issues
    .map((i) => `  • ${i.path.join(".")}: ${i.message}`)
    .join("\n");
  throw new Error(
    `Variáveis de ambiente públicas inválidas:\n${issues}\n\n` +
      "Verifique o arquivo .env.local (use .env.example como base).",
  );
}

const serverEnv = serverSchema.parse({
  SUPABASE_SECRET_KEY: process.env.SUPABASE_SECRET_KEY,
  SUPABASE_PROJECT_REF: process.env.SUPABASE_PROJECT_REF,
});

export const env = Object.freeze({
  ...clientEnv.data,
  ...serverEnv,
});

export type Env = typeof env;

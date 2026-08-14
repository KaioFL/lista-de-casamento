@AGENTS.md

# Enlace — Convite de Casamento

Plataforma de **convites de casamento** elegantes. O anfitrião cria a página do
casamento; convidados (anônimos) veem o convite, confirmam presença (RSVP) e
deixam recados. A **lista de presentes é apenas uma vitrine** (o casal mostra
sugestões do que gostaria de ganhar) — **não há compra, reserva nem pagamento
pelo site**. Uso principal: um convite bonito e sofisticado.

## Stack

- **Next.js 16** (App Router, Turbopack, RSC) + **React 19** + **TypeScript**
- **Tailwind v4** + **shadcn/ui** (estilo `radix-nova`) + **motion** + **sonner**
- **Supabase** (Postgres 17, Auth, Storage, Realtime, RLS) via `@supabase/ssr`
- **React Query**, **react-hook-form** + **Zod**

## Comandos

```bash
npm run dev          # desenvolvimento
npm run build        # build de produção
npm run typecheck    # tsc --noEmit
npm run lint         # eslint
node scripts/db-apply.mjs        # aplica migrações via Management API
node scripts/smoke-test.mjs      # smoke test de RLS end-to-end
```

## Arquitetura (Feature-Based)

```
src/
  app/                    # rotas finas (App Router)
    (auth)/               # login, cadastro, recuperar-senha
    (dashboard)/          # painel do anfitrião (protegido)
    [slug]/               # página pública do casamento
  components/
    ui/                   # primitivos shadcn
    shared/               # componentes reutilizáveis próprios
    layout/               # header do dashboard
  features/<feature>/     # auth, weddings, gifts, public-wedding, dashboard, storage
    schemas/  actions/  services/  hooks/  components/
  lib/supabase/           # clients: client (browser), server, admin, middleware
  types/                  # tipos globais derivados de database.types.ts
  providers/              # theme, react-query, tooltip, toaster
```

**Convenções**
- `services/*.ts` são **server-only** (leituras). Mutações são **Server Actions**
  em `actions/*.ts`, retornando `ActionResult<T>`.
- Nunca misturar imports server-only e client no mesmo barrel.
- Tipos derivam de `src/lib/supabase/database.types.ts` (gerado). Regenerar com
  `supabase gen types` após alterar o schema.
- Validações Zod compartilhadas; **sempre revalidar no servidor**.
- Schemas de formulário (RHF): manter `z.input === z.output` (sem `.coerce`/
  `.default()` — converter na action) para o `zodResolver` tipar corretamente.

## Banco de dados

- Projeto Supabase: `zyxjbbvusnqnhnxbdhac` (região sa-east-1). **Nunca recriar.**
- 10 tabelas, todas com **RLS**. Autorização via funções `SECURITY DEFINER`
  (`is_wedding_owner`, `is_wedding_published`) para evitar recursão de RLS.
- Convidados anônimos: `INSERT` liberado só em casamentos publicados; `SELECT`
  de contribuições/reservas é privado (só o dono). Agregados públicos vêm das
  views `gift_stats` / `wedding_fund_stats` (escondem identidades).
- Migrações em `supabase/migrations/` (fonte de verdade). Aplicadas via
  Management API (`scripts/db-apply.mjs`) — não há senha do banco local.
- Storage: buckets `avatars`, `wedding-covers`, `gift-images` (pasta = owner id).
- Realtime: publicação nas tabelas de interação; o painel usa `useRealtimeRefresh`.

## Segurança

- `SUPABASE_SECRET_KEY` só no servidor (`admin.ts`, `server-only`). Nunca no client.
- A chave publishable respeita RLS; a secret key a ignora (uso administrativo).

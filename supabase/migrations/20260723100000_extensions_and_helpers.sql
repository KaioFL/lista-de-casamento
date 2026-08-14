-- ============================================================================
-- 00 · Extensões e funções utilitárias genéricas
-- ----------------------------------------------------------------------------
-- Base para todo o schema. Não depende de nenhuma tabela.
-- ============================================================================

-- citext: comparações case-insensitive (slugs, e-mails).
create extension if not exists "citext" with schema "extensions";

-- ----------------------------------------------------------------------------
-- set_updated_at(): mantém a coluna updated_at sempre atualizada.
-- Usada por um trigger BEFORE UPDATE em todas as tabelas com essa coluna.
-- ----------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

comment on function public.set_updated_at() is
  'Trigger BEFORE UPDATE: define updated_at = now() automaticamente.';

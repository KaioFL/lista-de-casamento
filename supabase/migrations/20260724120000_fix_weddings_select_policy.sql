-- ============================================================================
-- 10 · Correção: policy de SELECT de weddings compatível com INSERT...RETURNING
-- ----------------------------------------------------------------------------
-- A policy anterior usava is_wedding_owner(id), que consulta a PRÓPRIA tabela
-- weddings. Durante um INSERT ... RETURNING (usado por .insert().select()), a
-- linha recém-criada ainda não é visível a essa subconsulta, fazendo o retorno
-- violar a RLS (erro 42501). A comparação direta de owner_id (coluna já presente
-- na linha retornada) resolve — e evita recursão de RLS com wedding_members.
-- ============================================================================

drop policy if exists "weddings_select_owner_or_published" on public.weddings;
create policy "weddings_select_owner_or_published"
  on public.weddings for select
  to anon, authenticated
  using (
    is_published
    or owner_id = (select auth.uid())
  );

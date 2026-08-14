-- ============================================================================
-- 09 · Realtime
-- ----------------------------------------------------------------------------
-- Publica as tabelas de interação na publicação supabase_realtime para
-- assinaturas em tempo real (painel do anfitrião e página pública).
-- REPLICA IDENTITY FULL garante payload completo em updates/deletes.
-- ============================================================================

do $$
declare
  t text;
  tables text[] := array[
    'gifts',
    'gift_reservations',
    'contributions',
    'rsvps',
    'guestbook_messages',
    'notifications'
  ];
begin
  foreach t in array tables loop
    -- Adiciona à publicação apenas se ainda não estiver
    if not exists (
      select 1 from pg_publication_tables
      where pubname = 'supabase_realtime'
        and schemaname = 'public'
        and tablename = t
    ) then
      execute format('alter publication supabase_realtime add table public.%I', t);
    end if;

    -- Payload completo em UPDATE/DELETE
    execute format('alter table public.%I replica identity full', t);
  end loop;
end$$;

-- ============================================================================
-- 07 · Views públicas de agregação + estatísticas do painel
-- ----------------------------------------------------------------------------
-- Convidados precisam ver o PROGRESSO de cada presente/fundo, mas NÃO quem
-- reservou/contribuiu. Estas views rodam com privilégio do owner
-- (security_invoker = off), filtram só casamentos publicados e expõem
-- exclusivamente agregados — nenhuma identidade.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- gift_stats: progresso por presente (contribuído + reservado)
-- Subconsultas separadas evitam fan-out (produto cartesiano) entre as tabelas.
-- ----------------------------------------------------------------------------
create or replace view public.gift_stats
with (security_invoker = off) as
select
  g.id                                        as gift_id,
  g.wedding_id                                as wedding_id,
  coalesce(cc.total_contributed, 0)::numeric(12, 2) as total_contributed,
  coalesce(cc.contributions_count, 0)::int    as contributions_count,
  coalesce(rr.reserved_quantity, 0)::int      as reserved_quantity
from public.gifts g
join public.weddings w
  on w.id = g.wedding_id and w.is_published
left join (
  select gift_id,
         sum(amount) as total_contributed,
         count(*)    as contributions_count
  from public.contributions
  where payment_status = 'confirmed' and gift_id is not null
  group by gift_id
) cc on cc.gift_id = g.id
left join (
  select gift_id,
         sum(quantity) as reserved_quantity
  from public.gift_reservations
  where status in ('pending', 'confirmed')
  group by gift_id
) rr on rr.gift_id = g.id;

comment on view public.gift_stats is
  'Agregados públicos por presente (só casamentos publicados). Sem identidades.';

-- ----------------------------------------------------------------------------
-- wedding_fund_stats: total arrecadado por casamento
-- ----------------------------------------------------------------------------
create or replace view public.wedding_fund_stats
with (security_invoker = off) as
select
  w.id as wedding_id,
  coalesce(sum(c.amount) filter (where c.payment_status = 'confirmed'), 0)::numeric(12, 2)
    as total_raised,
  coalesce(sum(c.amount) filter (where c.payment_status = 'confirmed' and c.gift_id is null), 0)::numeric(12, 2)
    as general_fund_raised,
  count(*) filter (where c.payment_status = 'confirmed')::int
    as contributions_count
from public.weddings w
left join public.contributions c on c.wedding_id = w.id
where w.is_published
group by w.id;

comment on view public.wedding_fund_stats is
  'Total arrecadado por casamento publicado (agregado público).';

grant select on public.gift_stats to anon, authenticated;
grant select on public.wedding_fund_stats to anon, authenticated;

-- ----------------------------------------------------------------------------
-- get_wedding_dashboard_stats(): números do painel do anfitrião.
-- SECURITY DEFINER + checagem explícita de autorização.
-- ----------------------------------------------------------------------------
create or replace function public.get_wedding_dashboard_stats(wid uuid)
returns table (
  gifts_total         int,
  gifts_reserved      int,
  gifts_received      int,
  total_raised        numeric,
  pending_amount      numeric,
  contributions_count int,
  rsvp_confirmed      int,
  rsvp_declined       int,
  guests_expected     int,
  guestbook_pending   int
)
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  if not public.is_wedding_owner(wid) then
    raise exception 'Acesso negado ao painel deste casamento';
  end if;

  return query
    select
      (select count(*)::int from gifts g where g.wedding_id = wid),
      (select count(*)::int from gifts g where g.wedding_id = wid and g.status = 'reserved'),
      (select count(*)::int from gifts g where g.wedding_id = wid and g.status = 'received'),
      coalesce((select sum(amount) from contributions c
                where c.wedding_id = wid and c.payment_status = 'confirmed'), 0),
      coalesce((select sum(amount) from contributions c
                where c.wedding_id = wid and c.payment_status = 'pending'), 0),
      (select count(*)::int from contributions c
        where c.wedding_id = wid and c.payment_status = 'confirmed'),
      (select count(*)::int from rsvps r where r.wedding_id = wid and r.status = 'confirmed'),
      (select count(*)::int from rsvps r where r.wedding_id = wid and r.status = 'declined'),
      coalesce((select sum(1 + companions)::int from rsvps r
                where r.wedding_id = wid and r.status = 'confirmed'), 0),
      (select count(*)::int from guestbook_messages m
        where m.wedding_id = wid and m.is_approved = false);
end;
$$;

grant execute on function public.get_wedding_dashboard_stats(uuid) to authenticated;

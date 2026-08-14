-- ============================================================================
-- 04 · gift_reservations + contributions
-- ----------------------------------------------------------------------------
-- Interações dos convidados (anônimos): reservar um presente ou contribuir
-- financeiramente (para um presente específico ou para o fundo geral).
-- ============================================================================

do $$
begin
  if not exists (select 1 from pg_type where typname = 'reservation_status') then
    create type public.reservation_status as enum ('pending', 'confirmed', 'cancelled');
  end if;
  if not exists (select 1 from pg_type where typname = 'payment_status') then
    create type public.payment_status as enum ('pending', 'confirmed', 'cancelled', 'refunded');
  end if;
  if not exists (select 1 from pg_type where typname = 'payment_method') then
    create type public.payment_method as enum ('pix', 'credit_card', 'bank_transfer', 'manual', 'other');
  end if;
end$$;

-- ----------------------------------------------------------------------------
-- gift_reservations
-- ----------------------------------------------------------------------------
create table if not exists public.gift_reservations (
  id          uuid primary key default gen_random_uuid(),
  wedding_id  uuid not null references public.weddings (id) on delete cascade,
  gift_id     uuid not null references public.gifts (id) on delete cascade,
  guest_name  text not null check (char_length(trim(guest_name)) > 0),
  guest_email citext,
  quantity    integer not null default 1 check (quantity >= 1),
  status      public.reservation_status not null default 'pending',
  message     text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists gift_reservations_gift_idx on public.gift_reservations (gift_id);
create index if not exists gift_reservations_wedding_idx on public.gift_reservations (wedding_id, status);

drop trigger if exists set_gift_reservations_updated_at on public.gift_reservations;
create trigger set_gift_reservations_updated_at
  before update on public.gift_reservations
  for each row execute function public.set_updated_at();

-- ----------------------------------------------------------------------------
-- contributions
-- ----------------------------------------------------------------------------
create table if not exists public.contributions (
  id             uuid primary key default gen_random_uuid(),
  wedding_id     uuid not null references public.weddings (id) on delete cascade,
  gift_id        uuid references public.gifts (id) on delete set null,
  guest_name     text not null check (char_length(trim(guest_name)) > 0),
  guest_email    citext,
  amount         numeric(12, 2) not null check (amount > 0),
  message        text,
  payment_method public.payment_method not null default 'pix',
  payment_status public.payment_status not null default 'pending',
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

comment on table public.contributions is
  'Contribuição financeira de um convidado. gift_id nulo = fundo geral (lua de mel).';

create index if not exists contributions_wedding_idx on public.contributions (wedding_id, payment_status);
create index if not exists contributions_gift_idx on public.contributions (gift_id);

drop trigger if exists set_contributions_updated_at on public.contributions;
create trigger set_contributions_updated_at
  before update on public.contributions
  for each row execute function public.set_updated_at();

-- ----------------------------------------------------------------------------
-- Consistência: gift pertence ao wedding informado
-- ----------------------------------------------------------------------------
create or replace function public.validate_gift_belongs_to_wedding()
returns trigger
language plpgsql
as $$
begin
  if new.gift_id is not null then
    if not exists (
      select 1 from public.gifts g
      where g.id = new.gift_id and g.wedding_id = new.wedding_id
    ) then
      raise exception 'O presente % não pertence ao casamento %', new.gift_id, new.wedding_id;
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists gift_reservations_check_gift on public.gift_reservations;
create trigger gift_reservations_check_gift
  before insert or update of gift_id, wedding_id on public.gift_reservations
  for each row execute function public.validate_gift_belongs_to_wedding();

drop trigger if exists contributions_check_gift on public.contributions;
create trigger contributions_check_gift
  before insert or update of gift_id, wedding_id on public.contributions
  for each row execute function public.validate_gift_belongs_to_wedding();

-- ----------------------------------------------------------------------------
-- RLS · gift_reservations
--   • Convidado anônimo pode CRIAR (apenas em casamento publicado).
--   • Somente o anfitrião LÊ/edita (privacidade de quem reservou).
-- ----------------------------------------------------------------------------
alter table public.gift_reservations enable row level security;

drop policy if exists "gift_reservations_insert_public" on public.gift_reservations;
create policy "gift_reservations_insert_public"
  on public.gift_reservations for insert
  to anon, authenticated
  with check ( public.is_wedding_published(wedding_id) and status = 'pending' );

drop policy if exists "gift_reservations_select_owner" on public.gift_reservations;
create policy "gift_reservations_select_owner"
  on public.gift_reservations for select
  to authenticated
  using ( public.is_wedding_owner(wedding_id) );

drop policy if exists "gift_reservations_update_owner" on public.gift_reservations;
create policy "gift_reservations_update_owner"
  on public.gift_reservations for update
  to authenticated
  using ( public.is_wedding_owner(wedding_id) )
  with check ( public.is_wedding_owner(wedding_id) );

drop policy if exists "gift_reservations_delete_owner" on public.gift_reservations;
create policy "gift_reservations_delete_owner"
  on public.gift_reservations for delete
  to authenticated
  using ( public.is_wedding_owner(wedding_id) );

grant insert on public.gift_reservations to anon, authenticated;
grant select, update, delete on public.gift_reservations to authenticated;

-- ----------------------------------------------------------------------------
-- RLS · contributions (mesmo padrão)
-- ----------------------------------------------------------------------------
alter table public.contributions enable row level security;

drop policy if exists "contributions_insert_public" on public.contributions;
create policy "contributions_insert_public"
  on public.contributions for insert
  to anon, authenticated
  with check ( public.is_wedding_published(wedding_id) and payment_status = 'pending' );

drop policy if exists "contributions_select_owner" on public.contributions;
create policy "contributions_select_owner"
  on public.contributions for select
  to authenticated
  using ( public.is_wedding_owner(wedding_id) );

drop policy if exists "contributions_update_owner" on public.contributions;
create policy "contributions_update_owner"
  on public.contributions for update
  to authenticated
  using ( public.is_wedding_owner(wedding_id) )
  with check ( public.is_wedding_owner(wedding_id) );

drop policy if exists "contributions_delete_owner" on public.contributions;
create policy "contributions_delete_owner"
  on public.contributions for delete
  to authenticated
  using ( public.is_wedding_owner(wedding_id) );

grant insert on public.contributions to anon, authenticated;
grant select, update, delete on public.contributions to authenticated;

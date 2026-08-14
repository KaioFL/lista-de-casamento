-- ============================================================================
-- 03 · gift_categories + gifts
-- ----------------------------------------------------------------------------
-- Itens da lista de presentes, organizados por categorias (por casamento).
-- ============================================================================

do $$
begin
  if not exists (select 1 from pg_type where typname = 'gift_status') then
    create type public.gift_status as enum ('available', 'reserved', 'received', 'archived');
  end if;
end$$;

-- ----------------------------------------------------------------------------
-- gift_categories
-- ----------------------------------------------------------------------------
create table if not exists public.gift_categories (
  id          uuid primary key default gen_random_uuid(),
  wedding_id  uuid not null references public.weddings (id) on delete cascade,
  name        text not null,
  icon        text,
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  unique (wedding_id, name)
);

create index if not exists gift_categories_wedding_idx
  on public.gift_categories (wedding_id, sort_order);

drop trigger if exists set_gift_categories_updated_at on public.gift_categories;
create trigger set_gift_categories_updated_at
  before update on public.gift_categories
  for each row execute function public.set_updated_at();

-- ----------------------------------------------------------------------------
-- gifts
-- ----------------------------------------------------------------------------
create table if not exists public.gifts (
  id                          uuid primary key default gen_random_uuid(),
  wedding_id                  uuid not null references public.weddings (id) on delete cascade,
  category_id                 uuid references public.gift_categories (id) on delete set null,
  title                       text not null,
  description                 text,
  image_url                   text,
  price                       numeric(12, 2) check (price is null or price >= 0),
  quantity_desired            integer not null default 1 check (quantity_desired >= 1),
  allow_partial_contributions boolean not null default true,
  external_url                text,
  status                      public.gift_status not null default 'available',
  sort_order                  integer not null default 0,
  is_featured                 boolean not null default false,
  created_at                  timestamptz not null default now(),
  updated_at                  timestamptz not null default now()
);

comment on table public.gifts is 'Item da lista de presentes. Pode ser reservado ou receber contribuições.';

create index if not exists gifts_wedding_idx on public.gifts (wedding_id, sort_order);
create index if not exists gifts_category_idx on public.gifts (category_id);
create index if not exists gifts_status_idx on public.gifts (wedding_id, status);

drop trigger if exists set_gifts_updated_at on public.gifts;
create trigger set_gifts_updated_at
  before update on public.gifts
  for each row execute function public.set_updated_at();

-- Garante que a categoria pertence ao mesmo casamento do presente
create or replace function public.gifts_validate_category()
returns trigger
language plpgsql
as $$
begin
  if new.category_id is not null then
    if not exists (
      select 1 from public.gift_categories c
      where c.id = new.category_id and c.wedding_id = new.wedding_id
    ) then
      raise exception 'A categoria % não pertence ao casamento %', new.category_id, new.wedding_id;
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists gifts_check_category on public.gifts;
create trigger gifts_check_category
  before insert or update of category_id, wedding_id on public.gifts
  for each row execute function public.gifts_validate_category();

-- ----------------------------------------------------------------------------
-- RLS · gift_categories
-- ----------------------------------------------------------------------------
alter table public.gift_categories enable row level security;

drop policy if exists "gift_categories_select" on public.gift_categories;
create policy "gift_categories_select"
  on public.gift_categories for select
  to anon, authenticated
  using ( public.is_wedding_published(wedding_id) or public.is_wedding_owner(wedding_id) );

drop policy if exists "gift_categories_manage" on public.gift_categories;
create policy "gift_categories_manage"
  on public.gift_categories for all
  to authenticated
  using ( public.is_wedding_owner(wedding_id) )
  with check ( public.is_wedding_owner(wedding_id) );

grant select on public.gift_categories to anon, authenticated;
grant insert, update, delete on public.gift_categories to authenticated;

-- ----------------------------------------------------------------------------
-- RLS · gifts
-- ----------------------------------------------------------------------------
alter table public.gifts enable row level security;

drop policy if exists "gifts_select" on public.gifts;
create policy "gifts_select"
  on public.gifts for select
  to anon, authenticated
  using ( public.is_wedding_published(wedding_id) or public.is_wedding_owner(wedding_id) );

drop policy if exists "gifts_manage" on public.gifts;
create policy "gifts_manage"
  on public.gifts for all
  to authenticated
  using ( public.is_wedding_owner(wedding_id) )
  with check ( public.is_wedding_owner(wedding_id) );

grant select on public.gifts to anon, authenticated;
grant insert, update, delete on public.gifts to authenticated;

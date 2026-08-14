-- ============================================================================
-- 02 · weddings + wedding_members
-- ----------------------------------------------------------------------------
-- O casamento é o "tenant" central. Todo o restante pende dele.
-- Convidados anônimos leem apenas casamentos publicados (is_published).
-- ============================================================================

-- Papel de colaborador no casamento
do $$
begin
  if not exists (select 1 from pg_type where typname = 'wedding_member_role') then
    create type public.wedding_member_role as enum ('owner', 'editor');
  end if;
end$$;

create table if not exists public.weddings (
  id                uuid primary key default gen_random_uuid(),
  owner_id          uuid not null references public.profiles (id) on delete cascade,
  slug              citext not null unique,
  partner_one_name  text not null,
  partner_two_name  text not null,
  title             text,
  story             text,
  event_date        timestamptz,
  event_location    text,
  cover_image_url   text,
  hero_headline     text,
  welcome_message   text,
  pix_key           text,
  pix_key_type      text,
  primary_color     text not null default '#7a1f2b',
  is_published      boolean not null default false,
  published_at      timestamptz,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),

  constraint weddings_slug_format
    check (slug ~ '^[a-z0-9](?:[a-z0-9-]{1,58}[a-z0-9])$'),
  constraint weddings_primary_color_hex
    check (primary_color ~* '^#[0-9a-f]{6}$')
);

comment on table public.weddings is 'Casamento/evento (tenant). Página pública quando is_published = true.';

create index if not exists weddings_owner_id_idx on public.weddings (owner_id);
create index if not exists weddings_published_idx on public.weddings (is_published) where is_published;

drop trigger if exists set_weddings_updated_at on public.weddings;
create trigger set_weddings_updated_at
  before update on public.weddings
  for each row execute function public.set_updated_at();

-- Mantém published_at coerente com is_published
create or replace function public.sync_wedding_published_at()
returns trigger
language plpgsql
as $$
begin
  if new.is_published and (old.is_published is distinct from true) then
    new.published_at := now();
  elsif not new.is_published then
    new.published_at := null;
  end if;
  return new;
end;
$$;

drop trigger if exists sync_weddings_published_at on public.weddings;
create trigger sync_weddings_published_at
  before insert or update of is_published on public.weddings
  for each row execute function public.sync_wedding_published_at();

-- ----------------------------------------------------------------------------
-- wedding_members: colaboradores (ex.: os dois noivos gerenciando juntos)
-- ----------------------------------------------------------------------------
create table if not exists public.wedding_members (
  id          uuid primary key default gen_random_uuid(),
  wedding_id  uuid not null references public.weddings (id) on delete cascade,
  user_id     uuid not null references public.profiles (id) on delete cascade,
  role        public.wedding_member_role not null default 'editor',
  created_at  timestamptz not null default now(),
  unique (wedding_id, user_id)
);

create index if not exists wedding_members_user_idx on public.wedding_members (user_id);

-- ----------------------------------------------------------------------------
-- Funções de autorização (SECURITY DEFINER evita recursão de RLS e é performático)
-- ----------------------------------------------------------------------------
create or replace function public.is_wedding_owner(wid uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.weddings w
    where w.id = wid and w.owner_id = (select auth.uid())
  )
  or exists (
    select 1 from public.wedding_members m
    where m.wedding_id = wid and m.user_id = (select auth.uid())
  );
$$;

comment on function public.is_wedding_owner(uuid) is
  'True se o usuário atual é dono ou colaborador do casamento.';

create or replace function public.is_wedding_published(wid uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.weddings w
    where w.id = wid and w.is_published
  );
$$;

comment on function public.is_wedding_published(uuid) is
  'True se o casamento está publicado (visível a convidados anônimos).';

-- ----------------------------------------------------------------------------
-- RLS · weddings
-- ----------------------------------------------------------------------------
alter table public.weddings enable row level security;

drop policy if exists "weddings_select_owner_or_published" on public.weddings;
create policy "weddings_select_owner_or_published"
  on public.weddings for select
  to anon, authenticated
  using ( is_published or public.is_wedding_owner(id) );

drop policy if exists "weddings_insert_owner" on public.weddings;
create policy "weddings_insert_owner"
  on public.weddings for insert
  to authenticated
  with check ( (select auth.uid()) = owner_id );

drop policy if exists "weddings_update_owner" on public.weddings;
create policy "weddings_update_owner"
  on public.weddings for update
  to authenticated
  using ( public.is_wedding_owner(id) )
  with check ( public.is_wedding_owner(id) );

drop policy if exists "weddings_delete_owner" on public.weddings;
create policy "weddings_delete_owner"
  on public.weddings for delete
  to authenticated
  using ( (select auth.uid()) = owner_id );

grant select on public.weddings to anon, authenticated;
grant insert, update, delete on public.weddings to authenticated;

-- ----------------------------------------------------------------------------
-- RLS · wedding_members
-- ----------------------------------------------------------------------------
alter table public.wedding_members enable row level security;

drop policy if exists "wedding_members_select" on public.wedding_members;
create policy "wedding_members_select"
  on public.wedding_members for select
  to authenticated
  using ( public.is_wedding_owner(wedding_id) or user_id = (select auth.uid()) );

drop policy if exists "wedding_members_manage" on public.wedding_members;
create policy "wedding_members_manage"
  on public.wedding_members for all
  to authenticated
  using (
    exists (
      select 1 from public.weddings w
      where w.id = wedding_id and w.owner_id = (select auth.uid())
    )
  )
  with check (
    exists (
      select 1 from public.weddings w
      where w.id = wedding_id and w.owner_id = (select auth.uid())
    )
  );

grant select, insert, update, delete on public.wedding_members to authenticated;

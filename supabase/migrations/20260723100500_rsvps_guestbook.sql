-- ============================================================================
-- 05 · rsvps + guestbook_messages
-- ----------------------------------------------------------------------------
-- Confirmação de presença e mural de recados. Ambos aceitam envio anônimo.
-- Recados só aparecem publicamente após aprovação do anfitrião.
-- ============================================================================

do $$
begin
  if not exists (select 1 from pg_type where typname = 'rsvp_status') then
    create type public.rsvp_status as enum ('confirmed', 'declined', 'pending');
  end if;
end$$;

-- ----------------------------------------------------------------------------
-- rsvps
-- ----------------------------------------------------------------------------
create table if not exists public.rsvps (
  id          uuid primary key default gen_random_uuid(),
  wedding_id  uuid not null references public.weddings (id) on delete cascade,
  guest_name  text not null check (char_length(trim(guest_name)) > 0),
  guest_email citext,
  phone       text,
  status      public.rsvp_status not null default 'confirmed',
  companions  integer not null default 0 check (companions >= 0 and companions <= 20),
  notes       text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists rsvps_wedding_idx on public.rsvps (wedding_id, status);

drop trigger if exists set_rsvps_updated_at on public.rsvps;
create trigger set_rsvps_updated_at
  before update on public.rsvps
  for each row execute function public.set_updated_at();

-- ----------------------------------------------------------------------------
-- guestbook_messages
-- ----------------------------------------------------------------------------
create table if not exists public.guestbook_messages (
  id          uuid primary key default gen_random_uuid(),
  wedding_id  uuid not null references public.weddings (id) on delete cascade,
  author_name text not null check (char_length(trim(author_name)) > 0),
  content     text not null check (char_length(trim(content)) between 1 and 2000),
  is_approved boolean not null default false,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists guestbook_wedding_idx
  on public.guestbook_messages (wedding_id, is_approved, created_at desc);

drop trigger if exists set_guestbook_updated_at on public.guestbook_messages;
create trigger set_guestbook_updated_at
  before update on public.guestbook_messages
  for each row execute function public.set_updated_at();

-- ----------------------------------------------------------------------------
-- RLS · rsvps
-- ----------------------------------------------------------------------------
alter table public.rsvps enable row level security;

drop policy if exists "rsvps_insert_public" on public.rsvps;
create policy "rsvps_insert_public"
  on public.rsvps for insert
  to anon, authenticated
  with check ( public.is_wedding_published(wedding_id) );

drop policy if exists "rsvps_select_owner" on public.rsvps;
create policy "rsvps_select_owner"
  on public.rsvps for select
  to authenticated
  using ( public.is_wedding_owner(wedding_id) );

drop policy if exists "rsvps_update_owner" on public.rsvps;
create policy "rsvps_update_owner"
  on public.rsvps for update
  to authenticated
  using ( public.is_wedding_owner(wedding_id) )
  with check ( public.is_wedding_owner(wedding_id) );

drop policy if exists "rsvps_delete_owner" on public.rsvps;
create policy "rsvps_delete_owner"
  on public.rsvps for delete
  to authenticated
  using ( public.is_wedding_owner(wedding_id) );

grant insert on public.rsvps to anon, authenticated;
grant select, update, delete on public.rsvps to authenticated;

-- ----------------------------------------------------------------------------
-- RLS · guestbook_messages
--   • Qualquer um cria (casamento publicado).
--   • Público lê apenas aprovados; anfitrião lê tudo e modera.
-- ----------------------------------------------------------------------------
alter table public.guestbook_messages enable row level security;

drop policy if exists "guestbook_insert_public" on public.guestbook_messages;
create policy "guestbook_insert_public"
  on public.guestbook_messages for insert
  to anon, authenticated
  with check ( public.is_wedding_published(wedding_id) and is_approved = false );

drop policy if exists "guestbook_select_public_or_owner" on public.guestbook_messages;
create policy "guestbook_select_public_or_owner"
  on public.guestbook_messages for select
  to anon, authenticated
  using (
    (public.is_wedding_published(wedding_id) and is_approved)
    or public.is_wedding_owner(wedding_id)
  );

drop policy if exists "guestbook_update_owner" on public.guestbook_messages;
create policy "guestbook_update_owner"
  on public.guestbook_messages for update
  to authenticated
  using ( public.is_wedding_owner(wedding_id) )
  with check ( public.is_wedding_owner(wedding_id) );

drop policy if exists "guestbook_delete_owner" on public.guestbook_messages;
create policy "guestbook_delete_owner"
  on public.guestbook_messages for delete
  to authenticated
  using ( public.is_wedding_owner(wedding_id) );

grant insert on public.guestbook_messages to anon, authenticated;
grant select, update, delete on public.guestbook_messages to authenticated;

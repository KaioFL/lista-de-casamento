-- ============================================================================
-- 06 · notifications
-- ----------------------------------------------------------------------------
-- Avisos para o anfitrião: nova contribuição, reserva, presença ou recado.
-- Alimentadas por triggers SECURITY DEFINER (o convidado anônimo não escreve
-- diretamente na tabela).
-- ============================================================================

create table if not exists public.notifications (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.profiles (id) on delete cascade,
  wedding_id  uuid references public.weddings (id) on delete cascade,
  type        text not null,
  title       text not null,
  body        text,
  data        jsonb not null default '{}'::jsonb,
  is_read     boolean not null default false,
  created_at  timestamptz not null default now()
);

create index if not exists notifications_user_idx
  on public.notifications (user_id, is_read, created_at desc);

-- ----------------------------------------------------------------------------
-- notify_wedding_owner(): cria uma notificação para o dono do casamento.
-- O tipo do evento vem como argumento do trigger (TG_ARGV[0]).
-- ----------------------------------------------------------------------------
create or replace function public.notify_wedding_owner()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_owner uuid;
  v_type  text := tg_argv[0];
  v_title text;
  v_body  text;
begin
  select owner_id into v_owner from public.weddings where id = new.wedding_id;
  if v_owner is null then
    return new;
  end if;

  case v_type
    when 'contribution' then
      v_title := 'Nova contribuição recebida';
      v_body  := new.guest_name || ' contribuiu com ' ||
                 to_char(new.amount, 'FM999G999G990D00');
    when 'reservation' then
      v_title := 'Presente reservado';
      v_body  := new.guest_name || ' reservou um presente da sua lista';
    when 'rsvp' then
      v_title := 'Confirmação de presença';
      v_body  := new.guest_name || ' respondeu ao seu convite';
    when 'guestbook' then
      v_title := 'Novo recado no mural';
      v_body  := new.author_name || ' deixou uma mensagem para vocês';
    else
      v_title := 'Nova atividade';
      v_body  := null;
  end case;

  insert into public.notifications (user_id, wedding_id, type, title, body, data)
  values (
    v_owner, new.wedding_id, v_type, v_title, v_body,
    jsonb_build_object('record_id', new.id)
  );

  return new;
end;
$$;

drop trigger if exists notify_on_contribution on public.contributions;
create trigger notify_on_contribution
  after insert on public.contributions
  for each row execute function public.notify_wedding_owner('contribution');

drop trigger if exists notify_on_reservation on public.gift_reservations;
create trigger notify_on_reservation
  after insert on public.gift_reservations
  for each row execute function public.notify_wedding_owner('reservation');

drop trigger if exists notify_on_rsvp on public.rsvps;
create trigger notify_on_rsvp
  after insert on public.rsvps
  for each row execute function public.notify_wedding_owner('rsvp');

drop trigger if exists notify_on_guestbook on public.guestbook_messages;
create trigger notify_on_guestbook
  after insert on public.guestbook_messages
  for each row execute function public.notify_wedding_owner('guestbook');

-- ----------------------------------------------------------------------------
-- RLS · notifications (só o destinatário enxerga/gerencia)
-- ----------------------------------------------------------------------------
alter table public.notifications enable row level security;

drop policy if exists "notifications_select_own" on public.notifications;
create policy "notifications_select_own"
  on public.notifications for select
  to authenticated
  using ( user_id = (select auth.uid()) );

drop policy if exists "notifications_update_own" on public.notifications;
create policy "notifications_update_own"
  on public.notifications for update
  to authenticated
  using ( user_id = (select auth.uid()) )
  with check ( user_id = (select auth.uid()) );

drop policy if exists "notifications_delete_own" on public.notifications;
create policy "notifications_delete_own"
  on public.notifications for delete
  to authenticated
  using ( user_id = (select auth.uid()) );

grant select, update, delete on public.notifications to authenticated;

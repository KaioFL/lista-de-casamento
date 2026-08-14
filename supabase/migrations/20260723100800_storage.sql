-- ============================================================================
-- 08 · Storage: buckets e políticas
-- ----------------------------------------------------------------------------
-- Buckets públicos (leitura livre). Escrita restrita ao dono da pasta.
-- Convenção de caminho:
--   avatars/{user_id}/arquivo
--   wedding-covers/{wedding_id}/arquivo
--   gift-images/{wedding_id}/arquivo
-- ============================================================================

-- Helper: converte texto em uuid retornando null se inválido (evita erro em policy).
create or replace function public.safe_uuid(value text)
returns uuid
language plpgsql
immutable
as $$
begin
  return value::uuid;
exception when others then
  return null;
end;
$$;

-- ----------------------------------------------------------------------------
-- Buckets (idempotente)
-- ----------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('avatars', 'avatars', true, 5242880,
    array['image/jpeg', 'image/png', 'image/webp', 'image/avif']),
  ('wedding-covers', 'wedding-covers', true, 10485760,
    array['image/jpeg', 'image/png', 'image/webp', 'image/avif']),
  ('gift-images', 'gift-images', true, 10485760,
    array['image/jpeg', 'image/png', 'image/webp', 'image/avif'])
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

-- ----------------------------------------------------------------------------
-- Leitura pública dos três buckets
-- ----------------------------------------------------------------------------
drop policy if exists "storage_public_read" on storage.objects;
create policy "storage_public_read"
  on storage.objects for select
  to anon, authenticated
  using ( bucket_id in ('avatars', 'wedding-covers', 'gift-images') );

-- ----------------------------------------------------------------------------
-- avatars: cada usuário gerencia a própria pasta ({user_id}/...)
-- ----------------------------------------------------------------------------
drop policy if exists "avatars_write_own" on storage.objects;
create policy "avatars_write_own"
  on storage.objects for all
  to authenticated
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  )
  with check (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

-- ----------------------------------------------------------------------------
-- wedding-covers e gift-images: dono/colaborador do casamento gerencia
-- ({wedding_id}/...)
-- ----------------------------------------------------------------------------
drop policy if exists "wedding_covers_write_owner" on storage.objects;
create policy "wedding_covers_write_owner"
  on storage.objects for all
  to authenticated
  using (
    bucket_id = 'wedding-covers'
    and public.is_wedding_owner(public.safe_uuid((storage.foldername(name))[1]))
  )
  with check (
    bucket_id = 'wedding-covers'
    and public.is_wedding_owner(public.safe_uuid((storage.foldername(name))[1]))
  );

drop policy if exists "gift_images_write_owner" on storage.objects;
create policy "gift_images_write_owner"
  on storage.objects for all
  to authenticated
  using (
    bucket_id = 'gift-images'
    and public.is_wedding_owner(public.safe_uuid((storage.foldername(name))[1]))
  )
  with check (
    bucket_id = 'gift-images'
    and public.is_wedding_owner(public.safe_uuid((storage.foldername(name))[1]))
  );

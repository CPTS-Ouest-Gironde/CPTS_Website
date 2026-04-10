-- =========================================================
-- Baseline schema: profiles table for pro area
-- This migration captures the existing state of the database
-- as of 2026-04-10, before the formulaires feature.
-- =========================================================

-- 1) Profile table linked 1:1 with auth.users
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  first_name text,
  last_name text,
  role text not null default 'adherent' check (role in ('adherent', 'membre_ca', 'collaborateur')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2) RLS
alter table public.profiles enable row level security;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'profiles'
      AND policyname = 'profiles_select_own'
  ) THEN
    CREATE POLICY profiles_select_own
      ON public.profiles
      FOR SELECT
      TO authenticated
      USING (auth.uid() = id);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'profiles'
      AND policyname = 'profiles_update_own'
  ) THEN
    CREATE POLICY profiles_update_own
      ON public.profiles
      FOR UPDATE
      TO authenticated
      USING (auth.uid() = id)
      WITH CHECK (auth.uid() = id);
  END IF;
END $$;

-- 3) updated_at auto-management
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row
execute function public.set_updated_at();

-- 4) Create profile automatically when a new auth user is created
create or replace function public.handle_auth_user_created()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  user_role text;
begin
  user_role := nullif(trim(coalesce(new.raw_user_meta_data ->> 'role', '')), '');

  if user_role is null or user_role not in ('adherent', 'membre_ca', 'collaborateur') then
    user_role := 'adherent';
  end if;

  insert into public.profiles (id, first_name, last_name, role)
  values (
    new.id,
    nullif(trim(coalesce(new.raw_user_meta_data ->> 'first_name', '')), ''),
    nullif(trim(coalesce(new.raw_user_meta_data ->> 'last_name', '')), ''),
    user_role
  )
  on conflict (id) do update
    set first_name = coalesce(excluded.first_name, public.profiles.first_name),
        last_name = coalesce(excluded.last_name, public.profiles.last_name),
        role = coalesce(excluded.role, public.profiles.role),
        updated_at = now();

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_auth_user_created();

-- 5) Backfill for existing users
insert into public.profiles (id, first_name, last_name, role)
select
  u.id,
  nullif(trim(coalesce(u.raw_user_meta_data ->> 'first_name', '')), ''),
  nullif(trim(coalesce(u.raw_user_meta_data ->> 'last_name', '')), ''),
  coalesce(
    nullif(trim(coalesce(u.raw_user_meta_data ->> 'role', '')), ''),
    'adherent'
  )
from auth.users u
on conflict (id) do nothing;

-- =========================================================
-- Supabase: table profiles (name/surname) for pro area
-- Execute in Supabase SQL Editor
-- =========================================================

-- 1) Profile table linked 1:1 with auth.users
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  first_name text,
  last_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2) RLS
alter table public.profiles enable row level security;

-- Read own profile
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

-- Update own profile (optional but useful)
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
begin
  insert into public.profiles (id, first_name, last_name)
  values (
    new.id,
    nullif(trim(coalesce(new.raw_user_meta_data ->> 'first_name', '')), ''),
    nullif(trim(coalesce(new.raw_user_meta_data ->> 'last_name', '')), '')
  )
  on conflict (id) do update
    set first_name = coalesce(excluded.first_name, public.profiles.first_name),
        last_name = coalesce(excluded.last_name, public.profiles.last_name),
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
insert into public.profiles (id, first_name, last_name)
select
  u.id,
  nullif(trim(coalesce(u.raw_user_meta_data ->> 'first_name', '')), ''),
  nullif(trim(coalesce(u.raw_user_meta_data ->> 'last_name', '')), '')
from auth.users u
on conflict (id) do nothing;

-- 6) Example: update names from your own list (email, first_name, last_name)
-- Replace values below with your real list.
with source_list(email, first_name, last_name) as (
  values
    ('john.doe@example.com', 'John', 'Doe'),
    ('jane.doe@example.com', 'Jane', 'Doe')
)
insert into public.profiles (id, first_name, last_name)
select
  u.id,
  s.first_name,
  s.last_name
from source_list s
join auth.users u
  on lower(u.email) = lower(s.email)
on conflict (id) do update
  set first_name = excluded.first_name,
      last_name = excluded.last_name,
      updated_at = now();

-- =========================================================
-- Feature formulaires baseline
-- Fondations roles + pharmacies pour le module PSO
-- =========================================================

BEGIN;

-- =========================================================
-- A. Table public.pharmacies
-- =========================================================

create table if not exists public.pharmacies (
  id uuid primary key default gen_random_uuid(),
  nom text not null,
  finess text not null,
  adresse text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint pharmacies_finess_key unique (finess)
);

alter table public.pharmacies enable row level security;

drop policy if exists pharmacies_select_authenticated on public.pharmacies;
-- Applies to authenticated users.
-- Authorizes reading the pharmacies directory.
-- Needed for protected pro flows that must resolve a pharmacy server-side.
create policy pharmacies_select_authenticated
  on public.pharmacies
  for select
  to authenticated
  using (true);

drop policy if exists pharmacies_insert_service_role on public.pharmacies;
-- Applies to service_role only.
-- Authorizes pharmacy creation.
-- Needed because pharmacy administration is not exposed to regular users.
create policy pharmacies_insert_service_role
  on public.pharmacies
  for insert
  to service_role
  with check (true);

drop policy if exists pharmacies_update_service_role on public.pharmacies;
-- Applies to service_role only.
-- Authorizes pharmacy updates.
-- Needed because pharmacy administration is reserved to trusted backend operations.
create policy pharmacies_update_service_role
  on public.pharmacies
  for update
  to service_role
  using (true)
  with check (true);

drop policy if exists pharmacies_delete_service_role on public.pharmacies;
-- Applies to service_role only.
-- Authorizes pharmacy deletion.
-- Needed because destructive changes must stay outside end-user permissions.
create policy pharmacies_delete_service_role
  on public.pharmacies
  for delete
  to service_role
  using (true);

drop trigger if exists pharmacies_set_updated_at on public.pharmacies;
create trigger pharmacies_set_updated_at
before update on public.pharmacies
for each row
execute function public.set_updated_at();

-- =========================================================
-- B. Extend public.profiles
-- =========================================================

alter table public.profiles
  add column if not exists rpps text;

alter table public.profiles
  add column if not exists pharmacie_id uuid references public.pharmacies (id) on delete set null;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'profiles_rpps_unique'
      AND conrelid = 'public.profiles'::regclass
  ) THEN
    ALTER TABLE public.profiles
      ADD CONSTRAINT profiles_rpps_unique unique (rpps);
  END IF;
END $$;

-- =========================================================
-- C. Table public.user_roles
-- =========================================================

create table if not exists public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  role text not null,
  created_at timestamptz not null default now(),
  constraint user_roles_role_check check (
    role in (
      'adherent',
      'membre_ca',
      'collaborateur',
      'pharmacien_pso',
      'reporting_pso'
    )
  ),
  constraint user_roles_user_id_role_unique unique (user_id, role)
);

create index if not exists user_roles_user_id_idx on public.user_roles (user_id);

alter table public.user_roles enable row level security;

drop policy if exists user_roles_insert_service_role on public.user_roles;
-- Applies to service_role only.
-- Authorizes role assignment creation.
-- Needed because role administration must stay server-controlled.
create policy user_roles_insert_service_role
  on public.user_roles
  for insert
  to service_role
  with check (true);

drop policy if exists user_roles_update_service_role on public.user_roles;
-- Applies to service_role only.
-- Authorizes role assignment updates.
-- Needed because role administration must stay server-controlled.
create policy user_roles_update_service_role
  on public.user_roles
  for update
  to service_role
  using (true)
  with check (true);

drop policy if exists user_roles_delete_service_role on public.user_roles;
-- Applies to service_role only.
-- Authorizes role assignment deletion.
-- Needed because destructive role changes must stay server-controlled.
create policy user_roles_delete_service_role
  on public.user_roles
  for delete
  to service_role
  using (true);

-- =========================================================
-- D. Helper public.has_role(role_name text)
-- =========================================================

create or replace function public.has_role(role_name text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select case
    when auth.uid() is null then false
    else exists (
      select 1
      from public.user_roles ur
      where ur.user_id = auth.uid()
        and ur.role = role_name
    )
  end
$$;

-- =========================================================
-- C (continued). Read policies for public.user_roles
-- =========================================================

drop policy if exists user_roles_select_own on public.user_roles;
-- Applies to authenticated users.
-- Authorizes reading the caller's own role assignments.
-- Needed so users can resolve their own access server-side without exposing everyone.
create policy user_roles_select_own
  on public.user_roles
  for select
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists user_roles_select_reporting_pso on public.user_roles;
-- Applies to authenticated users who already have reporting_pso.
-- Authorizes reading all role assignments.
-- Needed for reporting access checks and future dashboard administration flows.
create policy user_roles_select_reporting_pso
  on public.user_roles
  for select
  to authenticated
  using (public.has_role('reporting_pso'));

-- =========================================================
-- E. Backfill existing roles
-- =========================================================

insert into public.user_roles (user_id, role)
select
  p.id,
  'membre_ca'
from public.profiles p
where not (
  p.first_name = 'William'
  and p.last_name = 'Cotelle'
)
on conflict on constraint user_roles_user_id_role_unique do nothing;

insert into public.user_roles (user_id, role)
select
  p.id,
  'reporting_pso'
from public.profiles p
where (p.first_name, p.last_name) in (
  ('Corinne', 'Berthier'),
  ('Christine', 'Cauchetier'),
  ('Clément', 'Menigoz'),
  ('William', 'Cotelle')
)
on conflict on constraint user_roles_user_id_role_unique do nothing;

COMMIT;

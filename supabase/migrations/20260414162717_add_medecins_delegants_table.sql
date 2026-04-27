-- =========================================================
-- Add medecins_delegants table
-- Liste versionnée des médecins délégants signataires du protocole PSO
-- =========================================================

BEGIN;

create table if not exists public.medecins_delegants (
  id uuid primary key default gen_random_uuid(),
  nom text not null,
  prenom text not null,
  rpps text not null unique,
  actif boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.medecins_delegants enable row level security;

drop policy if exists medecins_delegants_select_authenticated on public.medecins_delegants;
-- Applies to authenticated users.
-- Authorizes reading active and inactive delegating doctors.
-- Needed so secured professional forms can resolve the selected doctor server-side.
create policy medecins_delegants_select_authenticated
  on public.medecins_delegants
  for select
  to authenticated
  using (true);

drop policy if exists medecins_delegants_insert_service_role on public.medecins_delegants;
-- Applies to service_role only.
-- Authorizes doctor creation.
-- Needed because the reference list is administered only by trusted backend operations.
create policy medecins_delegants_insert_service_role
  on public.medecins_delegants
  for insert
  to service_role
  with check (true);

drop policy if exists medecins_delegants_update_service_role on public.medecins_delegants;
-- Applies to service_role only.
-- Authorizes doctor updates.
-- Needed because the reference list must not be editable by regular authenticated users.
create policy medecins_delegants_update_service_role
  on public.medecins_delegants
  for update
  to service_role
  using (true)
  with check (true);

drop policy if exists medecins_delegants_delete_service_role on public.medecins_delegants;
-- Applies to service_role only.
-- Authorizes doctor deletion.
-- Needed because destructive changes to the reference list are backend-controlled.
create policy medecins_delegants_delete_service_role
  on public.medecins_delegants
  for delete
  to service_role
  using (true);

drop trigger if exists medecins_delegants_set_updated_at on public.medecins_delegants;
create trigger medecins_delegants_set_updated_at
before update on public.medecins_delegants
for each row
execute function public.set_updated_at();

insert into public.medecins_delegants (nom, prenom, rpps, actif)
values
  ('COMBY-VIALLARD', 'Marie', '10002778362', true),
  ('BERTHELOT', 'Valérie', '10002777430', true),
  ('MENIGOZ', 'Clément', '10101036043', true),
  ('MELIANI', 'Kheira', '10002818440', true),
  ('GARZARO', 'Jean-Michel', '10002753860', true)
on conflict (rpps) do update
set
  nom = excluded.nom,
  prenom = excluded.prenom,
  actif = excluded.actif,
  updated_at = now();

COMMIT;

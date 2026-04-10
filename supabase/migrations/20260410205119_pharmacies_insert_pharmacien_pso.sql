-- =========================================================
-- Pharmacies insert policy for pharmacien_pso
-- Allows onboarding flow to create a pharmacy when FINESS is unknown
-- =========================================================

BEGIN;

drop policy if exists pharmacies_insert_pharmacien_pso on public.pharmacies;
-- Applies to authenticated users with role pharmacien_pso.
-- Authorizes pharmacy creation during first-profile completion.
-- Needed so a pharmacist can create the pharmacy record when the FINESS is not yet present.
create policy pharmacies_insert_pharmacien_pso
  on public.pharmacies
  for insert
  to authenticated
  with check (public.has_role('pharmacien_pso'));

COMMIT;

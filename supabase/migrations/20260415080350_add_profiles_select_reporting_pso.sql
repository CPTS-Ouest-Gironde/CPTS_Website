-- =========================================================
-- Add profiles select policy for reporting_pso
-- Autorise le reporting PSO a lire les profils necessaires au dashboard
-- =========================================================

BEGIN;

drop policy if exists "reporting_pso can read all profiles" on public.profiles;
-- Applies to authenticated users who have reporting_pso.
-- Authorizes reading all profiles needed for PSO dashboard reporting.
-- Needed so reporting users can resolve pharmacist names and RPPS in audit and exports.
create policy "reporting_pso can read all profiles"
  on public.profiles
  for select
  to authenticated
  using (public.has_role('reporting_pso'));

COMMIT;

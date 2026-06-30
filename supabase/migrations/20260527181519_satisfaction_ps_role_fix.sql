BEGIN;

drop policy if exists satisfaction_ps_select_reporting on public.satisfaction_ps;

-- Applies to authenticated users with membre_ca.
-- Authorizes reading anonymous professional satisfaction responses for CA reporting only.
-- Needed to keep the dedicated dashboard separate from PSO reporting access.
create policy satisfaction_ps_select_membre_ca
  on public.satisfaction_ps
  for select
  to authenticated
  using (public.has_role('membre_ca'));

COMMIT;

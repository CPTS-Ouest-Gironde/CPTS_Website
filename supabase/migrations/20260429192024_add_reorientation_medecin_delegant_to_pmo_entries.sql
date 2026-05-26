-- =========================================================
-- Add reorientation_medecin_delegant to pmo_entries
-- Trace la reorientation vers un medecin delegant a posteriori dans les saisies PSO
-- =========================================================

BEGIN;

alter table if exists public.pmo_entries
  add column if not exists reorientation_medecin_delegant boolean not null default false;

COMMIT;

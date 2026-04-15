-- =========================================================
-- Add renouvellement to pmo_entries
-- Ajout du marqueur première prise en charge / renouvellement
-- =========================================================

BEGIN;

alter table if exists public.pmo_entries
  add column if not exists renouvellement boolean not null default false;

COMMIT;

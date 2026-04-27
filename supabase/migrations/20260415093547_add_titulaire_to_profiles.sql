-- =========================================================
-- Add titulaire to profiles
-- Identifie le pharmacien titulaire de l'officine
-- =========================================================

BEGIN;

alter table if exists public.profiles
  add column if not exists titulaire boolean not null default false;

COMMIT;

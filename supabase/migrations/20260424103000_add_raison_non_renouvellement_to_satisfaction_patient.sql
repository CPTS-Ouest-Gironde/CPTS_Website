-- =========================================================
-- Add raison_non_renouvellement to satisfaction_patient
-- Stocke la raison facultative lorsqu'un patient ne souhaite pas renouveler la prise en charge
-- =========================================================

BEGIN;

alter table if exists public.satisfaction_patient
  add column if not exists raison_non_renouvellement text;

COMMIT;

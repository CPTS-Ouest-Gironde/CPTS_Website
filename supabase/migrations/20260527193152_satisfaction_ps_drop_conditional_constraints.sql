BEGIN;

-- Supprime toutes les contraintes CHECK conditionnelles
alter table public.satisfaction_ps
  drop constraint if exists satisfaction_ps_chartes_connaissance_check,
  drop constraint if exists satisfaction_ps_chartes_suggestions_check,
  drop constraint if exists satisfaction_ps_site_connaissance_check,
  drop constraint if exists satisfaction_ps_site_consultation_check,
  drop constraint if exists satisfaction_ps_site_utilite_check,
  drop constraint if exists satisfaction_ps_outils_connaissance_check,
  drop constraint if exists satisfaction_ps_vmv_connaissance_check,
  drop constraint if exists satisfaction_ps_vmv_utilise_check,
  drop constraint if exists satisfaction_ps_vmv_suggestions_check;

-- Passe les colonnes booléennes auparavant conditionnelles en NOT NULL
alter table public.satisfaction_ps
  alter column chartes_souhait_reception set not null,
  alter column chartes_dispositifs_utilises set not null,
  alter column chartes_satisfaction set not null,
  alter column site_consultation set not null,
  alter column site_utilite set not null,
  alter column outils_utilisation set not null,
  alter column vmv_utilise set not null;

COMMIT;

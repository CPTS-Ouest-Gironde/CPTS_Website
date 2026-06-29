BEGIN;

-- Ajoute une colonne date seule pour les réponses anonymes.
alter table public.satisfaction_ps
  add column if not exists submitted_date date not null default current_date;

-- Migre les données existantes éventuelles vers la granularité jour.
update public.satisfaction_ps
set submitted_date = created_at::date
where created_at is not null;

-- Supprime les timestamps précis pour éliminer toute corrélation temporelle.
alter table public.satisfaction_ps drop column if exists created_at;
alter table public.satisfaction_ps drop column if exists updated_at;

-- Supprime le trigger updated_at devenu inutile.
drop trigger if exists satisfaction_ps_set_updated_at on public.satisfaction_ps;

COMMIT;

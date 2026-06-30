-- =========================================================
-- Satisfaction PS table
-- Questionnaire public anonyme de satisfaction professionnels de santé
-- =========================================================

BEGIN;

create table if not exists public.satisfaction_ps (
  id uuid primary key default gen_random_uuid(),
  annee_reference integer not null default extract(year from now()),

  -- Section 1
  chartes_connaissance boolean not null,
  chartes_souhait_reception boolean,
  chartes_dispositifs_utilises boolean,
  chartes_satisfaction boolean,
  chartes_suggestions boolean not null,
  chartes_suggestions_texte text,

  -- Section 2
  site_connaissance boolean not null,
  site_consultation boolean,
  site_utilite boolean,
  site_rubriques_utiles text,
  outils_connaissance boolean not null,
  outils_utilisation boolean,
  acces_distinct_pertinent boolean not null,
  site_outil_prevention boolean not null,
  site_suggestions_texte text,

  -- Section 3
  vmv_connaissance boolean not null,
  vmv_utilise boolean,
  vmv_utilite_texte text,
  vmv_suggestions boolean not null,
  vmv_suggestions_texte text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint satisfaction_ps_chartes_connaissance_check check (
    (
      chartes_connaissance = true
      and chartes_souhait_reception is null
      and chartes_dispositifs_utilises is not null
      and chartes_satisfaction is not null
    )
    or (
      chartes_connaissance = false
      and chartes_souhait_reception is not null
      and chartes_dispositifs_utilises is null
      and chartes_satisfaction is null
    )
  ),
  constraint satisfaction_ps_chartes_suggestions_check check (
    chartes_suggestions is true
    or chartes_suggestions_texte is null
  ),
  constraint satisfaction_ps_site_connaissance_check check (
    (site_connaissance = true and site_consultation is not null)
    or (site_connaissance = false and site_consultation is null)
  ),
  constraint satisfaction_ps_site_consultation_check check (
    (site_consultation = true and site_utilite is not null)
    or (site_consultation is distinct from true and site_utilite is null)
  ),
  constraint satisfaction_ps_site_utilite_check check (
    site_utilite is true
    or site_rubriques_utiles is null
  ),
  constraint satisfaction_ps_outils_connaissance_check check (
    (outils_connaissance = true and outils_utilisation is not null)
    or (outils_connaissance = false and outils_utilisation is null)
  ),
  constraint satisfaction_ps_vmv_connaissance_check check (
    (vmv_connaissance = true and vmv_utilise is not null)
    or (vmv_connaissance = false and vmv_utilise is null)
  ),
  constraint satisfaction_ps_vmv_utilise_check check (
    vmv_utilise is true
    or vmv_utilite_texte is null
  ),
  constraint satisfaction_ps_vmv_suggestions_check check (
    vmv_suggestions is true
    or vmv_suggestions_texte is null
  )
);

alter table public.satisfaction_ps enable row level security;

create index if not exists satisfaction_ps_annee_reference_created_at_idx
  on public.satisfaction_ps (annee_reference, created_at desc);

drop policy if exists satisfaction_ps_insert_anon on public.satisfaction_ps;
-- Applies to anon users.
-- Authorizes public anonymous questionnaire submissions.
-- Needed so health professionals can submit without authentication.
create policy satisfaction_ps_insert_anon
  on public.satisfaction_ps
  for insert
  to anon
  with check (true);

drop policy if exists satisfaction_ps_select_reporting on public.satisfaction_ps;
-- Applies to authenticated users with reporting_pso.
-- Authorizes reading anonymous professional satisfaction responses for reporting only.
-- Needed to build the dashboard while keeping the public form anonymous.
create policy satisfaction_ps_select_reporting
  on public.satisfaction_ps
  for select
  to authenticated
  using (public.has_role('reporting_pso'));

drop trigger if exists satisfaction_ps_set_updated_at on public.satisfaction_ps;
create trigger satisfaction_ps_set_updated_at
before update on public.satisfaction_ps
for each row
execute function public.set_updated_at();

COMMIT;

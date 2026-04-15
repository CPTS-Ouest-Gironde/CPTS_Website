-- =========================================================
-- PSO tables
-- Tables metier du module PSO Rhinite Allergique
-- =========================================================

BEGIN;

-- =========================================================
-- A. Table public.pmo_entries
-- =========================================================

create table if not exists public.pmo_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id),
  pharmacie_id uuid not null references public.pharmacies (id),
  date_realisation date not null,
  medecin_delegant_nom text not null,
  medecin_delegant_rpps text not null,
  patient_sexe text not null,
  patient_age text not null,
  patient_medecin_traitant boolean not null,
  orientation text not null,
  prescription_anti_h1 boolean not null,
  prescription_collyre boolean not null,
  prescription_antiallergique_nasal boolean not null,
  prescription_corticoide_nasal boolean not null,
  nb_produits_pmo text not null,
  dispensation_conseil boolean not null,
  nb_produits_conseil text not null,
  effet_indesirable text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint pmo_entries_patient_sexe_check check (
    patient_sexe in ('homme', 'femme')
  ),
  constraint pmo_entries_patient_age_check check (
    patient_age in ('<15', '15-20', '21-30', '31-40', '41-50', '>50')
  ),
  constraint pmo_entries_orientation_check check (
    orientation in ('officine', 'medecin_delegant', 'medecin_traitant', 'urgences')
  ),
  constraint pmo_entries_nb_produits_pmo_check check (
    nb_produits_pmo in ('0', '1', '2', '3', '4', '5', '>5')
  ),
  constraint pmo_entries_nb_produits_conseil_check check (
    nb_produits_conseil in ('0', '1', '2', '3', '4', '5', '>5')
  )
);

alter table public.pmo_entries enable row level security;

drop policy if exists pmo_entries_select_owner_or_reporting on public.pmo_entries;
-- Applies to authenticated users.
-- Authorizes reading the caller's own entries or all entries for reporting_pso.
-- Needed for pharmacist self-service and PSO reporting access.
create policy pmo_entries_select_owner_or_reporting
  on public.pmo_entries
  for select
  to authenticated
  using (
    auth.uid() = user_id
    or public.has_role('reporting_pso')
  );

drop policy if exists pmo_entries_insert_pharmacien_pso on public.pmo_entries;
-- Applies to authenticated users.
-- Authorizes inserts for pharmacien_pso on their own rows only.
-- Needed to prevent writing entries on behalf of another user.
create policy pmo_entries_insert_pharmacien_pso
  on public.pmo_entries
  for insert
  to authenticated
  with check (
    auth.uid() = user_id
    and public.has_role('pharmacien_pso')
  );

drop policy if exists pmo_entries_update_owner on public.pmo_entries;
-- Applies to authenticated users.
-- Authorizes updates on the caller's own rows only.
-- Needed so pharmacists can edit their own entries and nobody else's.
create policy pmo_entries_update_owner
  on public.pmo_entries
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists pmo_entries_delete_owner on public.pmo_entries;
-- Applies to authenticated users.
-- Authorizes deletes on the caller's own rows only.
-- Needed so pharmacists can remove only their own entries.
create policy pmo_entries_delete_owner
  on public.pmo_entries
  for delete
  to authenticated
  using (auth.uid() = user_id);

drop trigger if exists pmo_entries_set_updated_at on public.pmo_entries;
create trigger pmo_entries_set_updated_at
before update on public.pmo_entries
for each row
execute function public.set_updated_at();

-- =========================================================
-- B. Table public.satisfaction_pharmacien
-- =========================================================

create table if not exists public.satisfaction_pharmacien (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id),
  pharmacie_id uuid not null references public.pharmacies (id),
  satisfaction_globale integer not null,
  facilite_mise_en_place integer not null,
  benefice_pratique integer not null,
  acces_soins integer not null,
  appreciation_patients integer not null,
  nb_effets_indesirables_graves integer not null,
  autres_incidents boolean not null,
  incidents_description text,
  commentaire text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint satisfaction_pharmacien_satisfaction_globale_check check (
    satisfaction_globale between 1 and 5
  ),
  constraint satisfaction_pharmacien_facilite_mise_en_place_check check (
    facilite_mise_en_place between 1 and 5
  ),
  constraint satisfaction_pharmacien_benefice_pratique_check check (
    benefice_pratique between 1 and 5
  ),
  constraint satisfaction_pharmacien_acces_soins_check check (
    acces_soins between 1 and 5
  ),
  constraint satisfaction_pharmacien_appreciation_patients_check check (
    appreciation_patients between 1 and 5
  ),
  constraint satisfaction_pharmacien_nb_effets_indesirables_graves_check check (
    nb_effets_indesirables_graves >= 0
  )
);

alter table public.satisfaction_pharmacien enable row level security;

drop policy if exists satisfaction_pharmacien_select_owner_or_reporting on public.satisfaction_pharmacien;
-- Applies to authenticated users.
-- Authorizes reading the caller's own response or all responses for reporting_pso.
-- Needed for pharmacist self-service and PSO reporting access.
create policy satisfaction_pharmacien_select_owner_or_reporting
  on public.satisfaction_pharmacien
  for select
  to authenticated
  using (
    auth.uid() = user_id
    or public.has_role('reporting_pso')
  );

drop policy if exists satisfaction_pharmacien_insert_pharmacien_pso on public.satisfaction_pharmacien;
-- Applies to authenticated users.
-- Authorizes inserts for pharmacien_pso on their own rows only.
-- Needed to prevent creating a response on behalf of another user.
create policy satisfaction_pharmacien_insert_pharmacien_pso
  on public.satisfaction_pharmacien
  for insert
  to authenticated
  with check (
    auth.uid() = user_id
    and public.has_role('pharmacien_pso')
  );

drop trigger if exists satisfaction_pharmacien_set_updated_at on public.satisfaction_pharmacien;
create trigger satisfaction_pharmacien_set_updated_at
before update on public.satisfaction_pharmacien
for each row
execute function public.set_updated_at();

-- =========================================================
-- C. Table public.satisfaction_patient
-- =========================================================

create table if not exists public.satisfaction_patient (
  id uuid primary key default gen_random_uuid(),
  raison_venue text not null,
  raison_venue_autre text,
  satisfaction_prise_en_charge integer not null,
  conseils_aide integer not null,
  facilite_vie integer not null,
  souhait_renouvellement boolean not null,
  consultation_medecin_apres boolean not null,
  raison_consultation text,
  commentaire text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint satisfaction_patient_raison_venue_check check (
    raison_venue in ('affiche_saison', 'gene_symptomes', 'pas_acces_medecin', 'autres')
  ),
  constraint satisfaction_patient_satisfaction_prise_en_charge_check check (
    satisfaction_prise_en_charge between 1 and 5
  ),
  constraint satisfaction_patient_conseils_aide_check check (
    conseils_aide between 1 and 5
  ),
  constraint satisfaction_patient_facilite_vie_check check (
    facilite_vie between 1 and 5
  ),
  constraint satisfaction_patient_raison_consultation_check check (
    raison_consultation is null
    or raison_consultation in (
      'effets_indesirables',
      'pas_amelioration',
      'aggravation',
      'bilan_allergologique'
    )
  )
);

alter table public.satisfaction_patient enable row level security;

drop policy if exists satisfaction_patient_insert_anon on public.satisfaction_patient;
-- Applies to anon users.
-- Authorizes public questionnaire submissions.
-- Needed so patients can submit without authentication.
create policy satisfaction_patient_insert_anon
  on public.satisfaction_patient
  for insert
  to anon
  with check (true);

drop policy if exists satisfaction_patient_select_reporting on public.satisfaction_patient;
-- Applies to authenticated users with reporting_pso.
-- Authorizes reading patient responses for PSO reporting only.
-- Needed to keep responses anonymous while allowing aggregated reporting.
create policy satisfaction_patient_select_reporting
  on public.satisfaction_patient
  for select
  to authenticated
  using (public.has_role('reporting_pso'));

drop trigger if exists satisfaction_patient_set_updated_at on public.satisfaction_patient;
create trigger satisfaction_patient_set_updated_at
before update on public.satisfaction_patient
for each row
execute function public.set_updated_at();

-- =========================================================
-- D. Table public.tarifs_pso
-- =========================================================

create table if not exists public.tarifs_pso (
  id uuid primary key default gen_random_uuid(),
  cle text not null,
  libelle text not null,
  montant_euros numeric not null,
  actif boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint tarifs_pso_cle_unique unique (cle),
  constraint tarifs_pso_montant_euros_check check (montant_euros >= 0)
);

alter table public.tarifs_pso enable row level security;

drop policy if exists tarifs_pso_select_authenticated on public.tarifs_pso;
-- Applies to authenticated users.
-- Authorizes reading the tariff table.
-- Needed for future PSO reporting and remuneration-related features.
create policy tarifs_pso_select_authenticated
  on public.tarifs_pso
  for select
  to authenticated
  using (true);

drop policy if exists tarifs_pso_insert_service_role on public.tarifs_pso;
-- Applies to service_role only.
-- Authorizes tariff creation.
-- Needed because tariff administration is reserved to trusted backend operations.
create policy tarifs_pso_insert_service_role
  on public.tarifs_pso
  for insert
  to service_role
  with check (true);

drop policy if exists tarifs_pso_update_service_role on public.tarifs_pso;
-- Applies to service_role only.
-- Authorizes tariff updates.
-- Needed because tariff administration is reserved to trusted backend operations.
create policy tarifs_pso_update_service_role
  on public.tarifs_pso
  for update
  to service_role
  using (true)
  with check (true);

drop policy if exists tarifs_pso_delete_service_role on public.tarifs_pso;
-- Applies to service_role only.
-- Authorizes tariff deletion.
-- Needed because destructive tariff changes must stay backend-controlled.
create policy tarifs_pso_delete_service_role
  on public.tarifs_pso
  for delete
  to service_role
  using (true);

drop trigger if exists tarifs_pso_set_updated_at on public.tarifs_pso;
create trigger tarifs_pso_set_updated_at
before update on public.tarifs_pso
for each row
execute function public.set_updated_at();

COMMIT;

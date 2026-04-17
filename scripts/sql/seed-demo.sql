-- Seed de demonstration PSO pour la demo Christine.
-- NE JAMAIS executer ce script en production.

BEGIN;

-- A. Creation des 5 pharmacies demo.
INSERT INTO public.pharmacies (nom, finess, adresse) VALUES
  ('Pharmacie Robinson', '330000000', '[DEMO] 12 avenue de la Forêt, 33700 Mérignac'),
  ('Pharmacie des Pins', '330000001', '[DEMO] 45 rue des Écoles, 33600 Pessac'),
  ('Pharmacie Saint-Jean', '330000002', '[DEMO] 3 place du Bourg, 33127 Saint-Jean-d''Illac'),
  ('Pharmacie de Martignas', '330000003', '[DEMO] 18 avenue de Bordeaux, 33127 Martignas-sur-Jalle'),
  ('Pharmacie du Centre', '330000004', '[DEMO] 7 rue Georges Clemenceau, 33700 Mérignac')
ON CONFLICT (finess) DO NOTHING;

-- B. Attribution du role pharmacien_pso aux 5 comptes demo.
INSERT INTO public.user_roles (user_id, role) VALUES
  ('f5671ffe-f1b8-4e06-af75-1c739c3255e7', 'pharmacien_pso'),
  ('dd1370e5-ce1f-437f-a554-96d186476489', 'pharmacien_pso'),
  ('44eb4a19-defa-4fc4-8fd5-1cdf5b992170', 'pharmacien_pso'),
  ('6ffa63bd-bb79-4481-a001-d46ebdf80dd3', 'pharmacien_pso'),
  ('7f39f9b4-50f8-4dc6-acb8-7b0f199b1d7c', 'pharmacien_pso')
ON CONFLICT (user_id, role) DO NOTHING;

-- C. Completion des profils demo.
UPDATE public.profiles SET
  first_name = 'Marielle',
  last_name = 'Caussarieu',
  rpps = '10001586519',
  pharmacie_id = (SELECT id FROM public.pharmacies WHERE finess = '330000000')
WHERE id = 'f5671ffe-f1b8-4e06-af75-1c739c3255e7';

UPDATE public.profiles SET
  first_name = 'Jean',
  last_name = 'Dupont',
  rpps = '10002345671',
  pharmacie_id = (SELECT id FROM public.pharmacies WHERE finess = '330000001')
WHERE id = 'dd1370e5-ce1f-437f-a554-96d186476489';

UPDATE public.profiles SET
  first_name = 'Sophie',
  last_name = 'Bernard',
  rpps = '10003456782',
  pharmacie_id = (SELECT id FROM public.pharmacies WHERE finess = '330000002')
WHERE id = '44eb4a19-defa-4fc4-8fd5-1cdf5b992170';

UPDATE public.profiles SET
  first_name = 'Pierre',
  last_name = 'Moreau',
  rpps = '10004567893',
  pharmacie_id = (SELECT id FROM public.pharmacies WHERE finess = '330000003')
WHERE id = '6ffa63bd-bb79-4481-a001-d46ebdf80dd3';

UPDATE public.profiles SET
  first_name = 'Claire',
  last_name = 'Petit',
  rpps = '10005678904',
  pharmacie_id = (SELECT id FROM public.pharmacies WHERE finess = '330000004')
WHERE id = '7f39f9b4-50f8-4dc6-acb8-7b0f199b1d7c';

-- D. Seed de 35 pmo_entries reparties sur 5 officines demo.
WITH demo_pmo_entries (
  id,
  row_num,
  user_id,
  finess,
  date_realisation,
  patient_sexe,
  patient_age,
  patient_medecin_traitant,
  orientation,
  prescription_anti_h1,
  prescription_collyre,
  prescription_antiallergique_nasal,
  prescription_corticoide_nasal,
  nb_produits_pmo,
  dispensation_conseil,
  nb_produits_conseil,
  effet_indesirable
) AS (
  VALUES
    ('10000000-0000-4000-8000-000000000001', 1, 'f5671ffe-f1b8-4e06-af75-1c739c3255e7', '330000000', '2026-01-15', 'femme', '21-30', true,  'officine',          true,  false, false, false, '1', false, '0', NULL),
    ('10000000-0000-4000-8000-000000000002', 2, 'f5671ffe-f1b8-4e06-af75-1c739c3255e7', '330000000', '2026-01-18', 'homme', '31-40', true,  'officine',          true,  true,  false, false, '2', false, '0', NULL),
    ('10000000-0000-4000-8000-000000000003', 3, 'f5671ffe-f1b8-4e06-af75-1c739c3255e7', '330000000', '2026-01-22', 'femme', '15-20', true,  'medecin_delegant', true,  false, false, false, '1', false, '0', NULL),
    ('10000000-0000-4000-8000-000000000004', 4, 'f5671ffe-f1b8-4e06-af75-1c739c3255e7', '330000000', '2026-01-27', 'femme', '31-40', false, 'medecin_traitant', true,  false, false, true,  '2', false, '0', NULL),
    ('10000000-0000-4000-8000-000000000005', 5, 'f5671ffe-f1b8-4e06-af75-1c739c3255e7', '330000000', '2026-02-02', 'homme', '41-50', true,  'officine',          true,  false, false, false, '0', false, '0', NULL),
    ('10000000-0000-4000-8000-000000000006', 6, 'f5671ffe-f1b8-4e06-af75-1c739c3255e7', '330000000', '2026-02-06', 'femme', '21-30', true,  'officine',          true,  false, false, false, '1', true,  '1', NULL),
    ('10000000-0000-4000-8000-000000000007', 7, 'f5671ffe-f1b8-4e06-af75-1c739c3255e7', '330000000', '2026-02-12', 'homme', '31-40', true,  'officine',          true,  false, true,  false, '2', false, '0', NULL),
    ('10000000-0000-4000-8000-000000000008', 8, 'f5671ffe-f1b8-4e06-af75-1c739c3255e7', '330000000', '2026-02-18', 'femme', '21-30', true,  'officine',          true,  false, false, false, '1', false, '0', '[DEMO] Léger effet de somnolence signalé'),
    ('10000000-0000-4000-8000-000000000009', 9, 'f5671ffe-f1b8-4e06-af75-1c739c3255e7', '330000000', '2026-02-24', 'homme', '41-50', false, 'urgences',          true,  true,  false, true,  '3', true,  '2', NULL),
    ('10000000-0000-4000-8000-000000000010',10, 'f5671ffe-f1b8-4e06-af75-1c739c3255e7', '330000000', '2026-03-01', 'femme', '>50',   true,  'officine',          false, false, false, false, '0', false, '0', NULL),

    ('10000000-0000-4000-8000-000000000011',11, 'dd1370e5-ce1f-437f-a554-96d186476489', '330000001', '2026-01-16', 'femme', '15-20', true,  'officine',          true,  false, false, false, '1', false, '0', NULL),
    ('10000000-0000-4000-8000-000000000012',12, 'dd1370e5-ce1f-437f-a554-96d186476489', '330000001', '2026-01-25', 'homme', '21-30', true,  'officine',          true,  false, false, false, '2', false, '0', NULL),
    ('10000000-0000-4000-8000-000000000013',13, 'dd1370e5-ce1f-437f-a554-96d186476489', '330000001', '2026-02-04', 'femme', '31-40', true,  'medecin_delegant', true,  true,  false, false, '1', false, '0', NULL),
    ('10000000-0000-4000-8000-000000000014',14, 'dd1370e5-ce1f-437f-a554-96d186476489', '330000001', '2026-02-11', 'homme', '41-50', false, 'officine',          true,  false, false, false, '1', false, '0', NULL),
    ('10000000-0000-4000-8000-000000000015',15, 'dd1370e5-ce1f-437f-a554-96d186476489', '330000001', '2026-02-20', 'femme', '31-40', true,  'officine',          true,  false, false, true,  '2', true,  '1', NULL),
    ('10000000-0000-4000-8000-000000000016',16, 'dd1370e5-ce1f-437f-a554-96d186476489', '330000001', '2026-03-03', 'homme', '21-30', true,  'medecin_traitant', true,  false, false, false, '3', false, '0', NULL),
    ('10000000-0000-4000-8000-000000000017',17, 'dd1370e5-ce1f-437f-a554-96d186476489', '330000001', '2026-03-12', 'femme', '41-50', true,  'officine',          true,  true,  false, true,  '2', false, '0', NULL),
    ('10000000-0000-4000-8000-000000000018',18, 'dd1370e5-ce1f-437f-a554-96d186476489', '330000001', '2026-03-20', 'homme', '>50',   true,  'officine',          true,  false, false, false, '0', false, '0', NULL),

    ('10000000-0000-4000-8000-000000000019',19, '44eb4a19-defa-4fc4-8fd5-1cdf5b992170', '330000002', '2026-01-19', 'femme', '<15',   true,  'officine',          true,  false, false, false, '1', false, '0', NULL),
    ('10000000-0000-4000-8000-000000000020',20, '44eb4a19-defa-4fc4-8fd5-1cdf5b992170', '330000002', '2026-02-01', 'homme', '15-20', true,  'officine',          true,  false, false, false, '1', false, '0', NULL),
    ('10000000-0000-4000-8000-000000000021',21, '44eb4a19-defa-4fc4-8fd5-1cdf5b992170', '330000002', '2026-02-14', 'femme', '21-30', true,  'officine',          true,  false, false, false, '3', false, '0', NULL),
    ('10000000-0000-4000-8000-000000000022',22, '44eb4a19-defa-4fc4-8fd5-1cdf5b992170', '330000002', '2026-02-28', 'femme', '31-40', true,  'medecin_delegant', true,  true,  false, false, '2', false, '0', NULL),
    ('10000000-0000-4000-8000-000000000023',23, '44eb4a19-defa-4fc4-8fd5-1cdf5b992170', '330000002', '2026-03-08', 'homme', '41-50', true,  'officine',          true,  false, false, false, '1', false, '0', NULL),
    ('10000000-0000-4000-8000-000000000024',24, '44eb4a19-defa-4fc4-8fd5-1cdf5b992170', '330000002', '2026-03-18', 'femme', '31-40', true,  'officine',          true,  false, false, true,  '2', true,  '1', NULL),
    ('10000000-0000-4000-8000-000000000025',25, '44eb4a19-defa-4fc4-8fd5-1cdf5b992170', '330000002', '2026-03-27', 'homme', '21-30', false, 'medecin_traitant', true,  false, false, false, '3', false, '0', '[DEMO] Irritation oculaire bénigne'),

    ('10000000-0000-4000-8000-000000000026',26, '6ffa63bd-bb79-4481-a001-d46ebdf80dd3', '330000003', '2026-01-21', 'femme', '15-20', true,  'officine',          true,  false, false, false, '1', false, '0', NULL),
    ('10000000-0000-4000-8000-000000000027',27, '6ffa63bd-bb79-4481-a001-d46ebdf80dd3', '330000003', '2026-02-08', 'homme', '21-30', true,  'officine',          true,  false, false, false, '2', false, '0', NULL),
    ('10000000-0000-4000-8000-000000000028',28, '6ffa63bd-bb79-4481-a001-d46ebdf80dd3', '330000003', '2026-02-23', 'femme', '31-40', true,  'officine',          true,  true,  false, false, '2', false, '0', NULL),
    ('10000000-0000-4000-8000-000000000029',29, '6ffa63bd-bb79-4481-a001-d46ebdf80dd3', '330000003', '2026-03-09', 'homme', '41-50', true,  'medecin_delegant', true,  false, false, false, '1', false, '0', NULL),
    ('10000000-0000-4000-8000-000000000030',30, '6ffa63bd-bb79-4481-a001-d46ebdf80dd3', '330000003', '2026-03-24', 'femme', '31-40', true,  'officine',          false, false, false, false, '1', false, '0', NULL),
    ('10000000-0000-4000-8000-000000000031',31, '6ffa63bd-bb79-4481-a001-d46ebdf80dd3', '330000003', '2026-04-02', 'homme', '21-30', true,  'officine',          true,  false, false, true,  '2', true,  '1', NULL),

    ('10000000-0000-4000-8000-000000000032',32, '7f39f9b4-50f8-4dc6-acb8-7b0f199b1d7c', '330000004', '2026-01-30', 'femme', '<15',   true,  'officine',          true,  false, false, false, '1', false, '0', NULL),
    ('10000000-0000-4000-8000-000000000033',33, '7f39f9b4-50f8-4dc6-acb8-7b0f199b1d7c', '330000004', '2026-02-26', 'homme', '15-20', false, 'medecin_traitant', true,  false, false, false, '3', false, '0', NULL),
    ('10000000-0000-4000-8000-000000000034',34, '7f39f9b4-50f8-4dc6-acb8-7b0f199b1d7c', '330000004', '2026-03-31', 'femme', '21-30', true,  'medecin_delegant', true,  true,  false, true,  '2', true,  '1', NULL),
    ('10000000-0000-4000-8000-000000000035',35, '7f39f9b4-50f8-4dc6-acb8-7b0f199b1d7c', '330000004', '2026-04-10', 'homme', '31-40', true,  'officine',          true,  false, true,  false, '1', false, '0', NULL)
)
INSERT INTO public.pmo_entries (
  id,
  user_id,
  pharmacie_id,
  date_realisation,
  medecin_delegant_nom,
  medecin_delegant_rpps,
  patient_sexe,
  patient_age,
  patient_medecin_traitant,
  orientation,
  prescription_anti_h1,
  prescription_collyre,
  prescription_antiallergique_nasal,
  prescription_corticoide_nasal,
  nb_produits_pmo,
  dispensation_conseil,
  nb_produits_conseil,
  effet_indesirable
)
SELECT
  source.id::uuid,
  source.user_id::uuid,
  pharmacy.id,
  source.date_realisation::date,
  CASE ((source.row_num - 1) % 5)
    WHEN 0 THEN 'Dr Martin [DEMO]'
    WHEN 1 THEN 'Dr Dubois [DEMO]'
    WHEN 2 THEN 'Dr Laurent [DEMO]'
    WHEN 3 THEN 'Dr Garcia [DEMO]'
    ELSE 'Dr Bernard [DEMO]'
  END,
  CASE ((source.row_num - 1) % 5)
    WHEN 0 THEN '10002000001'
    WHEN 1 THEN '10002000002'
    WHEN 2 THEN '10002000003'
    WHEN 3 THEN '10002000004'
    ELSE '10002000005'
  END,
  source.patient_sexe,
  source.patient_age,
  source.patient_medecin_traitant,
  source.orientation,
  source.prescription_anti_h1,
  source.prescription_collyre,
  source.prescription_antiallergique_nasal,
  source.prescription_corticoide_nasal,
  source.nb_produits_pmo,
  source.dispensation_conseil,
  source.nb_produits_conseil,
  source.effet_indesirable
FROM demo_pmo_entries AS source
JOIN public.pharmacies AS pharmacy
  ON pharmacy.finess = source.finess
ON CONFLICT (id) DO NOTHING;

-- E. Seed de 5 retours satisfaction pharmacien.
WITH demo_satisfaction_pharmacien (
  id,
  user_id,
  finess,
  satisfaction_globale,
  facilite_mise_en_place,
  benefice_pratique,
  acces_soins,
  appreciation_patients,
  nb_effets_indesirables_graves,
  autres_incidents,
  incidents_description,
  commentaire
) AS (
  VALUES
    ('20000000-0000-4000-8000-000000000001', 'f5671ffe-f1b8-4e06-af75-1c739c3255e7', '330000000', 5, 4, 5, 5, 4, 0, false, NULL, '[DEMO] Protocole très apprécié des patients, simple à mettre en place au comptoir.'),
    ('20000000-0000-4000-8000-000000000002', 'dd1370e5-ce1f-437f-a554-96d186476489', '330000001', 4, 3, 4, 4, 5, 0, false, NULL, '[DEMO] Bon retour global, quelques ajustements nécessaires au début.'),
    ('20000000-0000-4000-8000-000000000003', '44eb4a19-defa-4fc4-8fd5-1cdf5b992170', '330000002', 5, 5, 4, 5, 5, 0, false, NULL, '[DEMO] Excellente initiative, nos patients sont ravis.'),
    ('20000000-0000-4000-8000-000000000004', '6ffa63bd-bb79-4481-a001-d46ebdf80dd3', '330000003', 3, 3, 3, 4, 3, 1, true, '[DEMO] Un patient a ressenti une légère irritation après prise d''anti-H1.', '[DEMO] Protocole correct mais demande du temps au comptoir.'),
    ('20000000-0000-4000-8000-000000000005', '7f39f9b4-50f8-4dc6-acb8-7b0f199b1d7c', '330000004', 4, 4, 4, 4, 4, 0, false, NULL, '[DEMO] Bonne expérience globale.')
)
INSERT INTO public.satisfaction_pharmacien (
  id,
  user_id,
  pharmacie_id,
  satisfaction_globale,
  facilite_mise_en_place,
  benefice_pratique,
  acces_soins,
  appreciation_patients,
  nb_effets_indesirables_graves,
  autres_incidents,
  incidents_description,
  commentaire
)
SELECT
  source.id::uuid,
  source.user_id::uuid,
  pharmacy.id,
  source.satisfaction_globale,
  source.facilite_mise_en_place,
  source.benefice_pratique,
  source.acces_soins,
  source.appreciation_patients,
  source.nb_effets_indesirables_graves,
  source.autres_incidents,
  source.incidents_description,
  source.commentaire
FROM demo_satisfaction_pharmacien AS source
JOIN public.pharmacies AS pharmacy
  ON pharmacy.finess = source.finess
ON CONFLICT (id) DO NOTHING;

-- F. Seed de 15 retours satisfaction patient anonymes.
WITH demo_satisfaction_patient (
  id,
  created_at,
  raison_venue,
  raison_venue_autre,
  satisfaction_prise_en_charge,
  conseils_aide,
  facilite_vie,
  souhait_renouvellement,
  consultation_medecin_apres,
  raison_consultation,
  commentaire
) AS (
  VALUES
    ('30000000-0000-4000-8000-000000000001', now() - interval '112 days', 'affiche_saison',     NULL,                           5, 5, 5, true,  false, NULL,                    NULL),
    ('30000000-0000-4000-8000-000000000002', now() - interval '104 days', 'affiche_saison',     NULL,                           5, 5, 5, true,  false, NULL,                    '[DEMO] Service rapide et efficace.'),
    ('30000000-0000-4000-8000-000000000003', now() - interval '96 days',  'affiche_saison',     NULL,                           4, 5, 5, true,  false, NULL,                    NULL),
    ('30000000-0000-4000-8000-000000000004', now() - interval '88 days',  'affiche_saison',     NULL,                           5, 4, 5, true,  false, NULL,                    NULL),
    ('30000000-0000-4000-8000-000000000005', now() - interval '80 days',  'affiche_saison',     NULL,                           5, 5, 5, true,  false, NULL,                    '[DEMO] Très pratique de ne pas attendre.'),
    ('30000000-0000-4000-8000-000000000006', now() - interval '72 days',  'affiche_saison',     NULL,                           4, 5, 4, true,  false, NULL,                    NULL),
    ('30000000-0000-4000-8000-000000000007', now() - interval '64 days',  'affiche_saison',     NULL,                           4, 4, 4, true,  false, NULL,                    NULL),
    ('30000000-0000-4000-8000-000000000008', now() - interval '56 days',  'affiche_saison',     NULL,                           5, 5, 5, true,  false, NULL,                    NULL),
    ('30000000-0000-4000-8000-000000000009', now() - interval '48 days',  'gene_symptomes',     NULL,                           3, 4, 3, true,  true,  'effets_indesirables',   NULL),
    ('30000000-0000-4000-8000-000000000010', now() - interval '40 days',  'gene_symptomes',     NULL,                           5, 5, 5, true,  false, NULL,                    '[DEMO] Conseils très utiles.'),
    ('30000000-0000-4000-8000-000000000011', now() - interval '32 days',  'gene_symptomes',     NULL,                           4, 4, 4, true,  false, NULL,                    NULL),
    ('30000000-0000-4000-8000-000000000012', now() - interval '24 days',  'pas_acces_medecin',  NULL,                           3, 3, 4, false, true,  'pas_amelioration',      NULL),
    ('30000000-0000-4000-8000-000000000013', now() - interval '18 days',  'pas_acces_medecin',  NULL,                           3, 3, 3, false, false, NULL,                    NULL),
    ('30000000-0000-4000-8000-000000000014', now() - interval '10 days',  'autres',             '[DEMO] Conseil d''un proche', 5, 5, 5, true,  false, NULL,                    NULL),
    ('30000000-0000-4000-8000-000000000015', now() - interval '4 days',   'autres',             '[DEMO] Réseaux sociaux',      4, 4, 5, true,  true,  'bilan_allergologique', NULL)
)
INSERT INTO public.satisfaction_patient (
  id,
  raison_venue,
  raison_venue_autre,
  satisfaction_prise_en_charge,
  conseils_aide,
  facilite_vie,
  souhait_renouvellement,
  consultation_medecin_apres,
  raison_consultation,
  commentaire,
  created_at,
  updated_at
)
SELECT
  id::uuid,
  raison_venue,
  raison_venue_autre,
  satisfaction_prise_en_charge,
  conseils_aide,
  facilite_vie,
  souhait_renouvellement,
  consultation_medecin_apres,
  raison_consultation,
  commentaire,
  created_at,
  created_at
FROM demo_satisfaction_patient
ON CONFLICT (id) DO NOTHING;

COMMIT;

# Scripts SQL demo PSO

## Avertissement

NE JAMAIS jouer ces scripts en production.

Ils sont prevus uniquement pour une base de demonstration temporaire avant une demo, puis un nettoyage complet juste apres.

## Ordre d'execution

1. Executer `seed-demo.sql` avant la demo.
2. Executer `cleanup-demo.sql` apres la demo.

## Comment executer

1. Ouvrir Supabase Dashboard.
2. Aller dans `SQL Editor`.
3. Coller le contenu du script voulu.
4. Executer le script.

## Comptes demo pharmaciens

Tous ces comptes recoivent le role `pharmacien_pso` via `seed-demo.sql`.

- `f5671ffe-f1b8-4e06-af75-1c739c3255e7` -> Pharmacie Robinson
- `dd1370e5-ce1f-437f-a554-96d186476489` -> Pharmacie des Pins
- `44eb4a19-defa-4fc4-8fd5-1cdf5b992170` -> Pharmacie Saint-Jean
- `6ffa63bd-bb79-4481-a001-d46ebdf80dd3` -> Pharmacie de Martignas
- `7f39f9b4-50f8-4dc6-acb8-7b0f199b1d7c` -> Pharmacie du Centre

## Marqueurs utilises

Les donnees demo sont marquees avec `[DEMO]` dans les champs suivants :

- `pharmacies.adresse`
- `pmo_entries.effet_indesirable`
- `pmo_entries.medecin_delegant_nom`
- `satisfaction_pharmacien.commentaire`
- `satisfaction_pharmacien.incidents_description`
- `satisfaction_patient.commentaire`
- `satisfaction_patient.raison_venue_autre`

En plus des marqueurs, les scripts utilisent des IDs fixes pour les lignes seedees afin de rendre le cleanup fiable.

## Rappel apres cleanup

Le script `cleanup-demo.sql` ne supprime pas les comptes `auth.users`.

Apres le cleanup SQL, supprimer manuellement les 5 comptes demo dans :

`Supabase Dashboard -> Authentication -> Users`

## Notes pratiques

- `seed-demo.sql` est idempotent sur les lignes seedees grace a des IDs fixes et aux `ON CONFLICT`.
- `cleanup-demo.sql` peut etre rejoue sans risque pour enlever les donnees demo restantes.

# Plan de développement — Module Formulaires CPTS Ouest Gironde

Devis N°60 — Module de formulaires et questionnaires intégré au site
Périmètre : 3 briques fonctionnelles (questionnaires de satisfaction, tableau de saisie PMO, dashboard CA)

## Principes

- Dev sur données réelles, pas de seed de test
- Les entrées de test créées pendant le dev sont supprimées avant passage en prod
- Ordre = dépendances techniques d'abord, features ensuite, polish à la fin
- Aucune feature hors périmètre du devis
- Commit + push + deploy preview Vercel à chaque fin de bloc
- Si blocage de plus de 30 minutes sur un point, contourner et y revenir plus tard

## Stack

- Next.js 16.2.2 (App Router, Server Actions, Turbopack)
- React 19.2
- TypeScript 5.9
- Tailwind 4 + Radix UI
- Supabase (auth + DB + RLS) via @supabase/ssr 0.10
- Resend 6.10 pour les emails transactionnels
- Zod 3.25 pour la validation
- Vercel pour l'hébergement

## Conventions Next 16 à respecter

- Utiliser les Server Actions pour toutes les mutations (insert, update, delete)
- `params` et `searchParams` sont asynchrones dans les pages : `const { id } = await params`
- Valider les payloads des Server Actions avec Zod avant toute interaction DB
- Revalider les pages concernées après mutation avec `revalidatePath`
- Pas de cache fetch implicite, opt-in explicite si nécessaire

---

## Phase 1 — Fondations

### 1.1 Modèle de données Supabase

- [x] Table `pharmacies`
  - id (uuid, pk)
  - nom (text)
  - finess (text, unique)
  - adresse (text, nullable)
  - created_at, updated_at
- [x] Table `profiles` (extension de la table existante)
  - Ajouter `rpps` (text, nullable, unique)
  - Ajouter `pharmacie_id` (uuid, fk pharmacies, nullable)
  - Conserver `role` temporairement pour compatibilité applicative
- [x] Table `user_roles`
  - id (uuid, pk)
  - user_id (uuid, fk auth.users)
  - role (text, check : adherent, membre_ca, collaborateur, pharmacien_pso, reporting_pso)
  - contrainte unique (user_id, role)
  - created_at
- [x] Helper SQL `public.has_role(role_name text)`
- [x] Table `pmo_entries`
  - id (uuid, pk)
  - user_id (uuid, fk auth.users)
  - pharmacie_id (uuid, fk pharmacies)
  - date_realisation (date)
  - medecin_delegant_nom (text)
  - medecin_delegant_rpps (text)
  - patient_sexe (enum: homme, femme)
  - patient_age (enum: `<15`, `15-20`, `21-30`, `31-40`, `41-50`, `>50`)
  - patient_medecin_traitant (bool)
  - orientation (enum: officine, medecin_delegant, medecin_traitant, urgences)
  - prescription_anti_h1 (bool)
  - prescription_collyre (bool)
  - prescription_antiallergique_nasal (bool)
  - prescription_corticoide_nasal (bool)
  - nb_produits_pmo (enum: 0, 1, 2, 3, 4, 5, >5)
  - dispensation_conseil (bool)
  - nb_produits_conseil (enum: 0, 1, 2, 3, 4, 5, >5)
  - effet_indesirable (text, nullable)
  - created_at, updated_at
- [x] Table `satisfaction_pharmacien`
  - id, user_id, pharmacie_id
  - satisfaction_globale (int 1-5)
  - facilite_mise_en_place (int 1-5)
  - benefice_pratique (int 1-5)
  - acces_soins (int 1-5)
  - appreciation_patients (int 1-5)
  - nb_effets_indesirables_graves (int)
  - autres_incidents (bool)
  - incidents_description (text, nullable)
  - commentaire (text, nullable)
  - created_at, updated_at
- [x] Table `satisfaction_patient`
  - id
  - pas de `pharmacie_id` (QR code patient global)
  - raison_venue (enum: affiche_saison, gene_symptomes, pas_acces_medecin, autres)
  - raison_venue_autre (text, nullable)
  - satisfaction_prise_en_charge (int 1-5)
  - conseils_aide (int 1-5)
  - facilite_vie (int 1-5)
  - souhait_renouvellement (bool)
  - consultation_medecin_apres (bool)
  - raison_consultation (enum: effets_indesirables, pas_amelioration, aggravation, bilan_allergologique, nullable)
  - commentaire (text, nullable)
  - created_at, updated_at
- [x] Table `tarifs_pso` (structure prête pour l'avenant rémunération)
  - id, cle (text), libelle (text), montant_euros (numeric), actif (bool)
  - created_at, updated_at

### 1.2 Row Level Security Supabase

- [x] `pmo_entries`
  - SELECT : user authentifié propriétaire OU rôle reporting_pso
  - INSERT : user authentifié avec rôle pharmacien_pso
  - UPDATE : user authentifié propriétaire de la ligne
  - DELETE : user authentifié propriétaire de la ligne
- [x] `satisfaction_pharmacien`
  - SELECT : propriétaire OU rôle reporting_pso
  - INSERT : rôle pharmacien_pso
  - UPDATE/DELETE : aucun
- [x] `satisfaction_patient`
  - INSERT : public (anon key)
  - SELECT : rôle reporting_pso uniquement
  - UPDATE/DELETE : aucun
- [x] `pharmacies`
  - SELECT : tous les authentifiés
  - INSERT : service role OU rôle `pharmacien_pso` pendant l'onboarding
  - UPDATE/DELETE : service role uniquement
- [x] `user_roles`
  - SELECT : user authentifié lui-même OU rôle reporting_pso
  - INSERT/UPDATE/DELETE : service role uniquement
- [x] `tarifs_pso`
  - SELECT : authentifiés
  - INSERT/UPDATE/DELETE : service role uniquement

### 1.3 Authentification pharmaciens

- [x] Annulée
  - Les pharmaciens PSO utilisent le même flow que les adhérents : invitation Supabase, setup password, puis connexion via `/login`
  - Il n'existe pas de page `/espace-pro/connexion-pharmacien`
  - La distinction adhérent / pharmacien PSO se fait uniquement via `user_roles`

### 1.4 Gestion des rôles et accès

- [x] Middleware Next.js qui vérifie le rôle utilisateur et protège les routes
- [x] Helper `hasRole(user, role)` côté serveur et côté client
- [x] Routes protégées :
  - `/espace-pro/pmo/*` → rôle `pharmacien_pso`
  - `/espace-pro/satisfaction` → rôle `pharmacien_pso`
  - `/espace-pro/dashboard` → rôle `reporting_pso`
  - `/satisfaction-patient/*` → public

### 1.5 Schémas Zod partagés

- [x] Schéma `pmoEntrySchema` pour valider une saisie PMO
- [x] Schéma `satisfactionPharmacienSchema`
- [x] Schéma `satisfactionPatientSchema`

### 1.6 Onboarding première connexion pharmacien

- [x] Page `/espace-pro/completer-profil` protégée par auth
- [x] Formulaire avec les champs :
  - RPPS (texte, 10 ou 11 chiffres, obligatoire)
  - Nom de la pharmacie (texte, obligatoire)
  - Numéro FINESS de la pharmacie (texte, 9 chiffres, obligatoire)
  - Adresse de la pharmacie (texte, optionnel)
- [x] Server Action `completePharmacienProfile` validée par Zod :
  - Vérifie que le user a le rôle `pharmacien_pso`
  - Vérifie que le RPPS n'est pas déjà utilisé par un autre profil
  - Cherche si une pharmacie avec ce FINESS existe déjà dans la table `pharmacies`
  - Si oui : rattache le pharmacien à cette pharmacie
  - Si non : crée la pharmacie, puis rattache le pharmacien
  - Met à jour `profiles` avec le RPPS et le `pharmacie_id`
  - Redirige vers `/espace-pro/pmo` après complétion
- [x] Vérification dans le layout ou middleware de l'espace pro :
  - Si le user a le rôle `pharmacien_pso` ET `profiles.rpps` est `NULL` → redirect vers `/espace-pro/completer-profil`
  - Si le profil est complet → accès normal
- [x] Schéma Zod `completeProfileSchema` dans `lib/validations/pso.ts`

---

## Phase 2 — Tableau de saisie PMO

### 2.1 Composants réutilisables

- [x] Composant `SelectField` basé sur Radix
- [x] Composant `RadioYesNo`
- [x] ~~Composant `DatePicker` compatible Tailwind 4~~ → utilisation de l'input HTML natif type=date, validé en démo
- [x] Composant `EchelleCinq` (échelle 1 à 5 avec légende)
- [x] Composant `FormSection` pour les en-têtes de sections

### 2.2 Saisie d'une ligne PMO

- [x] Route `/espace-pro/pmo/nouveau`
- [x] Récupération des infos du profil connecté pour l'en-tête pré-rempli
  - Nom CPTS, nom de l'officine, FINESS officine, nom et prénom du pharmacien, RPPS
- [x] Formulaire avec les champs validés
- [x] Champ "Réorientation médecin délégant a posteriori" en radio oui/non après la prise en charge
- [x] Server Action `createPmoEntry` validée par Zod
- [x] Insertion dans `pmo_entries` avec user_id et pharmacie_id
- [x] `revalidatePath('/espace-pro/pmo')` après insertion
- [x] Redirection vers la liste avec message de succès
- [x] Bouton `Enregistrer et nouvelle entrée` sur `/espace-pro/pmo/nouveau`
- [x] Réinitialisation du formulaire après sauvegarde avec toast discret en bas à droite
- [x] Avertissement de doublon souple avant création si la nouvelle entrée est identique à la précédente
- [x] Gestion des erreurs avec messages clairs

### 2.3 Liste et gestion des saisies

- [x] Route `/espace-pro/pmo` (server component)
- [x] Tableau des lignes du pharmacien connecté, tri par date décroissante
- [x] Colonnes affichées : date, sexe, âge, orientation, nb PMO, actions
- [x] Pagination (20 lignes par page, via `searchParams` async)
- [x] Boutons "Nouvelle entrée" en haut et sous le tableau
- [x] Action "Voir" → page détail `/espace-pro/pmo/[id]`
- [x] Action "Modifier" → page édition `/espace-pro/pmo/[id]/modifier`
- [x] Action "Supprimer" via Server Action avec modale de confirmation
- [x] Compteur "X lignes saisies"

### 2.4 Modification d'une ligne PMO

- [x] Route `/espace-pro/pmo/[id]/modifier` avec `await params`
- [x] Formulaire pré-rempli avec les valeurs actuelles
- [x] Server Action `updatePmoEntry` validée par Zod
- [x] Vérification RLS côté serveur (le user ne peut modifier que ses propres lignes)
- [x] `revalidatePath` après update
- [x] Redirection vers la liste

---

## Phase 3 — Questionnaires de satisfaction

### 3.1 Questionnaire pharmacien

- [x] Route `/espace-pro/satisfaction` protégée rôle `pharmacien_pso`
- [x] Pré-remplissage de l'identité depuis le profil (nom pharmacie, nom titulaire, RPPS)
- [x] 9 questions selon les libellés validés
  - Q1 satisfaction globale (échelle 1-5)
  - Q2 facilité mise en place (échelle 1-5)
  - Q3 bénéfice pratique (échelle 1-5)
  - Q4 accès aux soins (échelle 1-5)
  - Q5 appréciation patients (échelle 1-5)
  - Q6 nombre d'effets indésirables graves (nombre entier ≥ 0)
  - Q7 autres incidents (oui/non)
  - Q8 description incidents (conditionnel si Q7 = oui)
  - Q9 commentaire libre
- [x] Légende "1 = pas du tout, 5 = tout à fait" visible
- [x] Server Action `submitSatisfactionPharmacien` validée par Zod
- [x] Insertion dans `satisfaction_pharmacien`
- [x] Page de remerciement après soumission
- [x] Limitation à une réponse par pharmacien et par année de référence
- [x] Questionnaire accessible toute l'année avec une seule réponse par année
- [x] Card de rappel affichée uniquement en septembre et octobre si aucune réponse n'existe pour l'année en cours

### 3.2 Questionnaire patient public

- [x] Route publique `/satisfaction-patient`
- [x] Questionnaire totalement global, sans paramètre dynamique ni récupération de pharmacie
- [x] 9 questions selon les libellés validés
  - Q1 raison de venue (4 choix)
  - Q2 préciser si autres (conditionnel si Q1 = autres)
  - Q3 satisfaction prise en charge (échelle 1-5)
  - Q4 conseils aide (échelle 1-5)
  - Q5 facilité vie (échelle 1-5)
  - Q6 souhait renouvellement (oui/non)
  - Q7 consultation médecin après (oui/non)
  - Q8 raison consultation (conditionnel si Q7 = oui, 4 choix)
  - Q9 commentaire libre
- [x] Anonymat total, pas de stockage d'IP ni d'user agent
- [x] Server Action `submitSatisfactionPatient` validée par Zod
- [x] Insertion via l'anon key Supabase
- [x] Page de remerciement après soumission
- [x] Design mobile-first (les patients scannent au comptoir)

## Phase 4 — Dashboard CA

### 4.1 Structure et protection

- [x] Route `/espace-pro/dashboard` protégée rôle `reporting_pso`
- [x] Layout avec sections : en-tête + onglets, filtres, indicateurs clés, graphiques, export
- [x] Onglets `Activité PMO` et `Satisfaction`
- [ ] Vérification d'accès pour les 3 comptes (Corinne, Christine, Clément)

### 4.2 Filtres

- [x] Sélecteur d'année (2025, 2026, ...)
- [x] Sélecteur de plage de mois (début, fin)
- [x] Sélecteur de pharmacie (toutes par défaut, multi-sélection possible)
- [x] Filtres pilotés via `searchParams` async de Next 16
- [x] Les changements de filtres mettent à jour l'URL et rechargent la page
- [x] Layout compact sur une ligne en desktop
- [x] Les données de satisfaction restent globales et ne dépendent pas des filtres PMO

### 4.3 Fonction d'agrégation serveur

- [x] Fonction serveur `getDashboardStats(filters)` côté server component
- [x] Récupération des lignes `pmo_entries` selon les filtres
- [x] Calculs retournés :
  - `total_patients` : count
  - `nb_pharmacies_actives` : count distinct de pharmacie_id
  - `moyenne_patients_par_pharmacie` : total / nb_pharmacies_actives
  - `repartition_sexe` : { femmes: {n, pct}, hommes: {n, pct} }
  - `repartition_age` : { '<15': n, '15-20': n, '21-30': n, '31-40': n, '41-50': n, '>50': n }
  - `patients_sans_medecin_traitant` : { n, pct }
  - `reorientations` : { urgences: n, medecin_delegant: n, medecin_traitant: n }
  - `prescriptions` : { anti_h1_pct, collyre_pct, antiallergique_nasal_pct, corticoide_nasal_pct }
  - `moyenne_produits_pmo` : numeric
  - `taux_dispensation_conseil` : numeric
  - `moyenne_produits_conseil` : numeric
  - `total_produits_par_patient` : numeric

### 4.4 Affichage des indicateurs

- [x] Cards pour les indicateurs clés (total patients, nb pharmacies, moyennes)
- [x] Formatage des pourcentages à 1 décimale
- [x] État "aucune donnée" si filtres ne retournent rien

### 4.5 Graphiques

- [x] Installer `recharts`
- [x] Graphique barres verticales : répartition par tranche d'âge
- [x] Camembert : répartition par sexe
- [x] Bloc compact "Prescription et délivrance" avec pourcentages exacts à la place du graphique horizontal
- [x] Responsive et cohérent avec la charte du site

### 4.6 Export CSV

- [x] Server Action ou route handler qui génère le CSV
- [x] Bouton "Exporter en CSV"
- [x] Génération du CSV des données agrégées selon les filtres actifs
- [x] Nommage : `export-pso-rhinite-YYYY-MM-DD.csv`
- [x] Contenu : les indicateurs + détail par pharmacie
- [x] Encodage UTF-8 avec BOM pour compatibilité Excel

### 4.7 Onglet Satisfaction

- [x] Agrégation globale des réponses `satisfaction_pharmacien`
- [x] Agrégation globale des réponses `satisfaction_patient`
- [x] Section "Retours pharmaciens" : volume, moyennes Q1 à Q5, total effets indésirables graves, incidents, commentaires
- [x] Section "Retours patients" : volume, répartitions, moyennes Q3 à Q5, taux de renouvellement, taux de consultation après, commentaires
- [x] Filtre par année sur les retours pharmaciens avec sélection de l'année de référence

### 4.8 Détail par pharmacie et exports enrichis

- [x] Section "Détail par pharmacie" dans le dashboard (onglet Activité PMO) : tableau avec FINESS, pharmacien titulaire, RPPS et nombre de saisies
- [x] Page d'audit `/espace-pro/dashboard/pharmacie/[pharmacie_id]` accessible aux `reporting_pso`, lecture seule, paginée, avec toutes les colonnes des saisies PMO
- [x] Export CSV agrégé enrichi avec FINESS, pharmacien titulaire et RPPS par pharmacie
- [x] Nouvel export CSV détaillé global : 1 ligne par saisie PMO avec toutes les colonnes (pharmacie, FINESS, pharmacien, RPPS pharmacien, date, données patient, prescriptions, médecin délégant, RPPS médecin délégant)
- [x] Export CSV ciblé sur la page d'audit par officine
- [x] Champ "Réorientation médecin délégant a posteriori" intégré au dashboard, à l'audit pharmacie et aux exports CSV
- [x] Bouton "Année complète" dans la barre de filtres pour basculer rapidement sur Janvier-Décembre (utile pour la facturation annuelle ARS)

---

## Phase 5 — Intégration et polish

### 5.1 Navigation et intégration

- [x] Ajouter les liens vers les nouveaux modules depuis l'espace pro existant (card "Dashboard PSO" sur /professionnels pour reporting_pso)
- [ ] Ajouter une card "Saisie PMO" sur /professionnels visible uniquement pour les pharmacien_pso (TODO polish)
- [ ] Menu utilisateur adapté selon le rôle
- [ ] Breadcrumbs sur les pages profondes
- [ ] Cohérence visuelle avec le design existant

### 5.2 États et retours utilisateur

- [ ] Loading states via `loading.tsx` sur les pages concernées
- [x] Messages de succès après actions (toast discret en bas à droite, partout)
- [x] Messages d'erreur explicites renvoyés par les Server Actions
- [x] États vides (aucune saisie, aucune donnée dashboard)

### 5.3 Mobile

- [x] Questionnaire patient totalement mobile-first
- [ ] Saisie PMO utilisable sur tablette (non testé)
- [ ] Dashboard lisible sur mobile (graphiques Recharts à corriger, problème connu)

### 5.4 RGPD

- [ ] Bandeau d'information RGPD sur le formulaire patient public (à vérifier)
- [x] Mention sur les pages de saisie PMO rappelant l'absence de données identifiantes (bandeau bouclier vert)
- [ ] Lien vers la politique de confidentialité du site

---

## Phase 6 — Données réelles et mise en production

### 6.1 Import des données réelles

- [ ] Création manuelle initiale des pharmacies participantes si nécessaire
- [ ] Invitation des pharmaciens par email avec attribution du rôle `pharmacien_pso`
- [ ] Création des 3 comptes reporting_pso (Corinne, Christine, Clément)
- [ ] Envoi d'un email d'onboarding aux pharmaciens avec instructions de première connexion

### 6.2 Tests manuels en conditions réelles

- [ ] Parcours pharmacien complet : invitation → setup password → connexion `/login` → complétion profil → saisie PMO → modification → suppression → questionnaire satisfaction
- [ ] Parcours patient complet : scan QR code simulé → questionnaire → soumission → remerciement
- [ ] Parcours reporting_pso : connexion → dashboard → filtres → export CSV
- [ ] Vérification RLS : pharmacien A ne voit pas les lignes de pharmacien B
- [ ] Vérification RLS : pharmacien A ne peut pas accéder au dashboard
- [ ] Vérification RLS : visiteur anonyme ne peut pas lire `satisfaction_patient`

### 6.3 Nettoyage avant production

- [ ] Suppression des lignes PMO créées pendant les tests
- [ ] Suppression des réponses de satisfaction créées pendant les tests
- [ ] Vérification que seules les données réelles validées restent en base

### 6.4 Déploiement production

- [ ] Merge de la branche `feature/formulaires` sur `main`
- [ ] Vérification des variables d'environnement Vercel (Supabase, Resend)
- [ ] Déploiement Vercel prod
- [ ] Test rapide post-déploiement sur le domaine réel
- [ ] Vérification des DNS Resend si besoin

### 6.5 Documentation

- [ ] Guide utilisateur pharmacien (1 page) : comment se connecter, comment saisir, comment remplir le questionnaire
- [ ] Guide utilisateur CA (1 page) : dashboard, filtres, export
- [ ] Mise à disposition des guides dans l'espace pro

---

## Multi-rôles et profils combinés

Le système de rôles via `user_roles` est nativement multi-rôles. Un même utilisateur peut cumuler plusieurs rôles, ce qui couvre les cas métier suivants :

- Pharmacien adhérent : `adherent` + `pharmacien_pso` → accès à l'espace adhérent classique ET au tableau de saisie PMO
- Membre CA reporting : `membre_ca` + `reporting_pso` → accès à l'espace adhérent ET au dashboard PSO de reporting
- Pharmacien titulaire d'une CPTS : peut cumuler les 4 rôles selon les besoins

Aucun changement DB nécessaire, le helper `has_role()` et la fonction `readUserAccessContext` gèrent déjà ces combinaisons. Le seul travail restant est l'affichage conditionnel des cards sur la page `/professionnels` selon les rôles présents.

---

## Hors périmètre du devis (à proposer en avenant)

- **Calcul automatique de l'indemnisation par pharmacie** : génération de fiches de facturation par officine, multiplication des saisies par la grille tarifaire ARS, totaux mensuels et annuels. Nécessite la grille tarifaire ARS officielle. Estimation 2-3h.
- Export annuel avec rémunération (nécessite grille tarifaire ARS/CPAM)
- Tableau croisé PMO délivrés × Conseil délivrés
- Export PDF formaté
- Envoi automatique de rapports par email
- Système d'alertes sur seuils
- Back-office permettant à la CPTS de créer de nouveaux formulaires en autonomie
- Questions conditionnelles avancées au-delà des 4 déjà prévues
- Support de protocoles multiples avec gestion dynamique des colonnes
- Sauvegarde en brouillon d'un formulaire en cours

---

## Dépendances CPTS (à obtenir avant démarrage)

- [x] Liste des pharmaciens participants : reçue le 13/04 (20 pharmaciens, nom/prénom/email uniquement, RPPS et FINESS seront saisis par les pharmaciens lors de l'onboarding)
  - Note : doublons à clarifier : Sandra Gainza et Crysta Selva partagent le même email pro. Valérie Barrand a 2 emails.
- [ ] Validation écrite des libellés des 2 questionnaires
- [ ] Confirmation RGPD par retour email
- [x] QR code global unique validé
- [ ] Confirmation accès titulaire uniquement ou adjoints inclus
- [ ] Liste des pharmacies volontaires pour la phase de test
- [ ] Date cible de mise en ligne

## Points de vigilance

- Le point le plus sensible est la première connexion des pharmaciens : invitation, définition du mot de passe, puis complétion du profil
- Prévoir un plan B "inscription libre avec modération admin" si les pharmaciens n'ont pas été pré-créés à temps
- Les RLS Supabase doivent être testées rigoureusement avant toute mise en prod
- Les données saisies dans `pmo_entries` ne doivent jamais contenir de champ identifiant patient
- Les entrées de test créées pendant le dev doivent toutes être supprimées avant la bascule en prod
- Les `params` et `searchParams` sont asynchrones en Next 16, ne pas oublier le `await`

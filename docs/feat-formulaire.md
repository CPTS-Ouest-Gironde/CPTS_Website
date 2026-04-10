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
  - `/espace-pro/qr-codes` → rôle `reporting_pso`
  - `/satisfaction-patient/*` → public

### 1.5 Schémas Zod partagés

- [x] Schéma `pmoEntrySchema` pour valider une saisie PMO
- [x] Schéma `satisfactionPharmacienSchema`
- [x] Schéma `satisfactionPatientSchema`

### 1.6 Onboarding première connexion pharmacien

- [ ] Page `/espace-pro/completer-profil` protégée par auth
- [ ] Formulaire avec les champs :
  - RPPS (texte, 10 ou 11 chiffres, obligatoire)
  - Nom de la pharmacie (texte, obligatoire)
  - Numéro FINESS de la pharmacie (texte, 9 chiffres, obligatoire)
  - Adresse de la pharmacie (texte, optionnel)
- [ ] Server Action `completePharmacienProfile` validée par Zod :
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

- [ ] Composant `SelectField` basé sur Radix
- [ ] Composant `RadioYesNo`
- [ ] Composant `DatePicker` compatible Tailwind 4
- [ ] Composant `EchelleCinq` (échelle 1 à 5 avec légende)
- [ ] Composant `FormSection` pour les en-têtes de sections

### 2.2 Saisie d'une ligne PMO

- [ ] Route `/espace-pro/pmo/nouveau`
- [ ] Récupération des infos du profil connecté pour l'en-tête pré-rempli
  - Nom CPTS, FINESS CPTS, nom et prénom du délégué, RPPS du délégué
- [ ] Formulaire avec les 15 champs
- [ ] Server Action `createPmoEntry` validée par Zod
- [ ] Insertion dans `pmo_entries` avec user_id et pharmacie_id
- [ ] `revalidatePath('/espace-pro/pmo')` après insertion
- [ ] Redirection vers la liste avec message de succès
- [ ] Gestion des erreurs avec messages clairs

### 2.3 Liste et gestion des saisies

- [ ] Route `/espace-pro/pmo` (server component)
- [ ] Tableau des lignes du pharmacien connecté, tri par date décroissante
- [ ] Colonnes affichées : date, sexe, âge, orientation, nb PMO, actions
- [ ] Pagination (20 lignes par page, via `searchParams` async)
- [ ] Bouton "Nouvelle saisie"
- [ ] Action "Voir" → page détail `/espace-pro/pmo/[id]`
- [ ] Action "Modifier" → page édition `/espace-pro/pmo/[id]/modifier`
- [ ] Action "Supprimer" via Server Action avec modale de confirmation
- [ ] Compteur "X lignes saisies"

### 2.4 Modification d'une ligne PMO

- [ ] Route `/espace-pro/pmo/[id]/modifier` avec `await params`
- [ ] Formulaire pré-rempli avec les valeurs actuelles
- [ ] Server Action `updatePmoEntry` validée par Zod
- [ ] Vérification RLS côté serveur (le user ne peut modifier que ses propres lignes)
- [ ] `revalidatePath` après update
- [ ] Redirection vers la liste

---

## Phase 3 — Questionnaires de satisfaction

### 3.1 Questionnaire pharmacien

- [ ] Route `/espace-pro/satisfaction` protégée rôle `pharmacien_pso`
- [ ] Pré-remplissage de l'identité depuis le profil (nom pharmacie, nom titulaire, RPPS)
- [ ] 9 questions selon les libellés validés
  - Q1 satisfaction globale (échelle 1-5)
  - Q2 facilité mise en place (échelle 1-5)
  - Q3 bénéfice pratique (échelle 1-5)
  - Q4 accès aux soins (échelle 1-5)
  - Q5 appréciation patients (échelle 1-5)
  - Q6 nombre d'effets indésirables graves (nombre entier ≥ 0)
  - Q7 autres incidents (oui/non)
  - Q8 description incidents (conditionnel si Q7 = oui)
  - Q9 commentaire libre
- [ ] Légende "1 = pas du tout, 5 = tout à fait" visible
- [ ] Server Action `submitSatisfactionPharmacien` validée par Zod
- [ ] Insertion dans `satisfaction_pharmacien`
- [ ] Page de remerciement après soumission

### 3.2 Questionnaire patient public

- [ ] Route publique `/satisfaction-patient`
- [ ] Questionnaire totalement global, sans paramètre dynamique ni récupération de pharmacie
- [ ] 9 questions selon les libellés validés
  - Q1 raison de venue (4 choix)
  - Q2 préciser si autres (conditionnel si Q1 = autres)
  - Q3 satisfaction prise en charge (échelle 1-5)
  - Q4 conseils aide (échelle 1-5)
  - Q5 facilité vie (échelle 1-5)
  - Q6 souhait renouvellement (oui/non)
  - Q7 consultation médecin après (oui/non)
  - Q8 raison consultation (conditionnel si Q7 = oui, 4 choix)
  - Q9 commentaire libre
- [ ] Anonymat total, pas de stockage d'IP ni d'user agent
- [ ] Server Action `submitSatisfactionPatient` validée par Zod
- [ ] Insertion via l'anon key Supabase
- [ ] Page de remerciement après soumission
- [ ] Design mobile-first (les patients scannent au comptoir)

### 3.3 Génération des QR codes

- [ ] Installer la librairie `qrcode`
- [ ] Route admin `/espace-pro/qr-codes` protégée rôle `membre_ca`
- [ ] Génération d'un QR code global unique pointant vers `https://cpts-ouest-gironde.fr/satisfaction-patient`
- [ ] Un bouton "Télécharger en PNG"
- [ ] Un bouton "Télécharger la fiche A4 imprimable" (HTML imprimable avec QR code + instructions)

---

## Phase 4 — Dashboard CA

### 4.1 Structure et protection

- [ ] Route `/espace-pro/dashboard` protégée rôle `membre_ca`
- [ ] Layout avec sections : en-tête + filtres, indicateurs clés, graphiques, export
- [ ] Vérification d'accès pour les 3 comptes (Corinne, Christine, Clément)

### 4.2 Filtres

- [ ] Sélecteur d'année (2025, 2026, ...)
- [ ] Sélecteur de plage de mois (début, fin)
- [ ] Sélecteur de pharmacie (toutes par défaut, multi-sélection possible)
- [ ] Filtres pilotés via `searchParams` async de Next 16
- [ ] Les changements de filtres mettent à jour l'URL et rechargent la page

### 4.3 Fonction d'agrégation serveur

- [ ] Fonction serveur `getDashboardStats(filters)` côté server component
- [ ] Récupération des lignes `pmo_entries` selon les filtres
- [ ] Calculs retournés :
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

- [ ] Cards pour les indicateurs clés (total patients, nb pharmacies, moyennes)
- [ ] Formatage des pourcentages à 1 décimale
- [ ] État "aucune donnée" si filtres ne retournent rien

### 4.5 Graphiques

- [ ] Installer `recharts`
- [ ] Graphique barres verticales : répartition par tranche d'âge
- [ ] Camembert : répartition par sexe
- [ ] Graphique barres horizontales : taux de prescription par molécule
- [ ] Responsive et cohérent avec la charte du site

### 4.6 Export CSV

- [ ] Server Action ou route handler qui génère le CSV
- [ ] Bouton "Exporter en CSV"
- [ ] Génération du CSV des données agrégées selon les filtres actifs
- [ ] Nommage : `export-pso-rhinite-YYYY-MM-DD.csv`
- [ ] Contenu : les indicateurs + détail par pharmacie
- [ ] Encodage UTF-8 avec BOM pour compatibilité Excel

---

## Phase 5 — Intégration et polish

### 5.1 Navigation et intégration

- [ ] Ajouter les liens vers les nouveaux modules depuis l'espace pro existant
- [ ] Menu utilisateur adapté selon le rôle
- [ ] Breadcrumbs sur les pages profondes
- [ ] Cohérence visuelle avec le design existant (couleurs, typo, espacements)

### 5.2 États et retours utilisateur

- [ ] Loading states via `loading.tsx` sur les pages concernées
- [ ] Messages de succès après actions (saisie, modification, suppression)
- [ ] Messages d'erreur explicites renvoyés par les Server Actions
- [ ] États vides (aucune saisie, aucune donnée dashboard)

### 5.3 Mobile

- [ ] Questionnaire patient totalement mobile-first
- [ ] Saisie PMO utilisable sur tablette
- [ ] Dashboard lisible sur mobile (graphiques adaptatifs)

### 5.4 RGPD

- [ ] Bandeau d'information RGPD sur le formulaire patient public
- [ ] Mention sur les pages de saisie PMO rappelant l'absence de données identifiantes
- [ ] Lien vers la politique de confidentialité du site

---

## Phase 6 — Données réelles et mise en production

### 6.1 Import des données réelles

- [ ] Création manuelle initiale des pharmacies participantes si nécessaire
- [ ] Invitation des pharmaciens par email avec attribution du rôle `pharmacien_pso`
- [ ] Création des 3 comptes membre_ca (Corinne, Christine, Clément)
- [ ] Envoi d'un email d'onboarding aux pharmaciens avec instructions de première connexion

### 6.2 Tests manuels en conditions réelles

- [ ] Parcours pharmacien complet : invitation → setup password → connexion `/login` → complétion profil → saisie PMO → modification → suppression → questionnaire satisfaction
- [ ] Parcours patient complet : scan QR code simulé → questionnaire → soumission → remerciement
- [ ] Parcours membre_ca : connexion → dashboard → filtres → export CSV → génération QR codes
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
- [ ] Guide utilisateur CA (1 page) : dashboard, filtres, export, QR codes
- [ ] Mise à disposition des guides dans l'espace pro

---

## Hors périmètre du devis (à proposer en avenant)

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

- [ ] Liste des pharmaciens participants : nom, prénom, RPPS, email, nom officine, FINESS
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

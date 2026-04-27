# Suivi Feature `feat/pro-auth`

## Dernière mise à jour
- 07/04/2026

## Objectif
Mettre en place l'authentification Supabase pour sécuriser l'espace professionnel, sans impacter les routes publiques du site.

## Implémenté (actuel)
- Intégration Supabase avec `@supabase/ssr` (App Router Next.js).
- Clients Supabase créés:
  - `lib/supabase/client.ts`
  - `lib/supabase/server.ts`
  - `lib/supabase/middleware.ts`
- Middleware d'auth actif:
  - routes protégées: `/professionnels`, `/professionnels/supports`, `/professionnels/actions-outils`, `/professionnels/formations`
  - exception publique: `/professionnels/adhesion`
  - redirection vers `/login?next=...` si non connecté
  - redirection `/login` -> `/professionnels` si déjà connecté
  - refresh session/cookies géré côté middleware

- Pages auth en place:
  - `/login` (email + mot de passe, toggle visibilité mdp, mot de passe oublié)
  - `/setup-password` (activation via invitation)
  - `/reset-password` (réinitialisation)

- Header/Nav adaptés:
  - bouton top-right: `Espace Pro` si non connecté, `Se déconnecter` si connecté
  - style logout rouge léger/translucide (top + dropdown)
  - dropdown `Professionnels`:
    - non connecté: `Adhésion` + liens pro (protégés via modal)
    - connecté: `Tableau de bord pro` + liens pro + `Se déconnecter`
    - `Adhésion` masqué si connecté
  - modal d'accès sur clic d'une ressource pro sans session

- Modal `Nous Rejoindre`:
  - bouton `Adhérer` affiché uniquement si non connecté
  - caché si utilisateur pro connecté

- Hub `/professionnels` (protégé):
  - page orientée dashboard simple
  - message d'accueil personnalisé avec `first_name` + `last_name`
  - raccourcis vers `/professionnels/supports`, `/professionnels/actions-outils`, `/professionnels/formations`
  - pas d'email affiché, pas de bouton logout dans la page (logout géré dans le header)

- Layouts corrigés:
  - `setup-password`, `reset-password`, `professionnels` en `min-h-screen flex flex-col` avec footer stable en bas

## Profil utilisateur (name/surname)
- Lecture du profil dans `public.profiles` pour personnaliser l'accueil.
- Script SQL prêt pour Supabase: `docs/supabase-profiles-setup.sql`
  - création table `profiles`
  - RLS
  - trigger auto-création depuis `auth.users`
  - backfill utilisateurs existants

## Fichiers principaux touchés
- `middleware.ts`
- `lib/supabase/config.ts`
- `lib/supabase/client.ts`
- `lib/supabase/server.ts`
- `lib/supabase/middleware.ts`
- `lib/supabase/auth-errors.ts`
- `lib/supabase/password-policy.ts`
- `app/login/page.tsx`
- `app/setup-password/page.tsx`
- `app/reset-password/page.tsx`
- `app/professionnels/page.tsx`
- `components/auth/password-update-form.tsx`
- `components/header.tsx`
- `components/social-modal.tsx`
- `docs/supabase-profiles-setup.sql`

## Reste à faire (après validation UI/UX)
- Injecter les clés Supabase finales dans `.env.local`.
- Exécuter le script SQL `docs/supabase-profiles-setup.sql` dans Supabase.
- Vérifier la config Supabase Dashboard:
  - `Site URL`
  - `Redirect URLs` (`/setup-password`, `/reset-password`, env local/prod)
- QA complète des flows:
  - invitation -> setup password
  - login/logout
  - forgot password -> reset password
  - redirections middleware (routes protégées)
- Itération 2 (quand validé): enrichir le dashboard avec les contenus métier/news.

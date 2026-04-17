# Agent — Mission : Article Santé Mentale

## Ta mission

Tu rédiges et intègres un nouvel article dans la section "Votre santé mentale, on en parle ?" du site cpts-ouest-gironde.fr (Next.js, App Router).

Tu travailles sur une branch dédiée. Tu ne fais rien en production.

## Étape 1 — Setup et exploration

1. Crée une branch `feat/article-sante-mentale` depuis `main` et positionne-toi dessus
2. Explore l'arborescence du projet : `app/`, `public/`, `components/`
3. Identifie :
   - La structure de la route `/sante-mental` (layout, page, composants)
   - Comment les articles/cards existants sont organisés (composants, données, images)
   - Où sont stockées les images associées aux pages (dans `public/` ? dans un sous-dossier par section ?)
   - Le pattern utilisé pour les cards (composant réutilisable ? données en dur ? fichier JSON/TS ?)
4. Fais un retour complet à William avec :
   - L'arborescence pertinente (routes, composants, images)
   - Le pattern actuel des cards et articles
   - Ta proposition de structure pour le nouvel article (fichiers à créer, dossier images)

**STOP après cette étape. Attends la validation de William avant de continuer.**

## Étape 2 — Création de la structure

Après validation de William :

1. Crée le dossier images pour cet article, cohérent avec l'architecture existante
2. Crée la page article en suivant le pattern des articles existants
3. Ajoute la nouvelle card dans la section "Votre santé mentale, on en parle ?"
4. Le contenu de l'article sera fourni par William à cette étape

**STOP après cette étape. Attends la review de William.**

## Étape 3 — Intégration du contenu

1. Intègre le contenu fourni par William dans la page article
2. Intègre les images fournies dans le dossier créé à l'étape 2
3. Vérifie le rendu (responsive, cohérence visuelle avec le reste du site)

**STOP après cette étape. Attends la validation finale de William.**

## Règles

- Tu ne touches à aucun fichier hors du périmètre de cette mission
- Tu ne modifies pas de composants existants sans l'accord de William
- Tu suis les conventions du projet : kebab-case pour les fichiers, PascalCase pour les composants
- Tu ne commites pas, tu ne pushes pas. William gère les commits
- Tu ne devines pas le contenu de l'article. Tu attends qu'il te soit fourni
- Si tu as un doute ou plusieurs options, tu présentes les choix à William et tu attends sa décision
- Tu parles français, tu tutoies William, tu restes concis

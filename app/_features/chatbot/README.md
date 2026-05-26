# Chatbot rule-based CPTS

## Vue d'ensemble

Le chatbot est une feature isolée dans `app/_features/chatbot` et injectée globalement via `app/layout.tsx`.

- `chatbot.config.ts` contient les ressources, mots-clés, nodes, quick replies et règles.
- `engine.ts` orchestre la conversation : état initial, saisie libre, quick replies, restart et fallback.
- `matcher.ts` gère le matching déterministe par mots-clés.
- `fuzzySearch.ts` ajoute Fuse.js en deuxième couche quand le matcher ne trouve rien.
- `ChatbotWidget.tsx`, `ChatWindow.tsx`, `MessageBubble.tsx` et `QuickReplies.tsx` portent l'UI.
- `ChatbotContext.tsx` et `ChatbotErrorContext.tsx` exposent le contexte de page.
- `useChatbotAnalytics.ts` centralise les événements GA4 derrière le consentement cookies.

## Extension du chatbot

Pour ajouter une ressource :

1. Ajouter une entrée dans `resources` de `chatbot.config.ts`.
2. Utiliser un `id` stable en kebab-case.
3. Choisir le type adapté : `internal` ou `external` avec `href`, `email` ou `phone` avec `value`.
4. Renseigner `title` et si possible `description`, utilisée par Fuse.js.

Pour ajouter un keyword :

1. Ajouter une entrée dans `keywordIndex`.
2. Renseigner `keyword`, `resourceId` et éventuellement `scoreBoost`.
3. Ajouter les variantes sans accents quand elles sont fréquentes.
4. Vérifier que `resourceId` pointe vers une ressource existante.

Pour ajouter un node :

1. Ajouter une entrée dans `nodes`.
2. Renseigner `id` et `message`.
3. Ajouter `quickReplies` pour guider l'utilisateur ou `actions` avec `suggest_resources`.
4. Relier le node depuis un autre node via `nextNodeId`.
5. Ajouter une quick reply de retour quand le node est un sous-menu.

## Recherche

L'ordre de résolution est strict :

1. Quick reply textuelle du node courant.
2. Intent conversationnel (`bonjour`, `merci`, aide générale, contact).
3. Matcher déterministe par mots-clés (`exact`, `contains`, Levenshtein distance 1).
4. Fuse.js sur `title`, `description` et `allKeywords`, threshold `0.4`.
5. Node `fallback`.

Exemples :

- `médecin traitant` matche directement `medecin-traitant`.
- `mammographie` matche `sf-octobre-rose-2025` via `keywordIndex`.
- `psicothérapie` peut remonter `sm-pro-approches` via Fuse si le matcher déterministe échoue.
- Une phrase sans rapport affiche le hub `fallback`.

## Analytics

Les événements GA4 passent par `useChatbotAnalytics.ts`. Ils sont no-op si le consentement n'est pas `accepted` dans `localStorage.cookie-consent`, si `window.gtag` n'existe pas, ou en SSR.

- `chatbot_opened` : `context`.
- `chatbot_closed` : `session_duration_seconds`, `messages_count`.
- `chatbot_quick_reply` : `quick_reply_id`, `quick_reply_label`, `source_node_id`.
- `chatbot_resource_clicked` : `resource_id`, `resource_type`.
- `chatbot_fallback` : `user_input_length`, sans contenu utilisateur.
- `chatbot_restart` : aucun paramètre.

Tous les events sont fire-and-forget et ne bloquent jamais l'UX.

## Contexte d'erreur

Le provider `ChatbotErrorContext` permet de démarrer le chatbot sur le node `start-error` depuis les pages d'erreur. Le node propose des sorties courtes : médecin traitant, annuaire, accueil, contact CPTS.

Le contexte courant est lu via `useChatbotContext()` dans `ChatbotWidget`.

## Accessibilité

- Le panneau utilise `role="dialog"` et `aria-labelledby`.
- Le focus est contenu dans le panneau pendant la navigation clavier.
- La touche `Escape` ferme le chatbot.
- Le focus revient sur le FAB après fermeture.
- `useReducedMotion` désactive le scroll smooth si l'utilisateur préfère réduire les animations.
- Les messages sont dans une zone `aria-live="polite"`.

## Vie privée

- L'historique reste en `sessionStorage` sous `cpts_chatbot_history`.
- Aucun contenu utilisateur n'est envoyé au serveur par le moteur.
- Le tracking GA4 ne s'exécute qu'après consentement cookies.
- L'événement fallback ne transmet que la longueur de la saisie, jamais le texte.
- La modale `PrivacyModal` explique le fonctionnement à l'utilisateur.

## Tests

Commande :

```bash
npm run test:chatbot
```

La suite couvre `normalize.test.ts`, `matcher.test.ts` et `engine.test.ts`.

Elle vérifie notamment :

- Normalisation accents/ponctuation.
- Matching exact, contains et fuzzy léger.
- Sous-flows quick replies.
- Fallback guidé.
- Recherche Fuse en deuxième couche.
- Consentement analytics granted/denied.

Nombre de tests attendu après ce chantier : 31.

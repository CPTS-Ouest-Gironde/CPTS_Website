# Chatbot rule-based (sans IA)

## Emplacement
- Feature: `app/_features/chatbot`
- Injection globale du widget: `app/layout.tsx` via `<ChatbotWidget />`

## Ajouter une ressource
1. Ouvrir `app/_features/chatbot/chatbot.config.ts`
2. Ajouter une entrée dans `resources`:
   - `type: "internal"` + `href` pour une route Next
   - `type: "phone"` + `value` pour un téléphone
   - `type: "email"` + `value` pour un email

## Ajouter un mot-clé
1. Ouvrir `chatbot.config.ts`
2. Ajouter une entrée dans `keywordIndex`:
   - `keyword`: mot/phrase à détecter
   - `resourceId`: id de la ressource cible
   - `scoreBoost` (optionnel): bonus de score

Le matching est géré par `matcher.ts` avec priorité: exact > contains > fuzzy léger.

## Ajouter un node de décision
1. Ouvrir `chatbot.config.ts`
2. Ajouter un node dans `nodes` avec:
   - `id`, `message`
   - `quickReplies` (optionnel)
   - `actions` (optionnel), ex: `suggest_resources`
3. Relier ce node depuis un quick reply via `nextNodeId`.

## Persistance et logs
- Historique de session: `sessionStorage` clé `cpts_chatbot_history`
- L'historique n'est pas envoyé au serveur et disparaît à la fermeture du navigateur.
- Aucun log client de contenu utilisateur.

## Tests
- Lancer: `npm run test:chatbot`
- Fichiers testés:
  - `normalize.test.ts`
  - `matcher.test.ts`
  - `engine.test.ts`

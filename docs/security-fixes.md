# Correctifs securite - branche `fix/security-audit`

Date de mise a jour: 2026-04-09

## Perimetre traite

Cette branche traite uniquement les findings suivants de `SECURITY_AUDIT.md`:

- Finding 1 (Eleve): protection des endpoints publics `/api/contact` et `/api/supports/order`
- Finding 2 (Eleve): echappement des donnees utilisateur dans les templates e-mail
- Finding 5 (Moyen): reactivation de la securite TypeScript au build

## Correctifs appliques

### Finding 1 - Rate limiting + Origin check

Fichiers:

- `lib/api-security.ts`
- `app/api/contact/route.ts`
- `app/api/supports/order/route.ts`

Comportement:

- Verification stricte de l'en-tete `Origin`:
  - autorise uniquement l'host de la requete courante
  - autorise aussi l'host de `NEXT_PUBLIC_SITE_URL` si configure
  - refuse les requetes sans `Origin` (403)
- Rate limiting en memoire (par IP + endpoint):
  - contact: `1` requete / `12h` / IP
  - commande supports: `2` requetes / `12h` / IP
- En cas de depassement:
  - reponse HTTP `429`
  - header `Retry-After` retourne en secondes
- Validation stricte des payloads (schemas Zod `.strict()`) avant appel a Resend

Note:

- Le stockage du rate limit est volontairement local en memoire (non partage multi-instances). Une migration Redis/KV est prevue dans un chantier separe.

### Finding 2 - Echappement des donnees utilisateur dans les e-mails

Fichiers:

- `lib/api-security.ts`
- `app/api/contact/route.ts`
- `app/api/supports/order/route.ts`

Comportement:

- Toutes les donnees utilisateur injectees dans le HTML des e-mails sont echappees (`escapeHtml`)
- Les liens `mailto:` sont encodes (`toMailtoHref`)
- Les liens `tel:` utilisent une valeur normalisee
- Les sujets e-mail neutralisent les retours chariot (`\r`/`\n`)

### Finding 5 - Type safety au build

Fichier:

- `next.config.mjs`

Comportement:

- `typescript.ignoreBuildErrors` est fixe a `false`
- Les erreurs TypeScript bloquent a nouveau `npm run build`

## Variables d'environnement a configurer

### Local (`.env.local`)

```bash
NEXT_PUBLIC_SITE_URL=http://127.0.0.1:3001
RESEND_DEV_NOTIFICATION_EMAIL=dev.cptsouestgironde@gmail.com
RESEND_PROD_NOTIFICATION_EMAIL=info@cpts-ouest-gironde.fr
```

### Vercel (par environnement)

- `NEXT_PUBLIC_SITE_URL`
  - Production: URL publique du site (ex: `https://cpts-ouest-gironde.fr`)
  - Preview: URL preview ciblee si necessaire
- `RESEND_DEV_NOTIFICATION_EMAIL`
  - pour development/preview
- `RESEND_PROD_NOTIFICATION_EMAIL`
  - pour production
- `RESEND_API_KEY`
  - cle API Resend requise pour l'envoi effectif

## Procedure de verification

Depuis la racine du depot:

```bash
npm run build
npm run lint
```

Lancer l'application:

```bash
npm run dev -- --hostname 127.0.0.1
```

### Test 1 - Contact valide

```bash
curl -i -X POST http://127.0.0.1:3001/api/contact \
  -H 'Content-Type: application/json' \
  -H 'Origin: http://127.0.0.1:3001' \
  --data '{"firstName":"Alice","lastName":"Martin","email":"alice@example.com","message":"Bonjour, ceci est un message de test valide."}'
```

Attendu:

- `200` si envoi Resend possible
- sinon `503` si `RESEND_API_KEY` absente/non valide

### Test 2 - Refus sans Origin

```bash
curl -i -X POST http://127.0.0.1:3001/api/contact \
  -H 'Content-Type: application/json' \
  --data '{"firstName":"Alice","lastName":"Martin","email":"alice@example.com","message":"Sans origin"}'
```

Attendu:

- `403`

### Test 3 - Commande supports valide

```bash
curl -i -X POST http://127.0.0.1:3001/api/supports/order \
  -H 'Content-Type: application/json' \
  -H 'Origin: http://127.0.0.1:3001' \
  --data '{"name":"Alice Martin","email":"alice@example.com","phone":"0612345678","address":"12 rue du Test, 33000 Bordeaux","supports":[{"id":"affiche","name":"Affiche","quantity":1,"description":"Support de test"}]}'
```

Attendu:

- `200` ou `503` selon la config Resend

### Test 4 - Rate limit contact

```bash
for i in 1 2 3 4 5 6; do
  curl -s -o /dev/null -w "%{http_code}\n" -X POST http://127.0.0.1:3001/api/contact \
    -H 'Content-Type: application/json' \
    -H 'Origin: http://127.0.0.1:3001' \
    --data '{"firstName":"Alice","lastName":"Martin","email":"alice@example.com","message":"Bonjour, ceci est un message de test valide."}'
done
```

Attendu:

- 1ere requete: `200` ou `503`
- requetes suivantes: `429`

## Findings restants (hors perimetre de cette branche)

- Finding 3: CSP globale (a traiter dans un chantier dedie)
- Finding 4: `dangerouslyAllowSVG` (a traiter dans un chantier dedie)
- Finding 6: dependances flottantes / lint supply-chain (a traiter dans un chantier dedie)
- Finding 7: revue des `dangerouslySetInnerHTML` (a traiter dans un chantier dedie)

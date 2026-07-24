# PROJECT_STRUCTURE

**CPTS Ouest Gironde** | Next.js 15.2.4 App Router | React 19 | TS 5.7.2 (strict) | Tailwind 4.1.9 | Radix UI

## Core Stack

- **Framework:** Next.js 15.2.4 (App Router, SSR/SSG hybrid)
- **UI:** React 19, Tailwind 4.1.9, Radix UI (56 components)
- **Forms:** react-hook-form + zod
- **Icons:** lucide-react (450+)
- **Charts:** recharts
- **Date:** date-fns
- **Carousel:** embla-carousel-react

## Structure

```
app/
├── layout.tsx              # Root layout + providers
├── page.tsx                # Homepage
├── globals.css             # Tailwind + global styles
├── data/*.json (6)         # ALL data (never hardcode)
├── professionnels/ (4)     # Professional pages
├── patients/ (4)           # Patient pages
├── prevention/ (4)         # Prevention pages
├── actualites/ (4)         # News articles
├── presentation/ (2)       # About pages
├── sante-mentale/ (1)      # Mental health v1 [CLIENT]
├── sante-mentale-2/ (1)    # Mental health v2 [CLIENT]
└── faq/ (1)                # FAQ

components/
├── ui/ (56)                # Radix UI components (CHECK FIRST)
├── sante-voyage/ (3)       # Article santé voyage : reveal (scroll), journey-nav (sticky), travel-checklist [CLIENT]
├── header.tsx              # Site header + nav
├── footer.tsx              # Site footer
├── hero.tsx                # Homepage hero
├── theme-provider.tsx      # Dark/light theme
└── navigation-data.ts      # SINGLE SOURCE routes

public/                     # Static assets
docs/                       # ⚠️ DO NOT TOUCH
```

**Pages:** 22 total (17 RSC / 5 RCC = 77/23 ratio) ✅ MAINTAIN

**Client Pages (5):**
- `/professionnels/formations` - Tabs
- `/professionnels/supports` - Form + cart
- `/professionnels/actions-outils` - Accordions
- `/sante-mentale` - Modals
- `/sante-mentale-2` - Modals + staircase anim

## Data Files (app/data/)

| File | Size | Purpose |
|------|------|---------|
| formation.json | 27KB | Training details |
| formations.json | 3.7KB | Training catalog |
| supports.json | 3KB | Support materials |
| nos-actions-vos-outils.json | 51KB | Tools/actions DB |
| sante-mentale.json | 9.5KB | Mental health v1 |
| sante-mentale-2.json | 2.9KB | Mental health v2 |
| sante-voyage.json | 22KB | Article santé voyage (contenu médical) |

## Patterns

### RSC vs RCC
- **Default:** RSC (no 'use client')
- **RCC only if:** useState/useEffect/onClick/forms/Radix interactive (Dialog/Tabs/Accordion)

### Data
- **Never:** Hardcode arrays in components
- **Always:** Externalize to `app/data/*.json`
- **IconMap:** `iconMap[data.iconName]` (string → Component)

### Imports
- **Always:** `@/` alias
- **Never:** Relative paths `../../`

### Naming
- Components: PascalCase (file = export name)
- Data files: kebab-case
- Types: PascalCase

### TypeScript
- Const assertions: `as const` for type-safe literals
- IconMap: `Record<string, LucideIcon>`
- Optional fields: `field?: type`

### Tailwind
- Layout: `container mx-auto py-20 px-4`
- Typography: `text-4xl font-bold mb-8`
- Colors: `bg-primary text-primary-foreground`
- Spacing: `space-y-6`, `flex gap-4`
- Responsive: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3`

## File Locations

| Type | Location | Example |
|------|----------|---------|
| Page | `app/[section]/page.tsx` | `app/patients/coordonnees/page.tsx` |
| Data | `app/data/*.json` | `app/data/formations.json` |
| UI Comp | `components/ui/*.tsx` | `components/ui/button.tsx` |
| Feature | `components/*.tsx` | `components/hero.tsx` |
| Routes | `components/navigation-data.ts` | ONLY FILE |
| Styles | `app/globals.css` | Tailwind + custom |
| Assets | `public/` | `public/images/logo.png` |

## Navigation (components/navigation-data.ts)

**Centralized routes:**
- ACCUEIL → `/`
- PROFESSIONNELS → 4 dropdowns
- PATIENTS → 4 dropdowns
- PRÉSENTATION → 5 dropdowns (1 anchor)
- PRÉVENTION → 4 dropdowns
- FAQ → `/faq`

## Common Types

```ts
interface Formation {
  title: string; date: string; time: string; location: string;
  duration: string; level: string; format: string;
  description: string; themes?: string[];
}

interface Support {
  id: string; name: string; image: string; description: string;
}

interface ModalContent {
  title: string; iconName: string; color: string; content: string;
}
```

## Search Strategies

**Routes:** Check `components/navigation-data.ts` first
**Data:** Check `app/data/*.json`
**Components:** Check `components/ui/` (56 available)
**Client pages:** `find app -name "page.tsx" -exec grep -l "'use client'" {} \;`
**Server pages:** `find app -name "page.tsx" -exec grep -L "'use client'" {} \;`

## Build Config

- **Port:** 3001 (`npm run dev`)
- **Build:** `npm run build` (REQUIRED after changes)
- **TS/ESLint:** Disabled in build (temp)
- **Images:** AVIF + WebP, 7 device sizes
- **Security:** HSTS, CSP, X-Frame-Options, etc.

## Production TODO (Not Urgent)

See `docs/PRODUCTION-AUDIT.md`:
- Next.js 15.2.4 → 15.5.9+ (CVEs)
- Remove console.log (supports/page.tsx:62)
- Re-enable TS/ESLint checks
- Add DOMPurify (4 files w/ dangerouslySetInnerHTML)
- Bundle: 6.3 MB → 3 MB
- Images: PNG → WebP

## Dependency Graph

```
app/layout.tsx → theme-provider → next-themes
app/page.tsx → header/hero/footer
header → navigation-data.ts
[CLIENT] pages → ui/* + data/*.json + lucide-react
[SERVER] pages → header/footer + ui/card
```

## Last Updated
2026-01-09

import { mkdirSync, readFileSync, statSync, writeFileSync } from "node:fs"
import { dirname, join } from "node:path"

interface ArticleSource {
  slug: string
  resourceId: string
  path: string
}

interface ArticleChunk {
  sectionTitle: string
  text: string
  sectionIndex: number
}

interface IndexedArticle {
  articleId: string
  resourceId: string
  title: string
  chunks: ArticleChunk[]
}

type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue }

const ROOT_DIR = process.cwd()
const MAX_CHUNK_LENGTH = 300
const MIN_CHUNK_LENGTH = 50
const OUTPUT_PATH = join(ROOT_DIR, "app/_features/chatbot/articles-index.generated.json")
const TEXT_KEYS = new Set([
  "title",
  "section_title",
  "sectionTitle",
  "subtitle",
  "intro",
  "paragraph",
  "paragraphs",
  "paragraphsAfterImage",
  "text",
  "textBold",
  "description",
  "label",
  "content",
  "highlight",
  "summary",
  "note",
  "conclusion",
  "alert",
  "items",
  "blocks",
  "resources",
  "name",
  "coverage",
  "access",
  "stats",
  "steps",
  "factors",
  "riskFactors",
  "complications",
  "exams",
  "treatments",
  "causes",
  "actions",
  "professionals",
  "approaches",
  "structures",
  "professionnels",
  "lignesEcoute",
  "services",
  "modalites",
  "missions",
])
const IGNORED_KEYS = new Set([
  "id",
  "kind",
  "type",
  "tone",
  "date",
  "color",
  "iconName",
  "image",
  "images",
  "imageAlt",
  "heroImage",
  "heroAlt",
  "backLink",
  "href",
  "url",
  "link",
  "links",
  "linkLabel",
  "urlLabel",
  "embedUrl",
  "videoUrl",
  "pdfLinks",
  "affiche",
  "afficheAlt",
  "kitImage",
  "kitImageAlt",
  "phone",
  "email",
  "address",
])

const ARTICLE_SOURCES: ArticleSource[] = [
  {
    slug: "endometriose-depistage-prise-en-charge",
    resourceId: "sf-endometriose",
    path: "app/data/endometriose-depistage-prise-en-charge.json",
  },
  {
    slug: "cancer-colorectal-mars-bleu-2026",
    resourceId: "sf-mars-bleu-2026",
    path: "app/data/cancer-colorectal-mars-bleu-2026.json",
  },
  {
    slug: "octobre-rose-2025",
    resourceId: "sf-octobre-rose-2025",
    path: "app/data/octobre-rose-2025.json",
  },
  {
    slug: "vaccination-anti-grippale-2025",
    resourceId: "sf-vaccination-grippe-2025",
    path: "app/data/vaccination-anti-grippale-2025.json",
  },
  {
    slug: "vaccination-anti-covid-2025",
    resourceId: "sf-vaccination-covid-2025",
    path: "app/data/vaccination-anti-covid-2025.json",
  },
  {
    slug: "vaccination-papillomavirus-campagne-scolaire-2025",
    resourceId: "sf-papillomavirus",
    path: "app/data/vaccination-papillomavirus-campagne-scolaire-2025.json",
  },
  {
    slug: "sante-mentale-des-jeunes",
    resourceId: "sante-mentale-jeunes",
    path: "app/data/sante-mentale-des-jeunes.json",
  },
  {
    slug: "insomnie",
    resourceId: "sf-insomnie",
    path: "app/data/insomnie.json",
  },
  {
    slug: "mois-sans-tabac-2025",
    resourceId: "sf-mois-sans-tabac-2025",
    path: "app/data/mois-sans-tabac-2025.json",
  },
  {
    slug: "sante-mentale",
    resourceId: "sante-mentale",
    path: "app/data/sante-mentale.json",
  },
  {
    slug: "sante-mentale-professionnels-et-approches",
    resourceId: "sm-pro-approches",
    path: "app/data/sante-mentale-professionnels-et-approches.json",
  },
  {
    slug: "annuaire-sante-mental",
    resourceId: "sante-mentale-annuaire",
    path: "app/data/annuaire-santé-mental.json",
  },
  {
    slug: "syndrome-apnee-sommeil",
    resourceId: "etp-apnee-sommeil",
    path: "app/data/syndrome-apnee-sommeil.json",
  },
  {
    slug: "ateliers-education-therapeutique",
    resourceId: "etp-ateliers",
    path: "app/data/ateliers-education-therapeutique.json",
  },
  {
    slug: "canicule",
    resourceId: "sf-canicule",
    path: "app/data/canicule.json",
  },
  {
    slug: "chute-personne-agee",
    resourceId: "sf-chute-personne-agee",
    path: "app/data/chute-personne-agee.json",
  },
  {
    slug: "face-aux-violences",
    resourceId: "sm-face-aux-violences",
    path: "app/data/face-aux-violences.json",
  },
]

const TODO_SOURCES = [
  "app/prevention/sante-familiale/movember-2026/page.tsx",
  "app/sante-mental/page.tsx",
]

const SECTION_TITLE_LABELS: Record<string, string> = {
  chiffresClés: "Chiffres clés",
  commentSeFaireDepister: "Comment se faire dépister",
  saviezVous: "Le saviez-vous",
  gestesBarrieres: "Gestes barrières",
  ouSeVacciner: "Où se faire vacciner",
  troublesPsy: "Troubles psychiques",
  pourquoi: "Pourquoi",
  reconnaitre: "Reconnaître les signes",
  queFaire: "Que faire",
}

function isRecord(value: JsonValue): value is Record<string, JsonValue> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value)
}

function cleanText(value: string): string {
  return value
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim()
}

function truncateText(value: string): string {
  if (value.length <= MAX_CHUNK_LENGTH) {
    return value
  }

  const slice = value.slice(0, MAX_CHUNK_LENGTH - 1)
  const lastSpace = slice.lastIndexOf(" ")
  return `${slice.slice(0, lastSpace > 180 ? lastSpace : slice.length).trim()}…`
}

function collectText(value: JsonValue, parentKey = ""): string[] {
  if (typeof value === "string") {
    const text = cleanText(value)
    return text ? [text] : []
  }

  if (Array.isArray(value)) {
    return value.flatMap((item) => collectText(item, parentKey))
  }

  if (!isRecord(value)) {
    return []
  }

  return Object.entries(value).flatMap(([key, child]) => {
    if (IGNORED_KEYS.has(key)) {
      return []
    }

    if (TEXT_KEYS.has(key) || TEXT_KEYS.has(parentKey) || isRecord(child) || Array.isArray(child)) {
      return collectText(child, key)
    }

    return []
  })
}

function getTitle(data: JsonValue, fallback: string): string {
  if (isRecord(data) && typeof data.title === "string") {
    return cleanText(data.title)
  }

  if (isRecord(data) && typeof data.topic === "string") {
    return cleanText(data.topic)
  }

  return fallback
}

function getSectionTitle(section: JsonValue, fallback: string): string {
  if (isRecord(section)) {
    for (const key of ["title", "sectionTitle", "label", "topic", "age_group"]) {
      const value = section[key]
      if (typeof value === "string") {
        return cleanText(value)
      }
    }
  }

  return fallback
}

function getSectionCandidates(data: JsonValue): JsonValue[] {
  if (!isRecord(data)) {
    return []
  }

  const candidates: JsonValue[] = []

  if (data.intro) {
    candidates.push({ title: "Introduction", content: data.intro })
  }

  for (const key of ["sections", "topics", "structures", "age_groups"]) {
    const value = data[key]
    if (Array.isArray(value)) {
      candidates.push(...value)
    }
  }

  const metadataKeys = new Set([
    "title",
    "subtitle",
    "date",
    "image",
    "heroImage",
    "heroAlt",
    "backLink",
    "intro",
    "sections",
    "topics",
    "structures",
    "age_groups",
    "version_date",
    "scope",
    "topic",
    "exclusions",
    "linkedin",
    "evenements",
  ])

  for (const [key, value] of Object.entries(data)) {
    if (metadataKeys.has(key) || IGNORED_KEYS.has(key)) {
      continue
    }

    if (isRecord(value) || Array.isArray(value)) {
      candidates.push({ title: SECTION_TITLE_LABELS[key] ?? key, content: value })
    }
  }

  return candidates
}

function buildArticle(source: ArticleSource): IndexedArticle {
  const absolutePath = join(ROOT_DIR, source.path)
  const data = JSON.parse(readFileSync(absolutePath, "utf8")) as JsonValue
  const seenTexts = new Set<string>()
  const chunks = getSectionCandidates(data)
    .map((section, index): ArticleChunk | null => {
      const text = truncateText(collectText(section).join(" "))
      if (text.length < MIN_CHUNK_LENGTH || seenTexts.has(text)) {
        return null
      }

      seenTexts.add(text)

      return {
        sectionTitle: getSectionTitle(section, `Section ${index + 1}`),
        text,
        sectionIndex: index,
      }
    })
    .filter((chunk): chunk is ArticleChunk => Boolean(chunk))

  return {
    articleId: source.slug,
    resourceId: source.resourceId,
    title: getTitle(data, source.slug),
    chunks,
  }
}

function main(): void {
  const articles = ARTICLE_SOURCES.map(buildArticle).filter((article) => article.chunks.length > 0)
  const totalChunks = articles.reduce((count, article) => count + article.chunks.length, 0)
  const payload = {
    _comment: "AUTO-GENERATED FILE. Do not edit manually. Run npm run build:chatbot-index to regenerate.",
    articles,
  }

  mkdirSync(dirname(OUTPUT_PATH), { recursive: true })
  writeFileSync(OUTPUT_PATH, `${JSON.stringify(payload, null, 2)}\n`)

  const size = statSync(OUTPUT_PATH).size
  console.log(`Indexed ${articles.length} articles and ${totalChunks} chunks.`)
  console.log(`Generated ${OUTPUT_PATH} (${size} bytes).`)
  console.log(`TODO TSX sources not indexed yet: ${TODO_SOURCES.join(", ")}`)
}

main()

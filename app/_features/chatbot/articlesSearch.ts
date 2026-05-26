import Fuse from "fuse.js"

import articlesIndex from "./articles-index.generated.json"
import { normalizeText } from "./normalize"

interface GeneratedArticleChunk {
  sectionTitle: string
  text: string
  sectionIndex: number
}

interface GeneratedArticle {
  articleId: string
  resourceId: string
  title: string
  chunks: GeneratedArticleChunk[]
}

interface ArticlesIndex {
  articles: GeneratedArticle[]
}

interface ArticleSearchDocument {
  resourceId: string
  title: string
  sectionTitle: string
  text: string
  sectionIndex: number
  normalizedTitle: string
  normalizedSectionTitle: string
  normalizedText: string
}

export interface ArticleSearchResult {
  resourceId: string
  sectionTitle: string
  extract: string
  score: number
}

export interface SearchArticlesOptions {
  exploratory?: boolean
}

const FUSE_THRESHOLD = 0.4
const FUSE_THRESHOLD_EXPLORATORY = 0.5
const MAX_ARTICLE_RESULTS = 3
const EXTRACT_MAX_LENGTH = 300
const FUSE_KEYS = [
  { name: "title", weight: 0.4 },
  { name: "sectionTitle", weight: 0.3 },
  { name: "text", weight: 0.3 },
] as const

const typedArticlesIndex = articlesIndex as ArticlesIndex

const articleDocuments: ArticleSearchDocument[] = typedArticlesIndex.articles.flatMap((article) =>
  article.chunks.map((chunk) => ({
    resourceId: article.resourceId,
    title: article.title,
    sectionTitle: chunk.sectionTitle,
    text: chunk.text,
    sectionIndex: chunk.sectionIndex,
    normalizedTitle: normalizeText(article.title),
    normalizedSectionTitle: normalizeText(chunk.sectionTitle),
    normalizedText: normalizeText(chunk.text),
  })),
)

const articlesFuse = new Fuse(articleDocuments, {
  threshold: FUSE_THRESHOLD,
  includeScore: true,
  ignoreLocation: true,
  ignoreDiacritics: true,
  keys: [...FUSE_KEYS],
})

const articlesFuseExploratory = new Fuse(articleDocuments, {
  threshold: FUSE_THRESHOLD_EXPLORATORY,
  includeScore: true,
  ignoreLocation: true,
  ignoreDiacritics: true,
  keys: [...FUSE_KEYS],
})

const STOP_WORDS = new Set([
  "avec",
  "dans",
  "des",
  "est",
  "les",
  "pour",
  "que",
  "qui",
  "quoi",
  "une",
  "vous",
  "comment",
])

function getQueryTerms(query: string): string[] {
  return query
    .split(" ")
    .filter((term) => term.length > 2 && !STOP_WORDS.has(term))
}

function getLexicalScore(document: ArticleSearchDocument, queryTerms: string[]): number {
  return queryTerms.reduce((score, term) => {
    if (document.normalizedSectionTitle.includes(term)) {
      return score + 4
    }

    if (document.normalizedTitle.includes(term)) {
      return score + 2
    }

    if (document.normalizedText.includes(term)) {
      return score + 1
    }

    return score
  }, 0)
}

function stripMarkdown(text: string): string {
  return text
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/\s*\n+\s*/g, " ")
    .replace(/\s+/g, " ")
    .trim()
}

function truncateExtract(text: string, maxLength = EXTRACT_MAX_LENGTH): string {
  if (text.length <= maxLength) {
    return text
  }

  const window = text.slice(0, maxLength)
  let cutPoint = -1
  for (const terminator of [". ", "! ", "? "]) {
    const index = window.lastIndexOf(terminator)
    if (index > cutPoint) {
      cutPoint = index + 1
    }
  }

  if (cutPoint > 0) {
    return text.slice(0, cutPoint).trim()
  }

  const lastSpace = window.lastIndexOf(" ")
  if (lastSpace > 0) {
    return `${text.slice(0, lastSpace).trim()}…`
  }

  return `${text.slice(0, maxLength)}…`
}

export function cleanExtract(text: string): string {
  return truncateExtract(stripMarkdown(text))
}

export function searchArticles(query: string, options: SearchArticlesOptions = {}): ArticleSearchResult[] {
  const normalizedQuery = normalizeText(query)
  if (!normalizedQuery) {
    return []
  }

  const seenResources = new Set<string>()
  const queryTerms = getQueryTerms(normalizedQuery)
  const fuse = options.exploratory ? articlesFuseExploratory : articlesFuse

  return fuse
    .search(normalizedQuery, { limit: 20 })
    .map((result) => ({
      resourceId: result.item.resourceId,
      sectionTitle: result.item.sectionTitle,
      extract: result.item.text,
      score: result.score ?? 1,
      lexicalScore: getLexicalScore(result.item, queryTerms),
      sectionIndex: result.item.sectionIndex,
    }))
    .sort((left, right) => {
      if (left.lexicalScore !== right.lexicalScore) {
        return right.lexicalScore - left.lexicalScore
      }

      if (left.sectionIndex !== right.sectionIndex) {
        return left.sectionIndex - right.sectionIndex
      }

      return left.score - right.score
    })
    .filter((result) => {
      if (seenResources.has(result.resourceId)) {
        return false
      }

      seenResources.add(result.resourceId)
      return true
    })
    .map((result) => ({
      resourceId: result.resourceId,
      sectionTitle: result.sectionTitle,
      extract: cleanExtract(result.extract),
      score: result.score,
    }))
    .slice(0, MAX_ARTICLE_RESULTS)
}

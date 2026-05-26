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

const FUSE_THRESHOLD = 0.4
const MAX_ARTICLE_RESULTS = 3

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
  keys: [
    { name: "title", weight: 0.4 },
    { name: "sectionTitle", weight: 0.3 },
    { name: "text", weight: 0.3 },
  ],
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

export function searchArticles(query: string): ArticleSearchResult[] {
  const normalizedQuery = normalizeText(query)
  if (!normalizedQuery) {
    return []
  }

  const seenResources = new Set<string>()
  const queryTerms = getQueryTerms(normalizedQuery)

  return articlesFuse
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

      if (left.score !== right.score) {
        return left.score - right.score
      }

      return left.sectionIndex - right.sectionIndex
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
      extract: result.extract,
      score: result.score,
    }))
    .slice(0, MAX_ARTICLE_RESULTS)
}

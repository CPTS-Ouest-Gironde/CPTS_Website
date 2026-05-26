import Fuse from "fuse.js"

import { normalizeText } from "./normalize"
import type { ChatResource, ChatbotConfig } from "./types"

interface FuzzyResourceDocument {
  resource: ChatResource
  title: string
  description: string
  allKeywords: string
}

const FUSE_THRESHOLD = 0.4
const fuseIndexCache = new WeakMap<ChatbotConfig, Fuse<FuzzyResourceDocument>>()

function buildFuzzyDocuments(config: ChatbotConfig): FuzzyResourceDocument[] {
  const keywordMap = new Map<string, string[]>()

  for (const entry of config.keywordIndex) {
    const keywords = keywordMap.get(entry.resourceId)
    if (keywords) {
      keywords.push(entry.keyword)
    } else {
      keywordMap.set(entry.resourceId, [entry.keyword])
    }
  }

  return Object.values(config.resources)
    .filter((resource) => !resource.isSensitive)
    .map((resource) => ({
      resource,
      title: resource.title,
      description: resource.description ?? "",
      allKeywords: normalizeText(keywordMap.get(resource.id)?.join(" ") ?? ""),
    }))
}

function getFuseIndex(config: ChatbotConfig): Fuse<FuzzyResourceDocument> {
  const cached = fuseIndexCache.get(config)
  if (cached) {
    return cached
  }

  const fuse = new Fuse(buildFuzzyDocuments(config), {
    threshold: FUSE_THRESHOLD,
    includeScore: true,
    ignoreLocation: true,
    ignoreDiacritics: true,
    keys: [
      { name: "title", weight: 0.5 },
      { name: "description", weight: 0.3 },
      { name: "allKeywords", weight: 0.2 },
    ],
  })

  fuseIndexCache.set(config, fuse)
  return fuse
}

export function searchResourcesFuzzy(query: string, config: ChatbotConfig): ChatResource[] {
  const normalizedQuery = normalizeText(query)
  if (!normalizedQuery) {
    return []
  }

  return getFuseIndex(config)
    .search(normalizedQuery, { limit: config.rules.maxSuggestions })
    .map((result) => result.item.resource)
}

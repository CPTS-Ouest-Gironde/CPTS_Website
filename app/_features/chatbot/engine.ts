import { matchResources } from "./matcher"
import { normalizeText, normalizeTextPreservingStopWords } from "./normalize"
import { detectConversationalIntent, stripConversationalPrefix } from "./intents"
import { searchResourcesFuzzy } from "./fuzzySearch"
import { searchArticles, type ArticleSearchResult } from "./articlesSearch"
import type {
  ChatMessage,
  ChatResource,
  ChatNode,
  ChatbotConfig,
  ChatbotPageContext,
  ChatbotState,
  QuickReply,
  ResourceMatch,
} from "./types"

const ERROR_PAGE_START_NODE_ID = "start-error"
const RECENTLY_SUGGESTED_LIMIT = 5
const RESOURCE_FOLLOW_UP_NO_ID = "qr-resource-follow-up-no"
const VACCINATION_RESOURCE_ID = "sf-vaccination-grippe-2025"
const SYMPTOMS_RESOURCE_ID = "symptomes-douleur"
const MATCHER_EXACT_SCORE = 120
const ARTICLE_HIGH_CONFIDENCE_FUSE_SCORE = 0.4
const FALLBACK_ALTERNATIVE_MESSAGE =
  "Je n'ai pas d'autre suggestion pour cette demande. Souhaitez-vous reformuler votre question ou explorer une autre catégorie ?"

const EXPLORATORY_MARKERS = [
  "c est quoi",
  "qu est ce que",
  "qu est ce",
  "comment ca",
  "comment se passe",
  "je veux comprendre",
  "explique moi",
  "j ai des questions sur",
  "je voudrais savoir",
  "dis moi",
  "info sur",
  "infos sur",
]

function hasExploratoryMarker(intentInput: string): boolean {
  return EXPLORATORY_MARKERS.some((marker) => intentInput.includes(marker))
}

const SENSITIVE_ALLOWED_RESOURCE_IDS = {
  violence: new Set(["sm-face-aux-violences", "urgence-3919", "urgence-17", "sante-mentale-annuaire"]),
  suicide: new Set(["urgence-3114", "sante-mentale-annuaire", "sante-mentale"]),
  "danger-vital": new Set(["urgence-15", "urgence-17", "medecin-traitant"]),
} satisfies Record<NonNullable<ChatResource["sensitivityCategory"]>, Set<string>>

interface InitialStateOptions {
  context?: ChatbotPageContext
}

function resolveStartNodeId(config: ChatbotConfig, context: ChatbotPageContext = "default"): string {
  if (context === "error-page" && config.nodes[ERROR_PAGE_START_NODE_ID]) {
    return ERROR_PAGE_START_NODE_ID
  }

  return config.rules.startNodeId
}

export const CHATBOT_HISTORY_KEY = "cpts_chatbot_history"
const CHATBOT_HISTORY_VERSION = 6
const RESOURCE_FOLLOW_UP_QUICK_REPLIES: QuickReply[] = [
  {
    id: "qr-resource-follow-up-yes",
    label: "Oui, merci",
    value: "oui merci",
    message: "Parfait ! N'hésitez pas si vous avez d'autres questions.",
    nextNodeId: "start",
  },
  {
    id: "qr-resource-follow-up-no",
    label: "Non, autre chose",
    value: "non autre chose",
    nextNodeId: "start",
  },
  {
    id: "qr-resource-follow-up-contact",
    label: "Contacter la CPTS",
    value: "contacter la cpts",
    actionResourceIds: ["contact-email", "coordonnees"],
  },
]
const quickReplyLookupCache = new WeakMap<QuickReply[], Map<string, QuickReply>>()

function isBrowser(): boolean {
  return typeof window !== "undefined"
}

function createMessage(
  role: ChatMessage["role"],
  text: string,
  extra: Pick<ChatMessage, "quickReplies" | "suggestions"> = {},
): ChatMessage {
  const messageId =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(16).slice(2)}`

  return {
    id: messageId,
    role,
    text,
    timestamp: Date.now(),
    quickReplies: extra.quickReplies,
    suggestions: extra.suggestions,
  }
}

function appendUserMessage(messages: ChatMessage[], text: string): ChatMessage[] {
  return [...messages, createMessage("user", text)]
}

function resolveNode(config: ChatbotConfig, nodeId: string): ChatNode {
  return config.nodes[nodeId] ?? config.nodes[config.rules.fallbackNodeId]
}

function suggestionsFromResourceIds(config: ChatbotConfig, resourceIds: string[]): ResourceMatch[] {
  return resourceIds
    .map((resourceId, index) => {
      const resource = config.resources[resourceId]
      if (!resource) {
        return null
      }

      return {
        resource,
        score: 100 - index * 5,
        matchedKeyword: "action-node",
      }
    })
    .filter((item): item is ResourceMatch => Boolean(item))
    .slice(0, config.rules.maxSuggestions)
}

function suggestionsFromResources(resources: ChatResource[]): ResourceMatch[] {
  return resources.map((resource, index) => ({
    resource,
    score: 48 - index * 5,
    matchedKeyword: "fuse",
  }))
}

function filterRecentlySuggested<T extends ResourceMatch>(matches: T[], recentlySuggested: string[]): T[] {
  const recentlySuggestedSet = new Set(recentlySuggested)

  return matches.filter((match) => !recentlySuggestedSet.has(match.resource.id))
}

function filterLowConfidenceSensitiveMatches<T extends ResourceMatch>(matches: T[], minScore: number): T[] {
  const sensitiveMinScore = minScore * 2

  return matches.filter((match) => !match.resource.isSensitive || match.score >= sensitiveMinScore)
}

function filterSensitiveMatches<T extends ResourceMatch>(matches: T[]): T[] {
  const sensitiveMatch = matches.find((match) => match.resource.isSensitive && match.resource.sensitivityCategory)
  if (!sensitiveMatch?.resource.sensitivityCategory) {
    return matches
  }

  const category = sensitiveMatch.resource.sensitivityCategory
  const allowedResourceIds = SENSITIVE_ALLOWED_RESOURCE_IDS[category]
  const sameCategorySensitiveMatches = matches.filter(
    (match) => match.resource.isSensitive && match.resource.sensitivityCategory === category,
  )
  const relatedNonSensitiveMatch = matches.find(
    (match) => !match.resource.isSensitive && allowedResourceIds.has(match.resource.id),
  )

  return relatedNonSensitiveMatch
    ? [...sameCategorySensitiveMatches, relatedNonSensitiveMatch]
    : sameCategorySensitiveMatches
}

function hasDoctorIntent(matches: ResourceMatch[]): boolean {
  return matches.some(
    (match) => match.resource.id === "medecin-traitant" || match.resource.id === "patients-medecin-traitant",
  )
}

function filterAudienceMatches<T extends ResourceMatch>(
  matches: T[],
  audienceContext: ChatbotState["audienceContext"],
): T[] {
  if (audienceContext === "pro") {
    return matches
  }

  if (audienceContext === "patient") {
    return matches.filter((match) => match.resource.audience !== "pro")
  }

  if (hasDoctorIntent(matches)) {
    return matches.filter((match) => match.resource.audience !== "pro")
  }

  return matches
}

function hasVaccinationIntent(normalizedInput: string): boolean {
  return /\b(vaccin|vacciner|vaccination|rappel|dose)\b/.test(normalizedInput)
}

function filterVaccinationFalsePositives<T extends ResourceMatch>(matches: T[], normalizedInput: string): T[] {
  if (!hasVaccinationIntent(normalizedInput)) {
    return matches
  }

  if (!matches.some((match) => match.resource.id === VACCINATION_RESOURCE_ID)) {
    return matches
  }

  return matches.filter((match) => match.resource.id !== SYMPTOMS_RESOURCE_ID)
}

function hasSensitiveMatch(matches: ResourceMatch[]): boolean {
  return matches.some((match) => match.resource.isSensitive && match.resource.sensitivityCategory)
}

function hasArticleInfoIntent(normalizedInput: string): boolean {
  return /\b(qu|quoi|comment|definition|definir|depiste|depistage|symptome|traitement|prise en charge|c est quoi|qu est ce)\b/.test(
    normalizedInput,
  )
}

function filterMissingRequiredNumbers<T extends ResourceMatch>(matches: T[], normalizedInput: string): T[] {
  return matches.filter((match) => {
    const requiredNumbers = match.matchedKeyword.match(/\d+/g)
    if (!requiredNumbers) {
      return true
    }

    return requiredNumbers.every((number) => normalizedInput.includes(number))
  })
}

function appendRecentlySuggested(current: string[], resourceIds: string[]): string[] {
  if (!resourceIds.length) {
    return current
  }

  const next = [...current]

  for (const resourceId of resourceIds) {
    const existingIndex = next.indexOf(resourceId)
    if (existingIndex >= 0) {
      next.splice(existingIndex, 1)
    }
    next.push(resourceId)
  }

  return next.slice(-RECENTLY_SUGGESTED_LIMIT)
}

function getSuggestionResourceIds(suggestions: ResourceMatch[]): string[] {
  return suggestions.map((suggestion) => suggestion.resource.id)
}

function getLastSuggestedResourceIds(messages: ChatMessage[]): string[] {
  const lastSuggestionMessage = [...messages]
    .reverse()
    .find((message) => (message.suggestions?.length ?? 0) > 0)

  return lastSuggestionMessage?.suggestions?.map((suggestion) => suggestion.resource.id) ?? []
}

function buildFallbackState(
  config: ChatbotConfig,
  messages: ChatMessage[],
  recentlySuggested: string[],
  messageOverride?: string,
  audienceContext?: ChatbotState["audienceContext"],
): ChatbotState {
  const fallbackNode = messageOverride
    ? {
        ...resolveNode(config, config.rules.fallbackNodeId),
        message: messageOverride,
      }
    : resolveNode(config, config.rules.fallbackNodeId)

  return {
    currentNodeId: fallbackNode.id,
    messages: [...messages, ...buildNodeMessages(config, fallbackNode)],
    recentlySuggested,
    audienceContext: audienceContext ?? null,
  }
}

function buildAlternativeState(
  state: ChatbotState,
  config: ChatbotConfig,
  quickReply: QuickReply,
): ChatbotState | undefined {
  if (quickReply.id !== RESOURCE_FOLLOW_UP_NO_ID || !state.lastUserInput) {
    return undefined
  }

  const messagesWithUser = appendUserMessage(state.messages, quickReply.label)
  const suggestedBeforeReply = getLastSuggestedResourceIds(state.messages)
  const nextRecentlySuggested = appendRecentlySuggested(state.recentlySuggested, suggestedBeforeReply)
  const normalizedInput = normalizeText(stripConversationalPrefix(normalizeTextPreservingStopWords(state.lastUserInput)))
  const matches = filterVaccinationFalsePositives(
    filterAudienceMatches(
      filterSensitiveMatches(
        filterLowConfidenceSensitiveMatches(
          filterMissingRequiredNumbers(
            matchResources({
              input: normalizedInput,
              keywordIndex: config.keywordIndex,
              resources: config.resources,
              maxSuggestions: 10,
              minScore: config.rules.minScore,
              fuzzyDistanceThreshold: config.rules.fuzzyDistanceThreshold,
            }),
            normalizedInput,
          ),
          config.rules.minScore,
        ),
      ),
      state.audienceContext ?? null,
    ),
    normalizedInput,
  )
  const filteredMatches = filterRecentlySuggested(matches, nextRecentlySuggested)

  if (filteredMatches.length > 0) {
    return {
      currentNodeId: state.currentNodeId,
      messages: [...messagesWithUser, ...buildSuggestionMessages("Voici une autre piste possible :", filteredMatches)],
      recentlySuggested: appendRecentlySuggested(nextRecentlySuggested, getSuggestionResourceIds(filteredMatches)),
      lastUserInput: state.lastUserInput,
      audienceContext: state.audienceContext ?? null,
    }
  }

  return buildFallbackState(config, messagesWithUser, nextRecentlySuggested, FALLBACK_ALTERNATIVE_MESSAGE, state.audienceContext)
}

function buildSuggestionMessages(message: string, suggestions: ResourceMatch[]): ChatMessage[] {
  return [
    createMessage("bot", message, {
      suggestions,
    }),
    createMessage("bot", "Est-ce que cela répond à votre question ?", {
      quickReplies: RESOURCE_FOLLOW_UP_QUICK_REPLIES,
    }),
  ]
}

function buildArticleSearchState(
  config: ChatbotConfig,
  messages: ChatMessage[],
  recentlySuggested: string[],
  trimmedInput: string,
  audienceContext: ChatbotState["audienceContext"],
  articleResults: ArticleSearchResult[],
  allowedResourceIds?: Set<string>,
): ChatbotState | undefined {
  const filteredResults = articleResults.filter(
    (result) => !allowedResourceIds || allowedResourceIds.has(result.resourceId),
  )
  const articleSuggestions = filterRecentlySuggested(
    filterAudienceMatches(
      filteredResults
        .map((result): ResourceMatch | null => {
          const resource = config.resources[result.resourceId]
          if (!resource) {
            return null
          }

          return {
            resource,
            score: Math.max(1, Math.round((1 - result.score) * 100)),
            matchedKeyword: result.sectionTitle,
          }
        })
        .filter((result): result is ResourceMatch => Boolean(result)),
      audienceContext,
    ),
    recentlySuggested,
  ).slice(0, 1)

  if (!articleSuggestions.length) {
    return undefined
  }

  const firstMatch = filteredResults.find(
    (result) => result.resourceId === articleSuggestions[0]?.resource.id,
  )
  if (!firstMatch) {
    return undefined
  }

  return {
    currentNodeId: config.rules.fallbackNodeId,
    messages: [
      ...messages,
      createMessage("bot", `Voici ce que j'ai trouvé : ${firstMatch.extract}`),
      ...buildSuggestionMessages("Vous pouvez retrouver plus d'informations dans cet article.", articleSuggestions),
    ],
    recentlySuggested: appendRecentlySuggested(recentlySuggested, getSuggestionResourceIds(articleSuggestions)),
    lastUserInput: trimmedInput,
    audienceContext,
  }
}

function buildNodeMessages(config: ChatbotConfig, node: ChatNode): ChatMessage[] {
  const messages: ChatMessage[] = [
    createMessage("bot", node.message, {
      quickReplies: node.quickReplies,
    }),
  ]

  if (!node.actions?.length) {
    return messages
  }

  for (const action of node.actions) {
    if (action.type !== "suggest_resources") {
      continue
    }

    const suggestions = suggestionsFromResourceIds(config, action.resourceIds)
    if (!suggestions.length) {
      continue
    }

    messages.push(...buildSuggestionMessages(action.message ?? "Je vous conseille :", suggestions))
  }

  return messages
}

function buildFilteredNodeMessages(
  config: ChatbotConfig,
  node: ChatNode,
  recentlySuggested: string[],
): { messages: ChatMessage[]; suggestedIds: string[] } {
  const messages: ChatMessage[] = [
    createMessage("bot", node.message, {
      quickReplies: node.quickReplies,
    }),
  ]
  const suggestedIds: string[] = []

  if (!node.actions?.length) {
    return { messages, suggestedIds }
  }

  for (const action of node.actions) {
    if (action.type !== "suggest_resources") {
      continue
    }

    const suggestions = filterRecentlySuggested(
      suggestionsFromResourceIds(config, action.resourceIds),
      appendRecentlySuggested(recentlySuggested, suggestedIds),
    )
    if (!suggestions.length) {
      continue
    }

    suggestedIds.push(...getSuggestionResourceIds(suggestions))
    messages.push(...buildSuggestionMessages(action.message ?? "Je vous conseille :", suggestions))
  }

  return { messages, suggestedIds }
}

function getQuickReplyLookup(quickReplies: QuickReply[] = []): Map<string, QuickReply> {
  if (!quickReplies.length) {
    return new Map<string, QuickReply>()
  }

  const cached = quickReplyLookupCache.get(quickReplies)
  if (cached) {
    return cached
  }

  const lookup = new Map<string, QuickReply>()

  for (const reply of quickReplies) {
    lookup.set(normalizeText(reply.label), reply)
    lookup.set(normalizeText(reply.value), reply)
  }

  quickReplyLookupCache.set(quickReplies, lookup)
  return lookup
}

function findTextQuickReply(node: ChatNode, normalizedInput: string): QuickReply | undefined {
  if (!node.quickReplies?.length) {
    return undefined
  }

  return getQuickReplyLookup(node.quickReplies).get(normalizedInput)
}

function applyQuickReplyWithoutUserMessage(
  state: ChatbotState,
  config: ChatbotConfig,
  quickReply: QuickReply,
): ChatbotState {
  const alternativeState = buildAlternativeState(state, config, quickReply)
  if (alternativeState) {
    return alternativeState
  }

  const nextMessages = [...state.messages]
  const suggestedBeforeReply =
    quickReply.id === RESOURCE_FOLLOW_UP_NO_ID ? getLastSuggestedResourceIds(state.messages) : []
  let nextRecentlySuggested = appendRecentlySuggested(state.recentlySuggested, suggestedBeforeReply)
  let nextNodeId = state.currentNodeId
  let nextAudienceContext = state.audienceContext ?? null

  if (quickReply.id === "qr-docs-pro-oui" || quickReply.nextNodeId === "documents-pro") {
    nextAudienceContext = "pro"
  }

  if (quickReply.id === "qr-docs-pro-non" || quickReply.nextNodeId === "documents-patient") {
    nextAudienceContext = "patient"
  }

  if (quickReply.message) {
    nextMessages.push(createMessage("bot", quickReply.message))
  }

  if (quickReply.actionResourceIds?.length) {
    const suggestions = filterRecentlySuggested(
      filterAudienceMatches(suggestionsFromResourceIds(config, quickReply.actionResourceIds), nextAudienceContext),
      nextRecentlySuggested,
    )

    if (suggestions.length) {
      nextRecentlySuggested = appendRecentlySuggested(nextRecentlySuggested, getSuggestionResourceIds(suggestions))
      nextMessages.push(...buildSuggestionMessages("Je vous conseille :", suggestions))
    } else {
      return buildFallbackState(config, nextMessages, nextRecentlySuggested, undefined, nextAudienceContext)
    }
  }

  if (quickReply.nextNodeId) {
    const nextNode = resolveNode(config, quickReply.nextNodeId)
    const nextNodeResult = buildFilteredNodeMessages(config, nextNode, nextRecentlySuggested)
    nextRecentlySuggested = appendRecentlySuggested(nextRecentlySuggested, nextNodeResult.suggestedIds)
    nextMessages.push(...nextNodeResult.messages)
    nextNodeId = nextNode.id
  }

  const nextState = {
    currentNodeId: nextNodeId,
    messages: nextMessages,
    recentlySuggested: nextRecentlySuggested,
    lastUserInput: state.lastUserInput,
    audienceContext: nextAudienceContext,
  }

  return nextState
}

function isPersistedState(value: unknown): value is ChatbotState {
  if (!value || typeof value !== "object") {
    return false
  }

  const candidate = value as ChatbotState

  return (
    typeof candidate.currentNodeId === "string" &&
    Array.isArray(candidate.messages) &&
    (candidate.recentlySuggested === undefined ||
      (Array.isArray(candidate.recentlySuggested) &&
        candidate.recentlySuggested.every((resourceId) => typeof resourceId === "string"))) &&
    (candidate.audienceContext === undefined ||
      candidate.audienceContext === null ||
      candidate.audienceContext === "patient" ||
      candidate.audienceContext === "pro")
  )
}

interface PersistedHistory {
  version: number
  state: ChatbotState
}

function isPersistedHistory(value: unknown): value is PersistedHistory {
  if (!value || typeof value !== "object") {
    return false
  }

  const candidate = value as PersistedHistory

  return typeof candidate.version === "number" && isPersistedState(candidate.state)
}

export function createInitialState(config: ChatbotConfig, options: InitialStateOptions = {}): ChatbotState {
  const startNode = resolveNode(config, resolveStartNodeId(config, options.context))

  return {
    currentNodeId: startNode.id,
    messages: buildNodeMessages(config, startNode),
    recentlySuggested: [],
    lastUserInput: undefined,
    audienceContext: null,
  }
}

export function hydrateState(config: ChatbotConfig, options: InitialStateOptions = {}): ChatbotState {
  if (!isBrowser()) {
    return createInitialState(config, options)
  }

  try {
    const raw = window.sessionStorage.getItem(CHATBOT_HISTORY_KEY)
    if (!raw) {
      return createInitialState(config, options)
    }

    const parsed: unknown = JSON.parse(raw)
    if (isPersistedHistory(parsed)) {
      if (parsed.version !== CHATBOT_HISTORY_VERSION) {
        return createInitialState(config, options)
      }

      return {
        ...parsed.state,
        recentlySuggested: parsed.state.recentlySuggested ?? [],
        audienceContext: parsed.state.audienceContext ?? null,
      }
    }

    return createInitialState(config, options)
  } catch {
    return createInitialState(config, options)
  }
}

export function persistState(state: ChatbotState): void {
  if (!isBrowser()) {
    return
  }

  window.sessionStorage.setItem(
    CHATBOT_HISTORY_KEY,
    JSON.stringify({
      version: CHATBOT_HISTORY_VERSION,
      state,
    }),
  )
}

export function restartConversation(config: ChatbotConfig): ChatbotState {
  const restartNode = resolveNode(config, config.rules.restartNodeId ?? "start")
  const nextState = {
    currentNodeId: restartNode.id,
    messages: buildNodeMessages(config, restartNode),
    recentlySuggested: [],
    lastUserInput: undefined,
    audienceContext: null,
  }

  return nextState
}

export function processQuickReply(
  state: ChatbotState,
  quickReply: QuickReply,
  config: ChatbotConfig,
): ChatbotState {
  const stateWithUserMessage: ChatbotState = {
    ...state,
    messages: appendUserMessage(state.messages, quickReply.label),
    recentlySuggested: state.recentlySuggested ?? [],
    audienceContext: state.audienceContext ?? null,
  }

  return applyQuickReplyWithoutUserMessage(stateWithUserMessage, config, quickReply)
}

export function processUserInput(
  state: ChatbotState,
  input: string,
  config: ChatbotConfig,
): ChatbotState {
  const trimmed = input.trim()

  if (!trimmed) {
    return state
  }

  const messagesWithUser = appendUserMessage(state.messages, trimmed)
  const intentInput = normalizeTextPreservingStopWords(trimmed)
  const normalizedInput = normalizeText(stripConversationalPrefix(intentInput))
  const currentNode = resolveNode(config, state.currentNodeId)
  const matchedQuickReply = findTextQuickReply(currentNode, normalizedInput)

  if (matchedQuickReply) {
    return applyQuickReplyWithoutUserMessage(
      {
        ...state,
        messages: messagesWithUser,
        recentlySuggested: state.recentlySuggested ?? [],
        audienceContext: state.audienceContext ?? null,
      },
      config,
      matchedQuickReply,
    )
  }

  const startNodeQuickReplies = resolveNode(config, config.rules.startNodeId).quickReplies ?? []
  const conversationalIntent = detectConversationalIntent(intentInput, startNodeQuickReplies)

  if (conversationalIntent) {
    const suggestions = conversationalIntent.resourceIds
      ? filterRecentlySuggested(
          filterAudienceMatches(
            suggestionsFromResourceIds(config, conversationalIntent.resourceIds),
            state.audienceContext ?? null,
          ),
          state.recentlySuggested,
        )
      : undefined
    const nextRecentlySuggested = suggestions?.length
      ? appendRecentlySuggested(state.recentlySuggested, getSuggestionResourceIds(suggestions))
      : state.recentlySuggested
    const botMessages = suggestions?.length
      ? [
          createMessage("bot", conversationalIntent.message, {
            quickReplies: conversationalIntent.quickReplies,
            suggestions,
          }),
          createMessage("bot", "Est-ce que cela répond à votre question ?", {
            quickReplies: RESOURCE_FOLLOW_UP_QUICK_REPLIES,
          }),
        ]
      : [
          createMessage("bot", conversationalIntent.message, {
            quickReplies: conversationalIntent.quickReplies,
          }),
        ]

    return {
      currentNodeId: state.currentNodeId,
      messages: [...messagesWithUser, ...botMessages],
      recentlySuggested: nextRecentlySuggested,
      lastUserInput: trimmed,
      audienceContext: state.audienceContext ?? null,
    }
  }

  const exploratory = hasExploratoryMarker(intentInput)
  const articleResults = searchArticles(normalizedInput, { exploratory })
  const articleBestScore = articleResults[0]?.score ?? 1

  const matches = matchResources({
    input: normalizedInput,
    keywordIndex: config.keywordIndex,
    resources: config.resources,
    maxSuggestions: 10,
    minScore: config.rules.minScore,
    fuzzyDistanceThreshold: config.rules.fuzzyDistanceThreshold,
  })

  const numericSafeMatches = filterVaccinationFalsePositives(
    filterAudienceMatches(
      filterSensitiveMatches(
        filterLowConfidenceSensitiveMatches(
          filterMissingRequiredNumbers(matches, normalizedInput),
          config.rules.minScore,
        ),
      ),
      state.audienceContext ?? null,
    ),
    normalizedInput,
  )

  const matcherHasExactMatch = numericSafeMatches.some((match) => match.score >= MATCHER_EXACT_SCORE)
  const matcherSensitive = hasSensitiveMatch(numericSafeMatches)

  const articleTopResourceId = articleResults[0]?.resourceId
  const matcherTopResourceId = numericSafeMatches[0]?.resource.id
  const articleAgreesWithMatcherTop =
    articleTopResourceId !== undefined &&
    matcherTopResourceId !== undefined &&
    articleTopResourceId === matcherTopResourceId
  const articleHighConfidence =
    articleResults.length > 0 && articleBestScore <= ARTICLE_HIGH_CONFIDENCE_FUSE_SCORE

  const articleShouldWin =
    !matcherSensitive &&
    articleResults.length > 0 &&
    (
      // Exploratoire + haute confiance : prioritaire même si le matcher a un match exact
      (exploratory && articleHighConfidence) ||
      // Exploratoire (toute confiance) : prioritaire sauf si le matcher a un match exact
      (exploratory && !matcherHasExactMatch) ||
      // Non-exploratoire + haute confiance : prioritaire sauf si le matcher a un match exact
      (!exploratory && articleHighConfidence && !matcherHasExactMatch) ||
      // Non-exploratoire : matcher TOP == article TOP → afficher l'extrait pour la ressource commune
      (!exploratory && articleAgreesWithMatcherTop)
    )

  if (articleShouldWin) {
    // Agreement non-exploratoire : on contraint la recherche à la ressource du matcher pour
    // éviter qu'un article secondaire (bruit Fuse) ne s'invite si la ressource principale
    // est filtrée par recentlySuggested.
    const allowedResourceIds =
      !exploratory && articleAgreesWithMatcherTop && matcherTopResourceId !== undefined
        ? new Set([matcherTopResourceId])
        : undefined

    const priorityArticleState = buildArticleSearchState(
      config,
      messagesWithUser,
      state.recentlySuggested,
      trimmed,
      state.audienceContext ?? null,
      articleResults,
      allowedResourceIds,
    )

    if (priorityArticleState) {
      return priorityArticleState
    }
  }

  if (numericSafeMatches.length > 0) {
    const filteredMatches = filterRecentlySuggested(numericSafeMatches, state.recentlySuggested)
    if (!filteredMatches.length) {
      return buildFallbackState(config, messagesWithUser, state.recentlySuggested, undefined, state.audienceContext)
    }
    const suggestions = hasSensitiveMatch(filteredMatches)
      ? filteredMatches
      : filteredMatches.slice(0, config.rules.maxSuggestions)
    const articleSearchState =
      !hasSensitiveMatch(suggestions) && hasArticleInfoIntent(normalizedInput)
        ? buildArticleSearchState(
            config,
            messagesWithUser,
            state.recentlySuggested,
            trimmed,
            state.audienceContext ?? null,
            articleResults,
            new Set(getSuggestionResourceIds(suggestions)),
          )
        : undefined

    if (articleSearchState) {
      return articleSearchState
    }

    return {
      currentNodeId: state.currentNodeId,
      messages: [...messagesWithUser, ...buildSuggestionMessages("Je vous conseille :", suggestions)],
      recentlySuggested: appendRecentlySuggested(state.recentlySuggested, getSuggestionResourceIds(suggestions)),
      lastUserInput: trimmed,
      audienceContext: state.audienceContext ?? null,
    }
  }

  const fuzzyMatches = filterRecentlySuggested(
    filterAudienceMatches(
      filterVaccinationFalsePositives(
        suggestionsFromResources(searchResourcesFuzzy(normalizedInput, config)),
        normalizedInput,
      ),
      state.audienceContext ?? null,
    ),
    state.recentlySuggested,
  )

  if (fuzzyMatches.length > 0) {
    const articleSearchState = hasArticleInfoIntent(normalizedInput)
      ? buildArticleSearchState(
          config,
          messagesWithUser,
          state.recentlySuggested,
          trimmed,
          state.audienceContext ?? null,
          articleResults,
          new Set(getSuggestionResourceIds(fuzzyMatches)),
        )
      : undefined

    if (articleSearchState) {
      return articleSearchState
    }

    return {
      currentNodeId: state.currentNodeId,
      messages: [
        ...messagesWithUser,
        ...buildSuggestionMessages("Je ne suis pas sûr d'avoir bien compris, peut-être cherchez-vous :", fuzzyMatches),
      ],
      recentlySuggested: appendRecentlySuggested(state.recentlySuggested, getSuggestionResourceIds(fuzzyMatches)),
      lastUserInput: trimmed,
      audienceContext: state.audienceContext ?? null,
    }
  }

  const articleSearchState = buildArticleSearchState(
    config,
    messagesWithUser,
    state.recentlySuggested,
    trimmed,
    state.audienceContext ?? null,
    articleResults,
  )

  if (articleSearchState) {
    return articleSearchState
  }

  return {
    ...buildFallbackState(config, messagesWithUser, state.recentlySuggested, undefined, state.audienceContext),
    lastUserInput: trimmed,
  }
}

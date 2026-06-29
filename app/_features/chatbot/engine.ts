import { matchResources } from "./matcher"
import { normalizeText } from "./normalize"
import { detectConversationalIntent } from "./intents"
import { isSafeExternalHref, isSafeInternalHref } from "./links"
import type {
  ChatMessage,
  ChatNode,
  ChatResource,
  ChatbotConfig,
  ChatbotState,
  QuickReply,
  ResourceMatch,
} from "./types"

export const CHATBOT_HISTORY_KEY = "cpts_chatbot_history"
const MAX_USER_INPUT_LENGTH = 300
const CHATBOT_PRIVACY_NOTICE =
  "Cet échange n'est pas enregistré sur nos serveurs. L'historique est conservé localement sur votre navigateur et supprimé à la fermeture."
const CHATBOT_HISTORY_VERSION = 4
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

function appendUserMessageWithPrivacyNotice(messages: ChatMessage[], text: string): ChatMessage[] {
  const nextMessages = [...messages, createMessage("user", text)]
  const hasPreviousUserMessage = messages.some((message) => message.role === "user")

  if (hasPreviousUserMessage) {
    return nextMessages
  }

  return [...nextMessages, createMessage("bot", CHATBOT_PRIVACY_NOTICE)]
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
  const nextMessages = [...state.messages]
  let nextNodeId = state.currentNodeId

  if (quickReply.message) {
    nextMessages.push(createMessage("bot", quickReply.message))
  }

  if (quickReply.actionResourceIds?.length) {
    const suggestions = suggestionsFromResourceIds(config, quickReply.actionResourceIds)

    if (suggestions.length) {
      nextMessages.push(...buildSuggestionMessages("Je vous conseille :", suggestions))
    }
  }

  if (quickReply.nextNodeId) {
    const nextNode = resolveNode(config, quickReply.nextNodeId)
    nextMessages.push(...buildNodeMessages(config, nextNode))
    nextNodeId = nextNode.id
  }

  const nextState = {
    currentNodeId: nextNodeId,
    messages: nextMessages,
  }

  return nextState
}

// Hydratation sessionStorage : le contenu est forgeable côté client. On ne fait
// donc JAMAIS confiance à `parsed.state`. On valide chaque entrée ET on
// reconstruit un objet propre, en ne recopiant que les champs whitelistés et en
// rejetant tout lien qui n'est pas sûr (même politique que le rendu). Au moindre
// champ invalide, on renvoie null → l'historique est purgé et on repart à zéro.

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object"
}

function optionalString(value: unknown): string | undefined {
  return typeof value === "string" ? value : undefined
}

function normalizeResource(value: unknown): ChatResource | null {
  if (!isRecord(value) || typeof value.id !== "string" || typeof value.title !== "string") {
    return null
  }

  const base = { id: value.id, title: value.title, description: optionalString(value.description) }

  if (value.type === "internal" && typeof value.href === "string" && isSafeInternalHref(value.href)) {
    return { ...base, type: "internal", href: value.href }
  }

  if (
    value.type === "external" &&
    typeof value.href === "string" &&
    (isSafeInternalHref(value.href) || isSafeExternalHref(value.href))
  ) {
    return { ...base, type: "external", href: value.href }
  }

  if (value.type === "email" && typeof value.value === "string") {
    return { ...base, type: "email", value: value.value }
  }

  if (value.type === "phone" && typeof value.value === "string") {
    return { ...base, type: "phone", value: value.value }
  }

  return null
}

function normalizeQuickReply(value: unknown): QuickReply | null {
  if (!isRecord(value) || typeof value.id !== "string" || typeof value.label !== "string" || typeof value.value !== "string") {
    return null
  }

  const actionResourceIds =
    Array.isArray(value.actionResourceIds) && value.actionResourceIds.every((id) => typeof id === "string")
      ? (value.actionResourceIds as string[])
      : undefined

  return {
    id: value.id,
    label: value.label,
    value: value.value,
    message: optionalString(value.message),
    nextNodeId: optionalString(value.nextNodeId),
    actionResourceIds,
  }
}

function normalizeResourceMatch(value: unknown): ResourceMatch | null {
  if (!isRecord(value) || typeof value.score !== "number" || typeof value.matchedKeyword !== "string") {
    return null
  }

  const resource = normalizeResource(value.resource)
  if (!resource) {
    return null
  }

  return { resource, score: value.score, matchedKeyword: value.matchedKeyword }
}

function normalizeArray<T>(value: unknown, normalizeItem: (item: unknown) => T | null): T[] | null | undefined {
  if (value === undefined) {
    return undefined
  }

  if (!Array.isArray(value)) {
    return null
  }

  const normalized: T[] = []
  for (const item of value) {
    const normalizedItem = normalizeItem(item)
    if (!normalizedItem) {
      return null
    }
    normalized.push(normalizedItem)
  }

  return normalized
}

function normalizeMessage(value: unknown): ChatMessage | null {
  if (!isRecord(value) || typeof value.id !== "string" || (value.role !== "user" && value.role !== "bot")) {
    return null
  }

  if (typeof value.text !== "string" || typeof value.timestamp !== "number") {
    return null
  }

  const quickReplies = normalizeArray(value.quickReplies, normalizeQuickReply)
  if (quickReplies === null) {
    return null
  }

  const suggestions = normalizeArray(value.suggestions, normalizeResourceMatch)
  if (suggestions === null) {
    return null
  }

  return { id: value.id, role: value.role, text: value.text, timestamp: value.timestamp, quickReplies, suggestions }
}

function normalizePersistedState(value: unknown): ChatbotState | null {
  if (!isRecord(value) || typeof value.currentNodeId !== "string" || !Array.isArray(value.messages)) {
    return null
  }

  const messages = normalizeArray(value.messages, normalizeMessage)
  if (!messages) {
    return null
  }

  return { currentNodeId: value.currentNodeId, messages }
}

export function createInitialState(config: ChatbotConfig): ChatbotState {
  const startNode = resolveNode(config, config.rules.startNodeId)

  return {
    currentNodeId: startNode.id,
    messages: buildNodeMessages(config, startNode),
  }
}

function clearPersistedState(): void {
  if (!isBrowser()) {
    return
  }

  try {
    window.sessionStorage.removeItem(CHATBOT_HISTORY_KEY)
  } catch {
    // sessionStorage indisponible (mode privé strict, quota) : on ignore.
  }
}

export function hydrateState(config: ChatbotConfig): ChatbotState {
  if (!isBrowser()) {
    return createInitialState(config)
  }

  try {
    const raw = window.sessionStorage.getItem(CHATBOT_HISTORY_KEY)
    if (!raw) {
      return createInitialState(config)
    }

    const parsed: unknown = JSON.parse(raw)
    if (isRecord(parsed) && parsed.version === CHATBOT_HISTORY_VERSION) {
      const normalizedState = normalizePersistedState(parsed.state)
      if (normalizedState) {
        return normalizedState
      }
    }

    // Historique forgé, corrompu ou d'une version obsolète : on le purge.
    clearPersistedState()
    return createInitialState(config)
  } catch {
    clearPersistedState()
    return createInitialState(config)
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
    messages: appendUserMessageWithPrivacyNotice(state.messages, quickReply.label),
  }

  return applyQuickReplyWithoutUserMessage(stateWithUserMessage, config, quickReply)
}

export function processUserInput(
  state: ChatbotState,
  input: string,
  config: ChatbotConfig,
): ChatbotState {
  const trimmed = input.trim().slice(0, MAX_USER_INPUT_LENGTH)

  if (!trimmed) {
    return state
  }

  const messagesWithUser = appendUserMessageWithPrivacyNotice(state.messages, trimmed)
  const normalizedInput = normalizeText(trimmed)
  const currentNode = resolveNode(config, state.currentNodeId)
  const matchedQuickReply = findTextQuickReply(currentNode, normalizedInput)

  if (matchedQuickReply) {
    return applyQuickReplyWithoutUserMessage(
      {
        ...state,
        messages: messagesWithUser,
      },
      config,
      matchedQuickReply,
    )
  }

  const startNodeQuickReplies = resolveNode(config, config.rules.startNodeId).quickReplies ?? []
  const conversationalIntent = detectConversationalIntent(normalizedInput, startNodeQuickReplies)

  if (conversationalIntent) {
    const suggestions = conversationalIntent.resourceIds
      ? suggestionsFromResourceIds(config, conversationalIntent.resourceIds)
      : undefined
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
    }
  }

  const matches = matchResources({
    input: normalizedInput,
    keywordIndex: config.keywordIndex,
    resources: config.resources,
    maxSuggestions: config.rules.maxSuggestions,
    minScore: config.rules.minScore,
    fuzzyDistanceThreshold: config.rules.fuzzyDistanceThreshold,
  })

  if (matches.length > 0) {
    return {
      currentNodeId: state.currentNodeId,
      messages: [...messagesWithUser, ...buildSuggestionMessages("Je vous conseille :", matches)],
    }
  }

  const fallbackNode = resolveNode(config, config.rules.fallbackNodeId)

  return {
    currentNodeId: fallbackNode.id,
    messages: [...messagesWithUser, ...buildNodeMessages(config, fallbackNode)],
  }
}

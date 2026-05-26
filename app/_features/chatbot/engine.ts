import { matchResources } from "./matcher"
import { normalizeText } from "./normalize"
import { detectConversationalIntent } from "./intents"
import { searchResourcesFuzzy } from "./fuzzySearch"
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

function isPersistedState(value: unknown): value is ChatbotState {
  if (!value || typeof value !== "object") {
    return false
  }

  const candidate = value as ChatbotState

  return typeof candidate.currentNodeId === "string" && Array.isArray(candidate.messages)
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

      return parsed.state
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

  const fuzzyMatches = suggestionsFromResources(searchResourcesFuzzy(normalizedInput, config))

  if (fuzzyMatches.length > 0) {
    return {
      currentNodeId: state.currentNodeId,
      messages: [
        ...messagesWithUser,
        ...buildSuggestionMessages("Je ne suis pas sûr d'avoir bien compris, peut-être cherchez-vous :", fuzzyMatches),
      ],
    }
  }

  const fallbackNode = resolveNode(config, config.rules.fallbackNodeId)

  return {
    currentNodeId: fallbackNode.id,
    messages: [...messagesWithUser, ...buildNodeMessages(config, fallbackNode)],
  }
}

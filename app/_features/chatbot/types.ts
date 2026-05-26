export type ResourceType = "internal" | "external" | "email" | "phone"

export interface BaseResource {
  id: string
  title: string
  description?: string
  isSensitive?: boolean
  sensitivityCategory?: "violence" | "suicide" | "danger-vital"
}

export interface InternalResource extends BaseResource {
  type: "internal"
  href: string
}

export interface ExternalResource extends BaseResource {
  type: "external"
  href: string
}

export interface EmailResource extends BaseResource {
  type: "email"
  value: string
}

export interface PhoneResource extends BaseResource {
  type: "phone"
  value: string
}

export type ChatResource = InternalResource | ExternalResource | EmailResource | PhoneResource

export interface QuickReply {
  id: string
  label: string
  value: string
  message?: string
  nextNodeId?: string
  actionResourceIds?: string[]
}

export interface NodeAction {
  type: "suggest_resources"
  resourceIds: string[]
  message?: string
}

export interface ChatNode {
  id: string
  message: string
  quickReplies?: QuickReply[]
  actions?: NodeAction[]
}

export interface KeywordIndexEntry {
  keyword: string
  resourceId: string
  scoreBoost?: number
}

export interface DecisionRule {
  id: string
  trigger: "quick_reply_text" | "keyword_detected" | "no_match"
  description: string
}

export interface ChatbotRules {
  startNodeId: string
  fallbackNodeId: string
  restartNodeId?: string
  maxSuggestions: number
  minScore: number
  fuzzyDistanceThreshold: number
  decisionRules: DecisionRule[]
}

export interface ChatbotConfig {
  nodes: Record<string, ChatNode>
  resources: Record<string, ChatResource>
  keywordIndex: KeywordIndexEntry[]
  rules: ChatbotRules
}

export interface ResourceMatch {
  resource: ChatResource
  score: number
  matchedKeyword: string
}

export interface ChatMessage {
  id: string
  role: "user" | "bot"
  text: string
  timestamp: number
  quickReplies?: QuickReply[]
  suggestions?: ResourceMatch[]
}

export interface ChatbotState {
  currentNodeId: string
  messages: ChatMessage[]
  recentlySuggested: string[]
  lastUserInput?: string
}

export type ChatbotPageContext = "default" | "error-page"

"use client"

import { createContext, useCallback, useContext, useMemo, useState } from "react"
import type { ReactNode } from "react"

import type { ChatbotPageContext } from "./types"

interface ChatbotContextValue {
  context: ChatbotPageContext
  setContext: (context: ChatbotPageContext) => void
}

const ChatbotPageContextReact = createContext<ChatbotContextValue | null>(null)

export function ChatbotProvider({ children }: { children: ReactNode }) {
  const [context, setContextValue] = useState<ChatbotPageContext>("default")

  const setContext = useCallback((next: ChatbotPageContext) => {
    setContextValue(next)
  }, [])

  const value = useMemo<ChatbotContextValue>(() => ({ context, setContext }), [context, setContext])

  return <ChatbotPageContextReact.Provider value={value}>{children}</ChatbotPageContextReact.Provider>
}

export function useChatbotContext(): ChatbotContextValue {
  const value = useContext(ChatbotPageContextReact)
  if (!value) {
    return { context: "default", setContext: () => undefined }
  }
  return value
}

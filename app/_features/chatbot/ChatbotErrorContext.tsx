"use client"

import { useEffect } from "react"

import { useChatbotContext } from "./ChatbotContext"

export function ChatbotErrorContext() {
  const { setContext } = useChatbotContext()

  useEffect(() => {
    setContext("error-page")
    return () => setContext("default")
  }, [setContext])

  return null
}

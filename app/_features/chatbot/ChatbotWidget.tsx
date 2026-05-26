"use client"

import dynamic from "next/dynamic"
import { BotMessageSquare, X } from "lucide-react"
import { useCallback, useEffect, useRef, useState } from "react"

import { chatbotConfig } from "./chatbot.config"
import { useChatbotContext } from "./ChatbotContext"
import {
  CHATBOT_HISTORY_KEY,
  createInitialState,
  hydrateState,
  persistState,
  processQuickReply,
  processUserInput,
  restartConversation,
} from "./engine"
import type { QuickReply } from "./types"
import { useChatbotAnalytics } from "./useChatbotAnalytics"

const PANEL_ID = "cpts-chatbot-panel"
const FOCUSABLE_SELECTOR =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

const COMPANION_LABEL_STORAGE_KEY = "cpts_chatbot_label_seen"
const COMPANION_LABEL_SHOW_DELAY_MS = 3000
const COMPANION_LABEL_AUTO_DISMISS_MS = 8000

const ChatWindow = dynamic(() => import("./ChatWindow").then((module) => module.ChatWindow), {
  ssr: false,
})

export function ChatbotWidget() {
  const { context } = useChatbotContext()
  const { trackEvent } = useChatbotAnalytics()
  const [isOpen, setIsOpen] = useState(false)
  const [isHydratedFromStorage, setIsHydratedFromStorage] = useState(false)
  const [state, setState] = useState(() => createInitialState(chatbotConfig))
  const [isCompanionLabelVisible, setIsCompanionLabelVisible] = useState(false)
  const fabRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const wasOpenRef = useRef(false)
  const openedAtRef = useRef<number | null>(null)
  const previousNodeIdRef = useRef(state.currentNodeId)
  const lastUserInputLengthRef = useRef(0)

  const closeChatbot = useCallback(() => {
    const openedAt = openedAtRef.current
    const sessionDurationSeconds = openedAt ? Math.max(0, Math.round((Date.now() - openedAt) / 1000)) : 0

    trackEvent("chatbot_closed", {
      session_duration_seconds: sessionDurationSeconds,
      messages_count: state.messages.length,
    })
    openedAtRef.current = null
    setIsOpen(false)
  }, [state.messages.length, trackEvent])

  const openChatbot = useCallback(() => {
    if (!isHydratedFromStorage) {
      setState(hydrateState(chatbotConfig, { context }))
      setIsHydratedFromStorage(true)
    }

    openedAtRef.current = Date.now()
    trackEvent("chatbot_opened", { context })
    setIsOpen(true)
  }, [context, isHydratedFromStorage, trackEvent])

  useEffect(() => {
    if (isHydratedFromStorage) {
      return
    }
    if (typeof window === "undefined") {
      return
    }
    if (window.sessionStorage.getItem(CHATBOT_HISTORY_KEY)) {
      return
    }

    setState(createInitialState(chatbotConfig, { context }))
  }, [context, isHydratedFromStorage])

  useEffect(() => {
    if (!isHydratedFromStorage) {
      return
    }

    const timeoutId = window.setTimeout(() => {
      persistState(state)
    }, 120)

    return () => window.clearTimeout(timeoutId)
  }, [isHydratedFromStorage, state])

  useEffect(() => {
    if (!isOpen) {
      return
    }

    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeChatbot()
      }
    }

    window.addEventListener("keydown", onEscape)
    return () => window.removeEventListener("keydown", onEscape)
  }, [closeChatbot, isOpen])

  useEffect(() => {
    if (!isOpen) {
      return
    }

    const panel = panelRef.current
    if (!panel) {
      return
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Tab") {
        return
      }

      const focusable = panel.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
      if (focusable.length === 0) {
        return
      }

      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      const active = document.activeElement

      if (event.shiftKey && active === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && active === last) {
        event.preventDefault()
        first.focus()
      }
    }

    panel.addEventListener("keydown", handleKeyDown)
    return () => panel.removeEventListener("keydown", handleKeyDown)
  }, [isOpen])

  useEffect(() => {
    if (wasOpenRef.current && !isOpen) {
      fabRef.current?.focus()
    }
    wasOpenRef.current = isOpen
  }, [isOpen])

  useEffect(() => {
    if (previousNodeIdRef.current !== "fallback" && state.currentNodeId === "fallback") {
      trackEvent("chatbot_fallback", {
        user_input_length: lastUserInputLengthRef.current,
      })
    }

    previousNodeIdRef.current = state.currentNodeId
  }, [state.currentNodeId, trackEvent])

  useEffect(() => {
    if (typeof window === "undefined") {
      return
    }

    if (window.sessionStorage.getItem(COMPANION_LABEL_STORAGE_KEY) === "true") {
      return
    }

    const hasHistory = Boolean(window.sessionStorage.getItem("cpts_chatbot_history"))
    if (hasHistory) {
      return
    }

    const showTimeoutId = window.setTimeout(() => {
      setIsCompanionLabelVisible(true)
    }, COMPANION_LABEL_SHOW_DELAY_MS)

    return () => window.clearTimeout(showTimeoutId)
  }, [])

  useEffect(() => {
    if (!isCompanionLabelVisible) {
      return
    }

    const dismiss = () => {
      setIsCompanionLabelVisible(false)
      window.sessionStorage.setItem(COMPANION_LABEL_STORAGE_KEY, "true")
    }

    const autoDismissId = window.setTimeout(dismiss, COMPANION_LABEL_AUTO_DISMISS_MS)
    const onScroll = () => dismiss()
    window.addEventListener("scroll", onScroll, { passive: true, once: true })

    return () => {
      window.clearTimeout(autoDismissId)
      window.removeEventListener("scroll", onScroll)
    }
  }, [isCompanionLabelVisible])

  const handleSend = (input: string) => {
    lastUserInputLengthRef.current = input.length
    setState((previousState) => processUserInput(previousState, input, chatbotConfig))
  }

  const handleQuickReply = (quickReply: QuickReply) => {
    lastUserInputLengthRef.current = 0
    setState((previousState) => processQuickReply(previousState, quickReply, chatbotConfig))
  }

  const handleRestart = () => {
    setState(restartConversation(chatbotConfig))
  }

  const handleToggleOpen = () => {
    if (isCompanionLabelVisible) {
      setIsCompanionLabelVisible(false)
      if (typeof window !== "undefined") {
        window.sessionStorage.setItem(COMPANION_LABEL_STORAGE_KEY, "true")
      }
    }

    if (isOpen) {
      closeChatbot()
      return
    }

    openChatbot()
  }

  return (
    <>
      {isOpen ? (
        <div
          id={PANEL_ID}
          ref={panelRef}
          role="dialog"
          aria-modal="false"
          aria-labelledby="chatbot-title"
          className="fixed bottom-20 left-3 right-3 z-[70] sm:bottom-24 sm:left-auto sm:right-4 sm:w-[26rem]"
        >
          <ChatWindow
            currentNodeId={state.currentNodeId}
            messages={state.messages}
            onSend={handleSend}
            onQuickReply={handleQuickReply}
            onRestart={handleRestart}
            onClose={closeChatbot}
          />
        </div>
      ) : null}

      <div className="fixed bottom-4 right-4 z-[70] flex items-center gap-3">
        {!isOpen && isCompanionLabelVisible ? (
          <div
            aria-hidden="true"
            className="hidden max-w-[280px] items-center rounded-2xl border border-border bg-card px-4 py-2 text-sm font-medium text-foreground shadow-lg motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-right-2 sm:flex"
          >
            Besoin d&apos;aide pour trouver une ressource&nbsp;?
          </div>
        ) : null}

        <button
          ref={fabRef}
          type="button"
          className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-xl motion-safe:transition-all motion-safe:hover:scale-[1.02] hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          onClick={handleToggleOpen}
          aria-haspopup="dialog"
          aria-expanded={isOpen}
          aria-controls={PANEL_ID}
          aria-label={isOpen ? "Fermer le chatbot" : "Ouvrir le chatbot"}
        >
          {isOpen ? <X className="size-7" /> : <BotMessageSquare className="size-7" />}
        </button>
      </div>
    </>
  )
}

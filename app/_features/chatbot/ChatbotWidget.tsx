"use client"

import dynamic from "next/dynamic"
import { MessageCircle, X } from "lucide-react"
import { useEffect, useRef, useState } from "react"

import { chatbotConfig } from "./chatbot.config"
import {
  createInitialState,
  hydrateState,
  persistState,
  processQuickReply,
  processUserInput,
  restartConversation,
} from "./engine"
import type { QuickReply } from "./types"

const PANEL_ID = "cpts-chatbot-panel"
const ChatWindow = dynamic(() => import("./ChatWindow").then((module) => module.ChatWindow), {
  ssr: false,
})

export function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [isHydratedFromStorage, setIsHydratedFromStorage] = useState(false)
  const [state, setState] = useState(() => createInitialState(chatbotConfig))
  const triggerRef = useRef<HTMLButtonElement>(null)

  const closeChatbot = () => {
    setIsOpen(false)
    // Rend le focus au bouton déclencheur (clavier / lecteur d'écran).
    triggerRef.current?.focus()
  }

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
  }, [isOpen])

  const handleSend = (input: string) => {
    setState((previousState) => processUserInput(previousState, input, chatbotConfig))
  }

  const handleQuickReply = (quickReply: QuickReply) => {
    setState((previousState) => processQuickReply(previousState, quickReply, chatbotConfig))
  }

  const handleRestart = () => {
    setState(restartConversation(chatbotConfig))
  }

  const handleToggleOpen = () => {
    if (!isOpen && !isHydratedFromStorage) {
      setState(hydrateState(chatbotConfig))
      setIsHydratedFromStorage(true)
    }

    setIsOpen((currentValue) => !currentValue)
  }

  return (
    <>
      {isOpen ? (
        <div
          id={PANEL_ID}
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

      <button
        ref={triggerRef}
        type="button"
        className="fixed bottom-4 right-4 z-[70] inline-flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-xl transition-all hover:scale-[1.02] hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        onClick={handleToggleOpen}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-controls={PANEL_ID}
        aria-label={isOpen ? "Fermer le chatbot" : "Ouvrir le chatbot"}
      >
        {isOpen ? <X className="size-6" /> : <MessageCircle className="size-6" />}
      </button>
    </>
  )
}

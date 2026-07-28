"use client"

import { Info, RotateCcw, Send, X } from "lucide-react"
import { useEffect, useMemo, useRef, useState } from "react"
import type { FormEvent } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import { MessageBubble } from "./MessageBubble"
import { PrivacyModal } from "./PrivacyModal"
import { QuickReplies } from "./QuickReplies"
import type { ChatMessage, QuickReply } from "./types"
import { useChatbotAnalytics } from "./useChatbotAnalytics"

const MAX_MESSAGE_LENGTH = 300
const MESSAGE_TOO_LONG_ERROR = "Message trop long (300 caractères max)"
export const QUICK_REPLIES_INITIAL_COUNT = 4

function useReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    setPrefersReducedMotion(mediaQuery.matches)

    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches)
    }

    mediaQuery.addEventListener("change", handleChange)
    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [])

  return prefersReducedMotion
}

interface ChatWindowProps {
  currentNodeId: string
  messages: ChatMessage[]
  panelHeight?: number
  onSend: (input: string) => void
  onQuickReply: (reply: QuickReply) => void
  onRestart: () => void
  onClose: () => void
}

export function ChatWindow({
  currentNodeId,
  messages,
  panelHeight,
  onSend,
  onQuickReply,
  onRestart,
  onClose,
}: ChatWindowProps) {
  const { trackEvent } = useChatbotAnalytics()
  const [draft, setDraft] = useState("")
  const [inputError, setInputError] = useState<string | null>(null)
  const [isStartQuickRepliesExpanded, setIsStartQuickRepliesExpanded] = useState(false)
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false)
  const [isAwaitingRestartConfirm, setIsAwaitingRestartConfirm] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const cancelRestartRef = useRef<HTMLButtonElement>(null)
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: prefersReducedMotion ? "auto" : "smooth",
      block: "end",
    })
  }, [isAwaitingRestartConfirm, messages, prefersReducedMotion])

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    setIsStartQuickRepliesExpanded(false)
  }, [currentNodeId, messages.length])

  useEffect(() => {
    if (isAwaitingRestartConfirm) {
      cancelRestartRef.current?.focus()
    }
  }, [isAwaitingRestartConfirm])

  const latestQuickReplies = useMemo(() => {
    const reversed = [...messages].reverse()
    const lastBotMessageWithQuickReplies = reversed.find(
      (message) => message.role === "bot" && (message.quickReplies?.length ?? 0) > 0,
    )

    return lastBotMessageWithQuickReplies?.quickReplies ?? []
  }, [messages])

  const shouldLimitStartQuickReplies =
    currentNodeId === "start" &&
    !isStartQuickRepliesExpanded &&
    latestQuickReplies.length > QUICK_REPLIES_INITIAL_COUNT

  const visibleQuickReplies = shouldLimitStartQuickReplies
    ? latestQuickReplies.slice(0, QUICK_REPLIES_INITIAL_COUNT)
    : latestQuickReplies

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (isAwaitingRestartConfirm) {
      return
    }

    const value = draft.trim()
    if (!value) {
      setInputError(null)
      return
    }

    if (value.length > MAX_MESSAGE_LENGTH) {
      setInputError(MESSAGE_TOO_LONG_ERROR)
      return
    }

    onSend(value)
    setDraft("")
    setInputError(null)
  }

  const handleQuickReply = (reply: QuickReply) => {
    setIsAwaitingRestartConfirm(false)
    trackEvent("chatbot_quick_reply", {
      quick_reply_id: reply.id,
      quick_reply_label: reply.label,
      source_node_id: currentNodeId,
    })
    onQuickReply(reply)
  }

  const handleRequestRestart = () => {
    setInputError(null)
    setIsAwaitingRestartConfirm(true)
  }

  const handleConfirmRestart = () => {
    trackEvent("chatbot_restart", {})
    setIsAwaitingRestartConfirm(false)
    onRestart()
  }

  const handleCancelRestart = () => {
    setIsAwaitingRestartConfirm(false)
  }

  const handleClose = () => {
    setIsAwaitingRestartConfirm(false)
    onClose()
  }

  return (
    <div
      className="flex h-[min(72vh,36rem)] w-full flex-col overflow-hidden rounded-3xl border border-border bg-background shadow-2xl"
      style={panelHeight ? { height: panelHeight } : undefined}
    >
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div>
          <p id="chatbot-title" className="text-sm font-semibold text-foreground">
            Assistant CPTS
          </p>
          <p className="text-xs text-muted-foreground">Orientation par mots-clés</p>
        </div>
        <div className="flex items-center gap-1">
          <Button
            type="button"
            size="icon-sm"
            variant="ghost"
            onClick={handleRequestRestart}
            aria-label="Recommencer la conversation"
            aria-expanded={isAwaitingRestartConfirm}
          >
            <RotateCcw className="size-4" />
          </Button>
          <Button
            type="button"
            size="icon-sm"
            variant="ghost"
            onClick={() => setIsPrivacyOpen(true)}
            aria-label="Informations sur la confidentialité"
          >
            <Info className="size-4" />
          </Button>
          <Button type="button" size="icon-sm" variant="ghost" onClick={handleClose} aria-label="Fermer la fenêtre chatbot">
            <X className="size-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto px-3 py-3" aria-live="polite" aria-label="Historique des messages">
        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
            onInternalResourceClick={handleClose}
          />
        ))}
        {isAwaitingRestartConfirm ? (
          <div className="flex justify-start">
            <div className="max-w-[90%] rounded-2xl rounded-bl-sm border border-border bg-card px-4 py-3 text-sm leading-relaxed text-card-foreground shadow-sm">
              <p className="whitespace-pre-line">
                Voulez-vous vraiment recommencer la conversation ? Tout l&apos;historique sera effacé.
              </p>
            </div>
          </div>
        ) : null}
        <div ref={bottomRef} />
      </div>

      {isAwaitingRestartConfirm ? (
        <div className="border-t border-border px-3 py-3" aria-label="Confirmation de redémarrage">
          <div className="flex flex-wrap gap-2">
            <Button type="button" size="sm" variant="destructive" onClick={handleConfirmRestart}>
              Oui, recommencer
            </Button>
            <Button ref={cancelRestartRef} type="button" size="sm" variant="outline" onClick={handleCancelRestart}>
              Non, annuler
            </Button>
          </div>
        </div>
      ) : (
        <QuickReplies
          replies={visibleQuickReplies}
          onSelect={handleQuickReply}
          trailingAction={
            shouldLimitStartQuickReplies
              ? {
                  label: "Voir plus de catégories",
                  onClick: () => setIsStartQuickRepliesExpanded(true),
                }
              : undefined
          }
        />
      )}

      <form className="border-t border-border p-3" onSubmit={handleSubmit}>
        <label htmlFor="chatbot-input" className="sr-only">
          Votre message
        </label>
        <div className="flex items-center gap-2">
          <Input
            id="chatbot-input"
            ref={inputRef}
            value={draft}
            disabled={isAwaitingRestartConfirm}
            onChange={(event) => {
              setDraft(event.target.value)
              if (inputError) {
                setInputError(null)
              }
            }}
            placeholder={isAwaitingRestartConfirm ? "Confirmez votre choix ci-dessus..." : "Ex: Je cherche un médecin traitant"}
            autoComplete="off"
            aria-invalid={Boolean(inputError)}
            aria-describedby={inputError ? "chatbot-input-error" : undefined}
          />
          <Button type="submit" size="icon" disabled={isAwaitingRestartConfirm} aria-label="Envoyer le message">
            <Send className="size-4" />
          </Button>
        </div>
        {inputError ? (
          <p id="chatbot-input-error" className="mt-2 text-xs font-medium text-destructive">
            {inputError}
          </p>
        ) : null}
      </form>

      <PrivacyModal open={isPrivacyOpen} onOpenChange={setIsPrivacyOpen} />
    </div>
  )
}

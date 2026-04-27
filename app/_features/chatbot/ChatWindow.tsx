"use client"

import { RotateCcw, Send, X } from "lucide-react"
import { useEffect, useMemo, useRef, useState } from "react"
import type { FormEvent } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import { MessageBubble } from "./MessageBubble"
import { QuickReplies } from "./QuickReplies"
import type { ChatMessage, QuickReply } from "./types"

const MAX_MESSAGE_LENGTH = 300
const MESSAGE_TOO_LONG_ERROR = "Message trop long (300 caractères max)"
export const QUICK_REPLIES_INITIAL_COUNT = 4

interface ChatWindowProps {
  currentNodeId: string
  messages: ChatMessage[]
  onSend: (input: string) => void
  onQuickReply: (reply: QuickReply) => void
  onRestart: () => void
  onClose: () => void
}

export function ChatWindow({ currentNodeId, messages, onSend, onQuickReply, onRestart, onClose }: ChatWindowProps) {
  const [draft, setDraft] = useState("")
  const [inputError, setInputError] = useState<string | null>(null)
  const [isStartQuickRepliesExpanded, setIsStartQuickRepliesExpanded] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" })
  }, [messages])

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    setIsStartQuickRepliesExpanded(false)
  }, [currentNodeId, messages.length])

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

  return (
    <div className="flex h-[min(72vh,36rem)] w-full flex-col overflow-hidden rounded-3xl border border-border bg-background shadow-2xl">
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
            onClick={onRestart}
            aria-label="Recommencer la conversation"
          >
            <RotateCcw className="size-4" />
          </Button>
          <Button type="button" size="icon-sm" variant="ghost" onClick={onClose} aria-label="Fermer la fenêtre chatbot">
            <X className="size-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto px-3 py-3" aria-live="polite" aria-label="Historique des messages">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
        <div ref={bottomRef} />
      </div>

      <QuickReplies
        replies={visibleQuickReplies}
        onSelect={onQuickReply}
        trailingAction={
          shouldLimitStartQuickReplies
            ? {
                label: "Voir plus de catégories",
                onClick: () => setIsStartQuickRepliesExpanded(true),
              }
            : undefined
        }
      />

      <form className="border-t border-border p-3" onSubmit={handleSubmit}>
        <label htmlFor="chatbot-input" className="sr-only">
          Votre message
        </label>
        <div className="flex items-center gap-2">
          <Input
            id="chatbot-input"
            ref={inputRef}
            value={draft}
            onChange={(event) => {
              setDraft(event.target.value)
              if (inputError) {
                setInputError(null)
              }
            }}
            placeholder="Ex: Je cherche un médecin traitant"
            autoComplete="off"
            aria-invalid={Boolean(inputError)}
            aria-describedby={inputError ? "chatbot-input-error" : undefined}
          />
          <Button type="submit" size="icon" aria-label="Envoyer le message">
            <Send className="size-4" />
          </Button>
        </div>
        {inputError ? (
          <p id="chatbot-input-error" className="mt-2 text-xs font-medium text-destructive">
            {inputError}
          </p>
        ) : null}
      </form>
    </div>
  )
}

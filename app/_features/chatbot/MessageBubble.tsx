import Link from "next/link"

import type { ChatMessage, ChatResource } from "./types"
import { useChatbotAnalytics } from "./useChatbotAnalytics"

interface MessageBubbleProps {
  message: ChatMessage
}

function resourceHref(resource: ChatResource): string {
  if (resource.type === "internal" || resource.type === "external") {
    return resource.href
  }

  if (resource.type === "email") {
    return `mailto:${resource.value}`
  }

  return `tel:${resource.value.replace(/\s+/g, "")}`
}

function resourceLabel(resource: ChatResource): string {
  if (resource.type === "email") {
    return `Email : ${resource.value}`
  }

  if (resource.type === "phone") {
    return `Téléphone : ${resource.value}`
  }

  return "Ouvrir la ressource"
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const { trackEvent } = useChatbotAnalytics()
  const isUser = message.role === "user"

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[90%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
          isUser
            ? "bg-primary text-primary-foreground rounded-br-sm"
            : "bg-card text-card-foreground border border-border rounded-bl-sm"
        }`}
      >
        <p className="whitespace-pre-line">{message.text}</p>

        {message.suggestions?.length ? (
          <ul className="mt-3 space-y-2" aria-label="Ressources proposées">
            {message.suggestions.map((suggestion) => {
              const href = resourceHref(suggestion.resource)
              const isInternal = suggestion.resource.type === "internal"
              const handleResourceClick = () => {
                trackEvent("chatbot_resource_clicked", {
                  resource_id: suggestion.resource.id,
                  resource_type: suggestion.resource.type,
                })
              }

              return (
                <li key={`${message.id}-${suggestion.resource.id}`}>
                  {isInternal ? (
                    <Link
                      href={href}
                      onClick={handleResourceClick}
                      className="block rounded-xl border border-border bg-background px-3 py-2 text-foreground motion-safe:transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <p className="font-medium">{suggestion.resource.title}</p>
                      {suggestion.resource.description ? (
                        <p className="mt-1 text-xs text-muted-foreground">{suggestion.resource.description}</p>
                      ) : null}
                      <p className="mt-2 text-xs font-medium text-primary">{resourceLabel(suggestion.resource)}</p>
                    </Link>
                  ) : (
                    <a
                      href={href}
                      onClick={handleResourceClick}
                      className="block rounded-xl border border-border bg-background px-3 py-2 text-foreground motion-safe:transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      target={suggestion.resource.type === "external" ? "_blank" : undefined}
                      rel={suggestion.resource.type === "external" ? "noreferrer noopener" : undefined}
                    >
                      <p className="font-medium">{suggestion.resource.title}</p>
                      {suggestion.resource.description ? (
                        <p className="mt-1 text-xs text-muted-foreground">{suggestion.resource.description}</p>
                      ) : null}
                      <p className="mt-2 text-xs font-medium text-primary">{resourceLabel(suggestion.resource)}</p>
                    </a>
                  )}
                </li>
              )
            })}
          </ul>
        ) : null}
      </div>
    </div>
  )
}

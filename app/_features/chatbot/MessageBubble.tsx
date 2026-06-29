import Link from "next/link"

import type { ChatMessage, ChatResource } from "./types"

interface MessageBubbleProps {
  message: ChatMessage
  onResourceNavigate?: () => void
}

// Défense en profondeur : on n'autorise que des liens internes (chemins
// racine `/...`) ou des URLs externes https explicites. Tout le reste
// (javascript:, data:, //hôte, etc.) retombe sur "#" et ne peut rien exécuter.
const UNSAFE_HREF_FALLBACK = "#"

// Refuse les caractères de contrôle (tab, retours ligne, NUL, DEL...) : ils
// n'apparaissent jamais dans un lien légitime et servent à masquer un protocole.
function hasControlChars(value: string): boolean {
  for (let index = 0; index < value.length; index += 1) {
    const code = value.charCodeAt(index)
    if (code < 32 || code === 127) {
      return true
    }
  }

  return false
}

function sanitizeLinkHref(href: string, allowAbsolute: boolean): string {
  if (hasControlChars(href)) {
    return UNSAFE_HREF_FALLBACK
  }

  if (href.startsWith("/") && !href.startsWith("//")) {
    return href
  }

  if (allowAbsolute && /^https:\/\//i.test(href)) {
    return href
  }

  return UNSAFE_HREF_FALLBACK
}

function resourceHref(resource: ChatResource): string {
  if (resource.type === "internal") {
    return sanitizeLinkHref(resource.href, false)
  }

  if (resource.type === "external") {
    return sanitizeLinkHref(resource.href, true)
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

export function MessageBubble({ message, onResourceNavigate }: MessageBubbleProps) {
  const isUser = message.role === "user"
  // Défense en profondeur : l'historique peut être hydraté depuis sessionStorage
  // (forgeable côté client). On ne rend la liste que si c'est réellement un tableau.
  const suggestions = Array.isArray(message.suggestions) ? message.suggestions : []

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

        {suggestions.length ? (
          <ul className="mt-3 space-y-2" aria-label="Ressources proposées">
            {suggestions.map((suggestion) => {
              const href = resourceHref(suggestion.resource)
              const isInternal = suggestion.resource.type === "internal"

              return (
                <li key={`${message.id}-${suggestion.resource.id}`}>
                  {isInternal ? (
                    <Link
                      href={href}
                      onClick={onResourceNavigate}
                      className="block rounded-xl border border-border bg-background px-3 py-2 text-foreground transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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
                      className="block rounded-xl border border-border bg-background px-3 py-2 text-foreground transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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

import type { ChatResource } from "./types"

type GtagWindow = Window & {
  gtag?: (command: string, eventName: string, parameters?: Record<string, unknown>) => void
}

type ChatbotAnalyticsEvent =
  | {
      eventName: "chatbot_opened"
      parameters: {
        context: "default" | "error-page"
      }
    }
  | {
      eventName: "chatbot_closed"
      parameters: {
        session_duration_seconds: number
        messages_count: number
      }
    }
  | {
      eventName: "chatbot_quick_reply"
      parameters: {
        quick_reply_id: string
        quick_reply_label: string
        source_node_id: string
      }
    }
  | {
      eventName: "chatbot_resource_clicked"
      parameters: {
        resource_id: string
        resource_type: ChatResource["type"]
      }
    }
  | {
      eventName: "chatbot_fallback"
      parameters: {
        user_input_length: number
      }
    }
  | {
      eventName: "chatbot_restart"
      parameters?: Record<string, never>
    }

function hasAnalyticsConsent(): boolean {
  if (typeof window === "undefined") {
    return false
  }

  try {
    return window.localStorage.getItem("cookie-consent") === "accepted"
  } catch {
    return false
  }
}

type ChatbotAnalyticsEventName = ChatbotAnalyticsEvent["eventName"]
type ChatbotAnalyticsParameters<TEventName extends ChatbotAnalyticsEventName> =
  Extract<ChatbotAnalyticsEvent, { eventName: TEventName }>["parameters"]

export function trackEvent<TEventName extends ChatbotAnalyticsEventName>(
  eventName: TEventName,
  parameters: ChatbotAnalyticsParameters<TEventName>,
): void {
  if (!hasAnalyticsConsent()) {
    return
  }

  const analyticsWindow = window as GtagWindow

  if (typeof analyticsWindow.gtag !== "function") {
    return
  }

  try {
    analyticsWindow.gtag("event", eventName, parameters)
  } catch {
    // Analytics must never block the chatbot UX.
  }
}

export function useChatbotAnalytics() {
  return {
    trackEvent,
  }
}

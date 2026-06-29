type GtagConsentArg = {
  analytics_storage?: "granted" | "denied"
  ad_storage?: "granted" | "denied"
  wait_for_update?: number
}

interface Window {
  gtag: {
    (command: "consent", action: "default" | "update", params: GtagConsentArg): void
    (command: "config", targetId: string, config?: Record<string, unknown>): void
    (command: "js", date: Date): void
    (command: "event", eventName: string, params?: Record<string, unknown>): void
    (command: "set", params: Record<string, unknown>): void
  }
  dataLayer: unknown[]
}

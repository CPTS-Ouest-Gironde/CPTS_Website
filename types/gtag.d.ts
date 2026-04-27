interface Window {
  gtag: (
    command: string,
    targetId: string,
    config?: Record<string, unknown>
  ) => void
  dataLayer: Record<string, unknown>[]
}

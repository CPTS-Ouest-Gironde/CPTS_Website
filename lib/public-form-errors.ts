type PublicFormKind = "contact" | "supports-order"

type PublicFormErrorPayload = {
  error?: string
}

export type PublicFormErrorVariant = "warning" | "error"

export type PublicFormErrorDetails = {
  message: string
  variant: PublicFormErrorVariant
}

const CONTACT_EMAIL = "info@cpts-ouest-gironde.fr"

function parseRetryAfterSeconds(rawRetryAfter: string | null) {
  if (!rawRetryAfter) {
    return null
  }

  const parsedValue = Number.parseInt(rawRetryAfter, 10)
  if (!Number.isFinite(parsedValue) || parsedValue <= 0) {
    return null
  }

  return parsedValue
}

function formatRetryDelay(rawRetryAfter: string | null) {
  const retryAfterSeconds = parseRetryAfterSeconds(rawRetryAfter)
  if (!retryAfterSeconds) {
    return null
  }

  if (retryAfterSeconds < 60 * 60) {
    const minutes = Math.max(1, Math.ceil(retryAfterSeconds / 60))
    return `Réessayez dans ${minutes} minute${minutes > 1 ? "s" : ""}`
  }

  const hours = Math.max(1, Math.ceil(retryAfterSeconds / (60 * 60)))
  return `Réessayez dans ${hours} heure${hours > 1 ? "s" : ""}`
}

function getRateLimitMessage(formKind: PublicFormKind, retryAfterHeader: string | null) {
  const retryDelay = formatRetryDelay(retryAfterHeader)

  if (retryDelay) {
    if (formKind === "contact") {
      return `Vous avez déjà envoyé un message récemment. ${retryDelay} ou contactez-nous directement à ${CONTACT_EMAIL}.`
    }

    return `Vous avez déjà passé une commande récemment. ${retryDelay} ou contactez-nous directement à ${CONTACT_EMAIL}.`
  }

  if (formKind === "contact") {
    return "Vous avez déjà envoyé un message récemment. Par respect pour notre équipe, merci de patienter quelques heures avant d'en envoyer un nouveau. Si votre demande est urgente, contactez-nous directement à info@cpts-ouest-gironde.fr."
  }

  return "Vous avez déjà passé une commande récemment. Pour toute commande supplémentaire, merci de patienter avant de soumettre une nouvelle demande, ou contactez-nous directement à info@cpts-ouest-gironde.fr."
}

export async function getPublicFormErrorDetails(
  response: Response,
  formKind: PublicFormKind
): Promise<PublicFormErrorDetails> {
  const payload = (await response.json().catch(() => null)) as PublicFormErrorPayload | null

  if (response.status === 429) {
    return {
      message: getRateLimitMessage(formKind, response.headers.get("Retry-After")),
      variant: "warning",
    }
  }

  if (response.status === 403) {
    return {
      message:
        "Votre requête n'a pas pu être traitée. Si le problème persiste, contactez-nous à info@cpts-ouest-gironde.fr.",
      variant: "error",
    }
  }

  return {
    message: payload?.error || "Une erreur est survenue. Veuillez réessayer.",
    variant: "error",
  }
}

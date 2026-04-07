export function getAuthErrorMessage(error: unknown, fallbackMessage: string) {
  if (!error) {
    return fallbackMessage
  }

  if (error instanceof Error) {
    const normalizedMessage = error.message.toLowerCase()

    if (normalizedMessage.includes("invalid login credentials")) {
      return "Identifiants incorrects. Vérifiez votre email et votre mot de passe."
    }

    if (normalizedMessage.includes("email not confirmed")) {
      return "Votre email n'est pas encore confirmé."
    }

    if (normalizedMessage.includes("expired")) {
      return "Ce lien a expiré. Demandez un nouveau lien."
    }

    return error.message || fallbackMessage
  }

  return fallbackMessage
}

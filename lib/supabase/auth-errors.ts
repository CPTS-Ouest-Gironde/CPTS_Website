function getErrorDetails(error: unknown) {
  if (error instanceof Error) {
    const authError = error as Error & { code?: string }

    return {
      message: error.message ?? "",
      code: typeof authError.code === "string" ? authError.code.toLowerCase() : "",
    }
  }

  if (error && typeof error === "object") {
    const candidate = error as { message?: unknown; code?: unknown }

    return {
      message: typeof candidate.message === "string" ? candidate.message : "",
      code: typeof candidate.code === "string" ? candidate.code.toLowerCase() : "",
    }
  }

  return { message: "", code: "" }
}

export function getAuthErrorMessage(error: unknown, fallbackMessage: string) {
  if (!error) {
    return fallbackMessage
  }

  const { message, code } = getErrorDetails(error)
  const normalizedMessage = message.toLowerCase()

  if (normalizedMessage.includes("invalid login credentials")) {
    return "Identifiants incorrects. Vérifiez votre email et votre mot de passe."
  }

  if (normalizedMessage.includes("email not confirmed")) {
    return "Votre email n'est pas encore confirmé."
  }

  if (
    code.includes("rate_limit") ||
    code.includes("over_email_send_rate_limit") ||
    normalizedMessage.includes("rate limit") ||
    normalizedMessage.includes("security purposes")
  ) {
    return "Vous avez déjà demandé un email récemment. Merci de patienter 60 secondes avant de réessayer."
  }

  if (
    code.includes("weak_password") ||
    normalizedMessage.includes("weak password") ||
    normalizedMessage.includes("password should contain at least one character of each")
  ) {
    return "Le mot de passe est trop faible. Utilisez des minuscules, majuscules, chiffres et caractères spéciaux selon la politique de sécurité."
  }

  if (
    normalizedMessage.includes("password should be at least") ||
    normalizedMessage.includes("password is too short")
  ) {
    return "Le mot de passe est trop court."
  }

  if (
    normalizedMessage.includes("new password should be different from the old password") ||
    code.includes("same_password")
  ) {
    return "Le nouveau mot de passe doit être différent de l'ancien."
  }

  if (
    normalizedMessage.includes("auth session missing") ||
    normalizedMessage.includes("session missing") ||
    normalizedMessage.includes("invalid refresh token")
  ) {
    return "Votre session a expiré. Demandez un nouveau lien sécurisé."
  }

  if (
    normalizedMessage.includes("invalid token") ||
    normalizedMessage.includes("token has expired") ||
    normalizedMessage.includes("otp expired") ||
    normalizedMessage.includes("expired")
  ) {
    return "Ce lien a expiré ou n'est plus valide. Demandez un nouveau lien."
  }

  return fallbackMessage
}

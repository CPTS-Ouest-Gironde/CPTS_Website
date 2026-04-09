import type { User } from "@supabase/supabase-js"

const PASSWORD_AMR_METHODS = new Set(["password", "pwd"])

type ClaimsReader = () => Promise<{
  data: { claims?: { amr?: unknown } } | null
  error: unknown | null
}>

function getAmrMethod(entry: unknown) {
  if (typeof entry === "string") {
    return entry.toLowerCase()
  }

  if (entry && typeof entry === "object") {
    const method = (entry as { method?: unknown }).method

    if (typeof method === "string") {
      return method.toLowerCase()
    }
  }

  return null
}

export function hasPasswordAmr(amr: unknown) {
  if (!Array.isArray(amr)) {
    return false
  }

  return amr.some((entry) => {
    const method = getAmrMethod(entry)
    return Boolean(method && PASSWORD_AMR_METHODS.has(method))
  })
}

export async function isFullyAuthenticatedForProAccess(user: User | null, readClaims: ClaimsReader) {
  if (!user) {
    return false
  }

  // Users created via invite should complete a password-based auth step
  // before they can access protected pro routes.
  if (!user.invited_at) {
    return true
  }

  const { data, error } = await readClaims()

  if (error || !data) {
    return false
  }

  return hasPasswordAmr(data.claims?.amr)
}

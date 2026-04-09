const REQUIRED_ENV_VARS = {
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
} as const

function getRequiredEnvVar(name: keyof typeof REQUIRED_ENV_VARS) {
  const value = REQUIRED_ENV_VARS[name]

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`)
  }

  return value
}

export const SUPABASE_URL = getRequiredEnvVar("NEXT_PUBLIC_SUPABASE_URL")
export const SUPABASE_ANON_KEY = getRequiredEnvVar("NEXT_PUBLIC_SUPABASE_ANON_KEY")

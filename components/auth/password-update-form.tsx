"use client"

import { FormEvent, useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, LockKeyhole } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { getAuthErrorMessage } from "@/lib/supabase/auth-errors"
import { PASSWORD_REQUIREMENTS, validatePasswordPolicy } from "@/lib/supabase/password-policy"

type PasswordFlow = "invite" | "recovery"
type LinkValidationStatus = "loading" | "ready" | "error"

interface PasswordUpdateFormProps {
  flow: PasswordFlow
  title: string
  description: string
}

export function PasswordUpdateForm({ flow, title, description }: PasswordUpdateFormProps) {
  const router = useRouter()
  const supabase = useMemo(() => createClient(), [])
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [status, setStatus] = useState<LinkValidationStatus>("loading")
  const [errorMessage, setErrorMessage] = useState("")

  useEffect(() => {
    let isMounted = true

    async function preparePasswordSession() {
      try {
        const currentUrl = new URL(window.location.href)
        const code = currentUrl.searchParams.get("code")
        const type = currentUrl.searchParams.get("type")
        const tokenHash = currentUrl.searchParams.get("token_hash")
        const hashParams = new URLSearchParams(currentUrl.hash.replace(/^#/, ""))
        const accessToken = hashParams.get("access_token")
        const refreshToken = hashParams.get("refresh_token")
        const hashType = hashParams.get("type")

        if (accessToken && refreshToken) {
          if (hashType && hashType !== flow) {
            throw new Error("Ce lien n'est pas valide pour cette action.")
          }

          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          })

          if (error) {
            throw error
          }
        } else if (tokenHash) {
          if (type !== flow) {
            throw new Error("Ce lien n'est pas valide pour cette action.")
          }

          const { error } = await supabase.auth.verifyOtp({
            type: flow,
            token_hash: tokenHash,
          })

          if (error) {
            throw error
          }
        } else if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code)
          if (error) {
            throw error
          }
        }

        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser()

        if (userError || !user) {
          throw userError ?? new Error("Session invalide. Demandez un nouveau lien.")
        }

        const cleanUrl = new URL(window.location.href)
        cleanUrl.searchParams.delete("code")
        cleanUrl.searchParams.delete("token_hash")
        cleanUrl.searchParams.delete("type")
        cleanUrl.hash = ""
        window.history.replaceState({}, "", `${cleanUrl.pathname}${cleanUrl.search}`)

        if (isMounted) {
          setStatus("ready")
          setErrorMessage("")
        }
      } catch (error: unknown) {
        if (isMounted) {
          setStatus("error")
          setErrorMessage(getAuthErrorMessage(error, "Le lien est invalide ou expiré."))
        }
      }
    }

    void preparePasswordSession()

    return () => {
      isMounted = false
    }
  }, [flow, supabase])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const validation = validatePasswordPolicy(password)

    if (!validation.isValid) {
      setErrorMessage("Le mot de passe ne respecte pas les règles de sécurité.")
      return
    }

    if (password !== confirmPassword) {
      setErrorMessage("La confirmation du mot de passe ne correspond pas.")
      return
    }

    setIsSubmitting(true)
    setErrorMessage("")

    const { error } = await supabase.auth.updateUser({ password })

    if (error) {
      setErrorMessage(getAuthErrorMessage(error, "Impossible de mettre à jour le mot de passe."))
      setIsSubmitting(false)
      return
    }

    router.replace("/professionnels")
    router.refresh()
  }

  return (
    <Card className="rounded-3xl border-2 shadow-lg">
      <CardHeader className="space-y-3 pb-2">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <LockKeyhole className="h-6 w-6" />
        </div>
        <CardTitle className="text-2xl lg:text-3xl font-bold">{title}</CardTitle>
        <CardDescription className="text-base text-muted-foreground">{description}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {status === "loading" && (
          <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 text-sm text-foreground/80 flex items-center gap-3">
            <Loader2 className="h-4 w-4 animate-spin text-primary" />
            Vérification sécurisée du lien en cours...
          </div>
        )}

        {status === "error" && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{errorMessage}</div>
        )}

        {status === "ready" && (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="password">Nouveau mot de passe</Label>
              <Input
                id="password"
                type="password"
                autoComplete="new-password"
                placeholder="Créez un mot de passe sécurisé"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                className="h-11 rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirmer le mot de passe</Label>
              <Input
                id="confirm-password"
                type="password"
                autoComplete="new-password"
                placeholder="Confirmez votre mot de passe"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                required
                className="h-11 rounded-xl"
              />
            </div>

            <div className="rounded-2xl border border-border bg-muted/30 p-4">
              <p className="mb-2 text-sm font-semibold text-foreground">Règles du mot de passe</p>
              <ul className="space-y-1 text-sm text-muted-foreground">
                {PASSWORD_REQUIREMENTS.map((requirement) => (
                  <li key={requirement}>- {requirement}</li>
                ))}
              </ul>
            </div>

            {errorMessage && (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                {errorMessage}
              </div>
            )}

            <Button type="submit" className="w-full h-11 rounded-full font-semibold" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Validation...
                </>
              ) : (
                "Valider mon mot de passe"
              )}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  )
}

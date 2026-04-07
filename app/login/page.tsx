"use client"

import { FormEvent, useMemo, useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Loader2, Lock, Eye, EyeOff, Mail, ShieldCheck, CircleCheck } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createClient } from "@/lib/supabase/client"
import { getAuthErrorMessage } from "@/lib/supabase/auth-errors"

const PROFESSIONAL_BENEFITS = [
  "Commander des supports visuels en autonomie",
  "Accéder aux actions et outils territoriaux",
  "Suivre les formations disponibles",
  "Et bien d'autres outils à venir",
] as const

function getSafeNextPath(value: string | null) {
  if (!value || !value.startsWith("/")) {
    return "/professionnels"
  }

  return value
}

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = useMemo(() => createClient(), [])
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSendingReset, setIsSendingReset] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [resetMessage, setResetMessage] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const nextPath = getSafeNextPath(searchParams.get("next"))

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)
    setErrorMessage("")
    setResetMessage("")

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setErrorMessage(getAuthErrorMessage(error, "Connexion impossible. Veuillez réessayer."))
      setIsLoading(false)
      return
    }

    router.replace(nextPath)
    router.refresh()
  }

  async function handleResetPassword() {
    setErrorMessage("")
    setResetMessage("")

    if (!email.trim()) {
      setErrorMessage("Saisissez votre email pour recevoir un lien de réinitialisation.")
      return
    }

    setIsSendingReset(true)

    const redirectTo = `${window.location.origin}/reset-password`
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo,
    })

    if (error) {
      setErrorMessage(getAuthErrorMessage(error, "Impossible d'envoyer l'email de réinitialisation."))
      setIsSendingReset(false)
      return
    }

    setResetMessage("Un lien de réinitialisation a été envoyé à votre adresse email.")
    setIsSendingReset(false)
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 pt-32 pb-6 lg:pt-36 lg:pb-2 lg:flex lg:items-center bg-muted/20">
        <section className="w-full py-6 lg:py-3">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-5xl mx-auto grid gap-5 lg:grid-cols-[1fr_460px] lg:gap-6 items-start">
              <div className="space-y-4">
                <div className="space-y-4 px-1 lg:px-0">
                  <div className="inline-flex w-fit items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary">
                    Espace Professionnels
                  </div>
                  <h1 className="text-3xl font-bold leading-tight text-balance">
                    Votre espace métier, simple et sécurisé.
                  </h1>
                  <p className="text-base text-muted-foreground leading-relaxed max-w-[46ch]">
                    Connectez-vous pour accéder à vos ressources réservées et piloter vos actions CPTS.
                  </p>
                </div>

                <ul className="space-y-2.5">
                  {PROFESSIONAL_BENEFITS.map((benefit) => (
                    <li
                      key={benefit}
                      className="flex items-start gap-3 rounded-2xl border border-border/80 bg-card px-4 py-3 shadow-sm"
                    >
                      <div className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full border border-primary/25 bg-secondary/30">
                        <CircleCheck className="h-3.5 w-3.5 text-primary" />
                      </div>
                      <p className="text-sm font-medium text-foreground/90 leading-relaxed">{benefit}</p>
                    </li>
                  ))}
                </ul>

                <div className="lg:hidden rounded-2xl border border-border/70 bg-card px-4 py-3">
                  <p className="text-sm text-muted-foreground">
                    Espace réservé aux adhérents de la CPTS Ouest Gironde.
                  </p>
                </div>
              </div>

              <Card className="rounded-3xl border-2 border-border/80 bg-card shadow-sm">
                <CardHeader className="space-y-2.5 pb-1 pt-6">
                  <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/12 text-primary border border-primary/20">
                    <Lock className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-2xl lg:text-3xl font-bold text-balance">
                    Connexion Espace Pro
                  </CardTitle>
                  <CardDescription className="text-sm lg:text-base text-muted-foreground leading-relaxed max-w-[32ch]">
                    Accès réservé aux adhérents de la CPTS Ouest Gironde.
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="email"
                          type="email"
                          autoComplete="email"
                          placeholder="votre.email@exemple.fr"
                          value={email}
                          onChange={(event) => setEmail(event.target.value)}
                          required
                          className="h-12 rounded-xl pl-10 border-border/70"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="password">Mot de passe</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          autoComplete="current-password"
                          placeholder="Votre mot de passe"
                          value={password}
                          onChange={(event) => setPassword(event.target.value)}
                          required
                          className="h-12 rounded-xl pl-10 pr-11 border-border/70"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((prev) => !prev)}
                          className="absolute inset-y-0 right-0 inline-flex items-center justify-center w-11 text-muted-foreground hover:text-foreground transition-colors"
                          aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={handleResetPassword}
                        disabled={isSendingReset}
                        className="text-sm font-medium text-primary hover:text-primary/80 underline underline-offset-4 disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        {isSendingReset ? "Envoi en cours..." : "Mot de passe oublié ?"}
                      </button>
                    </div>

                    {errorMessage && (
                      <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                        {errorMessage}
                      </div>
                    )}

                    {resetMessage && (
                      <div className="rounded-2xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
                        {resetMessage}
                      </div>
                    )}

                    <Button
                      type="submit"
                      className="w-full h-12 rounded-xl font-semibold text-base"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Connexion...
                        </>
                      ) : (
                        "Se connecter"
                      )}
                    </Button>

                    <div className="rounded-xl border border-border/80 bg-muted/30 p-2.5 flex items-center gap-2.5">
                      <ShieldCheck className="h-4 w-4 text-primary shrink-0" />
                      <p className="text-xs text-muted-foreground">
                        Connexion sécurisée. Vos identifiants restent confidentiels.
                      </p>
                    </div>

                    <p className="text-xs text-center text-muted-foreground">
                      Besoin d&apos;adhérer ?{" "}
                      <Link href="/professionnels/adhesion" className="text-primary font-semibold hover:underline">
                        Voir l&apos;adhésion
                      </Link>
                    </p>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Mail, Linkedin, Facebook, Instagram, Copy, Check, Loader2 } from "lucide-react"
import { containsForbiddenLink } from "@/lib/message-content"
import { getPublicFormErrorDetails, type PublicFormErrorVariant } from "@/lib/public-form-errors"

const EMAIL = "info@cpts-ouest-gironde.fr"

export function Contact() {
  const [copied, setCopied] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")
  const [errorVariant, setErrorVariant] = useState<PublicFormErrorVariant>("error")
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    message: "",
  })

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement("textarea")
      textarea.value = EMAIL
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand("copy")
      document.body.removeChild(textarea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus("idle")
    setErrorMessage("")
    setErrorVariant("error")

    if (containsForbiddenLink(formData.message)) {
      setStatus("error")
      setErrorVariant("error")
      setErrorMessage("Les liens ne sont pas autorisés dans le message.")
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setStatus("success")
        setErrorMessage("")
        setFormData({ firstName: "", lastName: "", email: "", message: "" })
      } else {
        const apiError = await getPublicFormErrorDetails(response, "contact")
        setStatus("error")
        setErrorVariant(apiError.variant)
        setErrorMessage(apiError.message)
      }
    } catch {
      setStatus("error")
      setErrorVariant("error")
      setErrorMessage("Une erreur est survenue. Veuillez réessayer.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section id="contact" className="py-12 lg:py-32 bg-accent/30">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-start">
          <div className="space-y-6 lg:space-y-8">
            <div className="space-y-3 lg:space-y-6">
              <h2 className="text-2xl lg:text-6xl font-bold text-foreground text-balance">Contactez-nous</h2>
              <p className="text-base lg:text-2xl text-muted-foreground leading-relaxed text-pretty">
                Une question ? Besoin d'informations ? Notre équipe est à votre écoute.
              </p>
            </div>

            <div className="space-y-4 lg:space-y-6">
              <div className="flex items-start gap-3 lg:gap-4">
                <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl lg:rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 lg:w-6 lg:h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg lg:text-xl font-bold text-foreground mb-1">Email</h3>
                  <div className="flex items-center gap-2 flex-wrap">
                    <a
                      href={`mailto:${EMAIL}`}
                      className="text-sm lg:text-lg text-muted-foreground hover:text-primary transition-colors"
                    >
                      {EMAIL}
                    </a>
                    <button
                      onClick={copyEmail}
                      className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary text-xs font-medium transition-colors"
                      aria-label="Copier l'email"
                    >
                      {copied ? (
                        <>
                          <Check className="w-3 h-3" />
                          <span>Copié</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copier</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 lg:gap-4">
                <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl lg:rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 lg:w-6 lg:h-6 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4m0 4a4 4 0 0 1 4 -4h8a4 4 0 0 1 4 4v8a4 4 0 0 1 -4 4h-8a4 4 0 0 1 -4 -4z" />
                    <path d="M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
                    <path d="M16.5 7.5l0 0" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg lg:text-xl font-bold text-foreground mb-2">Réseaux sociaux</h3>
                  <div className="flex gap-3">
                    <a
                      href="https://www.linkedin.com/company/cpts-ouest-gironde"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full bg-[#0A66C2] flex items-center justify-center hover:scale-110 transition-transform"
                      aria-label="LinkedIn"
                    >
                      <Linkedin className="w-5 h-5 text-white" />
                    </a>
                    <a
                      href="https://www.facebook.com/cptsouestgironde/?locale=fr_FR"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full bg-[#1877F2] flex items-center justify-center hover:scale-110 transition-transform"
                      aria-label="Facebook"
                    >
                      <Facebook className="w-5 h-5 text-white" />
                    </a>
                    <a
                      href="https://www.instagram.com/cptsouestgironde/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#F77737] flex items-center justify-center hover:scale-110 transition-transform"
                      aria-label="Instagram"
                    >
                      <Instagram className="w-5 h-5 text-white" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-2xl lg:rounded-3xl p-5 lg:p-10 border border-border">
            <form onSubmit={handleSubmit} className="space-y-4 lg:space-y-6">
              <div className="grid grid-cols-2 gap-3 lg:gap-6">
                <div className="space-y-1 lg:space-y-2">
                  <label htmlFor="firstName" className="text-xs lg:text-sm font-semibold text-card-foreground">
                    Prénom
                  </label>
                  <Input
                    id="firstName"
                    placeholder="Votre prénom"
                    className="h-10 lg:h-12 rounded-xl lg:rounded-2xl text-sm"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    disabled={isLoading}
                    required
                  />
                </div>
                <div className="space-y-1 lg:space-y-2">
                  <label htmlFor="lastName" className="text-xs lg:text-sm font-semibold text-card-foreground">
                    Nom
                  </label>
                  <Input
                    id="lastName"
                    placeholder="Votre nom"
                    className="h-10 lg:h-12 rounded-xl lg:rounded-2xl text-sm"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    disabled={isLoading}
                    required
                  />
                </div>
              </div>

              <div className="space-y-1 lg:space-y-2">
                <label htmlFor="email" className="text-xs lg:text-sm font-semibold text-card-foreground">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="votre.email@exemple.fr"
                  className="h-10 lg:h-12 rounded-xl lg:rounded-2xl text-sm"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  disabled={isLoading}
                  required
                />
              </div>

              <div className="space-y-1 lg:space-y-2">
                <label htmlFor="message" className="text-xs lg:text-sm font-semibold text-card-foreground">
                  Message
                </label>
                <Textarea
                  id="message"
                  placeholder="Votre message..."
                  rows={4}
                  className="rounded-xl lg:rounded-2xl resize-none text-sm"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  disabled={isLoading}
                  required
                />
              </div>

              {status === "success" && (
                <div className="p-3 rounded-xl bg-green-100 text-green-800 text-sm font-medium">
                  Message envoyé avec succès !
                </div>
              )}

              {status === "error" && (
                <div
                  className={`p-3 rounded-xl text-sm font-medium ${
                    errorVariant === "warning"
                      ? "bg-amber-100 text-amber-900 border border-amber-200"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {errorMessage || "Une erreur est survenue. Veuillez réessayer."}
                </div>
              )}

              <p className="text-xs leading-relaxed text-muted-foreground">
                Les informations recueillies via ce formulaire (prénom, nom, email, message) sont
                utilisées uniquement pour traiter votre demande et y répondre. Elles sont destinées
                à l&apos;équipe de la CPTS Ouest Gironde et ne sont jamais transmises à des tiers.
                Conformément au RGPD, vous pouvez exercer vos droits d&apos;accès, de rectification
                et de suppression en écrivant à{" "}
                <a href={`mailto:${EMAIL}`} className="underline hover:text-primary transition-colors">
                  {EMAIL}
                </a>
                .
              </p>

              <Button
                type="submit"
                size="lg"
                className="w-full rounded-full font-bold text-sm lg:text-base h-12 lg:h-14"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Envoi en cours...
                  </>
                ) : (
                  "Envoyer le message"
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}

"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Cookie, Shield } from "lucide-react"

export function CookieConsentBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent")
    if (!consent) {
      setVisible(true)
    }
  }, [])

  function handleAccept() {
    localStorage.setItem("cookie-consent", "accepted")
    setVisible(false)
    window.dispatchEvent(new CustomEvent("cookie-consent-update"))
  }

  function handleRefuse() {
    localStorage.setItem("cookie-consent", "refused")
    setVisible(false)
    window.dispatchEvent(new CustomEvent("cookie-consent-update"))
  }

  if (!visible) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Consentement cookies"
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm"
    >
      <div className="mx-4 w-full max-w-lg animate-in zoom-in-95 fade-in duration-300 rounded-2xl border bg-background p-6 shadow-2xl md:p-8">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-full bg-primary/10">
            <Cookie className="size-5 text-primary" />
          </div>
          <h2 className="text-lg font-semibold">Gestion des cookies</h2>
        </div>

        <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
          Ce site utilise des cookies analytiques (Google Analytics) pour mesurer
          l&apos;audience et am&eacute;liorer votre exp&eacute;rience de
          navigation. Ces donn&eacute;es nous aident &agrave; orienter et
          am&eacute;liorer le contenu propos&eacute;.
        </p>

        <div className="mb-6 flex items-start gap-2 rounded-lg bg-muted/50 p-3">
          <Shield className="mt-0.5 size-4 shrink-0 text-primary" />
          <p className="text-xs text-muted-foreground">
            Aucune donn&eacute;e personnelle n&apos;est partag&eacute;e
            &agrave; des fins publicitaires. Vous pouvez modifier votre choix
            &agrave; tout moment.
          </p>
        </div>

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button variant="outline" onClick={handleRefuse}>
            Refuser
          </Button>
          <Button onClick={handleAccept}>
            Accepter les cookies
          </Button>
        </div>
      </div>
    </div>
  )
}

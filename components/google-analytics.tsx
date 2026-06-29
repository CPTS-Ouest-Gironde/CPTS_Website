"use client"

import { useEffect } from "react"
import Script from "next/script"
import { usePathname } from "next/navigation"

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

function applyConsentUpdate() {
  if (typeof window.gtag !== "function") return
  const consent = localStorage.getItem("cookie-consent")
  window.gtag("consent", "update", {
    analytics_storage: consent === "accepted" ? "granted" : "denied",
  })
}

export function GoogleAnalytics() {
  const pathname = usePathname()

  useEffect(() => {
    applyConsentUpdate()

    window.addEventListener("cookie-consent-update", applyConsentUpdate)
    return () => window.removeEventListener("cookie-consent-update", applyConsentUpdate)
  }, [])

  useEffect(() => {
    if (GA_MEASUREMENT_ID && typeof window.gtag === "function") {
      window.gtag("config", GA_MEASUREMENT_ID, { page_path: pathname })
    }
  }, [pathname])

  if (!GA_MEASUREMENT_ID) return null

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}', { page_path: window.location.pathname });
        `}
      </Script>
    </>
  )
}

"use client"

import { useEffect, useState } from "react"
import Script from "next/script"
import { usePathname } from "next/navigation"

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

export function GoogleAnalytics() {
  const [consentGiven, setConsentGiven] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent")
    setConsentGiven(consent === "accepted")

    function handleConsentUpdate() {
      const updated = localStorage.getItem("cookie-consent")
      setConsentGiven(updated === "accepted")
    }

    window.addEventListener("cookie-consent-update", handleConsentUpdate)
    return () => {
      window.removeEventListener("cookie-consent-update", handleConsentUpdate)
    }
  }, [])

  useEffect(() => {
    if (consentGiven && GA_MEASUREMENT_ID && typeof window.gtag === "function") {
      window.gtag("config", GA_MEASUREMENT_ID, {
        page_path: pathname,
      })
    }
  }, [pathname, consentGiven])

  if (!consentGiven || !GA_MEASUREMENT_ID) {
    return null
  }

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
          gtag('config', '${GA_MEASUREMENT_ID}', {
            page_path: window.location.pathname,
          });
        `}
      </Script>
    </>
  )
}

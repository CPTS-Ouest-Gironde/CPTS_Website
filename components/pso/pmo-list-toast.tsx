"use client"

import { useEffect, useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { CheckCircle2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { pmoSuccessMessages, type PmoSuccessValue } from "@/lib/pso/pmo"

type PmoListToastProps = {
  success?: PmoSuccessValue
}

export function PmoListToast({ success }: PmoListToastProps) {
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isVisible, setIsVisible] = useState(Boolean(success))
  const searchParamsValue = searchParams.toString()

  function dismissToast() {
    setIsVisible(false)

    if (!success) {
      return
    }

    const nextParams = new URLSearchParams(searchParamsValue)
    nextParams.delete("success")

    const nextHref = nextParams.toString() ? `${pathname}?${nextParams.toString()}` : pathname
    router.replace(nextHref, { scroll: false })
  }

  useEffect(() => {
    if (!success) {
      setIsVisible(false)
      return
    }

    setIsVisible(true)

    const timeout = window.setTimeout(() => {
      dismissToast()
    }, 4000)

    return () => {
      window.clearTimeout(timeout)
    }
  }, [pathname, router, searchParamsValue, success])

  if (!success || !isVisible) {
    return null
  }

  return (
    <div className="pointer-events-none fixed inset-x-4 bottom-4 z-50 flex justify-end lg:right-8 lg:left-auto lg:bottom-8">
      <div className="pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-2xl border border-border/80 bg-background px-4 py-3 shadow-md">
        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
        <p className="flex-1 text-sm text-foreground">{pmoSuccessMessages[success]}</p>
        <Button
          aria-label="Fermer le message"
          className="mt-[-2px] h-7 w-7 rounded-full"
          onClick={dismissToast}
          size="icon-sm"
          type="button"
          variant="ghost"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

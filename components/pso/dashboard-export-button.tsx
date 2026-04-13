"use client"

import { useEffect, useState } from "react"
import { CheckCircle2, Download, LoaderCircle, TriangleAlert, X } from "lucide-react"
import { Button } from "@/components/ui/button"

type DashboardExportButtonProps = {
  disabled?: boolean
  label?: string
  href: string
}

type ExportToast = {
  message: string
  tone: "error" | "success"
} | null

function getFileNameFromDisposition(value: string | null) {
  if (!value) {
    return null
  }

  const match = value.match(/filename="?([^"]+)"?/)
  return match?.[1] ?? null
}

function buildFallbackFileName() {
  return `export-pso-rhinite-${new Date().toISOString().slice(0, 10)}.csv`
}

export function DashboardExportButton({
  disabled = false,
  href,
  label = "Exporter en CSV",
}: DashboardExportButtonProps) {
  const [isDownloading, setIsDownloading] = useState(false)
  const [toast, setToast] = useState<ExportToast>(null)

  useEffect(() => {
    if (!toast) {
      return
    }

    const timeout = window.setTimeout(() => {
      setToast(null)
    }, 4000)

    return () => {
      window.clearTimeout(timeout)
    }
  }, [toast])

  async function handleClick() {
    setIsDownloading(true)

    try {
      const response = await fetch(href, {
        credentials: "include",
        method: "GET",
      })

      if (!response.ok) {
        throw new Error("EXPORT_FAILED")
      }

      const blob = await response.blob()
      const fileName = getFileNameFromDisposition(response.headers.get("content-disposition")) ?? buildFallbackFileName()
      const objectUrl = window.URL.createObjectURL(blob)
      const link = document.createElement("a")

      link.href = objectUrl
      link.download = fileName
      document.body.append(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(objectUrl)
      setToast({
        message: "Le fichier CSV a bien été téléchargé.",
        tone: "success",
      })
    } catch {
      setToast({
        message: "L'export CSV n'a pas pu être généré.",
        tone: "error",
      })
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <>
      <Button className="h-11 rounded-full px-5" disabled={disabled || isDownloading} onClick={handleClick} type="button">
        {isDownloading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
        {isDownloading ? "Génération..." : label}
      </Button>

      {toast ? (
        <div className="pointer-events-none fixed inset-x-4 bottom-4 z-50 flex justify-end lg:right-8 lg:left-auto lg:bottom-8">
          <div
            className="pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-2xl border border-border/80 bg-background px-4 py-3 shadow-md"
            role="status"
          >
            {toast.tone === "success" ? (
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#0a7a3e]" />
            ) : (
              <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
            )}
            <p className="flex-1 text-sm text-foreground">{toast.message}</p>
            <Button
              aria-label="Fermer le message"
              className="mt-[-2px] h-7 w-7 rounded-full"
              onClick={() => setToast(null)}
              size="icon-sm"
              type="button"
              variant="ghost"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ) : null}
    </>
  )
}

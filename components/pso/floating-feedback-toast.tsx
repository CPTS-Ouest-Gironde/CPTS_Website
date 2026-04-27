"use client"

import { CheckCircle2, TriangleAlert, X } from "lucide-react"
import { Button } from "@/components/ui/button"

type FloatingFeedbackToastProps = {
  message: string
  onDismiss: () => void
  tone?: "error" | "success"
}

export function FloatingFeedbackToast({
  message,
  onDismiss,
  tone = "success",
}: FloatingFeedbackToastProps) {
  return (
    <div className="pointer-events-none fixed inset-x-4 bottom-4 z-50 flex justify-end lg:right-8 lg:left-auto lg:bottom-8">
      <div
        className="pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-2xl border border-border/80 bg-background px-4 py-3 shadow-md"
        role="status"
      >
        {tone === "success" ? (
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#0a7a3e]" />
        ) : (
          <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
        )}
        <p className="flex-1 text-sm text-foreground">{message}</p>
        <Button
          aria-label="Fermer le message"
          className="mt-[-2px] h-7 w-7 rounded-full"
          onClick={onDismiss}
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

"use client"

import Link from "next/link"
import { ArrowRight, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

type SatisfactionReminderCardProps = {
  showSatisfactionReminder: boolean
}

export function SatisfactionReminderCard({
  showSatisfactionReminder,
}: SatisfactionReminderCardProps) {
  if (!showSatisfactionReminder) {
    return null
  }

  return (
    <Card className="rounded-3xl border border-border/80 border-l-4 border-l-emerald-500 bg-card shadow-sm">
      <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div className="flex items-start gap-3">
          <MessageSquare className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
          <p className="max-w-2xl text-sm leading-relaxed text-foreground">
            Votre avis compte — Prenez 2 minutes pour évaluer le protocole PSO Rhinite Allergique.
          </p>
        </div>

        <Button asChild className="rounded-full px-5 font-semibold">
          <Link href="/espace-pro/satisfaction">
            Répondre au questionnaire
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}

"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface PrivacyModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PrivacyModal({ open, onOpenChange }: PrivacyModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Confidentialité du chatbot</DialogTitle>
          <DialogDescription>
            Voici ce qu&apos;il faut savoir sur le traitement de vos échanges avec l&apos;assistant CPTS.
          </DialogDescription>
        </DialogHeader>

        <ul className="list-disc space-y-2 pl-5 text-sm text-foreground">
          <li>Votre conversation est stockée localement dans votre navigateur (sessionStorage).</li>
          <li>Elle est automatiquement supprimée à la fermeture de votre navigateur.</li>
          <li>Aucun contenu n&apos;est envoyé à un serveur, sauf en cas d&apos;analyse statistique anonyme avec votre consentement.</li>
          <li>Vous pouvez à tout moment effacer l&apos;historique avec le bouton « Recommencer la conversation ».</li>
        </ul>

        <DialogFooter>
          <Button type="button" onClick={() => onOpenChange(false)}>
            J&apos;ai compris
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

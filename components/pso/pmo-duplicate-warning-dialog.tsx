"use client"

import { Loader2 } from "lucide-react"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"

type PmoDuplicateWarningDialogProps = {
  isPending?: boolean
  onConfirm: () => void
  onOpenChange: (open: boolean) => void
  open: boolean
}

export function PmoDuplicateWarningDialog({
  isPending = false,
  onConfirm,
  onOpenChange,
  open,
}: PmoDuplicateWarningDialogProps) {
  return (
    <AlertDialog onOpenChange={onOpenChange} open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Saisie potentiellement dupliquée</AlertDialogTitle>
          <AlertDialogDescription>
            Cette nouvelle entrée a exactement les mêmes valeurs que votre dernière saisie. S&apos;agit-il bien d&apos;un nouveau patient ?
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending} type="button">
            Annuler
          </AlertDialogCancel>
          <Button disabled={isPending} onClick={onConfirm} type="button">
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Enregistrement...
              </>
            ) : (
              "C'est un nouveau patient, continuer"
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

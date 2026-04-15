"use client"

import Link from "next/link"
import { useState } from "react"
import { MoreHorizontal } from "lucide-react"
import { deletePmoEntry } from "@/app/espace-pro/pmo/actions"
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type PmoRowActionsProps = {
  entryId: string
  page: number
}

export function PmoRowActions({ entryId, page }: PmoRowActionsProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button aria-label="Ouvrir les actions" size="icon-sm" type="button" variant="ghost">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-44">
          <DropdownMenuItem asChild>
            <Link href={`/espace-pro/pmo/${entryId}`}>Voir le détail</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={`/espace-pro/pmo/${entryId}/modifier`}>Modifier</Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={(event) => {
              event.preventDefault()
              setIsDeleteDialogOpen(true)
            }}
            variant="destructive"
          >
            Supprimer
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog onOpenChange={setIsDeleteDialogOpen} open={isDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer cette saisie ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est définitive. La ligne PMO sera supprimée de votre tableau de saisie.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <form action={deletePmoEntry}>
            <input name="entryId" type="hidden" value={entryId} />
            <input name="page" type="hidden" value={String(page)} />

            <AlertDialogFooter>
              <AlertDialogCancel type="button">Annuler</AlertDialogCancel>
              <Button type="submit" variant="destructive">
                Supprimer
              </Button>
            </AlertDialogFooter>
          </form>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

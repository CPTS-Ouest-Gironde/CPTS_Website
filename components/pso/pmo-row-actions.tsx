"use client"

import Link from "next/link"
import { useActionState, useEffect, useState } from "react"
import { LoaderCircle, MoreHorizontal } from "lucide-react"
import { useRouter } from "next/navigation"
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
import { DELETE_PMO_ENTRY_INITIAL_STATE, getPmoListHref, type DeletePmoEntryState } from "@/lib/pso/pmo"

type PmoRowActionsProps = {
  entryId: string
  page: number
}

type DeletePmoEntryFormProps = {
  entryId: string
  onSuccess: () => void
  page: number
}

function DeletePmoEntryForm({ entryId, onSuccess, page }: DeletePmoEntryFormProps) {
  const router = useRouter()
  const [state, formAction, isPending] = useActionState<DeletePmoEntryState, FormData>(
    deletePmoEntry,
    DELETE_PMO_ENTRY_INITIAL_STATE,
  )

  useEffect(() => {
    if (state.status !== "success") {
      return
    }

    onSuccess()
    router.replace(getPmoListHref({ page, success: "deleted" }), { scroll: false })
  }, [onSuccess, page, router, state.status])

  return (
    <form action={formAction}>
      <input name="entryId" type="hidden" value={entryId} />
      <input name="page" type="hidden" value={String(page)} />

      {state.status === "error" ? (
        <p className="mt-4 rounded-2xl border border-destructive/15 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {state.message}
        </p>
      ) : null}

      <AlertDialogFooter className="mt-6">
        <AlertDialogCancel disabled={isPending} type="button">
          Annuler
        </AlertDialogCancel>
        <Button disabled={isPending} type="submit" variant="destructive">
          {isPending ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
          {isPending ? "Suppression..." : "Supprimer"}
        </Button>
      </AlertDialogFooter>
    </form>
  )
}

export function PmoRowActions({ entryId, page }: PmoRowActionsProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [deleteDialogKey, setDeleteDialogKey] = useState(0)

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
              setDeleteDialogKey((currentValue) => currentValue + 1)
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
          <DeletePmoEntryForm
            entryId={entryId}
            key={deleteDialogKey}
            onSuccess={() => setIsDeleteDialogOpen(false)}
            page={page}
          />
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

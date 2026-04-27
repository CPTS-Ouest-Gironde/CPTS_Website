"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { z } from "zod"
import { type DeletePmoEntryState, parsePmoPage } from "@/lib/pso/pmo"
import {
  hasCompletedPharmacienProfile,
  hasRole,
  readUserAccessContext,
} from "@/lib/supabase/roles"
import { createClient } from "@/lib/supabase/server"

const deletePmoEntrySchema = z.object({
  entryId: z.string().uuid(),
  page: z.string().optional(),
})

export async function deletePmoEntry(
  _previousState: DeletePmoEntryState,
  formData: FormData,
): Promise<DeletePmoEntryState> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login?next=/espace-pro/pmo")
  }

  const { profile, roles } = await readUserAccessContext(supabase, user.id)

  if (!hasRole(roles, "pharmacien_pso")) {
    redirect("/espace-pro")
  }

  if (!hasCompletedPharmacienProfile(profile)) {
    redirect("/espace-pro/completer-profil")
  }

  const parsed = deletePmoEntrySchema.safeParse({
    entryId: formData.get("entryId"),
    page: formData.get("page"),
  })

  if (!parsed.success) {
    return {
      message: "La saisie n'a pas pu être supprimée.",
      status: "error",
    }
  }

  const page = parsePmoPage(parsed.data.page)
  const deleteResult = await supabase
    .from("pmo_entries")
    .delete()
    .eq("id", parsed.data.entryId)
    .eq("user_id", user.id)
    .select("id")

  if (deleteResult.error || !deleteResult.data || deleteResult.data.length === 0) {
    return {
      message: "La saisie n'a pas pu être supprimée. Merci de réessayer.",
      status: "error",
    }
  }

  revalidatePath("/espace-pro/pmo")
  revalidatePath(`/espace-pro/pmo/${parsed.data.entryId}`)
  revalidatePath(`/espace-pro/pmo/${parsed.data.entryId}/modifier`)

  return {
    status: "success",
  }
}

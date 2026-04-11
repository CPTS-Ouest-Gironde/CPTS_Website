"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { z } from "zod"
import { getPmoListHref, parsePmoPage } from "@/lib/pso/pmo"
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

export async function deletePmoEntry(formData: FormData) {
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
    redirect(getPmoListHref())
  }

  const page = parsePmoPage(parsed.data.page)
  const deleteResult = await supabase
    .from("pmo_entries")
    .delete()
    .eq("id", parsed.data.entryId)
    .eq("user_id", user.id)
    .select("id")

  if (deleteResult.error || !deleteResult.data || deleteResult.data.length === 0) {
    redirect(getPmoListHref({ page }))
  }

  revalidatePath("/espace-pro/pmo")
  revalidatePath(`/espace-pro/pmo/${parsed.data.entryId}`)
  revalidatePath(`/espace-pro/pmo/${parsed.data.entryId}/modifier`)

  redirect(getPmoListHref({ page, success: "deleted" }))
}

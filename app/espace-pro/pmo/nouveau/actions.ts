"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { PMO_ENTRY_INITIAL_STATE, getPmoEntryValidationState, parsePmoEntryFormData, type PmoEntryActionState } from "@/lib/pso/pmo-form"
import { getPmoListHref } from "@/lib/pso/pmo"
import {
  hasCompletedPharmacienProfile,
  hasRole,
  readUserAccessContext,
} from "@/lib/supabase/roles"
import { createClient } from "@/lib/supabase/server"

export async function createPmoEntry(
  _previousState: PmoEntryActionState,
  formData: FormData,
): Promise<PmoEntryActionState> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login?next=/espace-pro/pmo/nouveau")
  }

  const { profile, roles } = await readUserAccessContext(supabase, user.id)

  if (!hasRole(roles, "pharmacien_pso")) {
    redirect("/espace-pro")
  }

  if (!hasCompletedPharmacienProfile(profile)) {
    redirect("/espace-pro/completer-profil")
  }

  const parsed = parsePmoEntryFormData(formData)

  if (!parsed.success) {
    return getPmoEntryValidationState(parsed.error)
  }

  if (!profile?.pharmacie_id) {
    return {
      ...PMO_ENTRY_INITIAL_STATE,
      formError: "Votre officine n'est pas encore rattachée à votre profil.",
    }
  }

  const insertResult = await supabase.from("pmo_entries").insert({
    date_realisation: parsed.data.dateRealisation,
    dispensation_conseil: parsed.data.dispensationConseil,
    effet_indesirable: parsed.data.effetIndesirable ?? null,
    medecin_delegant_nom: parsed.data.medecinDelegantNom,
    medecin_delegant_rpps: parsed.data.medecinDelegantRpps,
    nb_produits_conseil: parsed.data.nbProduitsConseil,
    nb_produits_pmo: parsed.data.nbProduitsPmo,
    orientation: parsed.data.orientation,
    patient_age: parsed.data.patientAge,
    patient_medecin_traitant: parsed.data.patientMedecinTraitant,
    patient_sexe: parsed.data.patientSexe,
    pharmacie_id: profile.pharmacie_id,
    prescription_anti_h1: parsed.data.prescriptionAntiH1,
    prescription_antiallergique_nasal: parsed.data.prescriptionAntiallergiqueNasal,
    prescription_collyre: parsed.data.prescriptionCollyre,
    prescription_corticoide_nasal: parsed.data.prescriptionCorticoideNasal,
    user_id: user.id,
  })

  if (insertResult.error) {
    return {
      ...PMO_ENTRY_INITIAL_STATE,
      formError: "Impossible d'enregistrer cette saisie pour le moment.",
    }
  }

  revalidatePath("/espace-pro/pmo")
  redirect(getPmoListHref({ success: "created" }))
}

"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { getActiveMedecinDelegantById } from "@/lib/pso/medecins-delegants"
import { PMO_ENTRY_INITIAL_STATE, getPmoEntryValidationState, parsePmoEntryFormData, type PmoEntryActionState } from "@/lib/pso/pmo-form"
import { getPmoListHref, parsePmoEntryId } from "@/lib/pso/pmo"
import {
  hasCompletedPharmacienProfile,
  hasRole,
  readUserAccessContext,
} from "@/lib/supabase/roles"
import { createClient } from "@/lib/supabase/server"

export async function updatePmoEntry(
  entryId: string,
  _previousState: PmoEntryActionState,
  formData: FormData,
): Promise<PmoEntryActionState> {
  const parsedEntryId = parsePmoEntryId(entryId)

  if (!parsedEntryId) {
    redirect("/espace-pro/pmo")
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect(`/login?next=/espace-pro/pmo/${parsedEntryId}/modifier`)
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

  const medecinDelegant = await getActiveMedecinDelegantById(supabase, parsed.data.medecinDelegantId)

  if (!medecinDelegant) {
    return {
      ...PMO_ENTRY_INITIAL_STATE,
      fieldErrors: {
        medecinDelegantId: ["Sélectionnez un médecin délégant valide."],
      },
    }
  }

  const updateResult = await supabase
    .from("pmo_entries")
    .update({
      date_realisation: parsed.data.dateRealisation,
      dispensation_conseil: parsed.data.dispensationConseil,
      effet_indesirable: parsed.data.effetIndesirableSignale
        ? parsed.data.effetIndesirableDescription ?? null
        : null,
      medecin_delegant_nom: medecinDelegant.label,
      medecin_delegant_rpps: medecinDelegant.rpps,
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
      reorientation_medecin_delegant: parsed.data.reorientationMedecinDelegant,
      renouvellement: parsed.data.renouvellement,
    })
    .eq("id", parsedEntryId)
    .eq("user_id", user.id)
    .select("id")
    .maybeSingle()

  if (updateResult.error || !updateResult.data) {
    return {
      ...PMO_ENTRY_INITIAL_STATE,
      formError: "Impossible de mettre à jour cette saisie pour le moment.",
    }
  }

  revalidatePath("/espace-pro/pmo")
  revalidatePath(`/espace-pro/pmo/${parsedEntryId}`)
  revalidatePath(`/espace-pro/pmo/${parsedEntryId}/modifier`)

  redirect(getPmoListHref({ success: "updated" }))
}

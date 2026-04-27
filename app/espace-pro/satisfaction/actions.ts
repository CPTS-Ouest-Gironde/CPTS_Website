"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import type { ZodError } from "zod"
import { createEmptyFormActionState, type FormActionState } from "@/lib/pso/form-action-state"
import { getSatisfactionPharmacienReferenceYear } from "@/lib/pso/satisfaction-pharmacien"
import {
  hasCompletedPharmacienProfile,
  hasRole,
  readUserAccessContext,
} from "@/lib/supabase/roles"
import { createClient } from "@/lib/supabase/server"
import { satisfactionPharmacienSchema, type SatisfactionPharmacienInput } from "@/lib/validations/pso"

type SatisfactionPharmacienFieldName = keyof SatisfactionPharmacienInput & string
type SatisfactionPharmacienActionState = FormActionState<SatisfactionPharmacienFieldName>

const INITIAL_STATE = createEmptyFormActionState<SatisfactionPharmacienFieldName>()

function getStringValue(formData: FormData, key: SatisfactionPharmacienFieldName) {
  const value = formData.get(key)
  return typeof value === "string" ? value : ""
}

function getBooleanValue(formData: FormData, key: SatisfactionPharmacienFieldName) {
  const value = formData.get(key)

  if (value === "true") {
    return true
  }

  if (value === "false") {
    return false
  }

  return value
}

function getNumberValue(formData: FormData, key: SatisfactionPharmacienFieldName) {
  const value = formData.get(key)
  return typeof value === "string" && value !== "" ? Number(value) : value
}

function getValidationState(
  error: ZodError<SatisfactionPharmacienInput>,
): SatisfactionPharmacienActionState {
  return {
    ...INITIAL_STATE,
    fieldErrors: error.flatten().fieldErrors as SatisfactionPharmacienActionState["fieldErrors"],
  }
}

export async function submitSatisfactionPharmacien(
  _previousState: SatisfactionPharmacienActionState,
  formData: FormData,
): Promise<SatisfactionPharmacienActionState> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login?next=/espace-pro/satisfaction")
  }

  const { profile, roles } = await readUserAccessContext(supabase, user.id)

  if (!hasRole(roles, "pharmacien_pso")) {
    redirect("/espace-pro")
  }

  if (!hasCompletedPharmacienProfile(profile)) {
    redirect("/espace-pro/completer-profil")
  }

  const currentReferenceYear = getSatisfactionPharmacienReferenceYear()

  const existingResponseResult = await supabase
    .from("satisfaction_pharmacien")
    .select("id")
    .eq("user_id", user.id)
    .eq("annee_reference", currentReferenceYear)
    .limit(1)
    .maybeSingle()

  if (existingResponseResult.data) {
    return {
      ...INITIAL_STATE,
      formError: `Vous avez déjà répondu à ce questionnaire pour ${currentReferenceYear}.`,
    }
  }

  const parsed = satisfactionPharmacienSchema.safeParse({
    accesSoins: getNumberValue(formData, "accesSoins"),
    appreciationPatients: getNumberValue(formData, "appreciationPatients"),
    autresIncidents: getBooleanValue(formData, "autresIncidents"),
    beneficePratique: getNumberValue(formData, "beneficePratique"),
    commentaire: getStringValue(formData, "commentaire"),
    faciliteMiseEnPlace: getNumberValue(formData, "faciliteMiseEnPlace"),
    incidentsDescription: getStringValue(formData, "incidentsDescription"),
    nbEffetsIndesirablesGraves: getNumberValue(formData, "nbEffetsIndesirablesGraves"),
    satisfactionGlobale: getNumberValue(formData, "satisfactionGlobale"),
  })

  if (!parsed.success) {
    return getValidationState(parsed.error)
  }

  if (!profile?.pharmacie_id) {
    return {
      ...INITIAL_STATE,
      formError: "Votre officine n'est pas encore rattachée à votre profil.",
    }
  }

  const insertResult = await supabase.from("satisfaction_pharmacien").insert({
    acces_soins: parsed.data.accesSoins,
    annee_reference: currentReferenceYear,
    appreciation_patients: parsed.data.appreciationPatients,
    autres_incidents: parsed.data.autresIncidents,
    benefice_pratique: parsed.data.beneficePratique,
    commentaire: parsed.data.commentaire ?? null,
    facilite_mise_en_place: parsed.data.faciliteMiseEnPlace,
    incidents_description: parsed.data.incidentsDescription ?? null,
    nb_effets_indesirables_graves: parsed.data.nbEffetsIndesirablesGraves,
    pharmacie_id: profile.pharmacie_id,
    satisfaction_globale: parsed.data.satisfactionGlobale,
    user_id: user.id,
  })

  if (insertResult.error) {
    return {
      ...INITIAL_STATE,
      formError: "Impossible d'enregistrer votre questionnaire pour le moment.",
    }
  }

  revalidatePath("/espace-pro/satisfaction")
  revalidatePath("/espace-pro/pmo")
  revalidatePath("/espace-pro/dashboard")
  redirect("/espace-pro/satisfaction/merci")
}

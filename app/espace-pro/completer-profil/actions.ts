"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import type { PostgrestError } from "@supabase/supabase-js"
import type { ZodError } from "zod"
import { createEmptyFormActionState, type FormActionState } from "@/lib/pso/form-action-state"
import { createClient } from "@/lib/supabase/server"
import {
  hasCompletedPharmacienProfile,
  hasRole,
  readUserAccessContext,
} from "@/lib/supabase/roles"
import { completeProfileSchema, type CompleteProfileInput } from "@/lib/validations/pso"

type CompleteProfileFieldName = keyof CompleteProfileInput & string
type CompleteProfileActionState = FormActionState<CompleteProfileFieldName>

const INITIAL_STATE = createEmptyFormActionState<CompleteProfileFieldName>()

function getStringValue(formData: FormData, key: CompleteProfileFieldName) {
  const value = formData.get(key)
  return typeof value === "string" ? value : ""
}

function getBooleanValue(formData: FormData, key: CompleteProfileFieldName) {
  const value = formData.get(key)

  if (value === "true") {
    return true
  }

  if (value === "false") {
    return false
  }

  return value
}

function getValidationState(error: ZodError<CompleteProfileInput>): CompleteProfileActionState {
  return {
    ...INITIAL_STATE,
    fieldErrors: error.flatten().fieldErrors as CompleteProfileActionState["fieldErrors"],
  }
}

function getErrorMessage(error: PostgrestError) {
  if (error.code === "23505" || error.message.includes("profiles_rpps_unique")) {
    return "Ce RPPS est déjà associé à un autre compte."
  }

  return "Impossible de mettre à jour le profil pour le moment."
}

export async function completePharmacienProfile(
  _previousState: CompleteProfileActionState,
  formData: FormData,
): Promise<CompleteProfileActionState> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login?next=/espace-pro/completer-profil")
  }

  const { profile, roles } = await readUserAccessContext(supabase, user.id)

  if (!hasRole(roles, "pharmacien_pso")) {
    redirect("/espace-pro")
  }

  if (hasCompletedPharmacienProfile(profile)) {
    redirect("/espace-pro/pmo")
  }

  const parsed = completeProfileSchema.safeParse({
    firstName: getStringValue(formData, "firstName"),
    lastName: getStringValue(formData, "lastName"),
    pharmacieAdresse: getStringValue(formData, "pharmacieAdresse"),
    pharmacieFiness: getStringValue(formData, "pharmacieFiness"),
    pharmacieNom: getStringValue(formData, "pharmacieNom"),
    rpps: getStringValue(formData, "rpps"),
    titulaire: getBooleanValue(formData, "titulaire"),
  })

  if (!parsed.success) {
    return getValidationState(parsed.error)
  }

  const { error: updateRppsError } = await supabase
    .from("profiles")
    .update({
      first_name: parsed.data.firstName,
      last_name: parsed.data.lastName,
      rpps: parsed.data.rpps,
      titulaire: parsed.data.titulaire,
    })
    .eq("id", user.id)

  if (updateRppsError) {
    if (updateRppsError.code === "23505" || updateRppsError.message.includes("profiles_rpps_unique")) {
      return {
        ...INITIAL_STATE,
        fieldErrors: {
          rpps: [getErrorMessage(updateRppsError)],
        },
      }
    }

    return {
      ...INITIAL_STATE,
      formError: getErrorMessage(updateRppsError),
    }
  }

  const pharmacyLookupResult = await supabase
    .from("pharmacies")
    .select("id")
    .eq("finess", parsed.data.pharmacieFiness)
    .maybeSingle()

  if (pharmacyLookupResult.error) {
    return {
      ...INITIAL_STATE,
      formError: "Impossible de vérifier l'officine pour le moment.",
    }
  }

  let pharmacyId = pharmacyLookupResult.data?.id ?? null

  if (!pharmacyId) {
    const createPharmacyResult = await supabase
      .from("pharmacies")
      .insert({
        adresse: parsed.data.pharmacieAdresse ?? null,
        finess: parsed.data.pharmacieFiness,
        nom: parsed.data.pharmacieNom,
      })
      .select("id")
      .single()

    if (createPharmacyResult.error) {
      if (createPharmacyResult.error.code === "23505") {
        const existingPharmacyResult = await supabase
          .from("pharmacies")
          .select("id")
          .eq("finess", parsed.data.pharmacieFiness)
          .maybeSingle()

        if (existingPharmacyResult.error || !existingPharmacyResult.data) {
          return {
            ...INITIAL_STATE,
            formError: "Impossible de rattacher l'officine pour le moment.",
          }
        }

        pharmacyId = existingPharmacyResult.data.id
      } else {
        return {
          ...INITIAL_STATE,
          formError: "Impossible de créer l'officine pour le moment.",
        }
      }
    } else {
      pharmacyId = createPharmacyResult.data.id
    }
  }

  const updateProfileResult = await supabase
    .from("profiles")
    .update({ pharmacie_id: pharmacyId })
    .eq("id", user.id)

  if (updateProfileResult.error) {
    return {
      ...INITIAL_STATE,
      formError: "Le profil a été partiellement mis à jour. Réessaie dans quelques instants.",
    }
  }

  revalidatePath("/espace-pro", "layout")
  redirect("/espace-pro/pmo")
}

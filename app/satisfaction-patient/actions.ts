"use server"

import { redirect } from "next/navigation"
import type { ZodError } from "zod"
import { createEmptyFormActionState, type FormActionState } from "@/lib/pso/form-action-state"
import { createAnonClient } from "@/lib/supabase/anon"
import { satisfactionPatientSchema, type SatisfactionPatientInput } from "@/lib/validations/pso"

type SatisfactionPatientFieldName = keyof SatisfactionPatientInput & string
type SatisfactionPatientActionState = FormActionState<SatisfactionPatientFieldName>

const INITIAL_STATE = createEmptyFormActionState<SatisfactionPatientFieldName>()
const HONEYPOT_FIELD_NAME = "website"

function getStringValue(formData: FormData, key: SatisfactionPatientFieldName) {
  const value = formData.get(key)
  return typeof value === "string" ? value : ""
}

function getOptionalStringValue(formData: FormData, key: SatisfactionPatientFieldName) {
  const value = getStringValue(formData, key).trim()
  return value === "" ? undefined : value
}

function getBooleanValue(formData: FormData, key: SatisfactionPatientFieldName) {
  const value = formData.get(key)

  if (value === "true") {
    return true
  }

  if (value === "false") {
    return false
  }

  return value
}

function getNumberValue(formData: FormData, key: SatisfactionPatientFieldName) {
  const value = formData.get(key)
  return typeof value === "string" && value !== "" ? Number(value) : value
}

function getValidationState(error: ZodError<SatisfactionPatientInput>): SatisfactionPatientActionState {
  return {
    ...INITIAL_STATE,
    fieldErrors: error.flatten().fieldErrors as SatisfactionPatientActionState["fieldErrors"],
  }
}

export async function submitSatisfactionPatient(
  _previousState: SatisfactionPatientActionState,
  formData: FormData,
): Promise<SatisfactionPatientActionState> {
  const honeypotValue = formData.get(HONEYPOT_FIELD_NAME)

  if (typeof honeypotValue === "string" && honeypotValue.trim() !== "") {
    redirect("/satisfaction-patient/merci")
  }

  const parsed = satisfactionPatientSchema.safeParse({
    commentaire: getStringValue(formData, "commentaire"),
    consultationMedecinApres: getBooleanValue(formData, "consultationMedecinApres"),
    conseilsAide: getNumberValue(formData, "conseilsAide"),
    faciliteVie: getNumberValue(formData, "faciliteVie"),
    raisonConsultation: getOptionalStringValue(formData, "raisonConsultation"),
    raisonVenue: getStringValue(formData, "raisonVenue"),
    raisonVenueAutre: getStringValue(formData, "raisonVenueAutre"),
    satisfactionPriseEnCharge: getNumberValue(formData, "satisfactionPriseEnCharge"),
    souhaitRenouvellement: getBooleanValue(formData, "souhaitRenouvellement"),
  })

  if (!parsed.success) {
    return getValidationState(parsed.error)
  }

  const supabase = createAnonClient()
  const insertResult = await supabase.from("satisfaction_patient").insert({
    commentaire: parsed.data.commentaire ?? null,
    consultation_medecin_apres: parsed.data.consultationMedecinApres,
    conseils_aide: parsed.data.conseilsAide,
    facilite_vie: parsed.data.faciliteVie,
    raison_consultation: parsed.data.raisonConsultation ?? null,
    raison_venue: parsed.data.raisonVenue,
    raison_venue_autre: parsed.data.raisonVenueAutre ?? null,
    satisfaction_prise_en_charge: parsed.data.satisfactionPriseEnCharge,
    souhait_renouvellement: parsed.data.souhaitRenouvellement,
  })

  if (insertResult.error) {
    return {
      ...INITIAL_STATE,
      formError: "Impossible d'envoyer votre questionnaire pour le moment.",
    }
  }

  redirect("/satisfaction-patient/merci")
}

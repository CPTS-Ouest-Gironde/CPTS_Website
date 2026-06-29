"use server"

import { redirect } from "next/navigation"
import type { ZodError } from "zod"
import { createEmptyFormActionState, type FormActionState } from "@/lib/pso/form-action-state"
import { createClient } from "@/lib/supabase/server"
import { satisfactionPsSchema, type SatisfactionPsInput } from "@/lib/validations/satisfaction-ps"
import type { Json } from "@/types/supabase"

type SatisfactionPsFieldName = keyof SatisfactionPsInput & string
type SatisfactionPsActionState = FormActionState<SatisfactionPsFieldName>

const INITIAL_STATE = createEmptyFormActionState<SatisfactionPsFieldName>()
const ALREADY_SUBMITTED_MESSAGE =
  "Vous avez déjà répondu à ce questionnaire pour cette année. Merci pour votre participation."
const SUBMISSION_ERROR_MESSAGE =
  "Une erreur est survenue lors de l'envoi de vos réponses. Merci de réessayer dans quelques instants. Si le problème persiste, vous pouvez contacter la CPTS Ouest Gironde à l'adresse cptsouestgironde@gmail.com."

function getStringValue(formData: FormData, key: SatisfactionPsFieldName) {
  const value = formData.get(key)
  return typeof value === "string" ? value : ""
}

function getBooleanValue(formData: FormData, key: SatisfactionPsFieldName) {
  const value = formData.get(key)

  if (value === "true") {
    return true
  }

  if (value === "false") {
    return false
  }

  return value
}

function getValidationState(error: ZodError<SatisfactionPsInput>): SatisfactionPsActionState {
  return {
    ...INITIAL_STATE,
    fieldErrors: error.flatten().fieldErrors as SatisfactionPsActionState["fieldErrors"],
  }
}

export async function submitSatisfactionPs(
  _previousState: SatisfactionPsActionState,
  formData: FormData,
): Promise<SatisfactionPsActionState> {
  const parsed = satisfactionPsSchema.safeParse({
    accesDistinctPertinent: getBooleanValue(formData, "accesDistinctPertinent"),
    chartesConnaissance: getBooleanValue(formData, "chartesConnaissance"),
    chartesDispositifsUtilises: getBooleanValue(formData, "chartesDispositifsUtilises"),
    chartesSatisfaction: getBooleanValue(formData, "chartesSatisfaction"),
    chartesSouhaitReception: getBooleanValue(formData, "chartesSouhaitReception"),
    chartesSuggestions: getBooleanValue(formData, "chartesSuggestions"),
    chartesSuggestionsTexte: getStringValue(formData, "chartesSuggestionsTexte"),
    outilsConnaissance: getBooleanValue(formData, "outilsConnaissance"),
    outilsUtilisation: getBooleanValue(formData, "outilsUtilisation"),
    siteConnaissance: getBooleanValue(formData, "siteConnaissance"),
    siteConsultation: getBooleanValue(formData, "siteConsultation"),
    siteOutilPrevention: getBooleanValue(formData, "siteOutilPrevention"),
    siteRubriquesUtiles: getStringValue(formData, "siteRubriquesUtiles"),
    siteSuggestionsTexte: getStringValue(formData, "siteSuggestionsTexte"),
    siteUtilite: getBooleanValue(formData, "siteUtilite"),
    vmvConnaissance: getBooleanValue(formData, "vmvConnaissance"),
    vmvSuggestions: getBooleanValue(formData, "vmvSuggestions"),
    vmvSuggestionsTexte: getStringValue(formData, "vmvSuggestionsTexte"),
    vmvUtilise: getBooleanValue(formData, "vmvUtilise"),
    vmvUtiliteTexte: getStringValue(formData, "vmvUtiliteTexte"),
  })

  if (!parsed.success) {
    return getValidationState(parsed.error)
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login?next=/espace-pro/satisfaction-ps")
  }

  const anneeReference = new Date().getFullYear()
  const existingSubmission = await supabase
    .from("satisfaction_ps_submissions")
    .select("id")
    .eq("user_id", user.id)
    .eq("annee_reference", anneeReference)
    .maybeSingle()

  if (existingSubmission.data) {
    return {
      ...INITIAL_STATE,
      formError: ALREADY_SUBMITTED_MESSAGE,
    }
  }

  if (existingSubmission.error) {
    return {
      ...INITIAL_STATE,
      formError: SUBMISSION_ERROR_MESSAGE,
    }
  }

  const responsePayload = {
    acces_distinct_pertinent: parsed.data.accesDistinctPertinent,
    chartes_connaissance: parsed.data.chartesConnaissance,
    chartes_dispositifs_utilises: parsed.data.chartesDispositifsUtilises,
    chartes_satisfaction: parsed.data.chartesSatisfaction,
    chartes_souhait_reception: parsed.data.chartesSouhaitReception,
    chartes_suggestions: parsed.data.chartesSuggestions,
    chartes_suggestions_texte: parsed.data.chartesSuggestionsTexte ?? null,
    outils_connaissance: parsed.data.outilsConnaissance,
    outils_utilisation: parsed.data.outilsUtilisation,
    site_connaissance: parsed.data.siteConnaissance,
    site_consultation: parsed.data.siteConsultation,
    site_outil_prevention: parsed.data.siteOutilPrevention,
    site_rubriques_utiles: parsed.data.siteRubriquesUtiles ?? null,
    site_suggestions_texte: parsed.data.siteSuggestionsTexte ?? null,
    site_utilite: parsed.data.siteUtilite,
    vmv_connaissance: parsed.data.vmvConnaissance,
    vmv_suggestions: parsed.data.vmvSuggestions,
    vmv_suggestions_texte: parsed.data.vmvSuggestionsTexte ?? null,
    vmv_utilise: parsed.data.vmvUtilise,
    vmv_utilite_texte: parsed.data.vmvUtiliteTexte ?? null,
  } satisfies Json

  const submitResult = await supabase.rpc("submit_satisfaction_ps", {
    p_annee_reference: anneeReference,
    p_response: responsePayload,
    p_user_id: user.id,
  })

  if (submitResult.error) {
    if (submitResult.error.message.includes("ALREADY_SUBMITTED")) {
      return {
        ...INITIAL_STATE,
        formError: ALREADY_SUBMITTED_MESSAGE,
      }
    }

    return {
      ...INITIAL_STATE,
      formError: SUBMISSION_ERROR_MESSAGE,
    }
  }

  redirect("/espace-pro/satisfaction-ps/merci")
}

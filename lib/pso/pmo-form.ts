import type { ZodError } from "zod"
import { createEmptyFormActionState, type FormActionState } from "@/lib/pso/form-action-state"
import { pmoEntrySchema, type PmoEntryInput } from "@/lib/validations/pso"

export type PmoEntryFieldName = keyof PmoEntryInput & string
export type PmoEntryActionState = FormActionState<PmoEntryFieldName>

export const PMO_ENTRY_INITIAL_STATE = createEmptyFormActionState<PmoEntryFieldName>()

function getStringValue(formData: FormData, key: PmoEntryFieldName) {
  const value = formData.get(key)
  return typeof value === "string" ? value : ""
}

function getBooleanValue(formData: FormData, key: PmoEntryFieldName) {
  const value = formData.get(key)

  if (value === "true") {
    return true
  }

  if (value === "false") {
    return false
  }

  return value
}

export function parsePmoEntryFormData(formData: FormData) {
  return pmoEntrySchema.safeParse({
    dateRealisation: getStringValue(formData, "dateRealisation"),
    dispensationConseil: getBooleanValue(formData, "dispensationConseil"),
    effetIndesirable: getStringValue(formData, "effetIndesirable"),
    medecinDelegantNom: getStringValue(formData, "medecinDelegantNom"),
    medecinDelegantRpps: getStringValue(formData, "medecinDelegantRpps"),
    nbProduitsConseil: getStringValue(formData, "nbProduitsConseil"),
    nbProduitsPmo: getStringValue(formData, "nbProduitsPmo"),
    orientation: getStringValue(formData, "orientation"),
    patientAge: getStringValue(formData, "patientAge"),
    patientMedecinTraitant: getBooleanValue(formData, "patientMedecinTraitant"),
    patientSexe: getStringValue(formData, "patientSexe"),
    prescriptionAntiH1: getBooleanValue(formData, "prescriptionAntiH1"),
    prescriptionAntiallergiqueNasal: getBooleanValue(formData, "prescriptionAntiallergiqueNasal"),
    prescriptionCollyre: getBooleanValue(formData, "prescriptionCollyre"),
    prescriptionCorticoideNasal: getBooleanValue(formData, "prescriptionCorticoideNasal"),
  })
}

export function getPmoEntryValidationState(error: ZodError<PmoEntryInput>): PmoEntryActionState {
  return {
    ...PMO_ENTRY_INITIAL_STATE,
    fieldErrors: error.flatten().fieldErrors as PmoEntryActionState["fieldErrors"],
  }
}

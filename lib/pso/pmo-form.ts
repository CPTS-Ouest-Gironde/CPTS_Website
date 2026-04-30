import { z, type ZodError } from "zod"
import { createEmptyFormActionState, type FormActionState } from "@/lib/pso/form-action-state"
import { pmoEntrySchema, type PmoEntryInput } from "@/lib/validations/pso"

export type PmoEntryFieldName = keyof PmoEntryInput & string
export const pmoEntrySubmissionModeValues = ["default", "create_another"] as const
export const pmoEntryWarningTypeValues = ["duplicate_warning"] as const

export type PmoEntrySubmissionMode = (typeof pmoEntrySubmissionModeValues)[number]
export type PmoEntryWarningType = (typeof pmoEntryWarningTypeValues)[number]
export type PmoEntryActionState = FormActionState<PmoEntryFieldName> & {
  didCreateAnother: boolean
  successKey: number
  successMessage: string | null
  warningKey: number
  warningMessage: string | null
  warningType: PmoEntryWarningType | null
}

const booleanFormValueSchema = z.union([z.literal("true"), z.literal("false")]).transform((value) => value === "true")
const pmoEntrySubmissionModeSchema = z.enum(pmoEntrySubmissionModeValues)

export const PMO_ENTRY_INITIAL_STATE: PmoEntryActionState = {
  ...createEmptyFormActionState<PmoEntryFieldName>(),
  didCreateAnother: false,
  successKey: 0,
  successMessage: null,
  warningKey: 0,
  warningMessage: null,
  warningType: null,
}

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
    effetIndesirableDescription: getStringValue(formData, "effetIndesirableDescription"),
    effetIndesirableSignale: getBooleanValue(formData, "effetIndesirableSignale"),
    medecinDelegantId: getStringValue(formData, "medecinDelegantId"),
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
    reorientationMedecinDelegant: getBooleanValue(formData, "reorientationMedecinDelegant"),
    renouvellement: getBooleanValue(formData, "renouvellement"),
  })
}

export function parsePmoEntrySubmissionMode(formData: FormData): PmoEntrySubmissionMode {
  const parsedMode = pmoEntrySubmissionModeSchema.safeParse(formData.get("submissionMode"))
  return parsedMode.success ? parsedMode.data : "default"
}

export function parsePmoEntryForceCreate(formData: FormData) {
  const parsedForceCreate = booleanFormValueSchema.safeParse(formData.get("forceCreate"))
  return parsedForceCreate.success ? parsedForceCreate.data : false
}

export function getPmoEntryValidationState(error: ZodError<PmoEntryInput>): PmoEntryActionState {
  return {
    ...PMO_ENTRY_INITIAL_STATE,
    fieldErrors: error.flatten().fieldErrors as PmoEntryActionState["fieldErrors"],
  }
}

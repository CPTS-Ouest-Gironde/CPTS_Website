import type { SupabaseClient } from "@supabase/supabase-js"
import type { PmoEntryInput } from "@/lib/validations/pso"
import type { Database } from "@/types/supabase"

type AppSupabaseClient = SupabaseClient<Database>
type LastPmoEntryRow = Pick<
  Database["public"]["Tables"]["pmo_entries"]["Row"],
  | "date_realisation"
  | "dispensation_conseil"
  | "medecin_delegant_rpps"
  | "nb_produits_conseil"
  | "nb_produits_pmo"
  | "orientation"
  | "patient_age"
  | "patient_medecin_traitant"
  | "patient_sexe"
  | "prescription_anti_h1"
  | "prescription_antiallergique_nasal"
  | "prescription_collyre"
  | "prescription_corticoide_nasal"
  | "reorientation_medecin_delegant"
  | "renouvellement"
>

export type PmoDuplicateCheckCandidate = {
  dateRealisation: string
  dispensationConseil: boolean
  medecinDelegantRpps: string
  nbProduitsConseil: PmoEntryInput["nbProduitsConseil"]
  nbProduitsPmo: PmoEntryInput["nbProduitsPmo"]
  orientation: PmoEntryInput["orientation"]
  patientAge: PmoEntryInput["patientAge"]
  patientMedecinTraitant: boolean
  patientSexe: PmoEntryInput["patientSexe"]
  prescriptionAntiH1: boolean
  prescriptionAntiallergiqueNasal: boolean
  prescriptionCollyre: boolean
  prescriptionCorticoideNasal: boolean
  reorientationMedecinDelegant: boolean
  renouvellement: boolean
}

const duplicateCheckFields = [
  "date_realisation",
  "patient_sexe",
  "patient_age",
  "patient_medecin_traitant",
  "orientation",
  "reorientation_medecin_delegant",
  "renouvellement",
  "prescription_anti_h1",
  "prescription_collyre",
  "prescription_antiallergique_nasal",
  "prescription_corticoide_nasal",
  "nb_produits_pmo",
  "dispensation_conseil",
  "nb_produits_conseil",
  "medecin_delegant_rpps",
].join(",")

export function buildPmoDuplicateCheckCandidate(
  input: PmoEntryInput,
  medecinDelegantRpps: string,
): PmoDuplicateCheckCandidate {
  return {
    dateRealisation: input.dateRealisation,
    dispensationConseil: input.dispensationConseil,
    medecinDelegantRpps,
    nbProduitsConseil: input.nbProduitsConseil,
    nbProduitsPmo: input.nbProduitsPmo,
    orientation: input.orientation,
    patientAge: input.patientAge,
    patientMedecinTraitant: input.patientMedecinTraitant,
    patientSexe: input.patientSexe,
    prescriptionAntiH1: input.prescriptionAntiH1,
    prescriptionAntiallergiqueNasal: input.prescriptionAntiallergiqueNasal,
    prescriptionCollyre: input.prescriptionCollyre,
    prescriptionCorticoideNasal: input.prescriptionCorticoideNasal,
    reorientationMedecinDelegant: input.reorientationMedecinDelegant,
    renouvellement: input.renouvellement,
  }
}

export async function isDuplicateOfLastPmoEntry(
  supabase: AppSupabaseClient,
  userId: string,
  candidate: PmoDuplicateCheckCandidate,
) {
  const result = await supabase
    .from("pmo_entries")
    .select(duplicateCheckFields)
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle()
    .overrideTypes<LastPmoEntryRow, { merge: false }>()

  if (result.error || !result.data) {
    return false
  }

  const lastEntry = result.data

  return (
    lastEntry.date_realisation === candidate.dateRealisation &&
    lastEntry.patient_sexe === candidate.patientSexe &&
    lastEntry.patient_age === candidate.patientAge &&
    lastEntry.patient_medecin_traitant === candidate.patientMedecinTraitant &&
    lastEntry.orientation === candidate.orientation &&
    lastEntry.reorientation_medecin_delegant === candidate.reorientationMedecinDelegant &&
    lastEntry.renouvellement === candidate.renouvellement &&
    lastEntry.prescription_anti_h1 === candidate.prescriptionAntiH1 &&
    lastEntry.prescription_collyre === candidate.prescriptionCollyre &&
    lastEntry.prescription_antiallergique_nasal === candidate.prescriptionAntiallergiqueNasal &&
    lastEntry.prescription_corticoide_nasal === candidate.prescriptionCorticoideNasal &&
    lastEntry.nb_produits_pmo === candidate.nbProduitsPmo &&
    lastEntry.dispensation_conseil === candidate.dispensationConseil &&
    lastEntry.nb_produits_conseil === candidate.nbProduitsConseil &&
    lastEntry.medecin_delegant_rpps === candidate.medecinDelegantRpps
  )
}

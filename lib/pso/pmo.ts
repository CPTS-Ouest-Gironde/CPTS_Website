import { format, parseISO } from "date-fns"
import { fr } from "date-fns/locale"
import type { SupabaseClient } from "@supabase/supabase-js"
import { z } from "zod"
import type { PmoEntryInput } from "@/lib/validations/pso"
import type { Database } from "@/types/supabase"

type AppSupabaseClient = SupabaseClient<Database>
type PmoEntryRow = Database["public"]["Tables"]["pmo_entries"]["Row"]

export const PMO_PAGE_SIZE = 20

export const pmoSuccessValues = ["created", "updated", "deleted"] as const
export type PmoSuccessValue = (typeof pmoSuccessValues)[number]

export const PmoOrientationLabels: Record<string, string> = {
  medecin_delegant: "Médecin délégant",
  medecin_traitant: "Médecin traitant",
  officine: "Officine",
  urgences: "Urgences",
}

export const pmoSuccessMessages: Record<PmoSuccessValue, string> = {
  created: "La saisie PMO a bien été enregistrée.",
  deleted: "La saisie PMO a bien été supprimée.",
  updated: "La saisie PMO a bien été mise à jour.",
}

const pmoEntryIdSchema = z.string().uuid()
const pmoSearchParamsSchema = z.object({
  page: z.union([z.string(), z.array(z.string())]).optional(),
  success: z.union([z.string(), z.array(z.string())]).optional(),
})
const pmoSuccessSchema = z.enum(pmoSuccessValues)

function getSearchParamValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value
}

export function formatPmoDate(dateValue: string) {
  const parsedDate = parseISO(dateValue)

  if (Number.isNaN(parsedDate.getTime())) {
    return dateValue
  }

  return format(parsedDate, "dd/MM/yyyy", { locale: fr })
}

export function getPmoOrientationLabel(value: string) {
  return PmoOrientationLabels[value] ?? value
}

export function getPmoPatientSexeLabel(value: string) {
  return value === "homme" ? "Homme" : "Femme"
}

export function getYesNoLabel(value: boolean) {
  return value ? "Oui" : "Non"
}

export function parsePmoPage(value: string | undefined) {
  const parsedPage = z.coerce.number().int().min(1).safeParse(value ?? "1")
  return parsedPage.success ? parsedPage.data : 1
}

export function parsePmoListSearchParams(input: {
  page?: string | string[]
  success?: string | string[]
}) {
  const parsedInput = pmoSearchParamsSchema.safeParse(input)

  if (!parsedInput.success) {
    return {
      page: 1,
      success: undefined,
    }
  }

  const successValue = getSearchParamValue(parsedInput.data.success)
  const parsedSuccess = successValue ? pmoSuccessSchema.safeParse(successValue) : null

  return {
    page: parsePmoPage(getSearchParamValue(parsedInput.data.page)),
    success: parsedSuccess?.success ? parsedSuccess.data : undefined,
  }
}

export function parsePmoEntryId(value: string) {
  const parsedId = pmoEntryIdSchema.safeParse(value)
  return parsedId.success ? parsedId.data : null
}

export function getPmoListHref({
  page = 1,
  success,
}: {
  page?: number
  success?: PmoSuccessValue
}) {
  const params = new URLSearchParams()

  if (page > 1) {
    params.set("page", String(page))
  }

  if (success) {
    params.set("success", success)
  }

  const query = params.toString()
  return query ? `/espace-pro/pmo?${query}` : "/espace-pro/pmo"
}

export async function getPmoEntryRecord(supabase: AppSupabaseClient, entryId: string): Promise<PmoEntryRow | null> {
  const parsedId = parsePmoEntryId(entryId)

  if (!parsedId) {
    return null
  }

  const result = await supabase
    .from("pmo_entries")
    .select(
      `
        id,
        created_at,
        date_realisation,
        dispensation_conseil,
        effet_indesirable,
        medecin_delegant_nom,
        medecin_delegant_rpps,
        nb_produits_conseil,
        nb_produits_pmo,
        orientation,
        patient_age,
        patient_medecin_traitant,
        patient_sexe,
        pharmacie_id,
        prescription_anti_h1,
        prescription_antiallergique_nasal,
        prescription_collyre,
        prescription_corticoide_nasal,
        renouvellement,
        updated_at,
        user_id
      `,
    )
    .eq("id", parsedId)
    .maybeSingle()

  if (result.error || !result.data) {
    return null
  }

  return result.data as PmoEntryRow
}

export function toPmoEntryInput(entry: PmoEntryRow, medecinDelegantId = ""): PmoEntryInput {
  const effetIndesirable = entry.effet_indesirable?.trim() ?? ""

  return {
    dateRealisation: entry.date_realisation,
    dispensationConseil: entry.dispensation_conseil,
    effetIndesirableDescription: effetIndesirable,
    effetIndesirableSignale: effetIndesirable.length > 0,
    medecinDelegantId,
    nbProduitsConseil: entry.nb_produits_conseil as PmoEntryInput["nbProduitsConseil"],
    nbProduitsPmo: entry.nb_produits_pmo as PmoEntryInput["nbProduitsPmo"],
    orientation: entry.orientation as PmoEntryInput["orientation"],
    patientAge: entry.patient_age as PmoEntryInput["patientAge"],
    patientMedecinTraitant: entry.patient_medecin_traitant,
    patientSexe: entry.patient_sexe as PmoEntryInput["patientSexe"],
    prescriptionAntiH1: entry.prescription_anti_h1,
    prescriptionAntiallergiqueNasal: entry.prescription_antiallergique_nasal,
    prescriptionCollyre: entry.prescription_collyre,
    prescriptionCorticoideNasal: entry.prescription_corticoide_nasal,
    renouvellement: entry.renouvellement,
  }
}

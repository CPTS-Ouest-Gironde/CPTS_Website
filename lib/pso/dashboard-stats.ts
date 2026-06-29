import { format } from "date-fns"
import type { SupabaseClient } from "@supabase/supabase-js"
import {
  getDashboardDateRange,
  getDashboardMonthLabel,
  type DashboardFilters,
  type DashboardPharmacyOption,
} from "@/lib/pso/dashboard-filters"
import {
  formatPmoDate,
  getPmoOrientationLabel,
  getPmoPatientSexeLabel,
  getYesNoLabel,
} from "@/lib/pso/pmo"
import { psoPatientAgeValues } from "@/lib/validations/pso"
import type { Database } from "@/types/supabase"

type AppSupabaseClient = SupabaseClient<Database>
type ProductCountValue = Database["public"]["Tables"]["pmo_entries"]["Row"]["nb_produits_pmo"]
type PatientAgeValue = (typeof psoPatientAgeValues)[number]
type PharmacyRow = Pick<Database["public"]["Tables"]["pharmacies"]["Row"], "finess" | "id" | "nom">
type PharmacienRoleRow = Pick<Database["public"]["Tables"]["user_roles"]["Row"], "user_id">
type TitulaireProfileRow = Pick<
  Database["public"]["Tables"]["profiles"]["Row"],
  "created_at" | "first_name" | "id" | "last_name" | "pharmacie_id" | "rpps" | "titulaire"
>
type PharmacienProfileRow = Pick<Database["public"]["Tables"]["profiles"]["Row"], "first_name" | "id" | "last_name" | "rpps">
type PmoEntryStatsRow = Pick<
  Database["public"]["Tables"]["pmo_entries"]["Row"],
  | "dispensation_conseil"
  | "nb_produits_conseil"
  | "nb_produits_pmo"
  | "orientation"
  | "patient_age"
  | "patient_medecin_traitant"
  | "patient_sexe"
  | "pharmacie_id"
  | "prescription_anti_h1"
  | "prescription_antiallergique_nasal"
  | "prescription_collyre"
  | "prescription_corticoide_nasal"
  | "reorientation_medecin_delegant"
  | "renouvellement"
>
type PmoEntryDetailRow = Pick<
  Database["public"]["Tables"]["pmo_entries"]["Row"],
  | "created_at"
  | "date_realisation"
  | "dispensation_conseil"
  | "effet_indesirable"
  | "id"
  | "medecin_delegant_nom"
  | "medecin_delegant_rpps"
  | "nb_produits_conseil"
  | "nb_produits_pmo"
  | "orientation"
  | "patient_age"
  | "patient_medecin_traitant"
  | "patient_sexe"
  | "pharmacie_id"
  | "prescription_anti_h1"
  | "prescription_antiallergique_nasal"
  | "prescription_collyre"
  | "prescription_corticoide_nasal"
  | "reorientation_medecin_delegant"
  | "renouvellement"
  | "user_id"
>

type MutablePharmacyDetail = {
  antiH1Count: number
  antiallergiqueNasalCount: number
  collyreCount: number
  corticoideNasalCount: number
  dispensationConseilCount: number
  finess: string
  medecinDelegantCount: number
  medecinTraitantCount: number
  moyenneProduitsConseilTotal: number
  moyenneProduitsPmoTotal: number
  nom: string
  patientsSansMedecinTraitantCount: number
  pharmacienRpps: string | null
  pharmacienTitulaire: string | null
  pharmacieId: string
  reorientationMedecinDelegantCount: number
  renouvellementCount: number
  totalPatients: number
  urgencesCount: number
}

type DashboardPharmacienSummary = {
  nom: string | null
  rpps: string | null
}

export type DashboardBreakdown = {
  n: number
  pct: number
}

export type DashboardAgeBreakdown = Record<PatientAgeValue, number>

export type DashboardPharmacyDetail = {
  antiH1Pct: number
  antiallergiqueNasalPct: number
  collyrePct: number
  corticoideNasalPct: number
  moyenneProduitsConseil: number
  moyenneProduitsPmo: number
  patientsSansMedecinTraitant: DashboardBreakdown
  pharmacienRpps: string | null
  pharmacienTitulaire: string | null
  pharmacieFiness: string
  pharmacieId: string
  pharmacieNom: string
  reorientationMedecinDelegant: DashboardBreakdown
  tauxRenouvellements: number
  tauxDispensationConseil: number
  totalPatients: number
  totalProduitsParPatient: number
  reorientations: {
    medecinDelegant: number
    medecinTraitant: number
    urgences: number
  }
}

export type DashboardPmoDetailRow = {
  dateRealisation: string
  dispensationConseil: boolean
  effetIndesirable: string | null
  id: string
  medecinDelegantNom: string
  medecinDelegantRpps: string
  nbProduitsConseil: ProductCountValue
  nbProduitsPmo: ProductCountValue
  orientation: string
  patientAge: string
  patientMedecinTraitant: boolean
  patientSexe: string
  pharmacienNom: string | null
  pharmacienRpps: string | null
  pharmacieFiness: string
  pharmacieId: string
  pharmacieNom: string
  prescriptionAntiH1: boolean
  prescriptionAntiallergiqueNasal: boolean
  prescriptionCollyre: boolean
  prescriptionCorticoideNasal: boolean
  reorientationMedecinDelegant: boolean
  renouvellement: boolean
}

export type DashboardPmoDetailPage = {
  currentPage: number
  entries: DashboardPmoDetailRow[]
  totalEntries: number
  totalPages: number
}

export type DashboardStats = {
  dispensationConseil: DashboardBreakdown
  hasData: boolean
  moyennePatientsParPharmacie: number
  moyenneProduitsConseil: number
  moyenneProduitsPmo: number
  nbPharmaciesActives: number
  patientsSansMedecinTraitant: DashboardBreakdown
  pharmacyDetails: DashboardPharmacyDetail[]
  prescriptions: {
    antiH1: DashboardBreakdown
    antiallergiqueNasal: DashboardBreakdown
    collyre: DashboardBreakdown
    corticoideNasal: DashboardBreakdown
  }
  reorientationMedecinDelegant: DashboardBreakdown
  repartitionAge: DashboardAgeBreakdown
  repartitionSexe: {
    femmes: DashboardBreakdown
    hommes: DashboardBreakdown
  }
  reorientations: {
    medecinDelegant: number
    medecinTraitant: number
    urgences: number
  }
  renouvellements: DashboardBreakdown
  totalPatients: number
  totalProduitsParPatient: number
}

const dashboardPmoStatsFields = [
  "pharmacie_id",
  "patient_sexe",
  "patient_age",
  "patient_medecin_traitant",
  "orientation",
  "reorientation_medecin_delegant",
  "prescription_anti_h1",
  "prescription_collyre",
  "prescription_antiallergique_nasal",
  "prescription_corticoide_nasal",
  "renouvellement",
  "nb_produits_pmo",
  "dispensation_conseil",
  "nb_produits_conseil",
].join(",")

const dashboardPmoDetailFields = [
  "id",
  "user_id",
  "pharmacie_id",
  "created_at",
  "date_realisation",
  "patient_sexe",
  "patient_age",
  "patient_medecin_traitant",
  "orientation",
  "reorientation_medecin_delegant",
  "prescription_anti_h1",
  "prescription_collyre",
  "prescription_antiallergique_nasal",
  "prescription_corticoide_nasal",
  "renouvellement",
  "nb_produits_pmo",
  "dispensation_conseil",
  "nb_produits_conseil",
  "effet_indesirable",
  "medecin_delegant_nom",
  "medecin_delegant_rpps",
].join(",")

const productCountMap: Record<ProductCountValue, number> = {
  "0": 0,
  "1": 1,
  "2": 2,
  "3": 3,
  "4": 4,
  "5": 5,
  ">5": 6,
}

function createAgeBreakdown(): DashboardAgeBreakdown {
  return {
    "<15": 0,
    "15-20": 0,
    "21-30": 0,
    "31-40": 0,
    "41-50": 0,
    ">50": 0,
  }
}

function createEmptyStats(): DashboardStats {
  return {
    dispensationConseil: { n: 0, pct: 0 },
    hasData: false,
    moyennePatientsParPharmacie: 0,
    moyenneProduitsConseil: 0,
    moyenneProduitsPmo: 0,
    nbPharmaciesActives: 0,
    patientsSansMedecinTraitant: { n: 0, pct: 0 },
    pharmacyDetails: [],
    prescriptions: {
      antiH1: { n: 0, pct: 0 },
      antiallergiqueNasal: { n: 0, pct: 0 },
      collyre: { n: 0, pct: 0 },
      corticoideNasal: { n: 0, pct: 0 },
    },
    reorientationMedecinDelegant: { n: 0, pct: 0 },
    repartitionAge: createAgeBreakdown(),
    repartitionSexe: {
      femmes: { n: 0, pct: 0 },
      hommes: { n: 0, pct: 0 },
    },
    reorientations: {
      medecinDelegant: 0,
      medecinTraitant: 0,
      urgences: 0,
    },
    renouvellements: { n: 0, pct: 0 },
    totalPatients: 0,
    totalProduitsParPatient: 0,
  }
}

function toPercentage(value: number, total: number) {
  return total > 0 ? (value / total) * 100 : 0
}

function toAverage(total: number, count: number) {
  return count > 0 ? total / count : 0
}

function toRoundedNumber(value: number, digits = 1) {
  return Number(value.toFixed(digits))
}

function toProductCount(value: ProductCountValue) {
  return productCountMap[value] ?? 0
}

function normalizeOptionalText(value: string | null | undefined) {
  const normalizedValue = value?.trim()
  return normalizedValue ? normalizedValue : null
}

function formatDisplayName(firstName: string | null | undefined, lastName: string | null | undefined) {
  const parts = [normalizeOptionalText(firstName), normalizeOptionalText(lastName)].filter(Boolean)
  return parts.length > 0 ? parts.join(" ") : null
}

function getCsvText(value: string | null | undefined, fallback = "") {
  return normalizeOptionalText(value) ?? fallback
}

function getDashboardPharmacienName(firstName: string | null | undefined, lastName: string | null | undefined) {
  return formatDisplayName(firstName, lastName) ?? "Nom non renseigné"
}

function getDashboardPharmacienRpps(rpps: string | null | undefined) {
  return normalizeOptionalText(rpps) ?? "RPPS non renseigné"
}

function createMutablePharmacyDetail(pharmacy: DashboardPharmacyOption): MutablePharmacyDetail {
  return {
    antiH1Count: 0,
    antiallergiqueNasalCount: 0,
    collyreCount: 0,
    corticoideNasalCount: 0,
    dispensationConseilCount: 0,
    finess: pharmacy.finess,
    medecinDelegantCount: 0,
    medecinTraitantCount: 0,
    moyenneProduitsConseilTotal: 0,
    moyenneProduitsPmoTotal: 0,
    nom: pharmacy.nom,
    patientsSansMedecinTraitantCount: 0,
    pharmacienRpps: pharmacy.pharmacienRpps,
    pharmacienTitulaire: pharmacy.pharmacienTitulaire,
    pharmacieId: pharmacy.id,
    reorientationMedecinDelegantCount: 0,
    renouvellementCount: 0,
    totalPatients: 0,
    urgencesCount: 0,
  }
}

function toCsvValue(value: number, digits = 1) {
  if (Number.isInteger(value)) {
    return String(value)
  }

  return value.toFixed(digits).replace(".", ",")
}

function escapeCsvCell(value: string) {
  if (/[;"\n\r]/.test(value)) {
    return `"${value.replaceAll('"', '""')}"`
  }

  return value
}

function buildCsvRow(values: Array<number | string>) {
  return values.map((value) => escapeCsvCell(String(value))).join(";")
}

async function getDashboardTitulaireMap(
  supabase: AppSupabaseClient,
  pharmacyIds: readonly string[],
): Promise<Map<string, DashboardPharmacienSummary>> {
  if (pharmacyIds.length === 0) {
    return new Map()
  }

  const rolesResult = await supabase.from("user_roles").select("user_id").eq("role", "pharmacien_pso")

  if (rolesResult.error) {
    throw new Error("Impossible de charger les pharmaciens du dashboard.")
  }

  const pharmacienIds = Array.from(new Set((rolesResult.data ?? []).map((row: PharmacienRoleRow) => row.user_id)))

  if (pharmacienIds.length === 0) {
    return new Map()
  }

  const profilesResult = await supabase
    .from("profiles")
    .select("id,pharmacie_id,first_name,last_name,rpps,created_at,titulaire")
    .in("id", pharmacienIds)
    .in("pharmacie_id", pharmacyIds)

  if (profilesResult.error) {
    throw new Error("Impossible de charger les titulaires du dashboard.")
  }

  const titulaires = (profilesResult.data ?? [])
    .filter((profile: TitulaireProfileRow) => Boolean(profile.pharmacie_id))
    .sort(
      (first, second) =>
        Number(second.titulaire) - Number(first.titulaire) ||
        new Date(first.created_at).getTime() - new Date(second.created_at).getTime() ||
        first.id.localeCompare(second.id),
    )

  const titulaireMap = new Map<string, DashboardPharmacienSummary>()

  for (const titulaire of titulaires) {
    if (!titulaire.pharmacie_id || titulaireMap.has(titulaire.pharmacie_id)) {
      continue
    }

    titulaireMap.set(titulaire.pharmacie_id, {
      nom: getDashboardPharmacienName(titulaire.first_name, titulaire.last_name),
      rpps: getDashboardPharmacienRpps(titulaire.rpps),
    })
  }

  return titulaireMap
}

async function getDashboardPharmacienProfileMap(
  supabase: AppSupabaseClient,
  userIds: readonly string[],
): Promise<Map<string, DashboardPharmacienSummary>> {
  if (userIds.length === 0) {
    return new Map()
  }

  const profilesResult = await supabase.from("profiles").select("id,first_name,last_name,rpps").in("id", userIds)

  if (profilesResult.error) {
    throw new Error("Impossible de charger les RPPS des pharmaciens.")
  }

  return new Map(
    (profilesResult.data ?? []).map((profile: PharmacienProfileRow) => [
      profile.id,
      {
        nom: formatDisplayName(profile.first_name, profile.last_name),
        rpps: normalizeOptionalText(profile.rpps),
      },
    ]),
  )
}

function mapDashboardPmoEntries(
  entries: readonly PmoEntryDetailRow[],
  pharmacies: readonly DashboardPharmacyOption[],
  pharmacienProfileMap: ReadonlyMap<string, DashboardPharmacienSummary>,
) {
  const pharmacyMap = new Map(pharmacies.map((pharmacy) => [pharmacy.id, pharmacy]))

  return entries.map<DashboardPmoDetailRow>((entry) => {
    const pharmacy = pharmacyMap.get(entry.pharmacie_id)
    const pharmacienProfile = pharmacienProfileMap.get(entry.user_id)

    return {
      dateRealisation: entry.date_realisation,
      dispensationConseil: entry.dispensation_conseil,
      effetIndesirable: normalizeOptionalText(entry.effet_indesirable),
      id: entry.id,
      medecinDelegantNom: entry.medecin_delegant_nom,
      medecinDelegantRpps: entry.medecin_delegant_rpps,
      nbProduitsConseil: entry.nb_produits_conseil,
      nbProduitsPmo: entry.nb_produits_pmo,
      orientation: entry.orientation,
      patientAge: entry.patient_age,
      patientMedecinTraitant: entry.patient_medecin_traitant,
      patientSexe: entry.patient_sexe,
      pharmacienNom: pharmacienProfile?.nom ?? null,
      pharmacienRpps: pharmacienProfile?.rpps ?? null,
      pharmacieFiness: pharmacy?.finess ?? "",
      pharmacieId: entry.pharmacie_id,
      pharmacieNom: pharmacy?.nom ?? "Pharmacie non renseignée",
      prescriptionAntiH1: entry.prescription_anti_h1,
      prescriptionAntiallergiqueNasal: entry.prescription_antiallergique_nasal,
      prescriptionCollyre: entry.prescription_collyre,
      prescriptionCorticoideNasal: entry.prescription_corticoide_nasal,
      reorientationMedecinDelegant: entry.reorientation_medecin_delegant,
      renouvellement: entry.renouvellement,
    }
  })
}

function buildDashboardPmoDetailQuery(
  supabase: AppSupabaseClient,
  filters: DashboardFilters,
  pharmacyId?: string,
) {
  const { endDate, startDate } = getDashboardDateRange(filters)

  let query = supabase
    .from("pmo_entries")
    .select(dashboardPmoDetailFields, { count: "exact" })
    .gte("date_realisation", startDate)
    .lte("date_realisation", endDate)

  if (pharmacyId) {
    return query.eq("pharmacie_id", pharmacyId)
  }

  if (filters.pharmacyIds.length > 0) {
    query = query.in("pharmacie_id", filters.pharmacyIds)
  }

  return query
}

export async function getDashboardPharmacyOptions(supabase: AppSupabaseClient): Promise<DashboardPharmacyOption[]> {
  const pharmaciesResult = await supabase.from("pharmacies").select("id,nom,finess").order("nom", { ascending: true })

  if (pharmaciesResult.error) {
    throw new Error("Impossible de charger les pharmacies du dashboard.")
  }

  const pharmacies = (pharmaciesResult.data ?? []) as PharmacyRow[]
  const titulaireMap = await getDashboardTitulaireMap(
    supabase,
    pharmacies.map((pharmacy) => pharmacy.id),
  )

  return pharmacies.map((pharmacy) => ({
    finess: pharmacy.finess,
    id: pharmacy.id,
    nom: pharmacy.nom,
    pharmacienRpps: titulaireMap.get(pharmacy.id)?.rpps ?? null,
    pharmacienTitulaire: titulaireMap.get(pharmacy.id)?.nom ?? null,
  }))
}

export async function getDashboardStats(
  supabase: AppSupabaseClient,
  filters: DashboardFilters,
  pharmacies: readonly DashboardPharmacyOption[],
): Promise<DashboardStats> {
  const { endDate, startDate } = getDashboardDateRange(filters)

  let query = supabase
    .from("pmo_entries")
    .select(dashboardPmoStatsFields)
    .gte("date_realisation", startDate)
    .lte("date_realisation", endDate)

  if (filters.pharmacyIds.length > 0) {
    query = query.in("pharmacie_id", filters.pharmacyIds)
  }

  const result = await query.overrideTypes<PmoEntryStatsRow[], { merge: false }>()

  if (result.error) {
    throw new Error("Impossible de charger les statistiques du dashboard.")
  }

  const entries = result.data ?? []

  if (entries.length === 0) {
    return createEmptyStats()
  }

  const pharmacyMap = new Map(pharmacies.map((pharmacy) => [pharmacy.id, pharmacy]))
  const repartitionAge = createAgeBreakdown()
  const pharmacyDetailsMap = new Map<string, MutablePharmacyDetail>()
  let femmesCount = 0
  let hommesCount = 0
  let patientsSansMedecinTraitantCount = 0
  let urgencesCount = 0
  let medecinDelegantCount = 0
  let medecinTraitantCount = 0
  let antiH1Count = 0
  let collyreCount = 0
  let antiallergiqueNasalCount = 0
  let corticoideNasalCount = 0
  let dispensationConseilCount = 0
  let produitsPmoTotal = 0
  let produitsConseilTotal = 0
  let reorientationMedecinDelegantCount = 0
  let renouvellementCount = 0

  for (const entry of entries) {
    const produitsPmo = toProductCount(entry.nb_produits_pmo)
    const produitsConseil = toProductCount(entry.nb_produits_conseil)
    const pharmacyMetadata = pharmacyMap.get(entry.pharmacie_id) ?? {
      finess: "",
      id: entry.pharmacie_id,
      nom: "Pharmacie non renseignée",
      pharmacienRpps: null,
      pharmacienTitulaire: null,
    }
    const pharmacyDetail =
      pharmacyDetailsMap.get(entry.pharmacie_id) ?? createMutablePharmacyDetail(pharmacyMetadata)

    pharmacyDetail.totalPatients += 1
    pharmacyDetail.moyenneProduitsPmoTotal += produitsPmo
    pharmacyDetail.moyenneProduitsConseilTotal += produitsConseil

    if (entry.reorientation_medecin_delegant) {
      reorientationMedecinDelegantCount += 1
      pharmacyDetail.reorientationMedecinDelegantCount += 1
    }

    if (entry.renouvellement) {
      renouvellementCount += 1
      pharmacyDetail.renouvellementCount += 1
    }

    if (entry.patient_sexe === "femme") {
      femmesCount += 1
    } else {
      hommesCount += 1
    }

    if (entry.patient_age in repartitionAge) {
      repartitionAge[entry.patient_age as PatientAgeValue] += 1
    }

    if (!entry.patient_medecin_traitant) {
      patientsSansMedecinTraitantCount += 1
      pharmacyDetail.patientsSansMedecinTraitantCount += 1
    }

    if (entry.orientation === "urgences") {
      urgencesCount += 1
      pharmacyDetail.urgencesCount += 1
    }

    if (entry.orientation === "medecin_delegant") {
      medecinDelegantCount += 1
      pharmacyDetail.medecinDelegantCount += 1
    }

    if (entry.orientation === "medecin_traitant") {
      medecinTraitantCount += 1
      pharmacyDetail.medecinTraitantCount += 1
    }

    if (entry.prescription_anti_h1) {
      antiH1Count += 1
      pharmacyDetail.antiH1Count += 1
    }

    if (entry.prescription_collyre) {
      collyreCount += 1
      pharmacyDetail.collyreCount += 1
    }

    if (entry.prescription_antiallergique_nasal) {
      antiallergiqueNasalCount += 1
      pharmacyDetail.antiallergiqueNasalCount += 1
    }

    if (entry.prescription_corticoide_nasal) {
      corticoideNasalCount += 1
      pharmacyDetail.corticoideNasalCount += 1
    }

    if (entry.dispensation_conseil) {
      dispensationConseilCount += 1
      pharmacyDetail.dispensationConseilCount += 1
    }

    produitsPmoTotal += produitsPmo
    produitsConseilTotal += produitsConseil
    pharmacyDetailsMap.set(entry.pharmacie_id, pharmacyDetail)
  }

  const totalPatients = entries.length
  const nbPharmaciesActives = pharmacyDetailsMap.size
  const pharmacyDetails = Array.from(pharmacyDetailsMap.values())
    .map((detail) => ({
      antiH1Pct: toRoundedNumber(toPercentage(detail.antiH1Count, detail.totalPatients)),
      antiallergiqueNasalPct: toRoundedNumber(toPercentage(detail.antiallergiqueNasalCount, detail.totalPatients)),
      collyrePct: toRoundedNumber(toPercentage(detail.collyreCount, detail.totalPatients)),
      corticoideNasalPct: toRoundedNumber(toPercentage(detail.corticoideNasalCount, detail.totalPatients)),
      moyenneProduitsConseil: toRoundedNumber(toAverage(detail.moyenneProduitsConseilTotal, detail.totalPatients), 2),
      moyenneProduitsPmo: toRoundedNumber(toAverage(detail.moyenneProduitsPmoTotal, detail.totalPatients), 2),
      patientsSansMedecinTraitant: {
        n: detail.patientsSansMedecinTraitantCount,
        pct: toRoundedNumber(toPercentage(detail.patientsSansMedecinTraitantCount, detail.totalPatients)),
      },
      pharmacienRpps: detail.pharmacienRpps,
      pharmacienTitulaire: detail.pharmacienTitulaire,
      pharmacieFiness: detail.finess,
      pharmacieId: detail.pharmacieId,
      pharmacieNom: detail.nom,
      reorientationMedecinDelegant: {
        n: detail.reorientationMedecinDelegantCount,
        pct: toRoundedNumber(toPercentage(detail.reorientationMedecinDelegantCount, detail.totalPatients)),
      },
      tauxRenouvellements: toRoundedNumber(toPercentage(detail.renouvellementCount, detail.totalPatients)),
      tauxDispensationConseil: toRoundedNumber(toPercentage(detail.dispensationConseilCount, detail.totalPatients)),
      totalPatients: detail.totalPatients,
      totalProduitsParPatient: toRoundedNumber(
        toAverage(detail.moyenneProduitsPmoTotal + detail.moyenneProduitsConseilTotal, detail.totalPatients),
        2,
      ),
      reorientations: {
        medecinDelegant: detail.medecinDelegantCount,
        medecinTraitant: detail.medecinTraitantCount,
        urgences: detail.urgencesCount,
      },
    }))
    .sort((first, second) => second.totalPatients - first.totalPatients || first.pharmacieNom.localeCompare(second.pharmacieNom))

  return {
    dispensationConseil: {
      n: dispensationConseilCount,
      pct: toRoundedNumber(toPercentage(dispensationConseilCount, totalPatients)),
    },
    hasData: true,
    moyennePatientsParPharmacie: toRoundedNumber(toAverage(totalPatients, nbPharmaciesActives), 2),
    moyenneProduitsConseil: toRoundedNumber(toAverage(produitsConseilTotal, totalPatients), 2),
    moyenneProduitsPmo: toRoundedNumber(toAverage(produitsPmoTotal, totalPatients), 2),
    nbPharmaciesActives,
    patientsSansMedecinTraitant: {
      n: patientsSansMedecinTraitantCount,
      pct: toRoundedNumber(toPercentage(patientsSansMedecinTraitantCount, totalPatients)),
    },
    pharmacyDetails,
    prescriptions: {
      antiH1: {
        n: antiH1Count,
        pct: toRoundedNumber(toPercentage(antiH1Count, totalPatients)),
      },
      antiallergiqueNasal: {
        n: antiallergiqueNasalCount,
        pct: toRoundedNumber(toPercentage(antiallergiqueNasalCount, totalPatients)),
      },
      collyre: {
        n: collyreCount,
        pct: toRoundedNumber(toPercentage(collyreCount, totalPatients)),
      },
      corticoideNasal: {
        n: corticoideNasalCount,
        pct: toRoundedNumber(toPercentage(corticoideNasalCount, totalPatients)),
      },
    },
    reorientationMedecinDelegant: {
      n: reorientationMedecinDelegantCount,
      pct: toRoundedNumber(toPercentage(reorientationMedecinDelegantCount, totalPatients)),
    },
    repartitionAge,
    repartitionSexe: {
      femmes: {
        n: femmesCount,
        pct: toRoundedNumber(toPercentage(femmesCount, totalPatients)),
      },
      hommes: {
        n: hommesCount,
        pct: toRoundedNumber(toPercentage(hommesCount, totalPatients)),
      },
    },
    reorientations: {
      medecinDelegant: medecinDelegantCount,
      medecinTraitant: medecinTraitantCount,
      urgences: urgencesCount,
    },
    renouvellements: {
      n: renouvellementCount,
      pct: toRoundedNumber(toPercentage(renouvellementCount, totalPatients)),
    },
    totalPatients,
    totalProduitsParPatient: toRoundedNumber(toAverage(produitsPmoTotal + produitsConseilTotal, totalPatients), 2),
  }
}

export async function getDashboardPmoDetailEntries(
  supabase: AppSupabaseClient,
  filters: DashboardFilters,
  pharmacies: readonly DashboardPharmacyOption[],
  pharmacyId?: string,
) {
  const result = await buildDashboardPmoDetailQuery(supabase, filters, pharmacyId)
    .order("date_realisation", { ascending: true })
    .order("created_at", { ascending: true })
    .overrideTypes<PmoEntryDetailRow[], { merge: false }>()

  if (result.error) {
    throw new Error("Impossible de charger les saisies du dashboard.")
  }

  const entries = result.data ?? []
  const pharmacienProfileMap = await getDashboardPharmacienProfileMap(
    supabase,
    Array.from(new Set(entries.map((entry) => entry.user_id))),
  )

  return mapDashboardPmoEntries(entries, pharmacies, pharmacienProfileMap)
}

export async function getDashboardPharmacyDetailPage(
  supabase: AppSupabaseClient,
  filters: DashboardFilters,
  pharmacies: readonly DashboardPharmacyOption[],
  pharmacyId: string,
  page: number,
  pageSize: number,
): Promise<DashboardPmoDetailPage> {
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  const result = await buildDashboardPmoDetailQuery(supabase, filters, pharmacyId)
    .order("date_realisation", { ascending: false })
    .order("created_at", { ascending: false })
    .range(from, to)
    .overrideTypes<PmoEntryDetailRow[], { merge: false }>()

  if (result.error) {
    throw new Error("Impossible de charger les saisies de la pharmacie.")
  }

  const totalEntries = result.count ?? 0
  const totalPages = Math.max(1, Math.ceil(totalEntries / pageSize))
  const pharmacienProfileMap = await getDashboardPharmacienProfileMap(
    supabase,
    Array.from(new Set((result.data ?? []).map((entry) => entry.user_id))),
  )

  return {
    currentPage: Math.min(page, totalPages),
    entries: mapDashboardPmoEntries(result.data ?? [], pharmacies, pharmacienProfileMap),
    totalEntries,
    totalPages,
  }
}

export function createDashboardCsv(
  stats: DashboardStats,
  filters: DashboardFilters,
  pharmacySummary: string,
) {
  const exportDate = format(new Date(), "yyyy-MM-dd")
  const rows: string[] = [
    buildCsvRow(["Dashboard PSO Rhinite Allergique"]),
    buildCsvRow(["Export généré le", exportDate]),
    buildCsvRow(["Année", filters.year]),
    buildCsvRow([
      "Période",
      `${getDashboardMonthLabel(filters.startMonth)} à ${getDashboardMonthLabel(filters.endMonth)}`,
    ]),
    buildCsvRow(["Pharmacies", pharmacySummary]),
    "",
    buildCsvRow(["Indicateur", "Valeur"]),
    buildCsvRow(["Total patients", stats.totalPatients]),
    buildCsvRow(["Pharmacies actives", stats.nbPharmaciesActives]),
    buildCsvRow(["Moyenne patients par pharmacie", toCsvValue(stats.moyennePatientsParPharmacie, 2)]),
    buildCsvRow([
      "Femmes",
      `${stats.repartitionSexe.femmes.n} (${toCsvValue(stats.repartitionSexe.femmes.pct)} %)`,
    ]),
    buildCsvRow([
      "Hommes",
      `${stats.repartitionSexe.hommes.n} (${toCsvValue(stats.repartitionSexe.hommes.pct)} %)`,
    ]),
    buildCsvRow([
      "Patients sans médecin traitant",
      `${stats.patientsSansMedecinTraitant.n} (${toCsvValue(stats.patientsSansMedecinTraitant.pct)} %)`,
    ]),
    buildCsvRow([
      "Taux de renouvellements",
      `${stats.renouvellements.n} (${toCsvValue(stats.renouvellements.pct)} %)`,
    ]),
    buildCsvRow([
      "Réorientation médecin délégant a posteriori",
      `${stats.reorientationMedecinDelegant.n} (${toCsvValue(stats.reorientationMedecinDelegant.pct)} %)`,
    ]),
    buildCsvRow(["Prise en charge urgences", stats.reorientations.urgences]),
    buildCsvRow(["Prise en charge médecin délégant", stats.reorientations.medecinDelegant]),
    buildCsvRow(["Prise en charge médecin traitant", stats.reorientations.medecinTraitant]),
    buildCsvRow([
      "Prescription anti-H1",
      `${stats.prescriptions.antiH1.n} (${toCsvValue(stats.prescriptions.antiH1.pct)} %)`,
    ]),
    buildCsvRow([
      "Prescription collyre",
      `${stats.prescriptions.collyre.n} (${toCsvValue(stats.prescriptions.collyre.pct)} %)`,
    ]),
    buildCsvRow([
      "Prescription antiallergique nasal",
      `${stats.prescriptions.antiallergiqueNasal.n} (${toCsvValue(stats.prescriptions.antiallergiqueNasal.pct)} %)`,
    ]),
    buildCsvRow([
      "Prescription corticoïde nasal",
      `${stats.prescriptions.corticoideNasal.n} (${toCsvValue(stats.prescriptions.corticoideNasal.pct)} %)`,
    ]),
    buildCsvRow(["Moyenne produits PMO", toCsvValue(stats.moyenneProduitsPmo, 2)]),
    buildCsvRow([
      "Taux dispensation conseil",
      `${stats.dispensationConseil.n} (${toCsvValue(stats.dispensationConseil.pct)} %)`,
    ]),
    buildCsvRow(["Moyenne produits conseil", toCsvValue(stats.moyenneProduitsConseil, 2)]),
    buildCsvRow(["Total produits par patient", toCsvValue(stats.totalProduitsParPatient, 2)]),
    "",
    buildCsvRow(["Tranche d'âge", "Patients"]),
    ...psoPatientAgeValues.map((ageRange) => buildCsvRow([ageRange, stats.repartitionAge[ageRange]])),
    "",
    buildCsvRow([
      "Pharmacie",
      "FINESS",
      "Pharmacien",
      "RPPS",
      "Patients",
      "Patients sans MT",
      "% sans MT",
      "Renouvellement",
      "Réorientation médecin délégant a posteriori",
      "% réorientation médecin délégant a posteriori",
      "Prise en charge urgences",
      "Prise en charge medecin delegant",
      "Prise en charge medecin traitant",
      "% anti-H1",
      "% collyre",
      "% antiallergique nasal",
      "% corticoide nasal",
      "% dispensation conseil",
      "Moy. produits PMO",
      "Moy. produits conseil",
      "Total produits/patient",
    ]),
  ]

  if (stats.pharmacyDetails.length === 0) {
    rows.push(
      buildCsvRow([
        "Aucune donnée",
        "",
        "",
        "",
        0,
        0,
        "0 %",
        "0 %",
        0,
        "0 %",
        0,
        0,
        0,
        "0 %",
        "0 %",
        "0 %",
        "0 %",
        "0 %",
        0,
        0,
        0,
      ]),
    )
  } else {
    rows.push(
      ...stats.pharmacyDetails.map((detail) =>
        buildCsvRow([
          detail.pharmacieNom,
          detail.pharmacieFiness,
          getCsvText(detail.pharmacienTitulaire, "Non renseigné"),
          getCsvText(detail.pharmacienRpps, "Non renseigné"),
          detail.totalPatients,
          detail.patientsSansMedecinTraitant.n,
          `${toCsvValue(detail.patientsSansMedecinTraitant.pct)} %`,
          `${toCsvValue(detail.tauxRenouvellements)} %`,
          detail.reorientationMedecinDelegant.n,
          `${toCsvValue(detail.reorientationMedecinDelegant.pct)} %`,
          detail.reorientations.urgences,
          detail.reorientations.medecinDelegant,
          detail.reorientations.medecinTraitant,
          `${toCsvValue(detail.antiH1Pct)} %`,
          `${toCsvValue(detail.collyrePct)} %`,
          `${toCsvValue(detail.antiallergiqueNasalPct)} %`,
          `${toCsvValue(detail.corticoideNasalPct)} %`,
          `${toCsvValue(detail.tauxDispensationConseil)} %`,
          toCsvValue(detail.moyenneProduitsPmo, 2),
          toCsvValue(detail.moyenneProduitsConseil, 2),
          toCsvValue(detail.totalProduitsParPatient, 2),
        ]),
      ),
    )
  }

  return {
    content: `\uFEFF${rows.join("\r\n")}`,
    fileName: `export-pso-rhinite-${exportDate}.csv`,
  }
}

export function createDashboardDetailedCsv(entries: readonly DashboardPmoDetailRow[]) {
  const exportDate = format(new Date(), "yyyy-MM-dd")
  const rows = [
    buildCsvRow([
      "Pharmacie",
      "FINESS",
      "Pharmacien",
      "RPPS pharmacien",
      "Date de réalisation",
      "Sexe",
      "Tranche d'âge",
      "Médecin traitant",
      "Prise en charge",
      "Réorientation médecin délégant a posteriori",
      "Renouvellement",
      "Prescription anti-H1",
      "Prescription collyre",
      "Prescription antiallergique nasal",
      "Prescription corticoïde nasal",
      "Nombre produits PMO",
      "Dispensation conseil",
      "Nombre produits conseil",
      "Effet indésirable",
      "Médecin délégant",
      "RPPS médecin délégant",
    ]),
    ...entries.map((entry) =>
      buildCsvRow([
        entry.pharmacieNom,
        entry.pharmacieFiness,
        getCsvText(entry.pharmacienNom, "Non renseigné"),
        getCsvText(entry.pharmacienRpps, "Non renseigné"),
        formatPmoDate(entry.dateRealisation),
        getPmoPatientSexeLabel(entry.patientSexe),
        entry.patientAge,
        getYesNoLabel(entry.patientMedecinTraitant),
        getPmoOrientationLabel(entry.orientation),
        getYesNoLabel(entry.reorientationMedecinDelegant),
        getYesNoLabel(entry.renouvellement),
        getYesNoLabel(entry.prescriptionAntiH1),
        getYesNoLabel(entry.prescriptionCollyre),
        getYesNoLabel(entry.prescriptionAntiallergiqueNasal),
        getYesNoLabel(entry.prescriptionCorticoideNasal),
        entry.nbProduitsPmo,
        getYesNoLabel(entry.dispensationConseil),
        entry.nbProduitsConseil,
        getCsvText(entry.effetIndesirable),
        entry.medecinDelegantNom,
        entry.medecinDelegantRpps,
      ]),
    ),
  ]

  return {
    content: `\uFEFF${rows.join("\r\n")}`,
    fileName: `detail-pso-rhinite-${exportDate}.csv`,
  }
}

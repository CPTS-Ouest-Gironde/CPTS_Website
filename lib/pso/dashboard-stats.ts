import { format } from "date-fns"
import type { SupabaseClient } from "@supabase/supabase-js"
import { psoPatientAgeValues } from "@/lib/validations/pso"
import type { Database } from "@/types/supabase"
import { getDashboardMonthLabel, type DashboardFilters, type DashboardPharmacyOption } from "@/lib/pso/dashboard-filters"

type AppSupabaseClient = SupabaseClient<Database>
type PmoEntryRow = Pick<
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
>

type ProductCountValue = Database["public"]["Tables"]["pmo_entries"]["Row"]["nb_produits_pmo"]
type PatientAgeValue = (typeof psoPatientAgeValues)[number]

type MutablePharmacyDetail = {
  antiH1Count: number
  antiallergiqueNasalCount: number
  collyreCount: number
  corticoideNasalCount: number
  dispensationConseilCount: number
  medecinDelegantCount: number
  medecinTraitantCount: number
  moyenneProduitsConseilTotal: number
  moyenneProduitsPmoTotal: number
  nom: string
  patientsSansMedecinTraitantCount: number
  pharmacieId: string
  totalPatients: number
  urgencesCount: number
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
  pharmacieId: string
  pharmacieNom: string
  tauxDispensationConseil: number
  totalPatients: number
  totalProduitsParPatient: number
  reorientations: {
    medecinDelegant: number
    medecinTraitant: number
    urgences: number
  }
}

export type DashboardStats = {
  hasData: boolean
  moyennePatientsParPharmacie: number
  moyenneProduitsConseil: number
  moyenneProduitsPmo: number
  nbPharmaciesActives: number
  patientsSansMedecinTraitant: DashboardBreakdown
  pharmacyDetails: DashboardPharmacyDetail[]
  prescriptions: {
    antiH1Pct: number
    antiallergiqueNasalPct: number
    collyrePct: number
    corticoideNasalPct: number
  }
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
  tauxDispensationConseil: number
  totalPatients: number
  totalProduitsParPatient: number
}

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
    hasData: false,
    moyennePatientsParPharmacie: 0,
    moyenneProduitsConseil: 0,
    moyenneProduitsPmo: 0,
    nbPharmaciesActives: 0,
    patientsSansMedecinTraitant: { n: 0, pct: 0 },
    pharmacyDetails: [],
    prescriptions: {
      antiH1Pct: 0,
      antiallergiqueNasalPct: 0,
      collyrePct: 0,
      corticoideNasalPct: 0,
    },
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
    tauxDispensationConseil: 0,
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

function createMutablePharmacyDetail(pharmacieId: string, nom: string): MutablePharmacyDetail {
  return {
    antiH1Count: 0,
    antiallergiqueNasalCount: 0,
    collyreCount: 0,
    corticoideNasalCount: 0,
    dispensationConseilCount: 0,
    medecinDelegantCount: 0,
    medecinTraitantCount: 0,
    moyenneProduitsConseilTotal: 0,
    moyenneProduitsPmoTotal: 0,
    nom,
    patientsSansMedecinTraitantCount: 0,
    pharmacieId,
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

export async function getDashboardPharmacyOptions(supabase: AppSupabaseClient): Promise<DashboardPharmacyOption[]> {
  const result = await supabase.from("pharmacies").select("id,nom").order("nom", { ascending: true })

  if (result.error) {
    throw new Error("Impossible de charger les pharmacies du dashboard.")
  }

  return result.data ?? []
}

export async function getDashboardStats(
  supabase: AppSupabaseClient,
  filters: DashboardFilters,
  pharmacies: readonly DashboardPharmacyOption[],
): Promise<DashboardStats> {
  const startDate = `${filters.year}-${String(filters.startMonth).padStart(2, "0")}-01`
  const lastDayInMonth = new Date(filters.year, filters.endMonth, 0).getDate()
  const endDate = `${filters.year}-${String(filters.endMonth).padStart(2, "0")}-${String(lastDayInMonth).padStart(2, "0")}`

  let query = supabase
    .from("pmo_entries")
    .select(
      [
        "pharmacie_id",
        "patient_sexe",
        "patient_age",
        "patient_medecin_traitant",
        "orientation",
        "prescription_anti_h1",
        "prescription_collyre",
        "prescription_antiallergique_nasal",
        "prescription_corticoide_nasal",
        "nb_produits_pmo",
        "dispensation_conseil",
        "nb_produits_conseil",
      ].join(","),
    )
    .gte("date_realisation", startDate)
    .lte("date_realisation", endDate)

  if (filters.pharmacyIds.length > 0) {
    query = query.in("pharmacie_id", filters.pharmacyIds)
  }

  const result = await query.overrideTypes<PmoEntryRow[], { merge: false }>()

  if (result.error) {
    throw new Error("Impossible de charger les statistiques du dashboard.")
  }

  const entries = result.data ?? []

  if (entries.length === 0) {
    return createEmptyStats()
  }

  const pharmacyNames = new Map(pharmacies.map((pharmacy) => [pharmacy.id, pharmacy.nom]))
  const repartitionAge = createAgeBreakdown()
  const pharmacyMap = new Map<string, MutablePharmacyDetail>()
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

  for (const entry of entries) {
    const produitsPmo = toProductCount(entry.nb_produits_pmo)
    const produitsConseil = toProductCount(entry.nb_produits_conseil)
    const pharmacyName = pharmacyNames.get(entry.pharmacie_id) ?? "Pharmacie non renseignée"
    const pharmacyDetail =
      pharmacyMap.get(entry.pharmacie_id) ?? createMutablePharmacyDetail(entry.pharmacie_id, pharmacyName)

    pharmacyDetail.totalPatients += 1
    pharmacyDetail.moyenneProduitsPmoTotal += produitsPmo
    pharmacyDetail.moyenneProduitsConseilTotal += produitsConseil

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
    pharmacyMap.set(entry.pharmacie_id, pharmacyDetail)
  }

  const totalPatients = entries.length
  const nbPharmaciesActives = pharmacyMap.size
  const pharmacyDetails = Array.from(pharmacyMap.values())
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
      pharmacieId: detail.pharmacieId,
      pharmacieNom: detail.nom,
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
      antiH1Pct: toRoundedNumber(toPercentage(antiH1Count, totalPatients)),
      antiallergiqueNasalPct: toRoundedNumber(toPercentage(antiallergiqueNasalCount, totalPatients)),
      collyrePct: toRoundedNumber(toPercentage(collyreCount, totalPatients)),
      corticoideNasalPct: toRoundedNumber(toPercentage(corticoideNasalCount, totalPatients)),
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
    tauxDispensationConseil: toRoundedNumber(toPercentage(dispensationConseilCount, totalPatients)),
    totalPatients,
    totalProduitsParPatient: toRoundedNumber(toAverage(produitsPmoTotal + produitsConseilTotal, totalPatients), 2),
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
    buildCsvRow(["Réorientation urgences", stats.reorientations.urgences]),
    buildCsvRow(["Réorientation médecin délégant", stats.reorientations.medecinDelegant]),
    buildCsvRow(["Réorientation médecin traitant", stats.reorientations.medecinTraitant]),
    buildCsvRow(["Prescription anti-H1", `${toCsvValue(stats.prescriptions.antiH1Pct)} %`]),
    buildCsvRow(["Prescription collyre", `${toCsvValue(stats.prescriptions.collyrePct)} %`]),
    buildCsvRow([
      "Prescription antiallergique nasal",
      `${toCsvValue(stats.prescriptions.antiallergiqueNasalPct)} %`,
    ]),
    buildCsvRow([
      "Prescription corticoïde nasal",
      `${toCsvValue(stats.prescriptions.corticoideNasalPct)} %`,
    ]),
    buildCsvRow(["Moyenne produits PMO", toCsvValue(stats.moyenneProduitsPmo, 2)]),
    buildCsvRow(["Taux dispensation conseil", `${toCsvValue(stats.tauxDispensationConseil)} %`]),
    buildCsvRow(["Moyenne produits conseil", toCsvValue(stats.moyenneProduitsConseil, 2)]),
    buildCsvRow(["Total produits par patient", toCsvValue(stats.totalProduitsParPatient, 2)]),
    "",
    buildCsvRow(["Tranche d'âge", "Patients"]),
    ...psoPatientAgeValues.map((ageRange) => buildCsvRow([ageRange, stats.repartitionAge[ageRange]])),
    "",
    buildCsvRow([
      "Pharmacie",
      "Patients",
      "Patients sans MT",
      "% sans MT",
      "Urgences",
      "Medecin delegant",
      "Medecin traitant",
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
    rows.push(buildCsvRow(["Aucune donnée", 0, 0, "0 %", 0, 0, 0, "0 %", "0 %", "0 %", "0 %", "0 %", 0, 0, 0]))
  } else {
    rows.push(
      ...stats.pharmacyDetails.map((detail) =>
        buildCsvRow([
          detail.pharmacieNom,
          detail.totalPatients,
          detail.patientsSansMedecinTraitant.n,
          `${toCsvValue(detail.patientsSansMedecinTraitant.pct)} %`,
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

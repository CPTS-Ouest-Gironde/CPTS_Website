import type { SupabaseClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"

type AppSupabaseClient = SupabaseClient<Database>
type SatisfactionPharmacienRow = Pick<
  Database["public"]["Tables"]["satisfaction_pharmacien"]["Row"],
  | "acces_soins"
  | "annee_reference"
  | "appreciation_patients"
  | "benefice_pratique"
  | "commentaire"
  | "created_at"
  | "facilite_mise_en_place"
  | "incidents_description"
  | "nb_effets_indesirables_graves"
  | "satisfaction_globale"
>
type SatisfactionPharmacienYearRow = Pick<
  Database["public"]["Tables"]["satisfaction_pharmacien"]["Row"],
  "annee_reference"
>
type SatisfactionPatientRow = Pick<
  Database["public"]["Tables"]["satisfaction_patient"]["Row"],
  | "commentaire"
  | "conseils_aide"
  | "consultation_medecin_apres"
  | "created_at"
  | "facilite_vie"
  | "raison_consultation"
  | "raison_venue"
  | "satisfaction_prise_en_charge"
  | "souhait_renouvellement"
>

type PatientRaisonVenueKey =
  | "affiche_saison"
  | "gene_symptomes"
  | "pas_acces_medecin"
  | "autres"

type PatientRaisonConsultationKey =
  | "effets_indesirables"
  | "pas_amelioration"
  | "aggravation"
  | "bilan_allergologique"

export type DashboardBreakdownItem = {
  count: number
  label: string
  pct: number
}

export type DashboardQuestionAverage = {
  average: number
  label: string
}

export type DashboardSatisfactionStats = {
  hasData: boolean
  patients: {
    comments: string[]
    consultationAfterCount: number
    consultationAfterRate: number
    consultationReasons: DashboardBreakdownItem[]
    questionAverages: DashboardQuestionAverage[]
    renewalCount: number
    renewalRate: number
    responseCount: number
    venueReasons: DashboardBreakdownItem[]
  }
  pharmaciens: {
    comments: string[]
    incidents: string[]
    questionAverages: DashboardQuestionAverage[]
    referenceYear: number
    responseCount: number
    totalSeriousAdverseEffects: number
  }
}

const pharmacienQuestionLabels = [
  {
    field: "satisfaction_globale",
    label: "Q1 — Êtes-vous globalement satisfait du protocole sur la rhinite allergique/rhinoconjonctivite allergique ?",
  },
  {
    field: "facilite_mise_en_place",
    label: "Q2 — Vous a-t-il paru facile à mettre en place ?",
  },
  {
    field: "benefice_pratique",
    label: "Q3 — Ce protocole vous a-t-il apporté un bénéfice dans votre pratique quotidienne ?",
  },
  {
    field: "acces_soins",
    label: "Q4 — A-t-il contribué à améliorer l'accès aux soins pour vos patients ?",
  },
  {
    field: "appreciation_patients",
    label: "Q5 — Vos patients ont-ils apprécié ce service ?",
  },
] as const satisfies ReadonlyArray<{
  field: keyof Pick<
    SatisfactionPharmacienRow,
    "acces_soins" | "appreciation_patients" | "benefice_pratique" | "facilite_mise_en_place" | "satisfaction_globale"
  >
  label: string
}>

const patientQuestionLabels = [
  {
    field: "satisfaction_prise_en_charge",
    label: "Q3 — Dans quelle mesure êtes-vous satisfait de la prise en charge proposée ?",
  },
  {
    field: "conseils_aide",
    label: "Q4 — Les conseils vous ont-ils aidé ?",
  },
  {
    field: "facilite_vie",
    label: "Q5 — Cette prise en charge vous a-t-elle facilité la vie ?",
  },
] as const satisfies ReadonlyArray<{
  field: keyof Pick<SatisfactionPatientRow, "conseils_aide" | "facilite_vie" | "satisfaction_prise_en_charge">
  label: string
}>

const patientVenueLabels: Record<PatientRaisonVenueKey, string> = {
  affiche_saison: "Affiche sur la rhinite allergique à la pharmacie",
  autres: "Autres",
  gene_symptomes: "Gêne liée aux symptômes",
  pas_acces_medecin: "Pas d'accès rapide à un médecin",
}

const patientConsultationLabels: Record<PatientRaisonConsultationKey, string> = {
  aggravation: "Aggravation",
  bilan_allergologique: "Bilan allergologique",
  effets_indesirables: "Effets indésirables",
  pas_amelioration: "Pas d'amélioration",
}

function toPercentage(value: number, total: number) {
  return total > 0 ? Number(((value / total) * 100).toFixed(1)) : 0
}

function toAverage(total: number, count: number) {
  return count > 0 ? Number((total / count).toFixed(1)) : 0
}

function cleanText(value: string | null) {
  const trimmedValue = value?.trim()
  return trimmedValue ? trimmedValue : null
}

function createEmptySatisfactionStats(referenceYear: number): DashboardSatisfactionStats {
  return {
    hasData: false,
    patients: {
      comments: [],
      consultationAfterCount: 0,
      consultationAfterRate: 0,
      consultationReasons: [],
      questionAverages: patientQuestionLabels.map((question) => ({
        average: 0,
        label: question.label,
      })),
      renewalCount: 0,
      renewalRate: 0,
      responseCount: 0,
      venueReasons: [],
    },
    pharmaciens: {
      comments: [],
      incidents: [],
      questionAverages: pharmacienQuestionLabels.map((question) => ({
        average: 0,
        label: question.label,
      })),
      referenceYear,
      responseCount: 0,
      totalSeriousAdverseEffects: 0,
    },
  }
}

export async function getDashboardSatisfactionYearOptions(
  supabase: AppSupabaseClient,
  selectedYear: number,
  currentYear = new Date().getFullYear(),
) {
  const result = await supabase
    .from("satisfaction_pharmacien")
    .select("annee_reference")
    .order("annee_reference", { ascending: false })
    .overrideTypes<SatisfactionPharmacienYearRow[], { merge: false }>()

  if (result.error) {
    throw new Error("Impossible de charger les années de satisfaction.")
  }

  const yearOptions = new Set<number>([currentYear, selectedYear])

  for (const row of result.data ?? []) {
    yearOptions.add(row.annee_reference)
  }

  return Array.from(yearOptions).sort((first, second) => second - first)
}

export async function getDashboardSatisfactionStats(
  supabase: AppSupabaseClient,
  referenceYear: number,
): Promise<DashboardSatisfactionStats> {
  const [pharmacienResult, patientResult] = await Promise.all([
    supabase
      .from("satisfaction_pharmacien")
      .select(
        [
          "annee_reference",
          "created_at",
          "satisfaction_globale",
          "facilite_mise_en_place",
          "benefice_pratique",
          "acces_soins",
          "appreciation_patients",
          "nb_effets_indesirables_graves",
          "incidents_description",
          "commentaire",
        ].join(","),
      )
      .eq("annee_reference", referenceYear)
      .order("created_at", { ascending: false })
      .overrideTypes<SatisfactionPharmacienRow[], { merge: false }>(),
    supabase
      .from("satisfaction_patient")
      .select(
        [
          "created_at",
          "raison_venue",
          "satisfaction_prise_en_charge",
          "conseils_aide",
          "facilite_vie",
          "souhait_renouvellement",
          "consultation_medecin_apres",
          "raison_consultation",
          "commentaire",
        ].join(","),
      )
      .order("created_at", { ascending: false })
      .overrideTypes<SatisfactionPatientRow[], { merge: false }>(),
  ])

  if (pharmacienResult.error || patientResult.error) {
    throw new Error("Impossible de charger les retours de satisfaction.")
  }

  const pharmacienRows = pharmacienResult.data ?? []
  const patientRows = patientResult.data ?? []

  if (pharmacienRows.length === 0 && patientRows.length === 0) {
    return createEmptySatisfactionStats(referenceYear)
  }

  const pharmacienQuestionAverages = pharmacienQuestionLabels.map((question) => ({
    average: toAverage(
      pharmacienRows.reduce((total, row) => total + row[question.field], 0),
      pharmacienRows.length,
    ),
    label: question.label,
  }))

  const patientQuestionAverages = patientQuestionLabels.map((question) => ({
    average: toAverage(
      patientRows.reduce((total, row) => total + row[question.field], 0),
      patientRows.length,
    ),
    label: question.label,
  }))

  const patientVenueCounts: Record<PatientRaisonVenueKey, number> = {
    affiche_saison: 0,
    autres: 0,
    gene_symptomes: 0,
    pas_acces_medecin: 0,
  }
  const patientConsultationCounts: Record<PatientRaisonConsultationKey, number> = {
    aggravation: 0,
    bilan_allergologique: 0,
    effets_indesirables: 0,
    pas_amelioration: 0,
  }

  let renewalCount = 0
  let consultationAfterCount = 0
  let consultationReasonCount = 0

  for (const row of patientRows) {
    const venueKey = row.raison_venue as PatientRaisonVenueKey
    if (venueKey in patientVenueCounts) {
      patientVenueCounts[venueKey] += 1
    }

    if (row.souhait_renouvellement) {
      renewalCount += 1
    }

    if (row.consultation_medecin_apres) {
      consultationAfterCount += 1
    }

    const consultationKey = row.raison_consultation as PatientRaisonConsultationKey | null
    if (consultationKey && consultationKey in patientConsultationCounts) {
      patientConsultationCounts[consultationKey] += 1
      consultationReasonCount += 1
    }
  }

  return {
    hasData: true,
    patients: {
      comments: patientRows.flatMap((row) => {
        const comment = cleanText(row.commentaire)
        return comment ? [comment] : []
      }),
      consultationAfterCount,
      consultationAfterRate: toPercentage(consultationAfterCount, patientRows.length),
      consultationReasons: (Object.entries(patientConsultationLabels) as Array<
        [PatientRaisonConsultationKey, string]
      >).map(([key, label]) => ({
        count: patientConsultationCounts[key],
        label,
        pct: toPercentage(patientConsultationCounts[key], consultationReasonCount),
      })),
      questionAverages: patientQuestionAverages,
      renewalCount,
      renewalRate: toPercentage(renewalCount, patientRows.length),
      responseCount: patientRows.length,
      venueReasons: (Object.entries(patientVenueLabels) as Array<[PatientRaisonVenueKey, string]>).map(
        ([key, label]) => ({
          count: patientVenueCounts[key],
          label,
          pct: toPercentage(patientVenueCounts[key], patientRows.length),
        }),
      ),
    },
    pharmaciens: {
      comments: pharmacienRows.flatMap((row) => {
        const comment = cleanText(row.commentaire)
        return comment ? [comment] : []
      }),
      incidents: pharmacienRows.flatMap((row) => {
        const incident = cleanText(row.incidents_description)
        return incident ? [incident] : []
      }),
      questionAverages: pharmacienQuestionAverages,
      referenceYear,
      responseCount: pharmacienRows.length,
      totalSeriousAdverseEffects: pharmacienRows.reduce(
        (total, row) => total + row.nb_effets_indesirables_graves,
        0,
      ),
    },
  }
}

import type { SupabaseClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"

type AppSupabaseClient = SupabaseClient<Database>
type SatisfactionPsRow = Database["public"]["Tables"]["satisfaction_ps"]["Row"]
type SatisfactionPsSectionId = "chartes" | "site" | "vmv"

export type SatisfactionPsBooleanStat = {
  field: keyof Pick<
    SatisfactionPsRow,
    | "acces_distinct_pertinent"
    | "chartes_connaissance"
    | "chartes_dispositifs_utilises"
    | "chartes_satisfaction"
    | "chartes_souhait_reception"
    | "chartes_suggestions"
    | "outils_connaissance"
    | "outils_utilisation"
    | "site_connaissance"
    | "site_consultation"
    | "site_outil_prevention"
    | "site_utilite"
    | "vmv_connaissance"
    | "vmv_suggestions"
    | "vmv_utilise"
  >
  label: string
  noCount: number
  noPct: number
  section: SatisfactionPsSectionId
  total: number
  yesCount: number
  yesPct: number
}

export type SatisfactionPsTextResponse = {
  submittedDate: string
  value: string
}

export type SatisfactionPsTextGroup = {
  field: keyof Pick<
    SatisfactionPsRow,
    | "chartes_suggestions_texte"
    | "site_rubriques_utiles"
    | "site_suggestions_texte"
    | "vmv_suggestions_texte"
    | "vmv_utilite_texte"
  >
  label: string
  responses: SatisfactionPsTextResponse[]
  section: SatisfactionPsSectionId
}

export type SatisfactionPsSectionStats = {
  booleanStats: SatisfactionPsBooleanStat[]
  textGroups: SatisfactionPsTextGroup[]
  tauxConnaissance: {
    pct: number
    total: number
    yesCount: number
  }
}

export type SatisfactionPsDashboardStats = {
  booleanStats: SatisfactionPsBooleanStat[]
  chartesSection: SatisfactionPsSectionStats
  hasData: boolean
  referenceYear: number
  responseCount: number
  siteSection: SatisfactionPsSectionStats
  textGroups: SatisfactionPsTextGroup[]
  vmvSection: SatisfactionPsSectionStats
}

const booleanQuestionLabels = [
  { field: "chartes_connaissance", label: "Avez-vous eu connaissance de ces chartes ?", section: "chartes" },
  { field: "chartes_souhait_reception", label: "Souhaitez-vous les recevoir ?", section: "chartes" },
  {
    field: "chartes_dispositifs_utilises",
    label: "Avez-vous utilisé les dispositifs proposés (numéro d'urgence, cartographie) ?",
    section: "chartes",
  },
  { field: "chartes_satisfaction", label: "Êtes-vous satisfait(e) de ces dispositifs ?", section: "chartes" },
  { field: "chartes_suggestions", label: "Avez-vous des suggestions à nous proposer ?", section: "chartes" },
  { field: "site_connaissance", label: "En avez-vous connaissance ?", section: "site" },
  { field: "site_consultation", label: "Le consultez-vous ?", section: "site" },
  { field: "site_utilite", label: "Vous est-il utile dans votre pratique quotidienne ?", section: "site" },
  {
    field: "outils_connaissance",
    label:
      "Savez-vous qu'un certain nombre d'outils et de supports en communication sont mis à disposition et accessibles en commande (envoyée aux adhérents) ?",
    section: "site",
  },
  { field: "outils_utilisation", label: "Utilisez-vous certains des outils proposés ?", section: "site" },
  {
    field: "acces_distinct_pertinent",
    label: "Le fait d'avoir un accès distinct professionnels de santé / patients vous semble-t-il pertinent ?",
    section: "site",
  },
  {
    field: "site_outil_prevention",
    label:
      "Utilisez-vous le site comme outil de prévention auprès de vos patients (articles, ressources locales et fiches de suivi) ?",
    section: "site",
  },
  { field: "vmv_connaissance", label: "En avez-vous eu connaissance ?", section: "vmv" },
  { field: "vmv_utilise", label: "L'avez-vous déjà utilisé ?", section: "vmv" },
  { field: "vmv_suggestions", label: "Avez-vous des suggestions à nous proposer ?", section: "vmv" },
] as const satisfies ReadonlyArray<Pick<SatisfactionPsBooleanStat, "field" | "label" | "section">>

const textQuestionLabels = [
  { field: "chartes_suggestions_texte", label: "Chartes - Suggestions", section: "chartes" },
  { field: "site_rubriques_utiles", label: "Site - Rubriques les plus utiles", section: "site" },
  { field: "site_suggestions_texte", label: "Site - Suggestions ou propositions", section: "site" },
  { field: "vmv_utilite_texte", label: "Vis ma vie - Utilité dans la pratique", section: "vmv" },
  { field: "vmv_suggestions_texte", label: "Vis ma vie - Suggestions", section: "vmv" },
] as const satisfies ReadonlyArray<Pick<SatisfactionPsTextGroup, "field" | "label" | "section">>

const csvColumns = [
  "id",
  "annee_reference",
  "chartes_connaissance",
  "chartes_souhait_reception",
  "chartes_dispositifs_utilises",
  "chartes_satisfaction",
  "chartes_suggestions",
  "chartes_suggestions_texte",
  "site_connaissance",
  "site_consultation",
  "site_utilite",
  "site_rubriques_utiles",
  "outils_connaissance",
  "outils_utilisation",
  "acces_distinct_pertinent",
  "site_outil_prevention",
  "site_suggestions_texte",
  "vmv_connaissance",
  "vmv_utilise",
  "vmv_utilite_texte",
  "vmv_suggestions",
  "vmv_suggestions_texte",
  "submitted_date",
] as const satisfies ReadonlyArray<keyof SatisfactionPsRow>

function toPercentage(value: number, total: number) {
  return total > 0 ? Number(((value / total) * 100).toFixed(1)) : 0
}

function cleanText(value: string | null) {
  const trimmedValue = value?.trim()
  return trimmedValue ? trimmedValue : null
}

function escapeCsvValue(value: string | number | boolean | null) {
  if (value === null) {
    return ""
  }

  const stringValue = String(value)
  return /[",\n\r;]/.test(stringValue) ? `"${stringValue.replaceAll('"', '""')}"` : stringValue
}

function createEmptyStats(referenceYear: number): SatisfactionPsDashboardStats {
  const booleanStats = booleanQuestionLabels.map((question) => ({
    field: question.field,
    label: question.label,
    noCount: 0,
    noPct: 0,
    section: question.section,
    total: 0,
    yesCount: 0,
    yesPct: 0,
  }))
  const textGroups = textQuestionLabels.map((question) => ({
    field: question.field,
    label: question.label,
    responses: [],
    section: question.section,
  }))

  return {
    booleanStats,
    chartesSection: createSectionStats(booleanStats, textGroups, "chartes", "chartes_connaissance"),
    hasData: false,
    referenceYear,
    responseCount: 0,
    siteSection: createSectionStats(booleanStats, textGroups, "site", "site_connaissance"),
    textGroups,
    vmvSection: createSectionStats(booleanStats, textGroups, "vmv", "vmv_connaissance"),
  }
}

function createSectionStats(
  booleanStats: SatisfactionPsBooleanStat[],
  textGroups: SatisfactionPsTextGroup[],
  section: SatisfactionPsSectionId,
  knowledgeField: SatisfactionPsBooleanStat["field"],
): SatisfactionPsSectionStats {
  const sectionBooleanStats = booleanStats.filter((item) => item.section === section)
  const sectionTextGroups = textGroups.filter((item) => item.section === section)
  const knowledgeStat = sectionBooleanStats.find((item) => item.field === knowledgeField)

  return {
    booleanStats: sectionBooleanStats,
    textGroups: sectionTextGroups,
    tauxConnaissance: {
      pct: knowledgeStat?.yesPct ?? 0,
      total: knowledgeStat?.total ?? 0,
      yesCount: knowledgeStat?.yesCount ?? 0,
    },
  }
}

export async function getSatisfactionPsYearOptions(
  supabase: AppSupabaseClient,
  selectedYear: number,
  currentYear = new Date().getFullYear(),
) {
  const result = await supabase
    .from("satisfaction_ps")
    .select("annee_reference")
    .order("annee_reference", { ascending: false })
    .overrideTypes<Array<Pick<SatisfactionPsRow, "annee_reference">>, { merge: false }>()

  if (result.error) {
    throw new Error("Impossible de charger les années de satisfaction PS.")
  }

  const yearOptions = new Set<number>([currentYear, selectedYear])

  for (const row of result.data ?? []) {
    yearOptions.add(row.annee_reference)
  }

  return Array.from(yearOptions).sort((first, second) => second - first)
}

export async function getSatisfactionPsDashboardStats(
  supabase: AppSupabaseClient,
  referenceYear: number,
): Promise<SatisfactionPsDashboardStats> {
  const result = await supabase
    .from("satisfaction_ps")
    .select(csvColumns.join(","))
    .eq("annee_reference", referenceYear)
    .order("submitted_date", { ascending: false })
    .overrideTypes<SatisfactionPsRow[], { merge: false }>()

  if (result.error) {
    throw new Error("Impossible de charger les retours de satisfaction PS.")
  }

  const rows = result.data ?? []

  if (rows.length === 0) {
    return createEmptyStats(referenceYear)
  }

  const booleanStats = booleanQuestionLabels.map((question) => {
      const values = rows.flatMap((row) => {
        const value = row[question.field]
        return typeof value === "boolean" ? [value] : []
      })
      const yesCount = values.filter(Boolean).length
      const noCount = values.length - yesCount

      return {
        field: question.field,
        label: question.label,
        noCount,
        noPct: toPercentage(noCount, values.length),
        section: question.section,
        total: values.length,
        yesCount,
        yesPct: toPercentage(yesCount, values.length),
      }
    })
  const textGroups = textQuestionLabels.map((question) => ({
    field: question.field,
    label: question.label,
    responses: rows.flatMap((row) => {
      const value = cleanText(row[question.field])
      return value ? [{ submittedDate: row.submitted_date, value }] : []
    }),
    section: question.section,
  }))

  return {
    booleanStats,
    chartesSection: createSectionStats(booleanStats, textGroups, "chartes", "chartes_connaissance"),
    hasData: true,
    referenceYear,
    responseCount: rows.length,
    siteSection: createSectionStats(booleanStats, textGroups, "site", "site_connaissance"),
    textGroups,
    vmvSection: createSectionStats(booleanStats, textGroups, "vmv", "vmv_connaissance"),
  }
}

export async function createSatisfactionPsCsv(supabase: AppSupabaseClient, referenceYear: number) {
  const result = await supabase
    .from("satisfaction_ps")
    .select(csvColumns.join(","))
    .eq("annee_reference", referenceYear)
    .order("submitted_date", { ascending: false })
    .overrideTypes<SatisfactionPsRow[], { merge: false }>()

  if (result.error) {
    throw new Error("Impossible de générer l'export satisfaction PS.")
  }

  const rows = result.data ?? []
  const content = [
    csvColumns.join(";"),
    ...rows.map((row) => csvColumns.map((column) => escapeCsvValue(row[column])).join(";")),
  ].join("\n")

  return {
    content,
    fileName: `satisfaction-ps-${referenceYear}.csv`,
  }
}

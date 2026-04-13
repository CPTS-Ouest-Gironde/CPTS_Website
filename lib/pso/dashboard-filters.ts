import { z } from "zod"

export const DASHBOARD_FIRST_YEAR = 2025
export const dashboardViewValues = ["pmo", "satisfaction"] as const

export type DashboardView = (typeof dashboardViewValues)[number]

export const dashboardMonthOptions = [
  { value: 1, label: "Janvier" },
  { value: 2, label: "Février" },
  { value: 3, label: "Mars" },
  { value: 4, label: "Avril" },
  { value: 5, label: "Mai" },
  { value: 6, label: "Juin" },
  { value: 7, label: "Juillet" },
  { value: 8, label: "Août" },
  { value: 9, label: "Septembre" },
  { value: 10, label: "Octobre" },
  { value: 11, label: "Novembre" },
  { value: 12, label: "Décembre" },
] as const

const uuidSchema = z.string().uuid()
const searchParamsSchema = z.object({
  endMonth: z.union([z.string(), z.array(z.string())]).optional(),
  pharmacy: z.union([z.string(), z.array(z.string())]).optional(),
  startMonth: z.union([z.string(), z.array(z.string())]).optional(),
  view: z.union([z.string(), z.array(z.string())]).optional(),
  year: z.union([z.string(), z.array(z.string())]).optional(),
})
const dashboardViewSchema = z.enum(dashboardViewValues)

export type DashboardSearchParams = {
  endMonth?: string | string[]
  pharmacy?: string | string[]
  startMonth?: string | string[]
  view?: string | string[]
  year?: string | string[]
}

export type DashboardFilters = {
  endMonth: number
  pharmacyIds: string[]
  startMonth: number
  year: number
}

export type DashboardPharmacyOption = {
  id: string
  nom: string
}

function getFirstSearchParamValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value
}

function getSearchParamValues(value: string | string[] | undefined) {
  if (!value) {
    return []
  }

  return Array.isArray(value) ? value : [value]
}

function parseIntegerValue(value: string | undefined, min: number, max?: number) {
  const schema = z.coerce.number().int().min(min)
  const boundedSchema = typeof max === "number" ? schema.max(max) : schema
  const parsedValue = boundedSchema.safeParse(value)
  return parsedValue.success ? parsedValue.data : null
}

export function getDefaultDashboardFilters(defaultYear = new Date().getFullYear()): DashboardFilters {
  return {
    endMonth: 12,
    pharmacyIds: [],
    startMonth: 1,
    year: Math.max(DASHBOARD_FIRST_YEAR, defaultYear),
  }
}

export function parseDashboardSearchParams(
  input: DashboardSearchParams,
  defaultYear = new Date().getFullYear(),
): DashboardFilters {
  const fallbackFilters = getDefaultDashboardFilters(defaultYear)
  const parsedInput = searchParamsSchema.safeParse(input)

  if (!parsedInput.success) {
    return fallbackFilters
  }

  const year = parseIntegerValue(
    getFirstSearchParamValue(parsedInput.data.year),
    DASHBOARD_FIRST_YEAR,
  )
  const parsedStartMonth = parseIntegerValue(
    getFirstSearchParamValue(parsedInput.data.startMonth),
    1,
    12,
  )
  const parsedEndMonth = parseIntegerValue(
    getFirstSearchParamValue(parsedInput.data.endMonth),
    1,
    12,
  )

  const startMonth = parsedStartMonth ?? fallbackFilters.startMonth
  const endMonth = parsedEndMonth ?? fallbackFilters.endMonth
  const [normalizedStartMonth, normalizedEndMonth] =
    startMonth <= endMonth ? [startMonth, endMonth] : [endMonth, startMonth]

  const pharmacyIds = Array.from(
    new Set(
      getSearchParamValues(parsedInput.data.pharmacy).flatMap((value) => {
        const parsedValue = uuidSchema.safeParse(value)
        return parsedValue.success ? [parsedValue.data] : []
      }),
    ),
  )

  return {
    endMonth: normalizedEndMonth,
    pharmacyIds,
    startMonth: normalizedStartMonth,
    year: year ?? fallbackFilters.year,
  }
}

export function parseDashboardView(input: DashboardSearchParams): DashboardView {
  const parsedInput = searchParamsSchema.safeParse(input)

  if (!parsedInput.success) {
    return "pmo"
  }

  const viewValue = getFirstSearchParamValue(parsedInput.data.view)
  const parsedView = dashboardViewSchema.safeParse(viewValue)
  return parsedView.success ? parsedView.data : "pmo"
}

export function sanitizeDashboardFilters(
  filters: DashboardFilters,
  pharmacies: readonly DashboardPharmacyOption[],
): DashboardFilters {
  const allowedPharmacyIds = new Set(pharmacies.map((pharmacy) => pharmacy.id))

  return {
    ...filters,
    pharmacyIds: filters.pharmacyIds.filter((pharmacyId) => allowedPharmacyIds.has(pharmacyId)),
  }
}

export function getDashboardDateRange(filters: DashboardFilters) {
  const firstDay = `${filters.year}-${String(filters.startMonth).padStart(2, "0")}-01`
  const lastDayInMonth = new Date(filters.year, filters.endMonth, 0).getDate()
  const lastDay = `${filters.year}-${String(filters.endMonth).padStart(2, "0")}-${String(lastDayInMonth).padStart(2, "0")}`

  return {
    endDate: lastDay,
    startDate: firstDay,
  }
}

export function getDashboardMonthLabel(month: number) {
  return dashboardMonthOptions.find((option) => option.value === month)?.label ?? String(month)
}

export function getDashboardYearOptions(selectedYear: number, currentYear = new Date().getFullYear()) {
  const lastYear = Math.max(DASHBOARD_FIRST_YEAR, currentYear, selectedYear)
  return Array.from({ length: lastYear - DASHBOARD_FIRST_YEAR + 1 }, (_, index) => DASHBOARD_FIRST_YEAR + index)
}

export function buildDashboardQueryString(filters: DashboardFilters, view: DashboardView = "pmo") {
  const searchParams = new URLSearchParams()
  searchParams.set("year", String(filters.year))
  searchParams.set("startMonth", String(filters.startMonth))
  searchParams.set("endMonth", String(filters.endMonth))

  if (view !== "pmo") {
    searchParams.set("view", view)
  }

  filters.pharmacyIds.forEach((pharmacyId) => {
    searchParams.append("pharmacy", pharmacyId)
  })

  return searchParams.toString()
}

export function getDashboardHref(filters: DashboardFilters, view: DashboardView = "pmo") {
  return `/espace-pro/dashboard?${buildDashboardQueryString(filters, view)}`
}

export function getDashboardExportHref(filters: DashboardFilters) {
  return `/espace-pro/dashboard/export?${buildDashboardQueryString(filters)}`
}

export function getDashboardPharmacySummary(
  pharmacies: readonly DashboardPharmacyOption[],
  pharmacyIds: readonly string[],
) {
  if (pharmacyIds.length === 0) {
    return "Toutes les pharmacies"
  }

  const selectedPharmacies = pharmacies.filter((pharmacy) => pharmacyIds.includes(pharmacy.id))

  if (selectedPharmacies.length === 1) {
    return selectedPharmacies[0]?.nom ?? "1 pharmacie"
  }

  if (selectedPharmacies.length === 2) {
    return selectedPharmacies.map((pharmacy) => pharmacy.nom).join(", ")
  }

  return `${selectedPharmacies.length} pharmacies`
}

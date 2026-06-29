import { z } from "zod"

export const SATISFACTION_PS_FIRST_YEAR = 2025

export type SatisfactionPsDashboardSearchParams = {
  year?: string | string[]
}

export type SatisfactionPsDashboardFilters = {
  year: number
}

const searchParamsSchema = z.object({
  year: z.union([z.string(), z.array(z.string())]).optional(),
})

function getFirstSearchParamValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value
}

function parseIntegerValue(value: string | undefined, min: number) {
  const parsedValue = z.coerce.number().int().min(min).safeParse(value)
  return parsedValue.success ? parsedValue.data : null
}

export function parseSatisfactionPsDashboardSearchParams(
  input: SatisfactionPsDashboardSearchParams,
  defaultYear = new Date().getFullYear(),
): SatisfactionPsDashboardFilters {
  const fallbackYear = Math.max(SATISFACTION_PS_FIRST_YEAR, defaultYear)
  const parsedInput = searchParamsSchema.safeParse(input)

  if (!parsedInput.success) {
    return { year: fallbackYear }
  }

  const year = parseIntegerValue(
    getFirstSearchParamValue(parsedInput.data.year),
    SATISFACTION_PS_FIRST_YEAR,
  )

  return {
    year: year ?? fallbackYear,
  }
}

export function buildSatisfactionPsDashboardQueryString(filters: SatisfactionPsDashboardFilters) {
  const searchParams = new URLSearchParams()
  searchParams.set("year", String(filters.year))
  return searchParams.toString()
}

export function getSatisfactionPsDashboardHref(filters: SatisfactionPsDashboardFilters) {
  return `/espace-pro/satisfaction-ps/dashboard?${buildSatisfactionPsDashboardQueryString(filters)}`
}

export function getSatisfactionPsDashboardExportHref(filters: SatisfactionPsDashboardFilters) {
  return `/espace-pro/satisfaction-ps/dashboard/export?${buildSatisfactionPsDashboardQueryString(filters)}`
}

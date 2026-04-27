import { NextResponse } from "next/server"
import {
  getDashboardPharmacySummary,
  parseDashboardSearchParams,
  sanitizeDashboardFilters,
} from "@/lib/pso/dashboard-filters"
import {
  createDashboardCsv,
  getDashboardPharmacyOptions,
  getDashboardStats,
} from "@/lib/pso/dashboard-stats"
import { hasRole, readUserAccessContext } from "@/lib/supabase/roles"
import { createClient } from "@/lib/supabase/server"

export const runtime = "nodejs"

export async function GET(request: Request) {
  const url = new URL(request.url)
  const rawFilters = parseDashboardSearchParams({
    endMonth: url.searchParams.get("endMonth") ?? undefined,
    pharmacy: url.searchParams.getAll("pharmacy"),
    startMonth: url.searchParams.get("startMonth") ?? undefined,
    year: url.searchParams.get("year") ?? undefined,
  })

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Authentification requise." }, { status: 401 })
  }

  const { roles } = await readUserAccessContext(supabase, user.id)

  if (!hasRole(roles, "reporting_pso")) {
    return NextResponse.json({ error: "Acces refuse." }, { status: 403 })
  }

  try {
    const pharmacies = await getDashboardPharmacyOptions(supabase)
    const filters = sanitizeDashboardFilters(rawFilters, pharmacies)
    const stats = await getDashboardStats(supabase, filters, pharmacies)
    const pharmacySummary = getDashboardPharmacySummary(pharmacies, filters.pharmacyIds)
    const csv = createDashboardCsv(stats, filters, pharmacySummary)

    return new NextResponse(csv.content, {
      headers: {
        "Content-Disposition": `attachment; filename="${csv.fileName}"`,
        "Content-Type": "text/csv; charset=utf-8",
      },
      status: 200,
    })
  } catch {
    return NextResponse.json({ error: "Le fichier CSV n'a pas pu être généré." }, { status: 500 })
  }
}

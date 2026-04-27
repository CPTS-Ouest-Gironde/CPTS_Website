import { NextResponse } from "next/server"
import {
  parseDashboardSearchParams,
  sanitizeDashboardFilters,
} from "@/lib/pso/dashboard-filters"
import {
  createDashboardDetailedCsv,
  getDashboardPharmacyOptions,
  getDashboardPmoDetailEntries,
} from "@/lib/pso/dashboard-stats"
import { hasRole, readUserAccessContext } from "@/lib/supabase/roles"
import { createClient } from "@/lib/supabase/server"

export const runtime = "nodejs"

type DashboardPharmacyExportRouteContext = {
  params: Promise<{
    pharmacie_id: string
  }>
}

export async function GET(request: Request, { params }: DashboardPharmacyExportRouteContext) {
  const { pharmacie_id: pharmacyId } = await params
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
    const pharmacy = pharmacies.find((candidate) => candidate.id === pharmacyId)

    if (!pharmacy) {
      return NextResponse.json({ error: "Pharmacie introuvable." }, { status: 404 })
    }

    const entries = await getDashboardPmoDetailEntries(supabase, filters, pharmacies, pharmacyId)
    const sortedEntries = [...entries].sort(
      (first, second) => first.dateRealisation.localeCompare(second.dateRealisation) || first.id.localeCompare(second.id),
    )
    const csv = createDashboardDetailedCsv(sortedEntries)

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

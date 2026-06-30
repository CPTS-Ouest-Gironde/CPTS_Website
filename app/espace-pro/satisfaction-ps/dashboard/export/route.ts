import { NextResponse } from "next/server"
import { parseSatisfactionPsDashboardSearchParams } from "@/lib/satisfaction-ps/dashboard-filters"
import { createSatisfactionPsCsv } from "@/lib/satisfaction-ps/dashboard-stats"
import { hasRole, readUserAccessContext } from "@/lib/supabase/roles"
import { createClient } from "@/lib/supabase/server"

export const runtime = "nodejs"

export async function GET(request: Request) {
  const url = new URL(request.url)
  const filters = parseSatisfactionPsDashboardSearchParams({
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

  if (!hasRole(roles, "membre_ca")) {
    return NextResponse.json({ error: "Acces refuse." }, { status: 403 })
  }

  try {
    const csv = await createSatisfactionPsCsv(supabase, filters.year)

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

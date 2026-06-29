import Link from "next/link"
import { redirect } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { FormSection } from "@/components/pso/form-section"
import { DashboardSatisfactionPsPanel } from "@/components/satisfaction-ps/dashboard-satisfaction-ps-panel"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  getSatisfactionPsDashboardExportHref,
  parseSatisfactionPsDashboardSearchParams,
  type SatisfactionPsDashboardSearchParams,
} from "@/lib/satisfaction-ps/dashboard-filters"
import {
  getSatisfactionPsDashboardStats,
  getSatisfactionPsYearOptions,
  type SatisfactionPsDashboardStats,
} from "@/lib/satisfaction-ps/dashboard-stats"
import { hasRole, readUserAccessContext } from "@/lib/supabase/roles"
import { createClient } from "@/lib/supabase/server"

type SatisfactionPsDashboardPageProps = {
  searchParams: Promise<SatisfactionPsDashboardSearchParams>
}

export default async function SatisfactionPsDashboardPage({ searchParams }: SatisfactionPsDashboardPageProps) {
  const resolvedSearchParams = await searchParams
  const filters = parseSatisfactionPsDashboardSearchParams(resolvedSearchParams)
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login?next=/espace-pro/satisfaction-ps/dashboard")
  }

  const { roles } = await readUserAccessContext(supabase, user.id)

  if (!hasRole(roles, "membre_ca")) {
    redirect("/espace-pro")
  }

  let statsError = false
  let stats: SatisfactionPsDashboardStats | null = null
  let yearOptions: number[] = []

  try {
    yearOptions = await getSatisfactionPsYearOptions(supabase, filters.year)
    stats = await getSatisfactionPsDashboardStats(supabase, filters.year)
  } catch {
    statsError = true
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#f3f6f3]">
      <Header />

      <main className="flex-1 pt-24 lg:pt-28">
        <section className="py-10 lg:py-14">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="mx-auto max-w-7xl space-y-6">
              <Card className="rounded-[2rem] border border-[#0a7a3e]/15 bg-card shadow-sm">
                <CardContent className="space-y-5 p-7 sm:p-9">
                  <Button asChild className="rounded-full" variant="outline">
                    <Link href="/professionnels">
                      <ArrowLeft className="h-4 w-4" />
                      Retour
                    </Link>
                  </Button>

                  <FormSection
                    description="Consultez les retours du questionnaire anonyme destiné aux professionnels de santé."
                    eyebrow="Satisfaction PS"
                    title="Tableau de bord satisfaction professionnels de santé"
                  />
                </CardContent>
              </Card>

              {statsError ? (
                <Card className="rounded-[2rem] border border-border/80 bg-card shadow-sm">
                  <CardContent className="p-8">
                    <p className="text-sm text-muted-foreground">
                      Les retours de satisfaction PS sont temporairement indisponibles. Merci de réessayer dans quelques instants.
                    </p>
                  </CardContent>
                </Card>
              ) : stats ? (
                <DashboardSatisfactionPsPanel
                  exportHref={getSatisfactionPsDashboardExportHref(filters)}
                  filters={filters}
                  stats={stats}
                  yearOptions={yearOptions}
                />
              ) : null}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

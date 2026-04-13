import Link from "next/link"
import { redirect } from "next/navigation"
import { TrendingUp } from "lucide-react"
import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { DashboardCharts } from "@/components/pso/dashboard-charts"
import { DashboardExportButton } from "@/components/pso/dashboard-export-button"
import { DashboardFilterBar } from "@/components/pso/dashboard-filter-bar"
import { DashboardMetricCard } from "@/components/pso/dashboard-metric-card"
import { DashboardSatisfactionPanel } from "@/components/pso/dashboard-satisfaction-panel"
import { FormSection } from "@/components/pso/form-section"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  getDashboardExportHref,
  getDashboardHref,
  getDashboardYearOptions,
  parseDashboardSearchParams,
  parseDashboardView,
  sanitizeDashboardFilters,
  type DashboardFilters,
  type DashboardPharmacyOption,
  type DashboardSearchParams,
  type DashboardView,
} from "@/lib/pso/dashboard-filters"
import { getDashboardSatisfactionStats, type DashboardSatisfactionStats } from "@/lib/pso/dashboard-satisfaction"
import { getDashboardPharmacyOptions, getDashboardStats, type DashboardStats } from "@/lib/pso/dashboard-stats"
import { hasRole, readUserAccessContext } from "@/lib/supabase/roles"
import { createClient } from "@/lib/supabase/server"
import { cn } from "@/lib/utils"

type DashboardPageProps = {
  searchParams: Promise<DashboardSearchParams>
}

function formatInteger(value: number) {
  return new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 }).format(value)
}

function formatDecimal(value: number, maximumFractionDigits = 2) {
  return new Intl.NumberFormat("fr-FR", {
    maximumFractionDigits,
    minimumFractionDigits: 0,
  }).format(value)
}

function formatPercentage(value: number) {
  return new Intl.NumberFormat("fr-FR", {
    maximumFractionDigits: 1,
    minimumFractionDigits: 1,
  }).format(value)
}

function getDashboardTabClass(isActive: boolean) {
  return cn(
    "flex h-10 w-full items-center justify-center rounded-[1rem] px-5 text-sm font-medium transition-all",
    isActive
      ? "bg-white text-[#0a7a3e] shadow-sm"
      : "text-muted-foreground hover:bg-white/50 hover:text-foreground",
  )
}

function DashboardTabs({ activeView, filters }: { activeView: DashboardView; filters: DashboardFilters }) {
  return (
    <div className="grid w-full max-w-[24rem] grid-cols-2 rounded-[1.2rem] bg-[#e4ece4] p-1">
      <Link
        aria-current={activeView === "pmo" ? "page" : undefined}
        className={getDashboardTabClass(activeView === "pmo")}
        href={getDashboardHref(filters, "pmo")}
      >
        Activité PMO
      </Link>
      <Link
        aria-current={activeView === "satisfaction" ? "page" : undefined}
        className={getDashboardTabClass(activeView === "satisfaction")}
        href={getDashboardHref(filters, "satisfaction")}
      >
        Satisfaction
      </Link>
    </div>
  )
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const resolvedSearchParams = await searchParams
  const activeView = parseDashboardView(resolvedSearchParams)
  const parsedFilters = parseDashboardSearchParams(resolvedSearchParams)
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login?next=/espace-pro/dashboard")
  }

  const { roles } = await readUserAccessContext(supabase, user.id)

  if (!hasRole(roles, "reporting_pso")) {
    redirect("/espace-pro")
  }

  let filters = parsedFilters
  let pmoStatsError = false
  let pmoStats: DashboardStats | null = null
  let pharmacies: DashboardPharmacyOption[] = []
  let yearOptions: number[] = []
  let exportHref = ""
  let satisfactionStatsError = false
  let satisfactionStats: DashboardSatisfactionStats | null = null

  if (activeView === "pmo") {
    pharmacies = await getDashboardPharmacyOptions(supabase)
    filters = sanitizeDashboardFilters(parsedFilters, pharmacies)
    yearOptions = getDashboardYearOptions(filters.year)
    exportHref = getDashboardExportHref(filters)

    try {
      pmoStats = await getDashboardStats(supabase, filters, pharmacies)
    } catch {
      pmoStatsError = true
    }
  } else {
    try {
      satisfactionStats = await getDashboardSatisfactionStats(supabase)
    } catch {
      satisfactionStatsError = true
    }
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
                  <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                    <div className="space-y-4">
                      <FormSection
                        description="Consultez les indicateurs PSO Rhinite Allergique consolidés automatiquement à partir des saisies PMO et des questionnaires de satisfaction."
                        eyebrow="Dashboard PSO"
                        title="Tableau de bord de reporting"
                      />

                      <DashboardTabs activeView={activeView} filters={filters} />
                    </div>

                    {activeView === "pmo" ? (
                      <DashboardExportButton disabled={!pmoStats || !pmoStats.hasData || pmoStatsError} href={exportHref} />
                    ) : null}
                  </div>

                  {activeView === "pmo" ? (
                    <DashboardFilterBar filters={filters} pharmacies={pharmacies} yearOptions={yearOptions} />
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Les retours de satisfaction sont affichés globalement. Ils ne sont pas filtrés par période ni par pharmacie.
                    </p>
                  )}
                </CardContent>
              </Card>

              {activeView === "pmo" ? (
                pmoStatsError ? (
                  <Card className="rounded-[2rem] border border-border/80 bg-card shadow-sm">
                    <CardContent className="p-8">
                      <p className="text-sm text-muted-foreground">
                        Le tableau de bord est temporairement indisponible. Merci de réessayer dans quelques instants.
                      </p>
                    </CardContent>
                  </Card>
                ) : pmoStats && !pmoStats.hasData ? (
                  <Card className="rounded-[2rem] border border-dashed border-border bg-card shadow-sm">
                    <CardContent className="space-y-3 p-8">
                      <h2 className="text-xl font-semibold text-foreground">Aucune donnée sur la période sélectionnée</h2>
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        Modifiez l'année, la plage de mois ou les pharmacies pour afficher les statistiques disponibles.
                      </p>
                    </CardContent>
                  </Card>
                ) : pmoStats ? (
                  <>
                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                      <DashboardMetricCard
                        eyebrow="Volume"
                        helper="Nombre total de patients pris en charge."
                        label="Patients inclus"
                        value={formatInteger(pmoStats.totalPatients)}
                      />
                      <DashboardMetricCard
                        eyebrow="Réseau"
                        helper="Pharmacies ayant au moins une saisie sur la période."
                        label="Pharmacies actives"
                        value={formatInteger(pmoStats.nbPharmaciesActives)}
                      />
                      <DashboardMetricCard
                        eyebrow="Activité"
                        helper="Moyenne calculée sur les pharmacies actives."
                        label="Patients par pharmacie"
                        value={formatDecimal(pmoStats.moyennePatientsParPharmacie)}
                      />
                      <DashboardMetricCard
                        eyebrow="Dispensation"
                        helper="Produits PMO et conseil confondus."
                        label="Produits par patient"
                        value={formatDecimal(pmoStats.totalProduitsParPatient)}
                      />
                      <DashboardMetricCard
                        helper="Part des patients sans médecin traitant déclaré."
                        label="Patients sans médecin traitant"
                        value={`${formatInteger(pmoStats.patientsSansMedecinTraitant.n)} (${formatPercentage(pmoStats.patientsSansMedecinTraitant.pct)} %)`}
                      />
                      <DashboardMetricCard
                        helper="Pourcentage de saisies avec dispensation conseil."
                        label="Taux de dispensation conseil"
                        value={`${formatPercentage(pmoStats.tauxDispensationConseil)} %`}
                      />
                      <DashboardMetricCard
                        helper="Moyenne des produits délivrés dans le cadre PMO."
                        label="Moyenne produits PMO"
                        value={formatDecimal(pmoStats.moyenneProduitsPmo)}
                      />
                      <DashboardMetricCard
                        helper="Moyenne des produits délivrés en conseil associé."
                        label="Moyenne produits conseil"
                        value={formatDecimal(pmoStats.moyenneProduitsConseil)}
                      />
                    </div>

                    <DashboardCharts stats={pmoStats} />

                    <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
                      <Card className="rounded-[2rem] border border-border/80 bg-card shadow-sm">
                        <CardHeader>
                          <CardTitle className="text-base">Réorientations observées</CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-4 sm:grid-cols-3">
                          <div className="rounded-2xl bg-[#f3f6f3] p-4">
                            <p className="text-sm text-muted-foreground">Urgences</p>
                            <p className="mt-2 text-2xl font-semibold text-foreground">
                              {formatInteger(pmoStats.reorientations.urgences)}
                            </p>
                          </div>
                          <div className="rounded-2xl bg-[#f3f6f3] p-4">
                            <p className="text-sm text-muted-foreground">Médecin délégant</p>
                            <p className="mt-2 text-2xl font-semibold text-foreground">
                              {formatInteger(pmoStats.reorientations.medecinDelegant)}
                            </p>
                          </div>
                          <div className="rounded-2xl bg-[#f3f6f3] p-4">
                            <p className="text-sm text-muted-foreground">Médecin traitant</p>
                            <p className="mt-2 text-2xl font-semibold text-foreground">
                              {formatInteger(pmoStats.reorientations.medecinTraitant)}
                            </p>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="rounded-[2rem] border border-border/80 bg-card shadow-sm">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2 text-base">
                            <TrendingUp className="h-4 w-4 text-[#0a7a3e]" />
                            Prescription et délivrance
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="flex items-center justify-between gap-4 rounded-2xl bg-[#f3f6f3] px-4 py-3">
                            <span className="text-sm text-muted-foreground">Anti-H1</span>
                            <span className="text-sm font-semibold text-foreground">
                              {formatPercentage(pmoStats.prescriptions.antiH1Pct)} %
                            </span>
                          </div>
                          <div className="flex items-center justify-between gap-4 rounded-2xl bg-[#f3f6f3] px-4 py-3">
                            <span className="text-sm text-muted-foreground">Collyre</span>
                            <span className="text-sm font-semibold text-foreground">
                              {formatPercentage(pmoStats.prescriptions.collyrePct)} %
                            </span>
                          </div>
                          <div className="flex items-center justify-between gap-4 rounded-2xl bg-[#f3f6f3] px-4 py-3">
                            <span className="text-sm text-muted-foreground">Antiallergique nasal</span>
                            <span className="text-sm font-semibold text-foreground">
                              {formatPercentage(pmoStats.prescriptions.antiallergiqueNasalPct)} %
                            </span>
                          </div>
                          <div className="flex items-center justify-between gap-4 rounded-2xl bg-[#f3f6f3] px-4 py-3">
                            <span className="text-sm text-muted-foreground">Corticoïde nasal</span>
                            <span className="text-sm font-semibold text-foreground">
                              {formatPercentage(pmoStats.prescriptions.corticoideNasalPct)} %
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </>
                ) : null
              ) : satisfactionStatsError ? (
                <Card className="rounded-[2rem] border border-border/80 bg-card shadow-sm">
                  <CardContent className="p-8">
                    <p className="text-sm text-muted-foreground">
                      Les retours de satisfaction sont temporairement indisponibles. Merci de réessayer dans quelques instants.
                    </p>
                  </CardContent>
                </Card>
              ) : satisfactionStats && !satisfactionStats.hasData ? (
                <Card className="rounded-[2rem] border border-dashed border-border bg-card shadow-sm">
                  <CardContent className="space-y-3 p-8">
                    <h2 className="text-xl font-semibold text-foreground">Aucune réponse de satisfaction pour le moment</h2>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      Les questionnaires pharmacien et patient apparaîtront ici dès réception des premières réponses.
                    </p>
                  </CardContent>
                </Card>
              ) : satisfactionStats ? (
                <DashboardSatisfactionPanel stats={satisfactionStats} />
              ) : null}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

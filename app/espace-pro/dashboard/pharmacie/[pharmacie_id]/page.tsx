import Link from "next/link"
import { redirect } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { DashboardExportButton } from "@/components/pso/dashboard-export-button"
import { FormSection } from "@/components/pso/form-section"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  getDashboardHref,
  getDashboardMonthLabel,
  getDashboardPharmacyExportHref,
  getDashboardPharmacyHref,
  parseDashboardSearchParams,
  sanitizeDashboardFilters,
  type DashboardSearchParams,
} from "@/lib/pso/dashboard-filters"
import {
  getDashboardPharmacyDetailPage,
  getDashboardPharmacyOptions,
} from "@/lib/pso/dashboard-stats"
import {
  PMO_PAGE_SIZE,
  formatPmoDate,
  getPmoOrientationLabel,
  getPmoPatientSexeLabel,
  getYesNoLabel,
  parsePmoPage,
} from "@/lib/pso/pmo"
import { hasRole, readUserAccessContext } from "@/lib/supabase/roles"
import { createClient } from "@/lib/supabase/server"

type DashboardPharmacyAuditPageProps = {
  params: Promise<{
    pharmacie_id: string
  }>
  searchParams: Promise<DashboardSearchParams & { page?: string | string[] }>
}

function getSearchParamValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value
}

function getDisplayValue(value: string | null) {
  return value ?? "Non renseigné"
}

export default async function DashboardPharmacyAuditPage({
  params,
  searchParams,
}: DashboardPharmacyAuditPageProps) {
  const [{ pharmacie_id: pharmacyId }, resolvedSearchParams] = await Promise.all([params, searchParams])
  const requestedPage = parsePmoPage(getSearchParamValue(resolvedSearchParams.page))
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect(`/login?next=/espace-pro/dashboard/pharmacie/${pharmacyId}`)
  }

  const { roles } = await readUserAccessContext(supabase, user.id)

  if (!hasRole(roles, "reporting_pso")) {
    redirect("/espace-pro")
  }

  const pharmacies = await getDashboardPharmacyOptions(supabase)
  const filters = sanitizeDashboardFilters(parseDashboardSearchParams(resolvedSearchParams), pharmacies)
  const pharmacy = pharmacies.find((candidate) => candidate.id === pharmacyId)

  if (!pharmacy) {
    redirect(getDashboardHref(filters, "pmo"))
  }

  const detailPage = await getDashboardPharmacyDetailPage(
    supabase,
    filters,
    pharmacies,
    pharmacyId,
    requestedPage,
    PMO_PAGE_SIZE,
  )

  if (requestedPage > detailPage.totalPages) {
    redirect(getDashboardPharmacyHref(filters, pharmacyId, detailPage.totalPages))
  }

  const exportHref = getDashboardPharmacyExportHref(filters, pharmacyId)
  const periodLabel = `${getDashboardMonthLabel(filters.startMonth)} à ${getDashboardMonthLabel(filters.endMonth)} ${filters.year}`
  const hasPreviousPage = detailPage.currentPage > 1
  const hasNextPage = detailPage.currentPage < detailPage.totalPages

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
                      <Button asChild className="rounded-full px-4" variant="outline">
                        <Link href={getDashboardHref(filters, "pmo")}>
                          <ArrowLeft className="h-4 w-4" />
                          Retour au dashboard
                        </Link>
                      </Button>

                      <FormSection
                        description="Consultez les saisies PMO en lecture seule pour cette pharmacie sur la période sélectionnée."
                        eyebrow="Audit pharmacie"
                        title={pharmacy.nom}
                      />
                    </div>

                    <DashboardExportButton href={exportHref} label="Exporter en CSV" />
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                    <div className="rounded-2xl bg-[#f3f6f3] p-4">
                      <p className="text-sm text-muted-foreground">FINESS</p>
                      <p className="mt-2 text-sm font-semibold text-foreground">{pharmacy.finess}</p>
                    </div>
                    <div className="rounded-2xl bg-[#f3f6f3] p-4">
                      <p className="text-sm text-muted-foreground">Pharmacien titulaire</p>
                      <p className="mt-2 text-sm font-semibold text-foreground">{getDisplayValue(pharmacy.pharmacienTitulaire)}</p>
                    </div>
                    <div className="rounded-2xl bg-[#f3f6f3] p-4">
                      <p className="text-sm text-muted-foreground">RPPS titulaire</p>
                      <p className="mt-2 text-sm font-semibold text-foreground">{getDisplayValue(pharmacy.pharmacienRpps)}</p>
                    </div>
                    <div className="rounded-2xl bg-[#f3f6f3] p-4">
                      <p className="text-sm text-muted-foreground">Période affichée</p>
                      <p className="mt-2 text-sm font-semibold text-foreground">{periodLabel}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-[2rem] border border-border/80 bg-card shadow-sm">
                <CardHeader className="space-y-2">
                  <CardTitle className="text-base">Saisies PMO de la pharmacie</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {detailPage.totalEntries} saisie(s) trouvée(s) sur la période sélectionnée.
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  {detailPage.entries.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-border px-5 py-8 text-sm text-muted-foreground">
                      Aucune saisie à afficher pour cette pharmacie sur la période sélectionnée.
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Sexe</TableHead>
                          <TableHead>Tranche d&apos;âge</TableHead>
                          <TableHead>Médecin traitant</TableHead>
                          <TableHead>Prise en charge</TableHead>
                          <TableHead>anti-H1</TableHead>
                          <TableHead>collyre</TableHead>
                          <TableHead>antiallergique nasal</TableHead>
                          <TableHead>corticoïde nasal</TableHead>
                          <TableHead>Nb produits PMO</TableHead>
                          <TableHead>Dispensation conseil</TableHead>
                          <TableHead>Nb produits conseil</TableHead>
                          <TableHead>Effet indésirable</TableHead>
                          <TableHead>Médecin délégant</TableHead>
                          <TableHead>RPPS médecin délégant</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {detailPage.entries.map((entry) => (
                          <TableRow key={entry.id}>
                            <TableCell>{formatPmoDate(entry.dateRealisation)}</TableCell>
                            <TableCell>{getPmoPatientSexeLabel(entry.patientSexe)}</TableCell>
                            <TableCell>{entry.patientAge}</TableCell>
                            <TableCell>{getYesNoLabel(entry.patientMedecinTraitant)}</TableCell>
                            <TableCell>{getPmoOrientationLabel(entry.orientation)}</TableCell>
                            <TableCell>{getYesNoLabel(entry.prescriptionAntiH1)}</TableCell>
                            <TableCell>{getYesNoLabel(entry.prescriptionCollyre)}</TableCell>
                            <TableCell>{getYesNoLabel(entry.prescriptionAntiallergiqueNasal)}</TableCell>
                            <TableCell>{getYesNoLabel(entry.prescriptionCorticoideNasal)}</TableCell>
                            <TableCell>{entry.nbProduitsPmo}</TableCell>
                            <TableCell>{getYesNoLabel(entry.dispensationConseil)}</TableCell>
                            <TableCell>{entry.nbProduitsConseil}</TableCell>
                            <TableCell>{entry.effetIndesirable ?? "—"}</TableCell>
                            <TableCell>{entry.medecinDelegantNom}</TableCell>
                            <TableCell>{entry.medecinDelegantRpps}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}

                  {detailPage.entries.length > 0 ? (
                    <div className="flex flex-col gap-3 border-t border-border/70 pt-4 sm:flex-row sm:items-center sm:justify-between">
                      <p className="text-sm text-muted-foreground">
                        Page {detailPage.currentPage} sur {detailPage.totalPages}
                      </p>

                      <div className="flex items-center gap-2">
                        {hasPreviousPage ? (
                          <Button asChild className="rounded-full px-4" variant="outline">
                            <Link href={getDashboardPharmacyHref(filters, pharmacyId, detailPage.currentPage - 1)}>
                              Précédent
                            </Link>
                          </Button>
                        ) : (
                          <Button className="rounded-full px-4" disabled variant="outline">
                            Précédent
                          </Button>
                        )}

                        {hasNextPage ? (
                          <Button asChild className="rounded-full px-4" variant="outline">
                            <Link href={getDashboardPharmacyHref(filters, pharmacyId, detailPage.currentPage + 1)}>
                              Suivant
                            </Link>
                          </Button>
                        ) : (
                          <Button className="rounded-full px-4" disabled variant="outline">
                            Suivant
                          </Button>
                        )}
                      </div>
                    </div>
                  ) : null}
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

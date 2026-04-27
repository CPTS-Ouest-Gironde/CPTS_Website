import Link from "next/link"
import { redirect } from "next/navigation"
import { PlusCircle } from "lucide-react"
import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { FormSection } from "@/components/pso/form-section"
import { PmoListToast } from "@/components/pso/pmo-list-toast"
import { PmoRowActions } from "@/components/pso/pmo-row-actions"
import { SatisfactionReminderCard } from "@/components/pso/satisfaction-reminder-card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  PMO_PAGE_SIZE,
  formatPmoDate,
  getPmoListHref,
  getPmoOrientationLabel,
  getPmoPatientSexeLabel,
  parsePmoListSearchParams,
} from "@/lib/pso/pmo"
import { getPsoProfileRecord } from "@/lib/pso/profile"
import {
  getSatisfactionPharmacienReferenceYear,
  isSatisfactionPharmacienResponseWindowOpen,
} from "@/lib/pso/satisfaction-pharmacien"
import {
  hasCompletedPharmacienProfile,
  hasRole,
  readUserAccessContext,
} from "@/lib/supabase/roles"
import { createClient } from "@/lib/supabase/server"

type PmoPageProps = {
  searchParams: Promise<{
    page?: string | string[]
    success?: string | string[]
  }>
}

export default async function PmoHomePage({ searchParams }: PmoPageProps) {
  const params = parsePmoListSearchParams(await searchParams)
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login?next=/espace-pro/pmo")
  }

  const from = (params.page - 1) * PMO_PAGE_SIZE
  const to = from + PMO_PAGE_SIZE - 1
  const currentReferenceYear = getSatisfactionPharmacienReferenceYear()
  const isSatisfactionWindowOpen = isSatisfactionPharmacienResponseWindowOpen()

  const [{ profile, roles }, profileRecord, entriesResult] = await Promise.all([
    readUserAccessContext(supabase, user.id),
    getPsoProfileRecord(supabase, user.id),
    supabase
      .from("pmo_entries")
      .select("id,date_realisation,patient_sexe,patient_age,orientation,nb_produits_pmo", { count: "exact" })
      .order("date_realisation", { ascending: false })
      .order("created_at", { ascending: false })
      .range(from, to),
  ])

  if (!hasRole(roles, "pharmacien_pso")) {
    redirect("/espace-pro")
  }

  if (!hasCompletedPharmacienProfile(profile) || !profileRecord?.pharmacy) {
    redirect("/espace-pro/completer-profil")
  }

  const totalEntries = entriesResult.count ?? 0
  const totalPages = Math.max(1, Math.ceil(totalEntries / PMO_PAGE_SIZE))

  if (params.page > totalPages) {
    redirect(getPmoListHref({ page: totalPages, success: params.success }))
  }

  const entries = entriesResult.error ? [] : entriesResult.data ?? []
  const currentPage = Math.min(params.page, totalPages)
  const hasPreviousPage = currentPage > 1
  const hasNextPage = currentPage < totalPages
  let showSatisfactionReminder = false

  if (isSatisfactionWindowOpen) {
    const satisfactionResult = await supabase
      .from("satisfaction_pharmacien")
      .select("id")
      .eq("user_id", user.id)
      .eq("annee_reference", currentReferenceYear)
      .limit(1)
      .maybeSingle()

    showSatisfactionReminder = !satisfactionResult.error && !satisfactionResult.data
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <PmoListToast success={params.success} />

      <main className="flex-1 bg-muted/20 pt-24 lg:pt-28">
        <section className="py-10 lg:py-14">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="mx-auto max-w-6xl space-y-6">
              <Card className="rounded-3xl border border-primary/20 bg-primary/[0.04] shadow-sm">
                <CardContent className="space-y-5 p-7 sm:p-9">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                    <FormSection
                      description="Retrouvez vos saisies PSO et enregistrez une nouvelle intervention."
                      eyebrow="Tableau PSO"
                      title="Bienvenue sur votre espace PSO."
                    />

                    <div className="flex flex-col gap-3 sm:flex-row">
                      <Button asChild className="h-11 rounded-full px-5 font-semibold">
                        <Link href="/espace-pro/pmo/nouveau">
                          Nouvelle entrée
                          <PlusCircle className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <Badge variant="secondary">{profileRecord.pharmacy.nom}</Badge>
                    <Badge variant="outline">FINESS {profileRecord.pharmacy.finess}</Badge>
                    <Badge variant="outline">{totalEntries} ligne(s) saisie(s)</Badge>
                  </div>
                </CardContent>
              </Card>

              <SatisfactionReminderCard showSatisfactionReminder={showSatisfactionReminder} />

              <Card className="rounded-3xl border border-border/80 bg-card shadow-sm">
                <CardContent className="space-y-5 p-6 sm:p-8">
                  <div className="flex items-center justify-between gap-4">
                    <FormSection title="Saisies récentes" />

                    {entries.length > 0 ? (
                      <Button asChild className="rounded-full px-4" variant="outline">
                        <Link href="/espace-pro/pmo/nouveau">
                          Nouvelle entrée
                          <PlusCircle className="h-4 w-4" />
                        </Link>
                      </Button>
                    ) : null}
                  </div>

                  {entries.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-border px-5 py-8 text-sm text-muted-foreground">
                      Aucune saisie pour le moment. Utilisez le bouton « Nouvelle entrée » pour commencer.
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Sexe</TableHead>
                          <TableHead>Âge</TableHead>
                          <TableHead>Prise en charge</TableHead>
                          <TableHead>Nb PMO</TableHead>
                          <TableHead className="w-[72px] text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {entries.map((entry) => (
                          <TableRow key={entry.id}>
                            <TableCell>{formatPmoDate(entry.date_realisation)}</TableCell>
                            <TableCell>{getPmoPatientSexeLabel(entry.patient_sexe)}</TableCell>
                            <TableCell>{entry.patient_age}</TableCell>
                            <TableCell>{getPmoOrientationLabel(entry.orientation)}</TableCell>
                            <TableCell>{entry.nb_produits_pmo}</TableCell>
                            <TableCell className="text-right">
                              <PmoRowActions entryId={entry.id} page={currentPage} />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}

                  {entries.length > 0 ? (
                    <div className="space-y-4 border-t border-border/70 pt-4">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-sm text-muted-foreground">
                          Page {currentPage} sur {totalPages}
                        </p>

                        <div className="flex items-center gap-2">
                          {hasPreviousPage ? (
                            <Button asChild className="rounded-full px-4" variant="outline">
                              <Link href={getPmoListHref({ page: currentPage - 1 })}>Précédent</Link>
                            </Button>
                          ) : (
                            <Button className="rounded-full px-4" disabled variant="outline">
                              Précédent
                            </Button>
                          )}

                          {hasNextPage ? (
                            <Button asChild className="rounded-full px-4" variant="outline">
                              <Link href={getPmoListHref({ page: currentPage + 1 })}>Suivant</Link>
                            </Button>
                          ) : (
                            <Button className="rounded-full px-4" disabled variant="outline">
                              Suivant
                            </Button>
                          )}
                        </div>
                      </div>

                      <div className="flex justify-center sm:justify-end">
                        <Button asChild className="h-11 rounded-full px-5 font-semibold">
                          <Link href="/espace-pro/pmo/nouveau">
                            Nouvelle entrée
                            <PlusCircle className="h-4 w-4" />
                          </Link>
                        </Button>
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

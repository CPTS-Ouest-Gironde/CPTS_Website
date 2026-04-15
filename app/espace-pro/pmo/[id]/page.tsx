import Link from "next/link"
import { redirect } from "next/navigation"
import { ArrowLeft, PencilLine } from "lucide-react"
import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  formatPmoDate,
  getPmoOrientationLabel,
  getPmoPatientSexeLabel,
  getPmoEntryRecord,
  getYesNoLabel,
  parsePmoEntryId,
} from "@/lib/pso/pmo"
import { getPsoProfileRecord } from "@/lib/pso/profile"
import {
  hasCompletedPharmacienProfile,
  hasRole,
  readUserAccessContext,
} from "@/lib/supabase/roles"
import { createClient } from "@/lib/supabase/server"

type PmoDetailPageProps = {
  params: Promise<{
    id: string
  }>
}

export default async function PmoDetailPage({ params }: PmoDetailPageProps) {
  const { id } = await params
  const entryId = parsePmoEntryId(id)

  if (!entryId) {
    redirect("/espace-pro/pmo")
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect(`/login?next=/espace-pro/pmo/${entryId}`)
  }

  const [{ profile, roles }, profileRecord, entry] = await Promise.all([
    readUserAccessContext(supabase, user.id),
    getPsoProfileRecord(supabase, user.id),
    getPmoEntryRecord(supabase, entryId),
  ])

  if (!hasRole(roles, "pharmacien_pso")) {
    redirect("/espace-pro")
  }

  if (!hasCompletedPharmacienProfile(profile) || !profileRecord?.pharmacy || !profileRecord.rpps) {
    redirect("/espace-pro/completer-profil")
  }

  if (!entry) {
    redirect("/espace-pro/pmo")
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />

      <main className="flex-1 bg-muted/20 pt-24 lg:pt-28">
        <section className="py-6 lg:py-8">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="mx-auto max-w-4xl space-y-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <Button asChild className="h-9 rounded-full px-4" variant="ghost">
                  <Link href="/espace-pro/pmo">
                    <ArrowLeft className="h-4 w-4" />
                    Retour aux saisies
                  </Link>
                </Button>

                <Button asChild className="h-10 rounded-full px-5 font-semibold" variant="outline">
                  <Link href={`/espace-pro/pmo/${entryId}/modifier`}>
                    <PencilLine className="h-4 w-4" />
                    Modifier
                  </Link>
                </Button>
              </div>

              <div className="space-y-1">
                <h1 className="text-3xl font-bold tracking-tight text-foreground">Détail de la saisie</h1>
                <p className="text-sm text-muted-foreground">
                  Intervention du {formatPmoDate(entry.date_realisation)} pour l&apos;officine{" "}
                  {profileRecord.pharmacy.nom}.
                </p>
              </div>

              <Card className="rounded-3xl border border-border/80 bg-card shadow-sm">
                <CardContent className="grid gap-4 p-6 sm:grid-cols-2">
                  <DetailField label="Date de réalisation" value={formatPmoDate(entry.date_realisation)} />
                  <DetailField label="Prise en charge" value={getPmoOrientationLabel(entry.orientation)} />
                  <DetailField label="Nom médecin délégant" value={entry.medecin_delegant_nom} />
                  <DetailField label="RPPS médecin délégant" value={entry.medecin_delegant_rpps} />
                  <DetailField label="Sexe" value={getPmoPatientSexeLabel(entry.patient_sexe)} />
                  <DetailField label="Tranche d&apos;âge" value={entry.patient_age} />
                  <DetailField label="Médecin traitant" value={getYesNoLabel(entry.patient_medecin_traitant)} />
                  <DetailField label="Renouvellement" value={getYesNoLabel(entry.renouvellement)} />
                  <DetailField label="Prescription anti-H1" value={getYesNoLabel(entry.prescription_anti_h1)} />
                  <DetailField label="Prescription collyre" value={getYesNoLabel(entry.prescription_collyre)} />
                  <DetailField
                    label="Prescription antiallergique nasal"
                    value={getYesNoLabel(entry.prescription_antiallergique_nasal)}
                  />
                  <DetailField
                    label="Prescription corticoïde nasal"
                    value={getYesNoLabel(entry.prescription_corticoide_nasal)}
                  />
                  <DetailField label="Nombre de produits PMO" value={entry.nb_produits_pmo} />
                  <DetailField label="Dispensation conseil" value={getYesNoLabel(entry.dispensation_conseil)} />
                  <DetailField label="Nombre de produits conseil" value={entry.nb_produits_conseil} />
                  <DetailField
                    className="sm:col-span-2"
                    label="Effet indésirable"
                    value={entry.effet_indesirable?.trim() || "Aucun effet indésirable renseigné."}
                  />
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

type DetailFieldProps = {
  className?: string
  label: string
  value: string
}

function DetailField({ className, label, value }: DetailFieldProps) {
  return (
    <div className={className}>
      <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground/80">{label}</p>
      <p className="mt-2 rounded-2xl border border-border/70 bg-muted/30 px-4 py-3 text-sm text-foreground">
        {value}
      </p>
    </div>
  )
}

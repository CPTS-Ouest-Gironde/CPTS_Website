import Link from "next/link"
import { redirect } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { PmoEntryForm } from "@/components/pso/pmo-entry-form"
import { Button } from "@/components/ui/button"
import { getPmoEntryRecord, parsePmoEntryId, toPmoEntryInput } from "@/lib/pso/pmo"
import { getPsoProfileRecord } from "@/lib/pso/profile"
import {
  hasCompletedPharmacienProfile,
  hasRole,
  readUserAccessContext,
} from "@/lib/supabase/roles"
import { createClient } from "@/lib/supabase/server"
import { updatePmoEntry } from "./actions"

type EditPmoEntryPageProps = {
  params: Promise<{
    id: string
  }>
}

export default async function EditPmoEntryPage({ params }: EditPmoEntryPageProps) {
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
    redirect(`/login?next=/espace-pro/pmo/${entryId}/modifier`)
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

  const boundUpdateAction = updatePmoEntry.bind(null, entryId)

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />

      <main className="flex-1 bg-muted/20 pt-24 lg:pt-28">
        <section className="py-6 lg:py-8">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="mx-auto max-w-5xl space-y-3">
              <Button asChild className="h-9 rounded-full px-4" variant="ghost">
                <Link href={`/espace-pro/pmo/${entryId}`}>
                  <ArrowLeft className="h-4 w-4" />
                  Retour au détail
                </Link>
              </Button>

              <h1 className="text-3xl font-bold tracking-tight text-foreground">Modifier la saisie</h1>

              <PmoEntryForm
                defaultValues={toPmoEntryInput(entry)}
                submitAction={boundUpdateAction}
                submitLabel="Enregistrer les modifications"
              />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

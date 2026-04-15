import Link from "next/link"
import { redirect } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { PmoEntryForm } from "@/components/pso/pmo-entry-form"
import { Button } from "@/components/ui/button"
import { getActiveMedecinsDelegants } from "@/lib/pso/medecins-delegants"
import { getPsoProfileRecord } from "@/lib/pso/profile"
import {
  hasCompletedPharmacienProfile,
  hasRole,
  readUserAccessContext,
} from "@/lib/supabase/roles"
import { createClient } from "@/lib/supabase/server"

export default async function NewPmoEntryPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login?next=/espace-pro/pmo/nouveau")
  }

  const [{ profile, roles }, profileRecord, medecinsDelegants] = await Promise.all([
    readUserAccessContext(supabase, user.id),
    getPsoProfileRecord(supabase, user.id),
    getActiveMedecinsDelegants(supabase),
  ])

  if (!hasRole(roles, "pharmacien_pso")) {
    redirect("/espace-pro")
  }

  if (!hasCompletedPharmacienProfile(profile) || !profileRecord?.pharmacy || !profileRecord.rpps) {
    redirect("/espace-pro/completer-profil")
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />

      <main className="flex-1 bg-muted/20 pt-24 lg:pt-28">
        <section className="py-6 lg:py-8">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="mx-auto max-w-5xl space-y-3">
              <Button asChild className="h-9 rounded-full px-4" variant="ghost">
                <Link href="/espace-pro/pmo">
                  <ArrowLeft className="h-4 w-4" />
                  Retour aux saisies
                </Link>
              </Button>

              <h1 className="text-3xl font-bold tracking-tight text-foreground">Nouvelle entrée</h1>

              <PmoEntryForm medecinsDelegants={medecinsDelegants} showSaveAndCreateAnotherButton />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

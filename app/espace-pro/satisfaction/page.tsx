import { redirect } from "next/navigation"
import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { SatisfactionPharmacienForm } from "@/components/pso/satisfaction-pharmacien-form"
import { getPsoProfileRecord } from "@/lib/pso/profile"
import {
  hasCompletedPharmacienProfile,
  hasRole,
  readUserAccessContext,
} from "@/lib/supabase/roles"
import { createClient } from "@/lib/supabase/server"

export default async function SatisfactionPharmacienPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login?next=/espace-pro/satisfaction")
  }

  const [{ profile, roles }, profileRecord] = await Promise.all([
    readUserAccessContext(supabase, user.id),
    getPsoProfileRecord(supabase, user.id),
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
        <section className="py-8 lg:py-10">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="mx-auto max-w-4xl space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight text-foreground">
                  Questionnaire de satisfaction
                </h1>
                <p className="text-sm text-muted-foreground">
                  Merci de partager votre retour sur le protocole PSO Rhinite Allergique.
                </p>
              </div>

              <SatisfactionPharmacienForm />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

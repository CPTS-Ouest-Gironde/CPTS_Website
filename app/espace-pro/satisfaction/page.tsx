import { redirect } from "next/navigation"
import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { SatisfactionPharmacienForm } from "@/components/pso/satisfaction-pharmacien-form"
import { Card, CardContent } from "@/components/ui/card"
import { getPsoProfileRecord } from "@/lib/pso/profile"
import { getSatisfactionPharmacienReferenceYear } from "@/lib/pso/satisfaction-pharmacien"
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

  const currentReferenceYear = getSatisfactionPharmacienReferenceYear()
  const existingResponseResult = await supabase
    .from("satisfaction_pharmacien")
    .select("id")
    .eq("user_id", user.id)
    .eq("annee_reference", currentReferenceYear)
    .limit(1)
    .maybeSingle()
  const hasAnsweredCurrentYear = !existingResponseResult.error && Boolean(existingResponseResult.data)

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

              {hasAnsweredCurrentYear ? (
                <Card className="rounded-3xl border border-border/80 bg-card shadow-sm">
                  <CardContent className="space-y-2 p-6">
                    <h2 className="text-lg font-semibold text-foreground">
                      Vous avez déjà complété le questionnaire pour cette année
                    </h2>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      Votre réponse pour l&apos;année {currentReferenceYear} a déjà été enregistrée.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <SatisfactionPharmacienForm />
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

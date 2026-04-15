import { redirect } from "next/navigation"
import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { CompleteProfileForm } from "@/components/pso/complete-profile-form"
import { FormSection } from "@/components/pso/form-section"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getPsoProfileRecord } from "@/lib/pso/profile"
import {
  hasCompletedPharmacienProfile,
  hasRole,
  readUserAccessContext,
} from "@/lib/supabase/roles"
import { createClient } from "@/lib/supabase/server"

export default async function CompleteProfilPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login?next=/espace-pro/completer-profil")
  }

  const [{ profile, roles }, profileRecord] = await Promise.all([
    readUserAccessContext(supabase, user.id),
    getPsoProfileRecord(supabase, user.id),
  ])

  if (!hasRole(roles, "pharmacien_pso")) {
    redirect("/espace-pro")
  }

  if (hasCompletedPharmacienProfile(profile)) {
    redirect("/espace-pro/pmo")
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />

      <main className="flex-1 bg-muted/20 pt-24 lg:pt-28">
        <section className="py-10 lg:py-14">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1.05fr_0.95fr]">
              <div className="space-y-5">
                <Card className="rounded-3xl border border-primary/20 bg-primary/[0.04] shadow-sm">
                  <CardContent className="space-y-5 p-7 sm:p-9">
                    <FormSection
                      description="Avant de commencer, rattachez votre compte à votre officine."
                      eyebrow="PROTOCOLE PSO"
                      title="Bienvenue sur votre espace de saisie."
                    />

                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="rounded-2xl border border-border/80 bg-card px-4 py-4 shadow-sm">
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary/75">
                          PREMIÈRE CONNEXION
                        </p>
                        <p className="mt-2 text-sm font-medium text-foreground">Étape unique</p>
                        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                          Cette configuration ne vous sera demandée qu&apos;une seule fois.
                        </p>
                      </div>

                      <div className="rounded-2xl border border-border/80 bg-card px-4 py-4 shadow-sm">
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary/75">
                          CONFIDENTIALITÉ
                        </p>
                        <p className="mt-2 text-sm font-medium text-foreground">Données professionnelles</p>
                        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                          Seules vos informations d&apos;exercice sont collectées. Aucune donnée patient.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="rounded-3xl border-2 border-border/80 bg-card shadow-sm">
                <CardHeader className="space-y-2.5 pb-2 pt-6">
                  <CardTitle className="text-2xl font-bold text-balance">Compléter mon profil</CardTitle>
                  <CardDescription className="text-sm leading-relaxed text-muted-foreground">
                    Renseignez votre RPPS et votre officine pour accéder à l&apos;espace de saisie PMO.
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <CompleteProfileForm
                    initialValues={{
                      firstName: profileRecord?.first_name ?? "",
                      lastName: profileRecord?.last_name ?? "",
                      pharmacieAdresse: profileRecord?.pharmacy?.adresse ?? "",
                      pharmacieFiness: profileRecord?.pharmacy?.finess ?? "",
                      pharmacieNom: profileRecord?.pharmacy?.nom ?? "",
                      rpps: profileRecord?.rpps ?? "",
                      titulaire: profileRecord?.titulaire ?? false,
                    }}
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

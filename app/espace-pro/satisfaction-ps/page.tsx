import Image from "next/image"
import { redirect } from "next/navigation"
import { ShieldCheck } from "lucide-react"
import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { SatisfactionPsForm } from "@/components/satisfaction-ps/satisfaction-ps-form"
import { Card, CardContent } from "@/components/ui/card"
import { hasSubmittedSatisfactionPsForYear } from "@/lib/satisfaction-ps/submission-status"
import { readUserAccessContext } from "@/lib/supabase/roles"
import { createClient } from "@/lib/supabase/server"

export default async function SatisfactionPsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login?next=/espace-pro/satisfaction-ps")
  }

  await readUserAccessContext(supabase, user.id)

  const anneeReference = new Date().getFullYear()
  const hasAlreadySubmitted = await hasSubmittedSatisfactionPsForYear(
    supabase,
    user.id,
    anneeReference,
  )

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />

      <main className="flex-1 bg-muted/20 pt-24 lg:pt-28">
        <section className="py-8 lg:py-12">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="mx-auto max-w-3xl space-y-7">
              <div className="space-y-8">
                <div className="flex justify-center py-4 sm:py-6">
                  <Image
                    alt="CPTS Ouest Gironde"
                    className="h-28 w-auto sm:h-32"
                    height={128}
                    priority
                    src="/favicon.svg"
                    width={128}
                  />
                </div>

                <div className="space-y-5">
                  <div className="space-y-3 text-center">
                    <h1 className="text-3xl font-bold leading-tight tracking-tight text-foreground sm:text-4xl">
                    Questionnaire satisfaction professionnels de santé adhérents CPTS Ouest Gironde
                    </h1>
                    <p className="text-base italic leading-relaxed text-muted-foreground">
                      Merci de bien vouloir prendre trois minutes pour répondre.
                    </p>
                  </div>

                  <div className="mx-auto max-w-2xl space-y-4">
                    <p className="pt-2 text-sm font-medium leading-relaxed text-foreground">
                    Cher(e)s consœurs et confrères,
                    </p>
                    <p className="text-base leading-7 text-muted-foreground">
                      Dans le cadre de ses missions, la CPTS Ouest Gironde a mis en place plusieurs dispositifs et
                      outils. Nous souhaitons recueillir votre retour sur 3 initiatives mises en place pour optimiser
                      votre exercice.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2 rounded-2xl border border-border/60 bg-background/70 px-4 py-3 text-xs leading-relaxed text-muted-foreground">
                <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                <p>
                  Vos réponses sont enregistrées de façon anonyme et ne sont jamais associées à votre
                  identité dans les résultats. Votre connexion sert uniquement à éviter les doublons.
                </p>
              </div>

              {hasAlreadySubmitted ? (
                <Card className="rounded-3xl border border-border/80 bg-card shadow-sm">
                  <CardContent className="p-5 sm:p-6">
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      Vous avez déjà répondu à ce questionnaire pour l&apos;année {anneeReference}.
                      Merci pour votre participation.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <SatisfactionPsForm />
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

import Link from "next/link"
import { BriefcaseMedical, BookOpenCheck, Megaphone, ArrowRight } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/server"
import {
  getAccessibleProfessionalResources,
  getUserRolesFromAppMetadata,
} from "@/lib/professionnels/resources"

const RESOURCE_ICONS = {
  supports: Megaphone,
  "actions-outils": BriefcaseMedical,
  formations: BookOpenCheck,
} as const

export default async function ProfessionnelsHubPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const userRoles = getUserRolesFromAppMetadata(user?.app_metadata)
  const resources = getAccessibleProfessionalResources(userRoles)

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-20">
        <section className="py-12 lg:py-16 bg-gradient-to-br from-primary/5 to-accent/5">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-6xl mx-auto text-center">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4 text-balance">
                Espace Professionnels
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground text-balance">
                Accédez à vos ressources CPTS en un clic.
              </p>
            </div>
          </div>
        </section>

        <section className="py-12 lg:py-16">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-6xl mx-auto">
              <div className="mb-8 rounded-2xl border border-primary/20 bg-primary/5 px-5 py-4">
                <p className="text-sm text-foreground/80">
                  Connecté en tant que{" "}
                  <span className="font-semibold text-foreground">{user?.email ?? "professionnel"}</span>
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {resources.map((resource) => {
                  const Icon = RESOURCE_ICONS[resource.id as keyof typeof RESOURCE_ICONS]

                  return (
                    <Card
                      key={resource.id}
                      className="rounded-3xl border-2 border-border/80 bg-card hover:border-primary/30 hover:shadow-xl transition-all duration-300"
                    >
                      <CardContent className="p-8 flex h-full flex-col">
                        <div className="mb-5 inline-flex w-12 h-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                          <Icon className="w-6 h-6" />
                        </div>

                        <h2 className="text-2xl font-bold text-foreground mb-3">{resource.title}</h2>
                        <p className="text-muted-foreground mb-8 flex-1">{resource.description}</p>

                        <Button asChild className="rounded-full font-semibold h-11 self-start">
                          <Link href={resource.href}>
                            {resource.ctaLabel}
                            <ArrowRight className="w-4 h-4" />
                          </Link>
                        </Button>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>

              {resources.length === 0 && (
                <Card className="rounded-3xl border-2 mt-6">
                  <CardContent className="p-8">
                    <h2 className="text-2xl font-bold text-foreground mb-3">Aucun accès disponible</h2>
                    <p className="text-muted-foreground">
                      Votre compte est connecté mais aucun module n&apos;est encore activé pour votre rôle.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

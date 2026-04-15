import Link from "next/link"
import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function SatisfactionPharmacienMerciPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />

      <main className="flex-1 bg-muted/20 pt-24 lg:pt-28">
        <section className="py-10 lg:py-14">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="mx-auto max-w-xl">
              <Card className="rounded-3xl border border-border/80 bg-card shadow-sm">
                <CardContent className="space-y-4 p-8 text-center">
                  <h1 className="text-3xl font-bold tracking-tight text-foreground">Merci pour votre retour</h1>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    Votre questionnaire a bien été enregistré. Vous pouvez revenir à votre espace PSO à tout moment.
                  </p>
                  <div className="flex justify-center">
                    <Button asChild className="rounded-full px-5 font-semibold">
                      <Link href="/espace-pro/pmo">Retour à l&apos;espace PSO</Link>
                    </Button>
                  </div>
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

import Image from "next/image"
import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { SatisfactionPsDraftCleaner } from "@/components/satisfaction-ps/satisfaction-ps-draft-cleaner"
import { Card, CardContent } from "@/components/ui/card"

export default function SatisfactionPsMerciPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <SatisfactionPsDraftCleaner />

      <main className="flex-1 bg-muted/20 pt-24 lg:pt-28">
        <section className="py-12 lg:py-16">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="mx-auto max-w-xl">
              <Card className="rounded-3xl border border-border/80 bg-card shadow-sm">
                <CardContent className="space-y-7 p-8 text-center sm:p-10">
                  <div className="flex justify-center py-3 sm:py-5">
                    <Image
                      alt="CPTS Ouest Gironde"
                      className="h-28 w-auto sm:h-32"
                      height={128}
                      priority
                      src="/favicon.svg"
                      width={128}
                    />
                  </div>
                  <div className="space-y-3">
                    <h1 className="text-3xl font-bold leading-tight tracking-tight text-foreground sm:text-4xl">
                      Merci pour votre réponse
                    </h1>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                    Votre avis a bien été enregistré. Merci pour votre participation.
                    </p>
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

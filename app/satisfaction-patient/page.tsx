import { ShieldCheck } from "lucide-react"
import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { SatisfactionPatientForm } from "@/components/pso/satisfaction-patient-form"

export default function SatisfactionPatientPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />

      <main className="flex-1 bg-muted/20 pt-24 lg:pt-28">
        <section className="py-6 lg:py-8">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="mx-auto max-w-3xl space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight text-foreground">Votre avis sur la prise en charge</h1>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Ce questionnaire est anonyme. Il aide la CPTS Ouest Gironde à évaluer le protocole PSO Rhinite
                  Allergique.
                </p>
              </div>

              <div className="flex items-start gap-2 rounded-2xl border border-border/80 bg-card px-4 py-3 text-sm text-muted-foreground">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" />
                <p>Aucune donnée permettant de vous identifier n&apos;est collectée dans ce questionnaire.</p>
              </div>

              <SatisfactionPatientForm />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

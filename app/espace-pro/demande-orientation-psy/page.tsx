import type { Metadata } from "next";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { OrientationWizard } from "@/components/demande-orientation-psy/orientation-wizard";

export const metadata: Metadata = {
  title: "Formulaire d'adressage IDE Psy - CPTS Ouest Gironde",
  description:
    "Formulaire d'orientation vers une infirmière en psychiatrie, à destination des professionnels de santé du territoire CPTS Ouest Gironde.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function DemandeOrientationPsyPage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />

      <section className="relative pt-24 lg:pt-32 pb-10 lg:pb-14 overflow-hidden bg-gradient-to-br from-primary/5 via-secondary/10 to-background">
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_85%_10%,hsl(var(--primary)/0.14),transparent_40%)]" />
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="max-w-5xl mx-auto space-y-4">
            <h1 className="text-3xl lg:text-5xl font-bold text-foreground text-balance">
              Demande d&apos;orientation psy
            </h1>
            <p className="text-muted-foreground text-base lg:text-lg leading-relaxed">
              Formulaire d&apos;adressage IDE Psy à télécharger en{" "}
              <span className="font-semibold text-foreground">PDF</span>, puis à
              envoyer à{" "}
              <span className="font-semibold text-foreground">
                elise.patenere@pro.mssante.fr
              </span>{" "}
              pour conserver une trace dans le dossier.
            </p>
          </div>
        </div>
      </section>

      <section className="pb-20 lg:pb-28">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <OrientationWizard />
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

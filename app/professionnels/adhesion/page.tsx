import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ExternalLink } from "lucide-react";

export default function AdhesionPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-12 lg:py-16 bg-gradient-to-br from-primary/5 to-accent/5">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4 text-balance">
                Comment adhérer ?
              </h1>
              <p className="text-lg sm:text-xl lg:text-2xl text-muted-foreground text-balance">
                Rejoignez la CPTS Ouest Gironde en quelques étapes simples
              </p>
            </div>
          </div>
        </section>

        {/* HelloAsso Section */}
        <section className="py-8 lg:py-12">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <Card className="p-6 lg:p-10 rounded-3xl bg-card border-2 text-center">
                <h2 className="text-xl lg:text-2xl font-bold text-foreground mb-3">
                  Via HELLOASSO
                </h2>
                <div className="inline-block w-20 h-1 bg-primary/50 rounded-full mb-6" />

                <Button
                  size="lg"
                  className="rounded-full font-bold text-base px-8 h-14 mb-4"
                  asChild
                >
                  <a
                    href="https://www.helloasso.com/associations/communaute-professionnelle-territoriale-de-sante-ouest-gironde/adhesions/bulletin-adhesion-2024-2025"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2"
                  >
                    Adhérer via HelloAsso
                    <ExternalLink className="w-5 h-5" />
                  </a>
                </Button>

                <p className="text-sm text-muted-foreground">
                  Plateforme sécurisée de gestion des adhésions
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* Steps Section */}
        <section className="py-16 lg:py-24 bg-accent/10">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl lg:text-5xl font-bold text-foreground mb-12 text-center">
                Les étapes de l'adhésion
              </h2>

              <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
                {/* Step 1 */}
                <Card className="p-8 lg:p-10 rounded-3xl bg-card border-2 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary/30 to-primary/50" />
                  <div className="flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 border-2 border-primary/30 text-primary text-4xl font-bold mb-6 mx-auto">
                    1
                  </div>
                  <h3 className="text-2xl lg:text-3xl font-bold text-foreground mb-4 text-center">
                    Inscription
                  </h3>
                  <p className="text-muted-foreground leading-relaxed text-center mb-6">
                    Vous renseignez les informations nécessaires à votre
                    inscription. Certaines d'entre elles seront affichées
                    publiquement dans l'annuaire des membres.
                  </p>
                </Card>

                {/* Step 2 */}
                <Card className="p-8 lg:p-10 rounded-3xl bg-card border-2 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-accent/30 to-accent/50" />
                  <div className="flex items-center justify-center w-20 h-20 rounded-full bg-accent/20 border-2 border-accent/40 text-accent-foreground text-4xl font-bold mb-6 mx-auto">
                    2
                  </div>
                  <h3 className="text-2xl lg:text-3xl font-bold text-foreground mb-4 text-center">
                    Validation
                  </h3>
                  <p className="text-muted-foreground leading-relaxed text-center mb-4">
                    Après vérifications, le bureau validera votre adhésion.
                  </p>
                  <div className="bg-primary/5 rounded-2xl p-4 border border-primary/20">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Vous recevrez une confirmation et aurez accès à l'espace
                      pro du site et aux outils mis à disposition des membres.
                    </p>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl lg:text-5xl font-bold text-foreground mb-12 text-center">
                Pourquoi adhérer à la CPTS ?
              </h2>

              <div className="grid md:grid-cols-2 gap-6">
                <Card className="p-6 rounded-2xl bg-card border-2">
                  <div className="flex items-start gap-4">
                    <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-lg font-bold text-foreground mb-2">
                        Améliorer la coordination des soins
                      </h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        Travaillez en réseau avec les autres professionnels de
                        santé du territoire
                      </p>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 rounded-2xl bg-card border-2">
                  <div className="flex items-start gap-4">
                    <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-lg font-bold text-foreground mb-2">
                        Accéder à des outils partagés
                      </h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        Bénéficiez d'outils de coordination et de supports de
                        prévention
                      </p>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 rounded-2xl bg-card border-2">
                  <div className="flex items-start gap-4">
                    <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-lg font-bold text-foreground mb-2">
                        Se former en continu
                      </h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        Participez à des formations interprofessionnelles
                      </p>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 rounded-2xl bg-card border-2">
                  <div className="flex items-start gap-4">
                    <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-lg font-bold text-foreground mb-2">
                        Agir pour la prévention
                      </h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        Impliquez-vous dans des actions de santé publique
                        territoriales
                      </p>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 rounded-2xl bg-card border-2">
                  <div className="flex items-start gap-4">
                    <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-lg font-bold text-foreground mb-2">
                        Être référencé localement
                      </h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        Soyez référencé dans l'annuaire partagé des
                        professionnels
                      </p>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 rounded-2xl bg-card border-2">
                  <div className="flex items-start gap-4">
                    <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-lg font-bold text-foreground mb-2">
                        Renforcer l’attractivité du territoire
                      </h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        Contribuez à rendre votre territoire plus attractif
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 lg:py-24 bg-gradient-to-br from-primary/5 to-accent/5">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">
                Prêt à rejoindre la CPTS Ouest Gironde ?
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Rejoignez-nous dès aujourd'hui et participez à l'amélioration de
                l'accès aux soins sur notre territoire
              </p>
              <Button
                size="lg"
                className="rounded-full font-bold text-base px-8 h-14"
                asChild
              >
                <a
                  href="https://www.helloasso.com/associations/communaute-professionnelle-territoriale-de-sante-ouest-gironde/adhesions/bulletin-adhesion-2024-2025"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2"
                >
                  Adhérer maintenant
                  <ExternalLink className="w-5 h-5" />
                </a>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

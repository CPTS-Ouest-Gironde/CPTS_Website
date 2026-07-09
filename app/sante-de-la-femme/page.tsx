import Image from "next/image";
import { MapPin, Newspaper, Route } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { SanteFemmeAnnuaire } from "@/components/sante-de-la-femme/annuaire";
import { SanteFemmeArticles } from "@/components/sante-de-la-femme/articles";
import articlesData from "@/app/data/sante-de-la-femme-articles.json";
import parcoursData from "@/app/data/sante-de-la-femme-parcours.json";

export default function SanteDeLaFemmePage() {
  return (
    <main className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="relative pt-32 lg:pt-40 pb-12 lg:pb-32 min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-primary/5 via-secondary/10 to-background">
        <div
          className="pointer-events-none absolute inset-0 z-0"
          style={{
            background: `
              radial-gradient(
                ellipse 1400px 1000px at 90% 5%,
                rgba(78, 196, 90, 0.45) 0%,
                rgba(16, 185, 129, 0.30) 30%,
                rgba(16, 185, 129, 0.15) 50%,
                transparent 70%
              ),
              radial-gradient(
                ellipse 1200px 900px at 10% 95%,
                rgba(78, 196, 90, 0.40) 0%,
                rgba(20, 184, 166, 0.25) 30%,
                rgba(20, 184, 166, 0.12) 50%,
                transparent 70%
              ),
              linear-gradient(
                180deg,
                rgba(240, 253, 244, 0.50) 0%,
                rgba(255, 255, 255, 0.70) 25%,
                rgba(255, 255, 255, 0.70) 75%,
                rgba(236, 253, 245, 0.40) 100%
              )
            `,
          }}
        />

        <div className="container mx-auto px-4 lg:px-8 relative z-20">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 items-center gap-10 lg:gap-16">
            <div className="text-center lg:text-left space-y-6">
              <h1 className="text-3xl sm:text-4xl lg:text-4xl xl:text-5xl font-bold text-foreground leading-tight">
                <span className="block whitespace-nowrap">
                  La Santé de la Femme
                </span>
                <span className="block mt-3 text-2xl lg:text-3xl xl:text-4xl font-semibold text-primary">
                  Annuaire et ressources patients
                </span>
              </h1>
              <p className="text-lg lg:text-2xl text-muted-foreground text-pretty max-w-xl mx-auto lg:mx-0 font-light">
                Accompagner et orienter les femmes à chaque étape de leur vie
              </p>
              <div className="pt-2">
                <p className="text-sm lg:text-base text-muted-foreground/80">
                  Découvrez les structures et professionnels du territoire
                </p>
              </div>

              {/* Navigation rapide : annonce les trois contenus de la page */}
              <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 pt-4 justify-center lg:justify-start">
                <Button
                  asChild
                  size="lg"
                  className="rounded-full font-semibold h-12 px-6 shadow-md hover:shadow-lg transition-all duration-200"
                >
                  <a href="#annuaire">
                    <MapPin className="w-4 h-4" />
                    Trouver une structure
                  </a>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="rounded-full font-semibold h-12 px-6 bg-background/70 backdrop-blur-sm transition-all duration-200"
                >
                  <a href="#articles">
                    <Newspaper className="w-4 h-4" />
                    Articles &amp; campagnes
                  </a>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="rounded-full font-semibold h-12 px-6 bg-background/70 backdrop-blur-sm transition-all duration-200"
                >
                  <a href="#parcours">
                    <Route className="w-4 h-4" />
                    Nos parcours
                  </a>
                </Button>
              </div>
            </div>
            {/* Photo hero */}
            <div className="w-full max-w-md mx-auto lg:max-w-none overflow-hidden rounded-3xl border border-primary/10 shadow-xl">
              <div className="relative aspect-[4/3] w-full">
                <Image
                  src="/santé-de-la-femme/hero-2-sante-femme.webp"
                  alt="Quatre femmes de générations différentes, souriantes et complices"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 448px, 560px"
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section Articles & campagnes */}
      <section id="articles" className="scroll-mt-28 py-12 lg:py-20 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center space-y-3 mb-10">
            <h2 className="text-2xl lg:text-3xl font-bold text-foreground">
              {articlesData.title}
            </h2>
            <p className="text-base text-muted-foreground max-w-2xl mx-auto">
              {articlesData.subtitle}
            </p>
          </div>

          <SanteFemmeArticles />
        </div>
      </section>

      {/* Section Annuaire */}
      <section id="annuaire" className="scroll-mt-28 py-12 lg:py-20 bg-secondary/20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center space-y-3 mb-10">
            <h2 className="text-2xl lg:text-3xl font-bold text-foreground">
              Annuaire santé de la femme
            </h2>
            <p className="text-base text-muted-foreground max-w-2xl mx-auto">
              Les institutions de santé pour les femmes du territoire : PMI,
              Maisons du Département Solidarités, planification familiale et
              accompagnement
            </p>
          </div>

          <SanteFemmeAnnuaire />
        </div>
      </section>

      {/* Section Parcours */}
      <section id="parcours" className="scroll-mt-28 py-12 lg:py-20 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center space-y-3 mb-10">
            <h2 className="text-2xl lg:text-3xl font-bold text-foreground">
              {parcoursData.title}
            </h2>
            <p className="text-base text-muted-foreground max-w-2xl mx-auto">
              {parcoursData.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {parcoursData.parcours.map((parcours) => (
              <Card key={parcours.id} className="border-primary/10">
                <CardContent className="p-6 space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-lg font-semibold text-foreground">
                      {parcours.title}
                    </h3>
                    <Badge variant="secondary">{parcours.status}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {parcours.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

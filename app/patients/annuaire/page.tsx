import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, UserCheck, Clock, RefreshCw } from "lucide-react";
import annuaireData from "@/app/data/annuaire.json";

const iconMap: Record<string, React.ElementType> = {
  "1": UserCheck,
  "2": Clock,
  "3": RefreshCw,
};

export default function AnnuairePage() {
  return (
    <main className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-background to-secondary/10">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center space-y-8">
            <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-foreground leading-tight">
              {annuaireData.hero.title}
            </h1>

            <p className="text-lg lg:text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
              {annuaireData.hero.subtitle}
            </p>

            {/* Email Card */}
            <Card className="max-w-2xl mx-auto shadow-lg">
              <CardContent className="p-8 space-y-6">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                  <Mail className="w-8 h-8 text-primary" />
                </div>

                <div className="space-y-4">
                  <a
                    href={`mailto:${annuaireData.hero.email}`}
                    className="text-2xl font-bold text-primary hover:underline block"
                  >
                    {annuaireData.hero.email}
                  </a>

                  <Button
                    asChild
                    size="lg"
                    className="w-full sm:w-auto rounded-full font-bold"
                  >
                    <a href={`mailto:${annuaireData.hero.email}`}>
                      <Mail className="w-5 h-5 mr-2" />
                      Envoyer un email
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid md:grid-cols-3 gap-6">
            {annuaireData.features.map((feature) => {
              const Icon = iconMap[feature.id] || UserCheck;
              return (
                <Card key={feature.id}>
                  <CardContent className="p-6 space-y-4 text-center">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-bold text-lg text-foreground">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

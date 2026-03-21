import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function RhiniteAllergiquePage() {
  return (
    <main className="min-h-screen">
      <Header />

      <section className="relative pt-24 lg:pt-32 pb-12 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/10 to-background" />
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto">
            <Link
              href="/#actualites"
              className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Retour aux actualités</span>
            </Link>

            <h1 className="text-4xl lg:text-6xl font-bold text-foreground mb-6 text-balance">
              Vous souffrez d&apos;une rhinite allergique
            </h1>

            <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5 lg:p-6">
              <p className="text-base lg:text-lg text-muted-foreground leading-relaxed">
                Pour la 2ème année consécutive, la CPTS Ouest Gironde renouvelle
                le protocole de délégation de tâches sur la rhinite et
                conjonctivite allergique : les pharmaciens peuvent délivrer des
                médicaments pour vos allergies sans ordonnance. Cette année, 12
                pharmacies supplémentaires participent à améliorer l&apos;accès au
                soin des patients du territoire.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-20 lg:pb-32">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="max-w-2xl mx-auto rounded-3xl overflow-hidden shadow-2xl border border-border bg-card">
              <div className="relative w-full aspect-[3/4]">
                <Image
                  src="/actu/affiche-rhinite.webp"
                  alt="Affiche rhinite allergique"
                  fill
                  className="object-contain"
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1000px"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

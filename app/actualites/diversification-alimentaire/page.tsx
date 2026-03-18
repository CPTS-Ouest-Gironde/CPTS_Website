import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const DOCTOLIB_URL =
  "https://www.doctolib.fr/dieteticien/merignac/celine-maillard-merignac/booking/availabilities?specialityId=414&telehealth=false&placeId=practice-161680&motiveCategoryIds%5B%5D=391618&motiveIds%5B%5D=13383386&pid=practice-161680&bookingFunnelSource=profile";

export default function DiversificationAlimentairePage() {
  return (
    <main className="min-h-screen">
      <Header />

      {/* Hero Section */}
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
              Jeunes parents? Inscrivez vous
            </h1>

            <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5 lg:p-6 space-y-3">
              <p className="text-base lg:text-lg font-semibold text-foreground">
                Atelier proposé tous les deux mois. Places limitées à 15.
              </p>
              <p className="text-muted-foreground">
                Inscriptions en scannant le QR code sur l&apos;affiche ou
                directement sur Doctolib.
              </p>
              <a
                href={DOCTOLIB_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center rounded-full bg-primary text-primary-foreground px-4 py-2 text-sm font-semibold hover:bg-primary/90 transition-colors"
              >
                S&apos;inscrire sur Doctolib
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Affiche Section */}
      <section className="pb-20 lg:pb-32">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="max-w-2xl mx-auto rounded-3xl overflow-hidden shadow-2xl border border-border bg-card">
              <div className="relative w-full aspect-[3/4]">
                <Image
                  src="/actu/affiche-diversification-alimentaire.webp"
                  alt="Affiche Diversification Alimentaire - Jeunes parents"
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

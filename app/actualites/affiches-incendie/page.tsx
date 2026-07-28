import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Flame } from "lucide-react";

import { BackToActualitesLink } from "@/components/back-to-actualites-link";
import { FeuDuPorgePosters } from "@/components/feu-du-porge-posters";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";

const posters = [
  {
    image: "/actu/affiche-incendie/1.jpg",
    alt: "Les 8 recommandations face aux risques des fumées d'incendie",
    downloadLabel: "Télécharger l'affiche 1",
    downloadUrl:
      "https://drive.google.com/uc?export=download&id=1uNqQrcj4Ii5Q6bLn4LsaaV0MYQwjNOab",
  },
  {
    image: "/actu/affiche-incendie/2.jpg",
    alt: "Questions et réponses face aux fumées d'incendie",
    downloadLabel: "Télécharger l'affiche 2",
    downloadUrl:
      "https://drive.google.com/uc?export=download&id=1SkPPDXLaOdeGojn34r3HVL1FBxJaNiYJ",
  },
] as const;

export const metadata: Metadata = {
  title: "Conseils face aux fumées d'incendie | CPTS Ouest Gironde",
  description:
    "Consultez et téléchargez les affiches de recommandations face aux fumées d'incendie.",
};

export default function AffichesIncendiePage() {
  return (
    <main className="min-h-screen">
      <Header />

      <section className="relative overflow-hidden pt-24 pb-16 lg:pt-32 lg:pb-24">
        <div className="absolute inset-0 bg-gradient-to-br from-red-600/5 via-secondary/10 to-background" />
        <div className="container relative z-10 mx-auto px-4 lg:px-8">
          <div className="mx-auto max-w-5xl">
            <BackToActualitesLink className="mb-8" />

            <div className="mb-10 text-center">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-red-600/10 px-4 py-1.5">
                <Flame
                  className="h-4 w-4 text-red-600"
                  aria-hidden="true"
                />
                <span className="text-sm font-semibold uppercase tracking-wider text-red-600">
                  Fumées d&apos;incendie
                </span>
              </div>
              <h1 className="mb-4 text-balance text-3xl font-bold text-foreground md:text-4xl lg:text-5xl">
                Les conseils de la CPTS Ouest Gironde
              </h1>
              <p className="mx-auto max-w-2xl text-base leading-relaxed text-muted-foreground lg:text-lg">
                Clique sur une affiche pour l&apos;agrandir ou télécharge sa
                version PDF.
              </p>
            </div>

            <FeuDuPorgePosters posters={posters} />

            <div className="mt-10 flex justify-center">
              <Link
                href="/actualites/feu-du-porge"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Lire l&apos;article sur le feu du Porge
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

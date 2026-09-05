import type { ReactNode } from "react";
import Image from "next/image";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { BackToActualitesLink } from "@/components/back-to-actualites-link";
import { ActualiteCarrousel } from "@/components/actualite-carrousel";
import { cn } from "@/lib/utils";

interface SimpleActualitePageProps {
  title: string;
  imageSrc: string;
  imageAlt: string;
  intro?: ReactNode;
  posterCardClassName?: string;
  /** Ratio du cadre de l'affiche. Carre pour les visuels de carrousel. */
  posterAspectClassName?: string;
  /**
   * Visuels supplementaires (pages 2 et suivantes d'un carrousel). Quand ils
   * sont fournis, l'affiche et eux sont parcourus dans un carrousel unique.
   */
  carrousel?: { src: string; alt: string }[];
}

export function SimpleActualitePage({
  title,
  imageSrc,
  imageAlt,
  intro,
  posterCardClassName,
  posterAspectClassName = "aspect-[3/4]",
  carrousel,
}: SimpleActualitePageProps) {
  return (
    <main className="min-h-screen">
      <Header />

      <section className="relative pt-24 lg:pt-32 pb-12 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/10 to-background" />
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto">
            <BackToActualitesLink className="mb-6" />

            <h1 className="text-4xl lg:text-6xl font-bold text-foreground mb-6 text-balance">
              {title}
            </h1>

            {intro}
          </div>
        </div>
      </section>

      <section className="pb-20 lg:pb-32">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto">
            {carrousel && carrousel.length > 0 ? (
              <ActualiteCarrousel
                slides={[{ src: imageSrc, alt: imageAlt }, ...carrousel]}
                aspectClassName={posterAspectClassName}
              />
            ) : (
              <div
                className={cn(
                  "max-w-2xl mx-auto rounded-3xl overflow-hidden shadow-2xl border border-border bg-card",
                  posterCardClassName
                )}
              >
                <div className={cn("relative w-full", posterAspectClassName)}>
                  <Image
                    src={imageSrc}
                    alt={imageAlt}
                    fill
                    className="object-contain"
                    priority
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1000px"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

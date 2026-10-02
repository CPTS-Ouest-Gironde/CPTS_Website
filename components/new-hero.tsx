import { Button } from "@/components/ui/button";
import { Newspaper, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

// Image précédente : "/hero/hero-illustration-team.png"
const HERO_IMAGE = "/hero-home-octobre-rose.webp";

export function NewHero() {
  return (
    <section className="relative pt-[calc(var(--home-header-height)+2rem)] pb-8 lg:pt-[calc(var(--home-header-height)+3rem)] lg:pb-28 bg-transparent">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
          {/* Colonne texte */}
          <div className="flex-1 min-w-0 text-center lg:text-left z-10 relative">
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black text-foreground mb-4 lg:mb-8 leading-[1.1] tracking-tight">
              Des acteurs
              <br />
              de <span className="text-primary">santé</span>
              <br />à votre <span className="text-primary">service</span>.
            </h1>

            <p className="text-base lg:text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0 mb-6 lg:mb-12 leading-relaxed">
              La Communauté Professionnelle Territoriale de Santé accompagne les
              patients et professionnels pour une santé de proximité et de
              qualité.
            </p>

            <div className="flex flex-wrap justify-center lg:justify-start gap-4">
              <Link href="#actualites">
                <Button
                  size="lg"
                  className="gap-2 px-10 lg:px-14 lg:h-16 lg:text-lg shadow-xl shadow-primary/20"
                >
                  Nos actualités <Newspaper className="w-5 h-5 lg:w-6 lg:h-6" />
                </Button>
              </Link>
              <Link href="/presentation">
                <Button
                  variant="outline"
                  size="lg"
                  className="gap-2 lg:px-14 lg:h-16 lg:text-lg"
                >
                  Découvrir la CPTS{" "}
                  <ArrowRight className="w-5 h-5 lg:w-6 lg:h-6" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Colonne image */}
          <div className="flex-1 min-w-0 w-full mt-2 lg:mt-0 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-[min(44rem,45vw)] h-[320px] sm:h-[360px] md:h-[420px] lg:h-[clamp(420px,40vw,620px)]">
              <Image
                src={HERO_IMAGE}
                alt="Illustration professionnels de santé mobilisés pour Octobre Rose"
                fill
                className="object-contain"
                sizes="(max-width: 768px) 90vw, (max-width: 1024px) 70vw, 45vw"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

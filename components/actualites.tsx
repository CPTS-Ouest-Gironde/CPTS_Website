"use client";

import { ArrowRight } from "lucide-react";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";

const actualites = [
  {
    title: "Endométriose : dépistage et prise en charge",
    image: "/endometriose-depistage-prise-en-charge/endometriose-hero.jpg",
    link: "/endometriose-depistage-prise-en-charge",
  },
  {
    title: "Vous souffrez d'une rhinite allergique ?",
    image: "/actu/affiche-rhinite.webp",
    link: "/actualites/rhinite-allergique",
  },
  {
    title: "Dépistage diabète & hypertension — Pharmacie Arago, 28 et 29 avril 2026",
    image: "/actu/affiche-pharma-ARAGO 28-29 avril _page-0001.webp",
    link: "/actualites/pharma-arago-avril",
  },
  {
    title: "Jeunes parents? Inscrivez vous ",
    image: "/actu/affiche-diversification-alimentaire.webp",
    link: "/actualites/diversification-alimentaire",
  },
];

function ActuCard({ actu }: { actu: (typeof actualites)[0] }) {
  return (
    <a href={actu.link} className="block w-full group">
      <div className="rounded-2xl bg-white shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-200 hover:border-primary/50 flex flex-col h-full">
        <div className="p-4 lg:p-3 relative aspect-[3/4] lg:aspect-[4/5] overflow-hidden">
          <Image
            src={actu.image}
            alt={actu.title}
            fill
            className="object-contain rounded-lg"
            sizes="(max-width: 768px) 80vw, (max-width: 1024px) 50vw, 33vw"
            quality={90}
            loading="lazy"
          />
        </div>
        <div className="p-6 pt-2 lg:p-4 lg:pt-1 space-y-3 lg:space-y-2 flex flex-col flex-1">
          <h3 className="text-lg lg:text-base font-bold text-foreground leading-tight flex-1">
            {actu.title}
          </h3>
          <div className="inline-flex items-center gap-2 text-sm lg:text-xs font-semibold text-primary group-hover:text-white group-hover:bg-primary px-4 py-2 lg:px-3 lg:py-1.5 rounded-full border-2 border-primary transition-all duration-300 w-fit">
            <span>Lire la suite</span>
            <ArrowRight className="w-4 h-4 lg:w-3 lg:h-3 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </a>
  );
}

export function Actualites() {
  return (
    <section
      id="actualites"
      className="py-12 lg:py-16 bg-gradient-to-b from-secondary/5 to-background"
    >
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10 lg:mb-10">
            <h2 className="text-2xl lg:text-4xl font-bold text-foreground mb-4 text-balance">
              Actualités Santé du territoire de la CPTS
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-primary/50 via-primary to-primary/50 mx-auto rounded-full" />
          </div>

          {/* Mobile: Carousel */}
          <div className="md:hidden">
            <Carousel
              opts={{
                align: "center",
                loop: true,
              }}
              className="w-full"
            >
              <CarouselContent className="-ml-2">
                {actualites.map((actu, index) => (
                  <CarouselItem key={index} className="pl-2 basis-[85%]">
                    <ActuCard actu={actu} />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="flex justify-center gap-4 mt-6">
                <CarouselPrevious className="static translate-y-0 bg-primary text-white hover:bg-primary/90" />
                <CarouselNext className="static translate-y-0 bg-primary text-white hover:bg-primary/90" />
              </div>
            </Carousel>
          </div>

          {/* Desktop: Grid */}
          <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-6">
            {actualites.map((actu, index) => (
              <div key={index} className="flex">
                <ActuCard actu={actu} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

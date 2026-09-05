import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

// À rétablir avec le carrousel (voir plus bas) :
// "use client";
// import {
//   Carousel,
//   CarouselContent,
//   CarouselItem,
//   CarouselPrevious,
//   CarouselNext,
// } from "@/components/ui/carousel";

const actualites = [
  {
    title: "La Collective RUN",
    image: "/actu/collective-run-2026/affiche-collective-run-2026.webp",
    link: "/actualites/collective-run-2026",
  },
  {
    title: "Les urgences, ce n'est pas une évidence",
    image: "/actu/urgence-pas-une-evidence.webp",
    link: "/actualites/urgences-pas-une-evidence",
    // Cette image a le même ratio 4:5 que la carte : on ajoute du padding
    // pour qu'elle "flotte" comme les autres affiches (plus étroites).
    imageClassName: "p-7 lg:p-8",
  },
  {
    title: "Jeunes parents? Inscrivez vous ",
    image: "/actu/affiche-diversification-alimentaire.webp",
    link: "/actualites/diversification-alimentaire",
  },
];

function ActuCard({ actu }: { actu: (typeof actualites)[0] }) {
  return (
    <a href={actu.link} className="block w-full h-full group">
      <div className="rounded-2xl bg-white shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-200 hover:border-primary/50 flex flex-col h-full">
        <div
          className={cn(
            "p-4 lg:p-3 relative aspect-[3/4] lg:aspect-[4/5] overflow-hidden",
            actu.imageClassName
          )}
        >
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

// Carte "Actualite a venir" : a remettre dans la grille (et a decommenter
// ici) quand il reste une place libre sur la ligne de trois cartes.
/*
function ActuPlaceholderCard() {
  return (
    <div className="rounded-2xl bg-white shadow-md border border-dashed border-primary/30 flex flex-col h-full">
      <div className="p-4 lg:p-3 relative aspect-[3/4] lg:aspect-[4/5]">
        <div className="w-full h-full rounded-lg bg-gradient-to-br from-secondary/20 to-primary/5 flex flex-col items-center justify-center gap-3 text-center px-6">
          <div className="w-14 h-14 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <Clock3 className="w-7 h-7" />
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Une nouvelle actualité du territoire sera publiée ici prochainement.
          </p>
        </div>
      </div>
      <div className="p-6 pt-2 lg:p-4 lg:pt-1 space-y-3 lg:space-y-2 flex flex-col flex-1">
        <h3 className="text-lg lg:text-base font-bold text-foreground leading-tight flex-1">
          Actualité à venir
        </h3>
        <div className="inline-flex items-center gap-2 text-sm lg:text-xs font-semibold text-muted-foreground px-4 py-2 lg:px-3 lg:py-1.5 rounded-full border-2 border-dashed border-border w-fit">
          <span>Bientôt disponible</span>
        </div>
      </div>
    </div>
  );
}
*/

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

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
            {actualites.map((actu, index) => (
              <ActuCard key={index} actu={actu} />
            ))}
            {/* Emplacement en attente : reafficher <ActuPlaceholderCard /> ici
                quand il reste une place libre sur la ligne de trois cartes. */}
          </div>

          {/* Affichage carrousel : à réactiver quand il y aura plus de 3 cartes
              (remplacer la grille ci-dessus par ce bloc et rétablir le
              "use client" et les imports Carousel en haut du fichier).

          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {actualites.map((actu, index) => (
                <CarouselItem
                  key={index}
                  className="pl-2 md:pl-4 basis-[85%] md:basis-[47%] lg:basis-[32%]"
                >
                  <div className="h-full flex">
                    <ActuCard actu={actu} />
                  </div>
                </CarouselItem>
              ))}
              <CarouselItem className="pl-2 md:pl-4 basis-[85%] md:basis-[47%] lg:basis-[32%]">
                <div className="h-full flex">
                  <ActuPlaceholderCard />
                </div>
              </CarouselItem>
            </CarouselContent>
            <div className="flex justify-center gap-4 mt-6">
              <CarouselPrevious className="static translate-y-0 bg-primary text-white hover:bg-primary/90" />
              <CarouselNext className="static translate-y-0 bg-primary text-white hover:bg-primary/90" />
            </div>
          </Carousel>
          */}
        </div>
      </div>
    </section>
  );
}

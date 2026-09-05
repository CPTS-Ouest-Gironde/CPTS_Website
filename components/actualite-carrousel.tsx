"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

interface Slide {
  src: string;
  alt: string;
}

interface ActualiteCarrouselProps {
  slides: Slide[];
  /** Ratio des visuels. Carre pour les carrousels reseaux sociaux. */
  aspectClassName?: string;
}

/**
 * Visuels d'une actualite parcourus un par un : pensé pour les carrousels
 * reseaux sociaux, ou chaque page se lit en entier (d'ou object-contain).
 */
export function ActualiteCarrousel({
  slides,
  aspectClassName = "aspect-square",
}: ActualiteCarrouselProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap());
    const onSelect = () => setCurrent(api.selectedScrollSnap());
    api.on("select", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  return (
    <div className="max-w-2xl mx-auto">
      <Carousel opts={{ align: "start", loop: true }} setApi={setApi}>
        <CarouselContent>
          {slides.map((slide, index) => (
            <CarouselItem key={slide.src}>
              <div className="rounded-3xl overflow-hidden shadow-2xl border border-border bg-card">
                <div className={cn("relative w-full", aspectClassName)}>
                  <Image
                    src={slide.src}
                    alt={slide.alt}
                    fill
                    className="object-contain"
                    priority={index === 0}
                    loading={index === 0 ? undefined : "lazy"}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1000px"
                  />
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-2 lg:-left-12" />
        <CarouselNext className="right-2 lg:-right-12" />
      </Carousel>

      <div className="flex justify-center items-center gap-2 mt-6">
        {slides.map((slide, index) => (
          <button
            key={slide.src}
            type="button"
            onClick={() => api?.scrollTo(index)}
            aria-label={`Visuel ${index + 1} sur ${slides.length}`}
            aria-current={index === current ? "true" : undefined}
            className={cn(
              "h-2 rounded-full transition-all",
              index === current ? "w-8 bg-primary" : "w-2 bg-muted-foreground/30"
            )}
          />
        ))}
      </div>
    </div>
  );
}

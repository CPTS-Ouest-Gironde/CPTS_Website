"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, ArrowUpRight, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import heroData from "@/app/data/hero-slides.json";

const slides = heroData.slides;

export function FeaturedCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [resetTimer, setResetTimer] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [resetTimer]);

  const goTo = (index: number) => {
    setCurrentSlide(index);
    setResetTimer((prev) => prev + 1);
  };
  const nextSlide = () => goTo((currentSlide + 1) % slides.length);
  const prevSlide = () => goTo((currentSlide - 1 + slides.length) % slides.length);

  return (
    <section
      id="a-la-une"
      className="scroll-mt-28 pt-12 pb-14 md:pt-14 md:pb-16 lg:pt-16 lg:pb-20 overflow-x-clip bg-primary/5 border-y border-primary/10"
    >
      <div className="container mx-auto px-4 lg:px-8">
        {/* En-tête de section */}
        <div className="text-center mb-8 lg:mb-10">
          <p className="inline-flex items-center gap-2 text-primary text-xs md:text-sm font-semibold uppercase tracking-wider mb-3">
            <span className="w-8 h-0.5 bg-primary" />
            Actualités récentes
            <span className="w-8 h-0.5 bg-primary" />
          </p>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-3">
            À la une : nos dernières actualités
          </h2>
          <p className="text-base lg:text-lg text-muted-foreground px-4">
            Campagnes, événements et informations santé récentes sur votre territoire
          </p>
        </div>

        <div className="relative mx-auto max-w-[64rem]">
          {/* Decorative shapes - desktop only */}
          <div className="hidden lg:block absolute -bottom-6 -left-6 w-40 h-40 bg-primary/15 rounded-3xl -z-10" />
          <div className="hidden lg:block absolute -top-6 -right-6 w-28 h-28 bg-primary/10 rounded-3xl -z-10" />

          {/* News illustration - hidden on mobile, small on tablet, full on desktop */}
          <div className="hidden md:block absolute -top-16 md:-top-28 lg:-top-72 -right-8 md:-right-16 lg:-right-44 w-[150px] h-[150px] md:w-[250px] md:h-[250px] lg:w-[420px] lg:h-[420px] z-0 opacity-50 md:opacity-70 lg:opacity-100">
            <Image
              src="/hero/news-hero.png"
              alt="Illustration actualités"
              fill
              className="object-contain"
              sizes="(max-width: 768px) 150px, (max-width: 1024px) 250px, 420px"
            />
          </div>

          <div className="aspect-[4/3] md:aspect-[16/9] rounded-2xl md:rounded-3xl overflow-hidden bg-muted relative shadow-xl md:shadow-2xl">
            {slides.map((slide, index) => (
              <Link
                key={index}
                href={slide.link}
                className={`absolute inset-0 transition-opacity duration-500 ${
                  index === currentSlide
                    ? "opacity-100 pointer-events-auto"
                    : "opacity-0 pointer-events-none"
                }`}
              >
                <Image
                  src={slide.image}
                  alt={slide.alt}
                  fill
                  className="object-cover"
                  priority={index === 0}
                  loading={index === 0 ? undefined : "lazy"}
                  sizes="(max-width: 1280px) 100vw, 1280px"
                  quality={85}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

                {/* Badge Nouveau sur la première slide */}
                {index === 0 && (
                  <span className="absolute top-4 left-4 md:top-6 md:left-6 lg:top-8 lg:left-8 inline-flex items-center gap-1.5 px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-primary text-primary-foreground text-xs md:text-sm font-bold uppercase tracking-wide shadow-lg">
                    <Sparkles className="w-3.5 h-3.5 md:w-4 md:h-4" />
                    Nouveau
                  </span>
                )}

                <div className="absolute top-4 right-4 md:top-6 md:right-6 lg:top-8 lg:right-8 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:bg-white/30 transition-colors">
                  <ArrowUpRight className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 lg:p-8 text-white">
                  <p className="text-lg md:text-xl lg:text-3xl font-bold leading-tight line-clamp-3 text-center">
                    {slide.title}
                  </p>
                </div>
              </Link>
            ))}

            {/* Compteur */}
            <span className="absolute bottom-4 right-4 md:bottom-6 md:right-6 px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-sm text-white text-xs md:text-sm font-semibold tabular-nums">
              {currentSlide + 1} / {slides.length}
            </span>
          </div>

          {slides.length > 1 && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors shadow-lg z-10"
                aria-label="Slide précédent"
              >
                <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-foreground" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors shadow-lg z-10"
                aria-label="Slide suivant"
              >
                <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-foreground" />
              </button>
            </>
          )}
        </div>

        {/* Vignettes de navigation */}
        {slides.length > 1 && (
          <div
            className="mt-5 md:mt-7 mx-auto max-w-[calc(64rem+1rem)] flex gap-2 md:gap-3 overflow-x-auto px-2 py-2 justify-start md:justify-center snap-x"
            role="group"
            aria-label="Navigation carousel"
          >
            {slides.map((slide, index) => (
              <button
                key={index}
                onClick={() => goTo(index)}
                className={`relative flex-shrink-0 w-24 md:w-32 aspect-[16/10] rounded-lg md:rounded-xl overflow-hidden snap-start transition-all ring-offset-2 ring-offset-background ${
                  index === currentSlide
                    ? "ring-2 ring-primary opacity-100"
                    : "opacity-60 hover:opacity-100"
                }`}
                aria-label={`Aller à ${slide.title}`}
                aria-current={index === currentSlide ? "true" : "false"}
              >
                <Image src={slide.image} alt="" fill className="object-cover" sizes="144px" />
                {index === 0 && (
                  <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-primary text-primary-foreground text-[10px] font-bold uppercase">
                    Nouveau
                  </span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

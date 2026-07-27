"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, ArrowUpRight } from "lucide-react";
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

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setResetTimer((prev) => prev + 1);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setResetTimer((prev) => prev + 1);
  };

  return (
    <section className="pt-8 pb-12 md:pb-14 lg:pb-16 bg-background overflow-x-clip">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-8 md:mb-8 lg:mb-10">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-3 md:mb-3">
            À la une
          </h2>
          <p className="text-base md:text-base lg:text-lg text-muted-foreground px-4">
            Découvrez nos dernières campagnes et informations importantes
          </p>
        </div>

        <div className="relative max-w-[58rem] mx-auto">
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

          <div className="aspect-[16/9] rounded-2xl md:rounded-3xl overflow-hidden bg-muted relative shadow-xl md:shadow-2xl">
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
                <div className="absolute top-4 right-4 md:top-6 md:right-6 lg:top-10 lg:right-10 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:bg-white/30 transition-colors">
                  <ArrowUpRight className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 lg:p-8 text-white">
                  <p className="text-lg md:text-xl lg:text-3xl font-bold leading-tight line-clamp-3 text-center">
                    {slide.title}
                  </p>
                </div>
              </Link>
            ))}
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

              <div
                className="absolute -bottom-5 md:-bottom-6 left-1/2 -translate-x-1/2 flex gap-2"
                role="group"
                aria-label="Navigation carousel"
              >
                {slides.map((slide, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setCurrentSlide(index);
                      setResetTimer((prev) => prev + 1);
                    }}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentSlide
                        ? "bg-primary w-6 md:w-8"
                        : "bg-muted-foreground/30"
                    }`}
                    aria-label={`Aller à ${slide.title}`}
                    aria-current={index === currentSlide ? "true" : "false"}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

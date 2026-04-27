import type { ReactNode } from "react";
import Image from "next/image";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { BackToActualitesLink } from "@/components/back-to-actualites-link";
import { cn } from "@/lib/utils";

interface SimpleActualitePageProps {
  title: string;
  imageSrc: string;
  imageAlt: string;
  intro?: ReactNode;
  posterCardClassName?: string;
}

export function SimpleActualitePage({
  title,
  imageSrc,
  imageAlt,
  intro,
  posterCardClassName,
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
            <div
              className={cn(
                "max-w-2xl mx-auto rounded-3xl overflow-hidden shadow-2xl border border-border bg-card",
                posterCardClassName
              )}
            >
              <div className="relative w-full aspect-[3/4]">
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
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

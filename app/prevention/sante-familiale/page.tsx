"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Clock, ChevronRight, Heart, Users, BookOpen } from "lucide-react";
import data from "@/app/data/sante-familiale.json";

interface Article {
  id: string;
  title: string;
  date: string;
  dateLabel: string;
  image: string;
  imagePosition?: string;
  slug: string;
  href?: string;
}

interface SanteFamilialeData {
  hero: {
    title: string;
    subtitle: string;
  };
  articlesPerPage: number;
  articles: Article[];
}

const typedData = data as SanteFamilialeData;

export default function SanteFamilialePage() {
  const [displayedCount, setDisplayedCount] = useState(typedData.articlesPerPage);
  const sortedArticles = [...typedData.articles].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const perPage = typedData.articlesPerPage;
  const total = sortedArticles.length;
  const hasMore = displayedCount < total;

  const articles = sortedArticles.slice(0, displayedCount);

  const loadMore = () => {
    setDisplayedCount((prev) => Math.min(prev + perPage, total));
  };

  return (
    <main className="min-h-screen">
      <Header />

      {/* Hero Section - Always visible */}
      {(
        <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-rose-50/50 via-background to-pink-50/30 pt-28 lg:pt-32">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16 max-w-6xl mx-auto">
              {/* Texte */}
              <div className="flex-1 text-center lg:text-left space-y-5">
                <div className="flex items-center gap-3 mb-4 justify-center lg:justify-start">
                  <div className="w-12 lg:w-16 h-1 bg-primary rounded-full" />
                  <span className="text-xs lg:text-sm font-semibold text-primary uppercase tracking-widest">
                    Prévention
                  </span>
                </div>
                <h1 className="text-3xl lg:text-5xl font-bold text-foreground mb-4">
                  {typedData.hero.title}
                </h1>
                <p className="text-base lg:text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0">
                  {typedData.hero.subtitle}
                </p>

                {/* Badges */}
                <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
                  {[
                    { icon: Heart, label: "Diabète, HTA, insuffisance cardiaque…", color: "bg-rose-50 text-rose-700 border-rose-200" },
                    { icon: Users, label: "Conseils rédigés par des professionnels de santé", color: "bg-pink-50 text-pink-700 border-pink-200" },
                    { icon: BookOpen, label: "Articles clairs et accessibles à tous", color: "bg-rose-50 text-rose-700 border-rose-200" },
                  ].map(({ icon: Icon, label, color }) => (
                    <span key={label} className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium ${color}`}>
                      <Icon className="w-3 h-3" />
                      {label}
                    </span>
                  ))}
                </div>
              </div>

              {/* Illustration + points clés */}
              <div className="flex-1 flex flex-col items-center gap-5 w-full">
                <div className="relative w-full max-w-sm lg:max-w-xl h-[280px] lg:h-[380px]">
                  <Image
                    src="/prevention/sante-famille/sante-famille-hero.svg"
                    alt="Santé familiale illustration"
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 100vw, 600px"
                    priority
                  />
                </div>

                {/* Points clés */}
                <div className="flex flex-col gap-2 w-full max-w-sm lg:max-w-md">
                  {[
                    { label: "Mieux comprendre sa maladie au quotidien", color: "bg-rose-50 border-rose-100 text-rose-700" },
                    { label: "Identifier les bons réflexes et les bonnes questions à poser", color: "bg-pink-50 border-pink-100 text-pink-700" },
                    { label: "Trouver des ressources et des accompagnements près de chez vous", color: "bg-rose-50 border-rose-100 text-rose-700" },
                  ].map((item) => (
                    <div key={item.label} className={`rounded-xl border px-4 py-2.5 flex items-center gap-3 ${item.color}`}>
                      <div className="w-1.5 h-1.5 rounded-full bg-current flex-shrink-0" />
                      <p className="text-xs sm:text-sm font-medium">{item.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Articles Grid */}
      <section className="py-10 lg:py-16 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-14 max-w-5xl mx-auto">
            {articles.map((article) => {
              const isComingSoon = !article.href;

              if (isComingSoon) {
                return (
                  <div
                    key={article.id}
                    className="group block opacity-50 cursor-not-allowed"
                  >
                    {/* Image */}
                    <div className="relative w-full aspect-[16/10] overflow-hidden mb-4">
                      <Image
                        src={article.image}
                        alt={article.title}
                        fill
                        className="object-cover grayscale transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, 50vw"
                        style={article.imagePosition ? { objectPosition: article.imagePosition } : undefined}
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                        <span className="px-4 py-2 bg-white/90 text-foreground text-xs font-bold uppercase tracking-wider rounded-full">
                          Article à venir
                        </span>
                      </div>
                    </div>

                    {/* Title */}
                    <h2 className="text-sm font-black uppercase tracking-wide text-muted-foreground transition-colors leading-snug mb-3">
                      {article.title}
                    </h2>

                    {/* Separator */}
                    <div className="w-8 h-0.5 bg-muted-foreground mb-3" />

                    {/* Date */}
                    <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{article.dateLabel}</span>
                    </div>
                  </div>
                );
              }

              return (
                <Link
                  key={article.id}
                  href={article.href!}
                  className="group block"
                >
                  {/* Image */}
                  <div className="relative w-full aspect-[16/10] overflow-hidden mb-4">
                    <Image
                      src={article.image}
                      alt={article.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, 50vw"
                      style={article.imagePosition ? { objectPosition: article.imagePosition } : undefined}
                    />
                  </div>

                  {/* Title */}
                  <h2 className="text-sm font-black uppercase tracking-wide text-foreground group-hover:text-primary transition-colors leading-snug mb-3">
                    {article.title}
                  </h2>

                  {/* Separator */}
                  <div className="w-8 h-0.5 bg-primary mb-3" />

                  {/* Date */}
                  <div className="flex items-center gap-1.5 text-primary text-sm">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{article.dateLabel}</span>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Load More Button */}
          {hasMore && (
            <div className="flex items-center justify-center mt-14">
              <button
                onClick={loadMore}
                className="group px-8 py-4 bg-primary text-primary-foreground rounded-lg font-semibold text-sm hover:bg-primary/90 transition-all duration-300 flex items-center gap-2 shadow-md hover:shadow-lg"
              >
                <span>Découvrir plus d'articles</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}

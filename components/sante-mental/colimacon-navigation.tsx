"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { HandHeart, BookOpen, Users, Video, ArrowLeft } from "lucide-react";
import { AnnuaireModal } from "./annuaire-modal";
import { ArticlesView } from "./articles-view";
import { VideosView } from "./videos-view";

type ViewType = "navigation" | "articles" | "videos-aide" | "videos-parlent";

export function ColimaconNavigation() {
  const [currentView, setCurrentView] = useState<ViewType>("navigation");
  const [isAnnuaireOpen, setIsAnnuaireOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hash === "#annuaire") {
      setIsAnnuaireOpen(true);
      history.replaceState(null, "", window.location.pathname);
    }
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleBack = () => setCurrentView("navigation");

  // Animation classes pour chaque card (effet spirale montante)
  const getCardAnimation = (index: number) => {
    const baseClass = "transition-all duration-700 ease-out";
    const delays = ["delay-0", "delay-100", "delay-200", "delay-300"];

    if (!isVisible) {
      return `${baseClass} opacity-0 scale-50 rotate-180`;
    }
    return `${baseClass} ${delays[index]} opacity-100 scale-100 rotate-0`;
  };

  // Navigation principale - Rectangle colimaçon avec 4 zones dedans
  if (currentView === "navigation") {
    return (
      <>
        <div ref={sectionRef} className="max-w-7xl mx-auto relative overflow-hidden rounded-3xl sm:rounded-[2rem] lg:rounded-[3rem]">
          {/* Background colimaçon avec opacité */}
          <div className="absolute -inset-4 sm:-inset-8 md:-inset-16 lg:-inset-20 overflow-hidden">
            <Image
              src="/colimaçon.jpg"
              alt=""
              fill
              className="object-cover object-center opacity-60 scale-110"
              aria-hidden="true"
            />
          </div>
          {/* Layout Desktop - Colimaçon rond avec cards rondes dedans */}
          <div className="hidden lg:block relative z-10">
            <div className="relative w-[600px] h-[600px] mx-auto">
              {/* Image du colimaçon - Ronde */}
              <div className="absolute inset-0 rounded-full overflow-hidden shadow-2xl">
                <Image
                  src="/colimaçon.jpg"
                  alt="Santé Mentale"
                  fill
                  className="object-cover"
                  priority
                  sizes="600px"
                />
              </div>

              {/* 4 cards circulaires en croix à l'intérieur */}
              {/* Haut - Card 1 */}
              <button
                onClick={() => setCurrentView("videos-aide")}
                className={`group absolute top-8 left-1/2 -translate-x-1/2 ${getCardAnimation(0)}`}
              >
                <div className="w-54 h-34 rounded-full bg-emerald-50/90 backdrop-blur-sm border-2 border-emerald-200/60 hover:bg-emerald-100/95 transition-all duration-300 hover:scale-110 hover:shadow-xl flex flex-col items-center justify-center">
                  <HandHeart className="w-10 h-10 text-emerald-600 mb-0.5" />
                  <span className="text-[12px] font-bold text-emerald-800 text-center leading-tight px-1">
                    Venez on vous aide !
                  </span>
                </div>
              </button>

              {/* Gauche - Card 2 */}
              <button
                onClick={() => setIsAnnuaireOpen(true)}
                className={`group absolute left-8 top-1/2 -translate-y-1/2 ${getCardAnimation(1)}`}
              >
                <div className="w-54 h-34 rounded-full bg-sky-50/90 backdrop-blur-sm border-2 border-sky-200/60 hover:bg-sky-100/95 transition-all duration-300 hover:scale-110 hover:shadow-xl flex flex-col items-center justify-center">
                  <Users className="w-10 h-10 text-sky-600 mb-0.5" />
                  <span className="text-[12px] font-bold text-sky-800 text-center leading-tight px-1">
                    Annuaire
                  </span>
                </div>
              </button>

              {/* Droite - Card 3 */}
              <button
                onClick={() => setCurrentView("videos-parlent")}
                className={`group absolute right-8 top-1/2 -translate-y-1/2 ${getCardAnimation(2)}`}
              >
                <div className="w-54 h-34 rounded-full bg-violet-50/90 backdrop-blur-sm border-2 border-violet-200/60 hover:bg-violet-100/95 transition-all duration-300 hover:scale-110 hover:shadow-xl flex flex-col items-center justify-center">
                  <Video className="w-10 h-10 text-violet-600 mb-0.5" />
                  <span className="text-[12px] font-bold text-violet-800 text-center leading-tight px-1">
                    Ils en parlent aussi
                  </span>
                </div>
              </button>

              {/* Bas - Card 4 */}
              <button
                onClick={() => setCurrentView("articles")}
                className={`group absolute bottom-8 left-1/2 -translate-x-1/2 ${getCardAnimation(3)}`}
              >
                <div className="w-54 h-34 rounded-full bg-amber-50/90 backdrop-blur-sm border-2 border-amber-200/60 hover:bg-amber-100/95 transition-all duration-300 hover:scale-110 hover:shadow-xl flex flex-col items-center justify-center">
                  <BookOpen className="w-10 h-10 text-amber-600 mb-0.5" />
                  <span className="text-[12px] font-bold text-amber-800 text-center leading-tight px-1">
                    Votre santé mentale on en parle ?
                  </span>
                </div>
              </button>
            </div>
          </div>

          {/* Layout Tablette - Colimaçon rond */}
          <div className="hidden md:block lg:hidden relative z-10">
            <div className="relative w-[400px] h-[400px] mx-auto">
              <div className="absolute inset-0 rounded-full overflow-hidden shadow-2xl">
                <Image
                  src="/colimaçon.jpg"
                  alt="Santé Mentale"
                  fill
                  className="object-cover"
                  priority
                  sizes="400px"
                />
              </div>
              {/* Haut - Card 1 */}
              <button
                onClick={() => setCurrentView("videos-aide")}
                className={`group absolute top-6 left-1/2 -translate-x-1/2 ${getCardAnimation(0)}`}
              >
                <div className="w-20 h-20 rounded-full bg-emerald-50/90 backdrop-blur-sm border-2 border-emerald-200/60 hover:bg-emerald-100/95 transition-all hover:scale-110 flex flex-col items-center justify-center">
                  <HandHeart className="w-6 h-6 text-emerald-600" />
                  <span className="text-[7px] font-bold text-emerald-800 text-center px-1">
                    Venez on vous aide
                  </span>
                </div>
              </button>
              {/* Gauche - Card 2 */}
              <button
                onClick={() => setIsAnnuaireOpen(true)}
                className={`group absolute left-6 top-1/2 -translate-y-1/2 ${getCardAnimation(1)}`}
              >
                <div className="w-20 h-20 rounded-full bg-sky-50/90 backdrop-blur-sm border-2 border-sky-200/60 hover:bg-sky-100/95 transition-all hover:scale-110 flex flex-col items-center justify-center">
                  <Users className="w-6 h-6 text-sky-600" />
                  <span className="text-[7px] font-bold text-sky-800 text-center px-1">
                    Annuaire
                  </span>
                </div>
              </button>
              {/* Droite - Card 3 */}
              <button
                onClick={() => setCurrentView("videos-parlent")}
                className={`group absolute right-6 top-1/2 -translate-y-1/2 ${getCardAnimation(2)}`}
              >
                <div className="w-20 h-20 rounded-full bg-violet-50/90 backdrop-blur-sm border-2 border-violet-200/60 hover:bg-violet-100/95 transition-all hover:scale-110 flex flex-col items-center justify-center">
                  <Video className="w-6 h-6 text-violet-600" />
                  <span className="text-[7px] font-bold text-violet-800 text-center px-1">
                    Ils en parlent aussi
                  </span>
                </div>
              </button>
              {/* Bas - Card 4 */}
              <button
                onClick={() => setCurrentView("articles")}
                className={`group absolute bottom-6 left-1/2 -translate-x-1/2 ${getCardAnimation(3)}`}
              >
                <div className="w-20 h-20 rounded-full bg-amber-50/90 backdrop-blur-sm border-2 border-amber-200/60 hover:bg-amber-100/95 transition-all hover:scale-110 flex flex-col items-center justify-center">
                  <BookOpen className="w-6 h-6 text-amber-600" />
                  <span className="text-[7px] font-bold text-amber-800 text-center px-1">
                    Votre santé mentale on en parle ?
                  </span>
                </div>
              </button>
            </div>
          </div>

          {/* Layout Mobile - Colimaçon rond */}
          <div className="md:hidden relative z-10">
            <div className="relative w-[340px] h-[340px] mx-auto">
              <div className="absolute inset-0 rounded-full overflow-hidden shadow-xl">
                <Image
                  src="/colimaçon.jpg"
                  alt="Santé Mentale"
                  fill
                  className="object-cover"
                  priority
                  sizes="340px"
                />
              </div>
              {/* Haut - Card 1 */}
              <button
                onClick={() => setCurrentView("videos-aide")}
                className={`group absolute top-3 left-1/2 -translate-x-1/2 ${getCardAnimation(0)}`}
              >
                <div className="w-20 h-20 rounded-full bg-emerald-50/95 backdrop-blur-sm border-2 border-emerald-200/60 active:scale-95 transition-all flex flex-col items-center justify-center shadow-lg">
                  <HandHeart className="w-7 h-7 text-emerald-600" />
                  <span className="text-[8px] font-bold text-emerald-800 text-center px-1 leading-tight">
                    Venez on vous aide
                  </span>
                </div>
              </button>
              {/* Gauche - Card 2 */}
              <button
                onClick={() => setIsAnnuaireOpen(true)}
                className={`group absolute left-3 top-1/2 -translate-y-1/2 ${getCardAnimation(1)}`}
              >
                <div className="w-20 h-20 rounded-full bg-sky-50/95 backdrop-blur-sm border-2 border-sky-200/60 active:scale-95 transition-all flex flex-col items-center justify-center shadow-lg">
                  <Users className="w-7 h-7 text-sky-600" />
                  <span className="text-[8px] font-bold text-sky-800 text-center px-1 leading-tight">
                    Annuaire
                  </span>
                </div>
              </button>
              {/* Droite - Card 3 */}
              <button
                onClick={() => setCurrentView("videos-parlent")}
                className={`group absolute right-3 top-1/2 -translate-y-1/2 ${getCardAnimation(2)}`}
              >
                <div className="w-20 h-20 rounded-full bg-violet-50/95 backdrop-blur-sm border-2 border-violet-200/60 active:scale-95 transition-all flex flex-col items-center justify-center shadow-lg">
                  <Video className="w-7 h-7 text-violet-600" />
                  <span className="text-[8px] font-bold text-violet-800 text-center px-1 leading-tight">
                    Ils en parlent aussi
                  </span>
                </div>
              </button>
              {/* Bas - Card 4 */}
              <button
                onClick={() => setCurrentView("articles")}
                className={`group absolute bottom-3 left-1/2 -translate-x-1/2 ${getCardAnimation(3)}`}
              >
                <div className="w-20 h-20 rounded-full bg-amber-50/95 backdrop-blur-sm border-2 border-amber-200/60 active:scale-95 transition-all flex flex-col items-center justify-center shadow-lg">
                  <BookOpen className="w-7 h-7 text-amber-600" />
                  <span className="text-[8px] font-bold text-amber-800 text-center px-1 leading-tight">
                    Santé mentale on en parle ?
                  </span>
                </div>
              </button>
            </div>
          </div>
        </div>

        <AnnuaireModal
          isOpen={isAnnuaireOpen}
          onClose={() => setIsAnnuaireOpen(false)}
        />
      </>
    );
  }

  // Vue Articles
  if (currentView === "articles") {
    return (
      <div className="max-w-5xl mx-auto">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-primary hover:text-primary/80 mb-6 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Retour</span>
        </button>
        <ArticlesView />
      </div>
    );
  }

  // Vue Vidéos - Venez on vous aide
  if (currentView === "videos-aide") {
    return (
      <div className="max-w-5xl mx-auto">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-primary hover:text-primary/80 mb-6 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Retour</span>
        </button>
        <VideosView type="aide" />
      </div>
    );
  }

  // Vue Vidéos - Ils en parlent aussi
  if (currentView === "videos-parlent") {
    return (
      <div className="max-w-5xl mx-auto">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-primary hover:text-primary/80 mb-6 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Retour</span>
        </button>
        <VideosView type="parlent" />
      </div>
    );
  }

  return null;
}

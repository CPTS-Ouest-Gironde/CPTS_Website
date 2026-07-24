"use client";

import { useEffect, useState } from "react";
import { Plane } from "lucide-react";

interface Chapter {
  id: string;
  num: string;
  label: string;
}

interface JourneyNavProps {
  chapters: Chapter[];
}

/**
 * Rail de navigation vertical fixé à gauche de l'écran (desktop large uniquement) :
 * une ligne de vol pointillée le long de laquelle l'avion descend selon la
 * progression du scroll, avec les chapitres en escales cliquables.
 */
export function JourneyNav({ chapters }: JourneyNavProps) {
  // Fraction [0,1] de la position de l'avion le long du rail, calée sur les escales :
  // exactement sur l'escale i quand son chapitre commence, puis interpolée vers la suivante.
  const [fraction, setFraction] = useState(0);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const refY = window.scrollY + window.innerHeight * 0.4;
      const tops = chapters.map((chapter) => {
        const el = document.getElementById(chapter.id);
        return el ? el.getBoundingClientRect().top + window.scrollY : Number.POSITIVE_INFINITY;
      });

      let current = -1;
      for (let i = 0; i < tops.length; i++) {
        if (refY >= tops[i]) current = i;
      }

      let f = 0;
      if (current >= tops.length - 1) {
        f = 1;
      } else if (current >= 0) {
        const within = Math.min(
          Math.max((refY - tops[current]) / (tops[current + 1] - tops[current]), 0),
          1
        );
        f = (current + within) / (tops.length - 1);
      }

      setFraction(f);
      setActiveId(current >= 0 ? chapters[current].id : null);
      // Le rail reste masqué tant qu'on est dans le hero (plein écran)
      setVisible(window.scrollY > window.innerHeight * 0.5);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [chapters]);

  return (
    <aside
      aria-label="Chapitres de l'article"
      className={`fixed left-5 top-1/2 -translate-y-1/2 z-40 hidden xl:block transition-all duration-500 ${
        visible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4 pointer-events-none"
      }`}
    >
      <div className="relative h-[26rem] w-9">
        {/* Ligne de vol pointillée */}
        <div
          aria-hidden
          className="absolute left-1/2 -translate-x-1/2 top-4 bottom-4 border-l-2 border-dashed border-stone-400/60"
        />
        {/* Tronçon déjà parcouru */}
        {/* La course va de centre de la 1re escale (2rem) au centre de la dernière (100% - 2rem) */}
        <div
          aria-hidden
          className="absolute left-1/2 -translate-x-1/2 top-8 w-0.5 bg-amber-500 transition-[height] duration-150 ease-out"
          style={{ height: `calc(${fraction} * (100% - 4rem))` }}
        />
        {/* Avion */}
        <div
          aria-hidden
          className="absolute left-1/2 -translate-x-1/2 z-20 transition-[top] duration-150 ease-out"
          style={{ top: `calc(2rem + ${fraction} * (100% - 4rem) - 0.875rem)` }}
        >
          <div className="w-7 h-7 rounded-full bg-stone-900 text-amber-400 flex items-center justify-center shadow-md">
            <Plane className="w-4 h-4 rotate-[135deg]" />
          </div>
        </div>

        {/* Escales */}
        <ul className="absolute inset-x-0 top-4 bottom-4 flex flex-col justify-between">
          {chapters.map((chapter) => {
            const isActive = activeId === chapter.id;
            return (
              <li key={chapter.id} className="flex justify-center">
                <a
                  href={`#${chapter.id}`}
                  className="group relative flex items-center justify-center"
                >
                  <span
                    className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-[11px] font-black transition-all duration-300 ${
                      isActive
                        ? "bg-amber-400 border-stone-900 text-stone-900 scale-110"
                        : "bg-amber-50 border-stone-400 text-stone-500 group-hover:border-stone-900 group-hover:text-stone-900"
                    }`}
                  >
                    {chapter.num}
                  </span>
                  {/* Étiquette du chapitre */}
                  <span
                    className={`absolute left-10 whitespace-nowrap bg-stone-900 text-amber-50 text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full shadow-md transition-all duration-300 ${
                      isActive
                        ? "opacity-100 translate-x-0"
                        : "opacity-0 -translate-x-2 pointer-events-none group-hover:opacity-100 group-hover:translate-x-0"
                    }`}
                  >
                    {chapter.label}
                  </span>
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </aside>
  );
}

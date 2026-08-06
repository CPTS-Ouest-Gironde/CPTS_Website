import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  ChevronDown,
  Plane,
} from "lucide-react";

import data from "@/app/data/sante-voyage.json";
import { EditorialImage } from "@/components/sante-voyage/editorial-image";
import { JourneyNav } from "@/components/sante-voyage/journey-nav";
import { Reveal } from "@/components/sante-voyage/reveal";

import { displayFont, handFont, renderInline } from "./article-ui";

export function TravelHero() {
  return (
    <>
      <section className="relative flex min-h-screen items-center overflow-hidden bg-amber-400 pt-28 pb-16 lg:pt-32">
        <div
          aria-hidden
          className="animate-sv-float absolute -top-16 -right-16 h-64 w-64 rounded-full bg-amber-300"
        />
        <svg
          aria-hidden
          className="absolute inset-0 h-full w-full opacity-30"
          viewBox="0 0 1200 600"
          preserveAspectRatio="none"
        >
          <path
            d="M -20 515 C 280 560, 560 500, 800 380 C 980 290, 1120 200, 1260 80"
            fill="none"
            stroke="#1c1917"
            strokeWidth="3"
            strokeDasharray="2 16"
            strokeLinecap="round"
          />
        </svg>

        <div className="container relative z-10 mx-auto w-full px-4 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <Link
              href={data.backLink.href}
              className="mb-10 inline-flex items-center gap-2 text-sm font-semibold text-stone-900/70 transition-colors hover:text-stone-900"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>{data.backLink.label}</span>
            </Link>

            <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[1.2fr_1fr] lg:gap-24">
              <div>
                <div className="mb-6 flex items-center gap-3">
                  <span className="inline-flex items-center gap-2 rounded-full bg-stone-900 px-4 py-1.5 text-xs font-bold tracking-widest text-amber-400 uppercase">
                    <Plane className="h-3.5 w-3.5 rotate-45" />
                    <span className="leading-snug">
                      <span>Prévention</span>
                      <span className="block sm:inline">
                        Santé du voyageur
                      </span>
                    </span>
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-900/70">
                    <Calendar className="h-3.5 w-3.5" />
                    {data.date}
                  </span>
                </div>
                <h1
                  className={`${displayFont.className} text-balance mb-7 text-3xl leading-[1.05] text-stone-900 uppercase sm:text-4xl lg:text-6xl`}
                >
                  {data.title}
                </h1>
                <p
                  className={`${handFont.className} max-w-2xl -rotate-1 text-xl text-stone-800 lg:text-3xl`}
                >
                  {data.subtitle}
                </p>
              </div>

              <Reveal from="right">
                <div className="relative rotate-2 rounded-2xl bg-amber-50 shadow-2xl transition-transform duration-500 hover:rotate-0 lg:scale-110">
                  <span
                    aria-hidden
                    className="absolute top-2/3 -left-3 h-6 w-6 rounded-full bg-amber-400"
                  />
                  <span
                    aria-hidden
                    className="absolute top-2/3 -right-3 h-6 w-6 rounded-full bg-amber-400"
                  />

                  <div className="p-6">
                    <div className="mb-5 flex items-center justify-between">
                      <span
                        className={`${displayFont.className} text-xs tracking-widest text-stone-900 uppercase`}
                      >
                        Carte d&apos;embarquement
                      </span>
                      <Plane className="h-5 w-5 rotate-45 text-stone-900" />
                    </div>
                    <div className="mb-6 flex items-center justify-between gap-4">
                      <div>
                        <p className="mb-1 text-[10px] tracking-widest text-stone-500 uppercase">
                          Départ
                        </p>
                        <p
                          className={`${displayFont.className} text-lg text-stone-900`}
                        >
                          {data.hero.boardingPass.from}
                        </p>
                      </div>
                      <div
                        aria-hidden
                        className="relative flex-1 border-t-2 border-dashed border-stone-300"
                      >
                        <Plane className="absolute -top-2 left-1/2 h-4 w-4 -translate-x-1/2 rotate-45 bg-amber-50 text-amber-600" />
                      </div>
                      <div className="text-right">
                        <p className="mb-1 text-[10px] tracking-widest text-stone-500 uppercase">
                          Arrivée
                        </p>
                        <p
                          className={`${displayFont.className} text-lg text-stone-900`}
                        >
                          {data.hero.boardingPass.to}
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-3 text-stone-900">
                      {[
                        ["Vol", data.hero.boardingPass.flight],
                        ["Porte", data.hero.boardingPass.gate],
                        ["Siège", data.hero.boardingPass.seat],
                      ].map(([label, value]) => (
                        <div key={label}>
                          <p className="mb-1 text-[10px] tracking-widest text-stone-500 uppercase">
                            {label}
                          </p>
                          <p className="text-sm font-bold">{value}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t-2 border-dashed border-stone-300 p-4">
                    <p className="text-[10px] tracking-widest text-stone-500 uppercase">
                      Passager · {data.hero.boardingPass.passenger}
                    </p>
                    <div aria-hidden className="flex h-6 items-end gap-[3px]">
                      {[3, 1, 2, 1, 3, 2, 1, 3, 1, 2, 3, 1, 2, 1, 3].map(
                        (width, index) => (
                          <span
                            key={index}
                            className="h-full bg-stone-900"
                            style={{ width: `${width}px` }}
                          />
                        ),
                      )}
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>

        <div
          aria-hidden
          className="absolute bottom-5 left-1/2 flex -translate-x-1/2 flex-col items-center gap-0.5 text-stone-900/70"
        >
          <span className={`${handFont.className} text-lg`}>Embarquement</span>
          <ChevronDown className="h-5 w-5 animate-bounce" />
        </div>
      </section>

      <div className="overflow-hidden bg-stone-900 py-3" aria-hidden>
        <div className="animate-sv-marquee flex w-max">
          {[0, 1].map((copy) => (
            <div key={copy} className="flex flex-shrink-0 items-center">
              {data.ticker.map((item) => (
                <span
                  key={`${copy}-${item}`}
                  className="flex items-center gap-3 px-6 text-sm font-bold tracking-widest whitespace-nowrap text-amber-400 uppercase"
                >
                  <Plane className="h-3.5 w-3.5 flex-shrink-0 rotate-45" />
                  {item}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <JourneyNav chapters={data.chapters} />

      <section className="py-14 lg:py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
            <Reveal from="left">
              <EditorialImage
                src={data.hero.image}
                alt={data.images.introduction.alt}
                label={data.images.introduction.label}
                responsivePortrait
                objectPosition="left center"
                priority
                sizes="(max-width: 1024px) 100vw, 480px"
              />
            </Reveal>
            <div className="space-y-6 lg:space-y-8">
              {data.intro.paragraphs.map((paragraph, index) => (
                <Reveal key={paragraph} from="right" delay={index * 120}>
                  <p
                    className={
                      index === 0
                        ? "text-xl font-semibold leading-relaxed text-stone-900 lg:text-2xl"
                        : "text-base leading-relaxed text-stone-600 lg:text-lg"
                    }
                  >
                    {renderInline(paragraph)}
                  </p>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

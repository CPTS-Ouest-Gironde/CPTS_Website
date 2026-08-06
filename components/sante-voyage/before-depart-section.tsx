import { CheckCircle2, Pill, ShieldCheck } from "lucide-react";

import data from "@/app/data/sante-voyage.json";
import { EditorialImage } from "@/components/sante-voyage/editorial-image";
import { Reveal } from "@/components/sante-voyage/reveal";
import { TravelChecklist } from "@/components/sante-voyage/travel-checklist";

import {
  AlertBanner,
  ChapterHeading,
  displayFont,
  handFont,
  renderInline,
} from "./article-ui";

export function BeforeDepartureSection() {
  return (
    <section id="avant-le-depart" className="scroll-mt-32 py-14 lg:py-20">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <Reveal>
            <ChapterHeading
              num="01"
              label="Étape n°1"
              title={data.avantDepart.title}
            />
          </Reveal>

          <div className="mb-12 grid grid-cols-1 gap-6 lg:grid-cols-[auto_1fr] lg:gap-10">
            <Reveal from="left">
              <div className="flex flex-col items-center justify-center rounded-3xl bg-stone-900 p-8 text-center text-amber-50 rotate-[-1deg] lg:w-56 lg:p-10">
                <span
                  className={`${displayFont.className} text-5xl leading-none text-amber-400 lg:text-6xl`}
                >
                  4-8
                </span>
                <span className={`${handFont.className} mt-2 text-2xl`}>
                  semaines avant
                </span>
                <span className="mt-1 text-xs tracking-widest uppercase opacity-70">
                  le départ
                </span>
              </div>
            </Reveal>
            <Reveal from="right" delay={100}>
              <div>
                <h3
                  className={`${displayFont.className} mb-3 text-lg text-stone-900 uppercase lg:text-xl`}
                >
                  {data.avantDepart.consultation.title}
                </h3>
                <p className="mb-4 leading-relaxed text-stone-600">
                  {renderInline(data.avantDepart.consultation.lead)}
                </p>
                <ul className="mb-4 flex flex-wrap gap-2">
                  {data.avantDepart.consultation.publics.map((publicName) => (
                    <li
                      key={publicName}
                      className="rounded-full border border-amber-300 bg-amber-100 px-3.5 py-1.5 text-sm font-medium text-stone-800"
                    >
                      {publicName}
                    </li>
                  ))}
                </ul>
                <p className="text-sm leading-relaxed text-stone-600 lg:text-base">
                  {data.avantDepart.consultation.outro}
                </p>
              </div>
            </Reveal>
          </div>

          <Reveal>
            <div className="mb-12 overflow-hidden rounded-[2rem] border-2 border-dashed border-stone-300 bg-white/70 p-3">
              <div className="grid items-stretch gap-3 lg:grid-cols-[0.9fr_1.1fr]">
                <EditorialImage
                  src={data.images.couverture.src}
                  alt={data.images.couverture.alt}
                  label={data.images.couverture.label}
                  desktopFill
                  objectPosition="center"
                  sizes="(max-width: 1024px) 100vw, 430px"
                />
                <div className="p-4 lg:p-7">
                  <div className="mb-5 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-400 text-stone-900">
                      <ShieldCheck className="h-5 w-5" />
                    </div>
                    <h3
                      className={`${displayFont.className} text-lg text-stone-900 uppercase lg:text-xl`}
                    >
                      {data.avantDepart.couverture.title}
                    </h3>
                  </div>
                  <ul className="space-y-3">
                    {data.avantDepart.couverture.bullets.map((bullet) => (
                      <li
                        key={bullet}
                        className="flex items-start gap-3 text-sm leading-relaxed text-stone-600 lg:text-base"
                      >
                        <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-500" />
                        <span>{renderInline(bullet)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal>
            <div className="mb-4">
              <h3
                className={`${displayFont.className} mb-2 text-lg text-stone-900 uppercase lg:text-xl`}
              >
                {data.avantDepart.trousse.title}
              </h3>
              <p className="mb-6 text-sm text-stone-600 lg:text-base">
                {data.avantDepart.trousse.subtitle}
              </p>
              <div className="mb-8">
                <EditorialImage
                  src={data.images.medicaments.src}
                  alt={data.images.medicaments.alt}
                  label={data.images.medicaments.label}
                  objectPosition="center 58%"
                />
              </div>
              <TravelChecklist groups={data.avantDepart.trousse.groups} />

              {/* Conseil pharmacien : clôture la liste de la trousse */}
              <div className="mt-5 flex items-start gap-3 rounded-2xl border border-amber-300 bg-amber-100/70 p-5">
                <Pill className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-600" />
                <p className="text-sm leading-relaxed font-semibold text-stone-800 lg:text-base">
                  {data.avantDepart.trousse.pharmacien}
                </p>
              </div>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <AlertBanner tone="warning" title="Attention">
              <p>{data.avantDepart.trousse.warning}</p>
              <p className="mt-3">{data.avantDepart.trousse.remboursement}</p>
            </AlertBanner>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

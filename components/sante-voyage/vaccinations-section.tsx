import { CheckCircle2, Stamp, Syringe } from "lucide-react";

import data from "@/app/data/sante-voyage.json";
import { EditorialImage } from "@/components/sante-voyage/editorial-image";
import { Reveal } from "@/components/sante-voyage/reveal";

import {
  AlertBanner,
  ChapterHeading,
  displayFont,
  handFont,
  renderInline,
} from "./article-ui";

function RoutineVaccines() {
  const section = data.vaccinations.calendrier;

  return (
    <Reveal>
      <div className="mb-12">
        <div className="mb-4 flex items-center gap-3">
          <span
            className={`${displayFont.className} flex h-9 w-9 items-center justify-center rounded-full bg-stone-900 text-amber-400`}
          >
            {section.badge}
          </span>
          <h3
            className={`${displayFont.className} text-lg text-stone-900 uppercase lg:text-xl`}
          >
            {section.title}
          </h3>
        </div>
        <p className="mb-6 leading-relaxed text-stone-600">{section.lead}</p>
        <ul className="mb-6 flex flex-wrap gap-3 lg:gap-4">
          {section.vaccins.map((vaccine, index) => (
            <li
              key={vaccine}
              className={`${handFont.className} rounded-lg border-2 border-stone-900/70 bg-white/60 px-4 py-1.5 text-lg text-stone-800 lg:text-xl ${
                index % 2 === 0 ? "rotate-2" : "-rotate-2"
              }`}
            >
              <Stamp
                className="mr-1.5 -mt-1 inline-block h-4 w-4 text-amber-600"
                aria-hidden
              />
              {vaccine}
            </li>
          ))}
        </ul>
        <p className="mb-5 text-sm text-stone-600 lg:text-base">
          {section.note}
        </p>
        <AlertBanner tone="warning" title="Rougeole : vigilance">
          <p>{renderInline(section.alerte, "font-bold text-amber-400")}</p>
        </AlertBanner>
      </div>
    </Reveal>
  );
}

function RecommendedVaccines() {
  const section = data.vaccinations.recommandees;

  return (
    <div className="mb-12">
      <Reveal>
        <div className="mb-6 flex items-center gap-3">
          <span
            className={`${displayFont.className} flex h-9 w-9 items-center justify-center rounded-full bg-stone-900 text-amber-400`}
          >
            {section.badge}
          </span>
          <h3
            className={`${displayFont.className} text-lg text-stone-900 uppercase lg:text-xl`}
          >
            {section.title}
          </h3>
        </div>
      </Reveal>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {section.vaccins.map((vaccine, index) => (
          <Reveal
            key={vaccine.name}
            delay={(index % 2) * 100}
            from={index % 2 === 0 ? "left" : "right"}
          >
            <div className="h-full rounded-2xl border border-amber-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
              <div className="mb-3 flex items-center gap-2.5">
                <Syringe
                  className="h-4 w-4 flex-shrink-0 text-amber-600"
                  aria-hidden
                />
                <h4
                  className={`${displayFont.className} text-sm tracking-wide text-stone-900 uppercase`}
                >
                  {vaccine.name}
                </h4>
              </div>
              {vaccine.paragraphs?.map((paragraph) => (
                <p
                  key={paragraph}
                  className="mb-2 text-sm leading-relaxed text-stone-600"
                >
                  {renderInline(paragraph)}
                </p>
              ))}
              {vaccine.bullets ? (
                <ul className="mb-2 space-y-1.5">
                  {vaccine.bullets.map((bullet) => (
                    <li
                      key={bullet}
                      className="flex items-start gap-2 text-sm leading-relaxed text-stone-600"
                    >
                      <span
                        aria-hidden
                        className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-amber-500"
                      />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
              {vaccine.extra?.map((paragraph) => (
                <p
                  key={paragraph}
                  className="mb-2 text-sm leading-relaxed text-stone-600"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}

function RequiredVaccines() {
  const section = data.vaccinations.obligatoires;

  return (
    <Reveal>
      <div className="relative overflow-hidden rounded-3xl bg-stone-900 p-7 text-amber-50 lg:p-10">
        <span
          aria-hidden
          className={`${displayFont.className} pointer-events-none absolute -right-4 -bottom-6 text-[8rem] text-amber-400/10 uppercase select-none`}
        >
          C
        </span>
        <div className="relative mb-4 flex items-center gap-3">
          <span
            className={`${displayFont.className} flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-amber-400 text-stone-900`}
          >
            {section.badge}
          </span>
          <h3
            className={`${displayFont.className} text-lg uppercase lg:text-xl`}
          >
            {section.title}
          </h3>
        </div>
        <div className="relative">
          <span
            className={`${handFont.className} mb-3 inline-block -rotate-2 text-3xl text-amber-400`}
          >
            {section.vaccin.name}
          </span>
          <p className="mb-4 leading-relaxed opacity-90">
            {renderInline(section.vaccin.lead, "font-bold text-amber-400")}
          </p>
          <ul className="mb-4 space-y-2">
            {section.vaccin.bullets.map((bullet) => (
              <li
                key={bullet}
                className="flex items-start gap-3 leading-relaxed opacity-90"
              >
                <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-400" />
                <span>{bullet}</span>
              </li>
            ))}
          </ul>
          <p className="leading-relaxed opacity-90">
            {renderInline(section.vaccin.outro, "font-bold text-amber-400")}
          </p>
        </div>
      </div>
    </Reveal>
  );
}

export function VaccinationsSection() {
  return (
    <section
      id="vaccinations"
      className="scroll-mt-32 bg-amber-100/60 py-14 lg:py-20"
    >
      <div className="container mx-auto px-4 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <Reveal>
            <ChapterHeading
              num="02"
              label="Étape n°2"
              title={data.vaccinations.title}
            />
          </Reveal>

          <Reveal>
            <p className="mb-4 max-w-3xl text-base leading-relaxed text-stone-600 lg:text-lg">
              {renderInline(data.vaccinations.lead)}
            </p>
            <ul className="mb-8 flex flex-wrap gap-2">
              {data.vaccinations.criteria.map((criterion) => (
                <li
                  key={criterion}
                  className="rounded-full border border-stone-300 bg-white px-3.5 py-1.5 text-sm font-medium text-stone-700"
                >
                  {criterion}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal from="right">
            <div className="mb-12">
              <EditorialImage
                src={data.images.vaccination.src}
                alt={data.images.vaccination.alt}
                label={data.images.vaccination.label}
                objectPosition="center 55%"
              />
            </div>
          </Reveal>

          <RoutineVaccines />
          <RecommendedVaccines />
          <RequiredVaccines />
        </div>
      </div>
    </section>
  );
}

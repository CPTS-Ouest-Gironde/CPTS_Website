import { Bug, CheckCircle2, Droplets, Rat } from "lucide-react";

import data from "@/app/data/sante-voyage.json";
import { EditorialImage } from "@/components/sante-voyage/editorial-image";
import { Reveal } from "@/components/sante-voyage/reveal";

import {
  AlertBanner,
  displayFont,
  handFont,
  renderInline,
} from "./article-ui";

export function MosquitoAndRodentAdvice() {
  return (
    <>
      <div>
        <Reveal>
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-400 text-stone-900">
              <Bug className="h-5 w-5" />
            </div>
            <h3
              className={`${displayFont.className} text-lg text-stone-900 uppercase lg:text-xl`}
            >
              {data.pendant.moustiques.title}
            </h3>
          </div>
          <p className="mb-4 leading-relaxed text-stone-600">
            {data.pendant.moustiques.lead}
          </p>
          <ul className="mb-5 flex flex-wrap gap-2">
            {data.pendant.moustiques.maladies.map((disease) => (
              <li
                key={disease}
                className={`${displayFont.className} rounded-lg bg-stone-900 px-3.5 py-2 text-xs tracking-wide text-amber-400 uppercase`}
              >
                {disease}
              </li>
            ))}
          </ul>
          <p className="mb-4 leading-relaxed text-stone-600">
            {data.pendant.moustiques.transition}
          </p>
          <ul className="mb-6 space-y-2.5">
            {data.pendant.moustiques.mesures.map((measure) => (
              <li
                key={measure}
                className="flex items-start gap-3 leading-relaxed text-stone-600"
              >
                <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-500" />
                <span>{measure}</span>
              </li>
            ))}
          </ul>
        </Reveal>
        <Reveal delay={100}>
          <AlertBanner tone="warning" title="Attention">
            <p>{data.pendant.moustiques.attention}</p>
          </AlertBanner>
        </Reveal>

        <Reveal delay={150}>
          <div className="mt-8 rounded-3xl border-2 border-dashed border-stone-300 bg-white/70 p-6 lg:p-8">
            <h4
              className={`${displayFont.className} mb-3 text-base text-stone-900 uppercase lg:text-lg`}
            >
              {data.pendant.moustiques.paludisme.title}
            </h4>
            <p className="mb-4 leading-relaxed text-stone-600">
              {data.pendant.moustiques.paludisme.lead}
            </p>
            <ol className="mb-4 space-y-3">
              {data.pendant.moustiques.paludisme.mesures.map(
                (measure, index) => (
                  <li
                    key={measure}
                    className="flex items-start gap-3 leading-relaxed text-stone-700"
                  >
                    <span
                      className={`${displayFont.className} flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-amber-400 text-xs text-stone-900`}
                    >
                      {index + 1}
                    </span>
                    <span className="pt-0.5">{measure}</span>
                  </li>
                ),
              )}
            </ol>
            <p className="mb-6 leading-relaxed text-stone-600">
              {data.pendant.moustiques.paludisme.outro}
            </p>
            <AlertBanner tone="danger" title="Urgence médicale">
              <p>
                {renderInline(
                  data.pendant.moustiques.paludisme.alerte,
                  "font-bold text-white",
                )}
              </p>
            </AlertBanner>
          </div>
        </Reveal>
      </div>

      <Reveal>
        <div>
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-400 text-stone-900">
              <Rat className="h-5 w-5" />
            </div>
            <h3
              className={`${displayFont.className} text-lg text-stone-900 uppercase lg:text-xl`}
            >
              {data.pendant.rongeurs.title}
            </h3>
          </div>
          <div className="space-y-3">
            {data.pendant.rongeurs.paragraphs.map((paragraph) => (
              <p key={paragraph} className="leading-relaxed text-stone-600">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </Reveal>
    </>
  );
}

export function FoodAndWaterAdvice() {
  return (
    <div>
      <Reveal>
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-400 text-stone-900">
            <Droplets className="h-5 w-5" />
          </div>
          <h3
            className={`${displayFont.className} text-lg text-stone-900 uppercase lg:text-xl`}
          >
            {data.pendant.eau.title}
          </h3>
        </div>
        <p className="mb-4 leading-relaxed text-stone-600">
          {data.pendant.eau.lead}
        </p>
        <ul className="mb-8 space-y-2.5">
          {data.pendant.eau.regles.map((rule) => (
            <li
              key={rule}
              className="flex items-start gap-3 leading-relaxed text-stone-600"
            >
              <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-500" />
              <span>{rule}</span>
            </li>
          ))}
        </ul>
        <div className="mb-8">
          <EditorialImage
            src={data.images.eau.src}
            alt={data.images.eau.alt}
            label={data.images.eau.label}
            objectPosition="center 42%"
          />
        </div>
      </Reveal>

      <Reveal delay={100}>
        <div className="mb-6 rounded-3xl border-2 border-dashed border-stone-300 bg-white/70 p-6 lg:p-8">
          <h4
            className={`${displayFont.className} mb-2 text-base text-stone-900 uppercase lg:text-lg`}
          >
            {data.pendant.eau.assainir.title}
          </h4>
          <p className="mb-6 font-semibold leading-relaxed text-stone-700">
            {data.pendant.eau.assainir.lead}
          </p>
          <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            {data.pendant.eau.assainir.methodes.map((method, index) => (
              <div
                key={method.title}
                className="rounded-2xl border border-amber-200 bg-amber-50 p-5"
              >
                <div className="mb-2 flex items-center gap-2.5">
                  <span
                    className={`${displayFont.className} flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-stone-900 text-xs text-amber-400`}
                  >
                    {index + 1}
                  </span>
                  <h5 className="text-sm font-bold text-stone-900">
                    {method.title}
                  </h5>
                </div>
                <p className="text-sm leading-relaxed text-stone-600">
                  {method.text}
                </p>
              </div>
            ))}
          </div>
          <p className="mb-6 text-sm leading-relaxed text-stone-600">
            <span className="font-bold text-stone-900">À éviter : </span>
            {data.pendant.eau.assainir.aEviter}
          </p>
          <div className="rounded-2xl bg-amber-400 p-6 text-center rotate-[-0.5deg]">
            <p className={`${handFont.className} mb-1 text-lg text-stone-800`}>
              Règle d&apos;or
            </p>
            <p
              className={`${displayFont.className} text-xl leading-snug text-stone-900 uppercase lg:text-3xl`}
            >
              « {data.pendant.eau.assainir.regleOr} »
            </p>
            <p className="mt-2 text-sm text-stone-800/80">
              {data.pendant.eau.assainir.regleOrNote}
            </p>
          </div>
        </div>
      </Reveal>

      <Reveal delay={150}>
        <p className="mb-3 leading-relaxed text-stone-600">
          {data.pendant.eau.reduit.lead}
        </p>
        <ul className="flex flex-wrap gap-2">
          {data.pendant.eau.reduit.maladies.map((disease) => (
            <li
              key={disease}
              className="rounded-full border border-amber-300 bg-amber-100 px-3.5 py-1.5 text-sm font-medium text-stone-800"
            >
              {disease}
            </li>
          ))}
        </ul>
      </Reveal>
    </div>
  );
}

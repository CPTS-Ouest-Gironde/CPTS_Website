import { Moon, Mountain, Plane } from "lucide-react";

import data from "@/app/data/sante-voyage.json";
import { EditorialImage } from "@/components/sante-voyage/editorial-image";
import { Reveal } from "@/components/sante-voyage/reveal";

import {
  AlertBanner,
  displayFont,
  handFont,
  renderInline,
} from "./article-ui";

export function PhlebitisAdvice() {
  return (
    <div>
      <Reveal>
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-400 text-stone-900">
            <Plane className="h-5 w-5" />
          </div>
          <h3
            className={`${displayFont.className} text-lg text-stone-900 uppercase lg:text-xl`}
          >
            {data.pendant.phlebite.title}
          </h3>
        </div>
        <p className="mb-6 leading-relaxed text-stone-600">
          {data.pendant.phlebite.lead}
        </p>
      </Reveal>
      <div className="mb-6 grid items-stretch gap-5 lg:grid-cols-[0.68fr_1.32fr]">
        <Reveal from="left">
          <EditorialImage
            src={data.images.phlebite.src}
            alt={data.images.phlebite.alt}
            label={data.images.phlebite.label}
            portrait
            objectPosition="center 48%"
            sizes="(max-width: 1024px) 100vw, 360px"
          />
        </Reveal>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {data.pendant.phlebite.conseils.map((advice, index) => (
            <Reveal key={advice.title} delay={(index % 2) * 100}>
              <div className="h-full rounded-2xl border border-amber-200 bg-white p-5 shadow-sm">
                <h4 className="mb-1.5 text-sm font-bold text-stone-900">
                  {advice.title}
                </h4>
                <p className="text-sm leading-relaxed text-stone-600">
                  {advice.text}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
      <Reveal delay={100}>
        <AlertBanner tone="danger" title="Signes d'alerte">
          <p>{data.pendant.phlebite.alerte}</p>
        </AlertBanner>
      </Reveal>
    </div>
  );
}

export function AltitudeAdvice() {
  return (
    <div>
      <Reveal>
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-400 text-stone-900">
            <Mountain className="h-5 w-5" />
          </div>
          <h3
            className={`${displayFont.className} text-lg text-stone-900 uppercase lg:text-xl`}
          >
            {data.pendant.mam.title}
          </h3>
        </div>
        <p className="mb-6 leading-relaxed text-stone-600">
          {data.pendant.mam.lead}
        </p>
        <div className="mb-8">
          <EditorialImage
            src={data.images.montagne.src}
            alt={data.images.montagne.alt}
            label={data.images.montagne.label}
            objectPosition="center 48%"
          />
        </div>
      </Reveal>
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        {data.pendant.mam.conseils.map((advice, index) => (
          <Reveal key={advice.title} delay={(index % 2) * 100}>
            <div className="h-full rounded-2xl border border-amber-200 bg-white p-5 shadow-sm">
              <h4 className="mb-1.5 text-sm font-bold text-stone-900">
                {advice.title}
              </h4>
              <p className="text-sm leading-relaxed text-stone-600">
                {advice.text}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
      <Reveal delay={100}>
        <div className="rounded-2xl bg-amber-400 p-6">
          <p className={`${handFont.className} mb-1 text-lg text-stone-800`}>
            À retenir
          </p>
          <p className="font-bold leading-relaxed text-stone-900">
            {data.pendant.mam.aRetenir}
          </p>
        </div>
      </Reveal>
    </div>
  );
}

export function JetLagAdvice() {
  return (
    <div>
      <Reveal>
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-400 text-stone-900">
            <Moon className="h-5 w-5" />
          </div>
          <h3
            className={`${displayFont.className} text-lg text-stone-900 uppercase lg:text-xl`}
          >
            {data.pendant.jetlag.title}
          </h3>
        </div>
        <p className="mb-6 leading-relaxed text-stone-600">
          {data.pendant.jetlag.lead}
        </p>
        <div className="mb-8">
          <EditorialImage
            src={data.images.jetlag.src}
            alt={data.images.jetlag.alt}
            label={data.images.jetlag.label}
            objectPosition="center 45%"
          />
        </div>
      </Reveal>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {data.pendant.jetlag.phases.map((phase, index) => (
          <Reveal key={phase.title} delay={index * 120}>
            <div className="relative h-full overflow-hidden rounded-2xl bg-stone-900 p-6 text-amber-50">
              <span
                aria-hidden
                className={`${displayFont.className} pointer-events-none absolute -top-4 -right-2 text-[5rem] text-amber-400/10 select-none`}
              >
                {index + 1}
              </span>
              <h4
                className={`${handFont.className} relative mb-4 text-2xl text-amber-400`}
              >
                {phase.title}
              </h4>
              <ul className="relative space-y-3">
                {phase.conseils.map((advice) => (
                  <li
                    key={advice}
                    className="text-sm leading-relaxed opacity-90"
                  >
                    {renderInline(advice, "font-bold text-amber-400")}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}

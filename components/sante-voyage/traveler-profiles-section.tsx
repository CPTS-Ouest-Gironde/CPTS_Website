import Link from "next/link";
import {
  ArrowLeft,
  Baby,
  HeartPulse,
  Plane,
  Users,
  type LucideIcon,
} from "lucide-react";

import data from "@/app/data/sante-voyage.json";
import { EditorialImage } from "@/components/sante-voyage/editorial-image";
import { Reveal } from "@/components/sante-voyage/reveal";

import {
  ChapterHeading,
  handFont,
  renderInline,
} from "./article-ui";

const profileIcons: Record<string, LucideIcon> = {
  Baby,
  Users,
  HeartPulse,
};

export function TravelerProfilesSection() {
  return (
    <section
      id="profils"
      className="scroll-mt-32 bg-amber-100/60 py-14 lg:py-20"
    >
      <div className="container mx-auto px-4 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <Reveal>
            <ChapterHeading
              num="04"
              label="Étape n°4"
              title={data.profils.title}
            />
          </Reveal>
          <div className="grid items-start gap-6 lg:grid-cols-[0.78fr_1.22fr]">
            <Reveal from="left">
              <EditorialImage
                src={data.images.senior.src}
                alt={data.images.senior.alt}
                label={data.images.senior.label}
                portrait
                objectPosition="center 62%"
                sizes="(max-width: 1024px) 100vw, 410px"
              />
            </Reveal>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {data.profils.items.map((item, index) => {
                const Icon = profileIcons[item.iconName] ?? Users;

                return (
                  <Reveal
                    key={item.title}
                    delay={index * 120}
                    className={
                      index === data.profils.items.length - 1
                        ? "sm:col-span-2"
                        : undefined
                    }
                  >
                    <div className="h-full rounded-3xl border border-amber-200 bg-white p-6 shadow-sm lg:p-7">
                      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-400 text-stone-900">
                        <Icon className="h-6 w-6" />
                      </div>
                      <h3 className="mb-3 text-base leading-snug font-bold text-stone-900">
                        {item.title}
                      </h3>
                      {item.lead ? (
                        <p className="mb-3 text-sm leading-relaxed text-stone-600">
                          {item.lead}
                        </p>
                      ) : null}
                      {item.bullets ? (
                        <ul className="mb-3 space-y-1.5">
                          {item.bullets.map((bullet) => (
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
                      {item.paragraphs?.map((paragraph) => (
                        <p
                          key={paragraph}
                          className="mb-2 text-sm leading-relaxed text-stone-600"
                        >
                          {renderInline(paragraph)}
                        </p>
                      ))}
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function TravelArticleFooter() {
  return (
    <section className="bg-stone-900 py-14 text-amber-50 lg:py-20">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <Reveal>
            <Plane
              className="mx-auto mb-5 h-8 w-8 rotate-45 text-amber-400"
              aria-hidden
            />
            <p
              className={`${handFont.className} mb-4 text-2xl text-amber-400 lg:text-3xl`}
            >
              Bon voyage, et bonne santé !
            </p>
            <p className="mb-8 text-sm leading-relaxed opacity-80 lg:text-base">
              Source : {data.source}
            </p>
            <Link
              href={data.backLink.href}
              className="inline-flex items-center gap-2 rounded-full bg-amber-400 px-6 py-3 text-sm font-bold text-stone-900 transition-colors hover:bg-amber-300"
            >
              <ArrowLeft className="h-4 w-4" />
              {data.backLink.label}
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

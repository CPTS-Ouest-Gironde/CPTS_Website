import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  ExternalLink,
  CheckCircle2,
  Syringe,
  ShieldCheck,
  HelpCircle,
  Target,
} from "lucide-react";
import type { CSSProperties, ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import data from "@/app/data/vaccination-papillomavirus-campagne-scolaire-2026.json";
import { ArticleToc } from "@/components/papillomavirus-article/article-toc";

/**
 * Palette dérivée du fond de la photo de l'article (sable chaud #C8A878).
 * Le sable porte tout l'habillage ; l'argile isole le bloc « haut risque ».
 */
const palette = {
  "--sand-50": "#FBF7F1",
  "--sand-100": "#F7EFE3",
  "--sand-150": "#F3EADB",
  "--sand-200": "#EADCC7",
  "--sand-300": "#DCC7A6",
  "--sand-400": "#C8A878",
  "--sand-600": "#9A7440",
  "--sand-700": "#8A5F2A",
  "--sand-800": "#6B4E2B",
  "--sand-900": "#3D2C18",
  "--clay-50": "#FBF1EC",
  "--clay-100": "#F7E4DC",
  "--clay-200": "#EBD0C5",
  "--clay-700": "#8C3F26",
  "--clay-800": "#7A3A24",
} as CSSProperties;

type Figure = { value: string; label: string; unit?: string };

type Stat = { value: string; unit: string; scope: string; note?: string };

type Pathologie = { nom: string; description: string; stat?: Stat };

type Groupe = {
  id: string;
  label: string;
  types: string;
  tone: string;
  resume: string;
  pathologies: Pathologie[];
};

type Section = {
  id: string;
  navLabel: string;
  title: string;
  icon: string;
  content: string[];
  items?: string[];
  groupes?: Groupe[];
  repartition?: { title: string; intro: string; figures: Figure[]; note: string };
  couverture?: {
    title: string;
    items: { label: string; value: number; display: string }[];
    objectif: { value: number; display: string; label: string };
    note: string;
  };
  illustration?: { image: string; alt: string };
  schemaVaccinal?: {
    title: string;
    vaccines: {
      name: string;
      intro?: string;
      doses: string[];
      note?: string;
      nouveauNote?: string;
    }[];
  };
  encadreSecondaire?: string;
  media?: {
    image: string;
    alt: string;
    linkUrl: string;
    linkLabel: string;
    linkSource?: string;
  };
};

const sections = data.sections as Section[];

/** Les questions illustrées alternent le côté de leur photo. */
const illustratedIds = sections.filter((s) => s.illustration).map((s) => s.id);

const sectionIcons: Record<string, LucideIcon> = {
  shield: ShieldCheck,
  syringe: Syringe,
  help: HelpCircle,
  target: Target,
};

/** Espace fine insécable U+202F, en échappement pour rester visible en relecture. */
const NNBSP = "\u202F";

/**
 * Typographie française : espace fine insécable avant la ponctuation double,
 * après « et avant », pour éviter les signes orphelins en fin de ligne.
 */
function fr(text: string): string {
  return text
    .replace(/\s+([?!;:%])/g, `${NNBSP}$1`)
    .replace(/«\s+/g, `«${NNBSP}`)
    .replace(/\s+»/g, `${NNBSP}»`);
}

function RichText({ text }: { text: string }) {
  const parts = fr(text).split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((part, i) =>
        part.startsWith("**") && part.endsWith("**") ? (
          <strong key={i} className="font-semibold text-[var(--sand-900)]">
            {part.slice(2, -2)}
          </strong>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}

/** Titre de question : pas de carte, une pastille d'icône et le titre. */
function QuestionHeading({ section }: { section: Section }) {
  const Icon = sectionIcons[section.icon] ?? ShieldCheck;
  return (
    <div className="mb-5 flex items-start gap-3">
      <span className="mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-[var(--sand-200)]">
        <Icon className="h-[18px] w-[18px] text-[var(--sand-700)]" />
      </span>
      <h2 className="pt-1 text-xl font-bold leading-snug text-[var(--sand-800)] lg:text-[1.6rem]">
        {fr(section.title)}
      </h2>
    </div>
  );
}

function Paragraphs({ items }: { items: string[] }) {
  return (
    <>
      {items.map((p, i) => (
        <p
          key={i}
          className="text-[15px] leading-[1.75] text-[var(--sand-900)]/80 lg:text-base"
        >
          <RichText text={p} />
        </p>
      ))}
    </>
  );
}

function CheckList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2 pt-1">
      {items.map((item, i) => (
        <li
          key={i}
          className="flex items-start gap-3 text-[15px] leading-[1.7] text-[var(--sand-900)]/80"
        >
          <CheckCircle2 className="mt-1 h-4 w-4 flex-shrink-0 text-[var(--sand-600)]" />
          <span>
            <RichText text={item} />
          </span>
        </li>
      ))}
    </ul>
  );
}

/** Enveloppe d'une question : filet de séparation et ancre. */
function Question({ id, children }: { id: string; children: ReactNode }) {
  return (
    <section
      id={id}
      className="scroll-mt-28 border-t border-[var(--sand-200)] pt-10 first:border-t-0 first:pt-0"
    >
      {children}
    </section>
  );
}

/** Tuile de statistique : filet, valeur en grand, unité puis libellé. */
function StatTile({ figure, tone = "sand" }: { figure: Figure; tone?: "sand" | "clay" }) {
  const c =
    tone === "clay"
      ? { border: "border-[var(--clay-200)]", rule: "bg-[var(--clay-700)]", value: "text-[var(--clay-800)]" }
      : { border: "border-[var(--sand-300)]", rule: "bg-[var(--sand-600)]", value: "text-[var(--sand-800)]" };

  return (
    <div className={`rounded-2xl border ${c.border} bg-white/70 p-5`}>
      <div className={`mb-3 h-0.5 w-8 rounded-full ${c.rule}`} />
      <p className={`text-2xl font-semibold tracking-tight lg:text-3xl ${c.value}`}>
        {fr(figure.value)}
      </p>
      {figure.unit && (
        <p className="mt-1 text-sm text-[var(--sand-900)]/60">{fr(figure.unit)}</p>
      )}
      <p className="mt-2 text-sm font-medium leading-snug text-[var(--sand-900)]">
        {fr(figure.label)}
      </p>
    </div>
  );
}

/** Encart chiffré rattaché à une pathologie. */
function StatNote({ stat, tone }: { stat: Stat; tone: string }) {
  const c =
    tone === "amber"
      ? { bg: "bg-[var(--sand-150)]", border: "border-[var(--sand-300)]", value: "text-[var(--sand-800)]", chip: "bg-[var(--sand-300)] text-[var(--sand-900)]" }
      : { bg: "bg-[var(--clay-100)]", border: "border-[var(--clay-200)]", value: "text-[var(--clay-800)]", chip: "bg-[var(--clay-200)] text-[var(--clay-800)]" };

  return (
    <div className={`mt-3 rounded-xl border ${c.border} ${c.bg} px-4 py-3`}>
      <span className={`inline-block rounded-full ${c.chip} px-2.5 py-0.5 text-xs font-semibold`}>
        {fr(stat.scope)}
      </span>
      <p className="mt-2 flex flex-wrap items-baseline gap-x-2">
        <span className={`text-2xl font-semibold tracking-tight ${c.value}`}>
          {fr(stat.value)}
        </span>
        <span className="text-sm text-[var(--sand-900)]/70">{fr(stat.unit)}</span>
      </p>
      {stat.note && (
        <p className="mt-1.5 text-sm leading-relaxed text-[var(--sand-900)]/75">
          {fr(stat.note)}
        </p>
      )}
    </div>
  );
}

/** Jauge de couverture vaccinale, avec repère de l'objectif national. */
function CouvertureMeter({
  couverture,
}: {
  couverture: NonNullable<Section["couverture"]>;
}) {
  return (
    <div className="mt-6 rounded-3xl border border-[var(--sand-200)] bg-white/70 p-6 lg:p-7">
      <div className="mb-6 flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="text-base font-semibold text-[var(--sand-800)]">
          {fr(couverture.title)}
        </h3>
        <p className="text-sm text-[var(--sand-900)]/60">
          Repère : {fr(couverture.objectif.display)}
        </p>
      </div>

      <div className="space-y-6">
        {couverture.items.map((item) => (
          <div key={item.label}>
            <div className="mb-2 flex items-baseline justify-between">
              <span className="text-sm font-medium text-[var(--sand-900)]">
                {fr(item.label)}
              </span>
              <span className="text-xl font-semibold tracking-tight text-[var(--sand-800)]">
                {fr(item.display)}
              </span>
            </div>
            <div className="relative h-3 rounded-full bg-[var(--sand-150)]">
              <div
                className="absolute inset-y-0 left-0 rounded-full bg-[var(--sand-700)]"
                style={{ width: `${item.value}%` }}
              />
              <div
                className="absolute inset-y-[-5px] w-0.5 bg-[var(--sand-900)]"
                style={{ left: `${couverture.objectif.value}%` }}
                aria-hidden="true"
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 flex items-start gap-2.5 border-t border-[var(--sand-200)] pt-4">
        <span
          className="mt-1 h-4 w-0.5 flex-shrink-0 bg-[var(--sand-900)]"
          aria-hidden="true"
        />
        <p className="text-sm leading-relaxed text-[var(--sand-900)]/70">
          {fr(couverture.objectif.label)} : {fr(couverture.objectif.display)}.{" "}
          {fr(couverture.note)}
        </p>
      </div>
    </div>
  );
}

export default function VaccinationPapillomavirusPage() {
  return (
    <main style={palette} className="min-h-screen bg-[var(--sand-50)]">
      <Header />

      {/* Hero — titre à gauche, photo à droite ; pleine largeur sur mobile */}
      <section className="bg-[var(--sand-100)]">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="grid items-center gap-8 pb-10 pt-32 lg:grid-cols-2 lg:gap-14 lg:pb-16">
              <div>
                <Link
                  href={data.backLink.href}
                  className="mb-7 inline-flex items-center gap-2 text-[var(--sand-700)] transition-colors hover:text-[var(--sand-900)]"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>{fr(data.backLink.label)}</span>
                </Link>
                <div className="mb-5 flex items-center gap-2 text-sm text-[var(--sand-800)]">
                  <Calendar className="h-4 w-4 text-[var(--sand-600)]" />
                  <span>{data.date}</span>
                </div>
                <h1 className="text-balance text-3xl font-bold leading-[1.15] text-[var(--sand-900)] lg:text-[2.9rem]">
                  {fr(data.title)}
                </h1>
              </div>

              <div className="relative -mx-4 aspect-[4/3] sm:mx-0 sm:overflow-hidden sm:rounded-[2rem] sm:shadow-lg sm:ring-1 sm:ring-[var(--sand-300)] lg:aspect-[5/4]">
                <Image
                  src={data.image}
                  alt={data.imageAlt}
                  fill
                  className="object-cover"
                  priority
                  quality={75}
                  sizes="(max-width: 1024px) 100vw, 560px"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Chapô — bande pleine largeur, texte plus grand */}
      <section className="border-b border-[var(--sand-200)] bg-[var(--sand-100)]">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="mx-auto max-w-4xl pb-12 pt-2 lg:pb-14">
            <div className="space-y-4">
              {data.intro.paragraphs.map((p, i) => (
                <p
                  key={i}
                  className="text-[17px] leading-[1.7] text-[var(--sand-900)]/85 lg:text-xl"
                >
                  <RichText text={p.text} />
                </p>
              ))}
            </div>
            <div className="mt-8 rounded-2xl bg-[var(--sand-400)] px-6 py-5 text-center">
              <p className="text-base font-bold text-[var(--sand-900)] lg:text-lg">
                {fr(data.intro.banner)}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Corps — sommaire latéral collant + fil de lecture */}
      <div className="container mx-auto px-4 lg:px-8">
        <div className="mx-auto max-w-6xl gap-12 pb-20 pt-12 lg:grid lg:grid-cols-[248px_minmax(0,1fr)] lg:pb-28">

          {/* Sommaire : bandeau défilant sur mobile, colonne collante ensuite */}
          <aside className="mb-10 lg:mb-0">
            <ArticleToc
              items={sections.map((section) => ({
                id: section.id,
                label: fr(section.navLabel),
              }))}
            />
          </aside>

          {/* Fil de lecture */}
          <div className="space-y-10">

            {/* Suite de l'introduction */}
            <div className="space-y-4">
              <Paragraphs items={data.intro.paragraphs2} />
            </div>

            <div className="rounded-3xl border border-[var(--sand-200)] bg-[var(--sand-100)] p-6 lg:p-7">
              <p className="mb-5 font-semibold text-[var(--sand-800)]">
                {fr(data.intro.stats.label)}
              </p>
              <div className="grid grid-cols-2 gap-3 lg:gap-4">
                {data.intro.stats.figures.map((figure, i) => (
                  <StatTile key={i} figure={figure} />
                ))}
              </div>
              <p className="pt-5 text-[15px] leading-[1.75] text-[var(--sand-900)]/80">
                {fr(data.intro.conclusion)}
              </p>
            </div>

            {/* Questions */}
            {sections.map((section) => {

              /* Conséquences : deux familles de HPV + répartition régionale */
              if (section.groupes) {
                return (
                  <Question key={section.id} id={section.id}>
                    <QuestionHeading section={section} />
                    <div className="space-y-4">
                      <Paragraphs items={section.content} />
                    </div>

                    <div className="mt-6 grid items-start gap-4 md:grid-cols-2">
                      {section.groupes.map((groupe) => {
                        const c =
                          groupe.tone === "amber"
                            ? { border: "border-[var(--sand-300)]", bg: "bg-[var(--sand-100)]", head: "text-[var(--sand-800)]", chip: "bg-[var(--sand-300)] text-[var(--sand-900)]", dot: "bg-[var(--sand-600)]" }
                            : { border: "border-[var(--clay-200)]", bg: "bg-[var(--clay-50)]", head: "text-[var(--clay-800)]", chip: "bg-[var(--clay-200)] text-[var(--clay-800)]", dot: "bg-[var(--clay-700)]" };

                        return (
                          <div
                            key={groupe.id}
                            className={`h-full rounded-3xl border ${c.border} ${c.bg} p-5 lg:p-6`}
                          >
                            <span className={`inline-block rounded-full ${c.chip} px-3 py-1 text-xs font-semibold`}>
                              {fr(groupe.types)}
                            </span>
                            <h3 className={`mt-3 text-lg font-bold ${c.head}`}>
                              {fr(groupe.label)}
                            </h3>
                            <p className="mt-2 text-[15px] leading-[1.7] text-[var(--sand-900)]/80">
                              {fr(groupe.resume)}
                            </p>

                            <div className="mt-5 space-y-5">
                              {groupe.pathologies.map((pathologie) => (
                                <div key={pathologie.nom}>
                                  <div className="flex items-start gap-2.5">
                                    <span className={`mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full ${c.dot}`} />
                                    <div>
                                      <p className="font-semibold leading-snug text-[var(--sand-900)]">
                                        {fr(pathologie.nom)}
                                      </p>
                                      <p className="mt-1 text-[15px] leading-[1.7] text-[var(--sand-900)]/80">
                                        {fr(pathologie.description)}
                                      </p>
                                    </div>
                                  </div>
                                  {pathologie.stat && (
                                    <StatNote stat={pathologie.stat} tone={groupe.tone} />
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {section.repartition && (
                      <div className="mt-4 rounded-3xl border border-[var(--clay-200)] bg-[var(--clay-50)] p-6 lg:p-7">
                        <h3 className="text-lg font-bold text-[var(--clay-800)]">
                          {fr(section.repartition.title)}
                        </h3>
                        <p className="mb-5 mt-2 text-[15px] leading-[1.75] text-[var(--sand-900)]/80">
                          {fr(section.repartition.intro)}
                        </p>
                        <div className="grid gap-3 sm:grid-cols-3 lg:gap-4">
                          {section.repartition.figures.map((figure, i) => (
                            <StatTile key={i} figure={figure} tone="clay" />
                          ))}
                        </div>
                        <p className="mt-5 text-sm leading-relaxed text-[var(--sand-900)]/70">
                          {fr(section.repartition.note)}
                        </p>
                      </div>
                    )}
                  </Question>
                );
              }

              /* Depuis quand : schéma vaccinal + encadré réglementaire */
              if (section.schemaVaccinal) {
                return (
                  <Question key={section.id} id={section.id}>
                    <QuestionHeading section={section} />
                    <div className="space-y-4">
                      <Paragraphs items={section.content} />
                    </div>

                    <div className="mt-6 space-y-5 rounded-3xl border border-[var(--sand-300)] bg-white/70 p-6 lg:p-7">
                      <h3 className="text-lg font-bold text-[var(--sand-800)]">
                        {fr(section.schemaVaccinal.title)}
                      </h3>
                      {section.schemaVaccinal.vaccines.map((vaccine, vi) => (
                        <div key={vi} className="space-y-2">
                          <p className="font-bold text-[var(--sand-800)]">{fr(vaccine.name)}</p>
                          {vaccine.intro && (
                            <p className="text-sm italic text-[var(--sand-900)]/70">
                              {fr(vaccine.intro)}
                            </p>
                          )}
                          <ul className="space-y-1.5">
                            {vaccine.doses.map((dose, di) => (
                              <li
                                key={di}
                                className="flex items-start gap-2.5 text-[15px] text-[var(--sand-900)]/85"
                              >
                                <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[var(--sand-400)]" />
                                <span>{fr(dose)}</span>
                              </li>
                            ))}
                          </ul>
                          {vaccine.note && (
                            <p className="mt-2 rounded-xl bg-[var(--sand-150)] px-4 py-2.5 text-sm text-[var(--sand-900)]/80">
                              {fr(vaccine.note)}
                            </p>
                          )}
                          {vaccine.nouveauNote && (
                            <div className="mt-3 flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3">
                              <span className="mt-0.5 inline-flex flex-shrink-0 items-center rounded-full bg-green-600 px-2 py-0.5 text-xs font-bold text-white">
                                NOUVEAU
                              </span>
                              <p className="text-sm leading-relaxed text-green-900">
                                {fr(vaccine.nouveauNote)}
                              </p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {section.encadreSecondaire && (
                      <div className="mt-4 rounded-3xl border border-[var(--sand-400)] bg-[var(--sand-150)] p-6 lg:p-7">
                        <p className="text-[15px] leading-[1.75] text-[var(--sand-900)]/85">
                          {fr(section.encadreSecondaire)}
                        </p>
                      </div>
                    )}
                  </Question>
                );
              }

              /* Objectifs : jauges de couverture vaccinale */
              if (section.couverture) {
                return (
                  <Question key={section.id} id={section.id}>
                    <QuestionHeading section={section} />
                    <div className="space-y-4">
                      <Paragraphs items={section.content} />
                    </div>
                    <CouvertureMeter couverture={section.couverture} />
                  </Question>
                );
              }

              /* Actions : bloc média cliquable */
              if (section.media) {
                return (
                  <Question key={section.id} id={section.id}>
                    <QuestionHeading section={section} />
                    <div className="space-y-4">
                      <Paragraphs items={section.content} />
                    </div>

                    <div className="mt-6 space-y-3">
                      <a
                        href={section.media.linkUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="-mx-4 block overflow-hidden shadow-md transition-shadow hover:shadow-lg sm:mx-0 sm:rounded-3xl"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={section.media.image}
                          alt={section.media.alt}
                          className="h-auto w-full object-cover transition-transform duration-500 hover:scale-105"
                        />
                      </a>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 pt-1">
                        <a
                          href={section.media.linkUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 rounded-full bg-[var(--sand-700)] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[var(--sand-800)]"
                        >
                          {fr(section.media.linkLabel)}
                          <ExternalLink className="h-4 w-4 flex-shrink-0" />
                        </a>
                        {section.media.linkSource && (
                          <span className="text-sm text-[var(--sand-900)]/60">
                            {section.media.linkSource}
                          </span>
                        )}
                      </div>
                    </div>
                  </Question>
                );
              }

              /* Questions illustrées : photo pleine largeur sur mobile,
                 en vis-à-vis alterné sur grand écran */
              if (section.illustration) {
                const imageFirst = illustratedIds.indexOf(section.id) % 2 === 1;
                return (
                  <Question key={section.id} id={section.id}>
                    <div className="grid gap-6 md:grid-cols-2 md:items-center md:gap-8">
                      <div className={imageFirst ? "md:order-2" : undefined}>
                        <QuestionHeading section={section} />
                        <div className="space-y-4">
                          <Paragraphs items={section.content} />
                          {section.items && <CheckList items={section.items} />}
                        </div>
                      </div>
                      <div
                        className={`relative -mx-4 aspect-[4/3] sm:mx-0 sm:overflow-hidden sm:rounded-3xl ${
                          imageFirst ? "md:order-1" : ""
                        }`}
                      >
                        <Image
                          src={section.illustration.image}
                          alt={section.illustration.alt}
                          fill
                          className="object-cover"
                          quality={72}
                          sizes="(max-width: 768px) 100vw, 360px"
                        />
                      </div>
                    </div>
                  </Question>
                );
              }

              /* Questions simples */
              return (
                <Question key={section.id} id={section.id}>
                  <QuestionHeading section={section} />
                  <div className="space-y-4">
                    <Paragraphs items={section.content} />
                    {section.items && <CheckList items={section.items} />}
                  </div>
                </Question>
              );
            })}

          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}

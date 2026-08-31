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
  ListOrdered,
} from "lucide-react";
import type { CSSProperties } from "react";
import type { LucideIcon } from "lucide-react";
import data from "@/app/data/vaccination-papillomavirus-campagne-scolaire-2026.json";

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
  media?: { image: string; alt: string; linkUrl: string; linkLabel: string };
};

const sections = data.sections as Section[];

const sectionIcons: Record<string, LucideIcon> = {
  shield: ShieldCheck,
  syringe: Syringe,
  help: HelpCircle,
  target: Target,
};

const NNBSP = " ";

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

/** Carte de section : même habillage pour les neuf questions. */
function SectionCard({
  children,
  id,
  className = "",
}: {
  children: React.ReactNode;
  id?: string;
  className?: string;
}) {
  return (
    <section
      id={id}
      className={`scroll-mt-28 rounded-3xl border border-[var(--sand-200)] bg-[var(--sand-100)] ${className}`}
    >
      {children}
    </section>
  );
}

function SectionHeading({ section }: { section: Section }) {
  const Icon = sectionIcons[section.icon] ?? ShieldCheck;
  return (
    <div className="flex items-start gap-3 mb-5">
      <span className="mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-[var(--sand-200)]">
        <Icon className="h-[18px] w-[18px] text-[var(--sand-700)]" />
      </span>
      <h2 className="text-xl lg:text-2xl font-bold text-[var(--sand-800)] leading-snug pt-1">
        {fr(section.title)}
      </h2>
    </div>
  );
}

function Paragraphs({ items }: { items: string[] }) {
  return (
    <>
      {items.map((p, i) => (
        <p key={i} className="text-[15px] lg:text-base leading-[1.75] text-[var(--sand-900)]/80">
          <RichText text={p} />
        </p>
      ))}
    </>
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
      <p className={`text-3xl font-semibold tracking-tight ${c.value}`}>{fr(figure.value)}</p>
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
    <div className="rounded-3xl border border-[var(--sand-200)] bg-white/70 p-6 lg:p-7">
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
          {fr(couverture.objectif.label)} : {fr(couverture.objectif.display)}. {fr(couverture.note)}
        </p>
      </div>
    </div>
  );
}

export default function VaccinationPapillomavirusPage() {
  return (
    <main style={palette} className="min-h-screen bg-[var(--sand-50)]">
      <Header />

      {/* Hero — le fond prolonge celui de la photo */}
      <section className="relative overflow-hidden bg-[var(--sand-100)] pt-24 lg:pt-32 pb-12 lg:pb-16">
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-[var(--sand-50)]" />
        <div className="container relative z-10 mx-auto px-4 lg:px-8">
          <div className="mx-auto max-w-5xl">
            <Link
              href={data.backLink.href}
              className="mb-8 inline-flex items-center gap-2 text-[var(--sand-700)] transition-colors hover:text-[var(--sand-900)]"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>{fr(data.backLink.label)}</span>
            </Link>

            <div className="grid items-center gap-8 lg:grid-cols-12 lg:gap-12">
              <div className="lg:col-span-7">
                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[var(--sand-300)] bg-[var(--sand-50)] px-3 py-1 text-sm text-[var(--sand-800)]">
                  <Calendar className="h-4 w-4 text-[var(--sand-600)]" />
                  <span>{data.date}</span>
                </div>
                <h1 className="text-balance text-3xl font-bold leading-tight text-[var(--sand-900)] lg:text-[2.75rem]">
                  {fr(data.title)}
                </h1>
              </div>

              <div className="lg:col-span-5">
                <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-lg ring-1 ring-[var(--sand-300)]">
                  <Image
                    src={data.image}
                    alt={data.imageAlt}
                    fill
                    className="object-cover"
                    priority
                    quality={75}
                    sizes="(max-width: 1024px) 100vw, 460px"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Corps de l'article */}
      <section className="pb-20 pt-10 lg:pb-28">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="mx-auto max-w-3xl space-y-10">

            {/* Chapô */}
            <div className="rounded-3xl border-l-4 border-[var(--sand-400)] bg-white/70 py-6 pl-6 pr-6 lg:pl-8 lg:pr-8 space-y-4">
              {data.intro.paragraphs.map((p, i) => (
                <p
                  key={i}
                  className="text-base leading-[1.75] text-[var(--sand-900)]/85 lg:text-[17px]"
                >
                  <RichText text={p.text} />
                </p>
              ))}
            </div>

            {/* Bandeau — schéma vaccinal simplifié */}
            <div className="rounded-2xl bg-[var(--sand-400)] px-6 py-5 text-center">
              <p className="text-lg font-bold text-[var(--sand-900)]">
                {fr(data.intro.banner)}
              </p>
            </div>

            <div className="space-y-4">
              <Paragraphs items={data.intro.paragraphs2} />
            </div>

            {/* Chiffres méningocoques */}
            <div className="rounded-3xl border border-[var(--sand-200)] bg-[var(--sand-100)] p-6 lg:p-8">
              <p className="mb-5 font-semibold text-[var(--sand-800)]">
                {fr(data.intro.stats.label)}
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                {data.intro.stats.figures.map((figure, i) => (
                  <StatTile key={i} figure={figure} />
                ))}
              </div>
              <p className="pt-5 text-[15px] leading-[1.75] text-[var(--sand-900)]/80 lg:text-base">
                {fr(data.intro.conclusion)}
              </p>
            </div>

            {/* Sommaire */}
            <nav
              aria-label="Sommaire de l'article"
              className="rounded-3xl border border-[var(--sand-300)] bg-white/70 p-6 lg:p-7"
            >
              <div className="mb-4 flex items-center gap-2">
                <ListOrdered className="h-5 w-5 text-[var(--sand-600)]" />
                <h2 className="text-base font-semibold text-[var(--sand-800)]">
                  Les questions abordées
                </h2>
              </div>
              <ol className="grid gap-x-6 gap-y-1 sm:grid-cols-2">
                {sections.map((section, i) => (
                  <li key={section.id}>
                    <a
                      href={`#${section.id}`}
                      className="flex items-baseline gap-3 rounded-lg px-2 py-2 text-sm text-[var(--sand-900)]/75 transition-colors hover:bg-[var(--sand-100)] hover:text-[var(--sand-800)]"
                    >
                      <span className="text-xs font-semibold tabular-nums text-[var(--sand-600)]">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="leading-snug">{fr(section.navLabel)}</span>
                    </a>
                  </li>
                ))}
              </ol>
            </nav>

            {/* Questions */}
            {sections.map((section) => {

              /* Conséquences : deux familles de HPV + répartition régionale */
              if (section.groupes) {
                return (
                  <div key={section.id} id={section.id} className="scroll-mt-28 space-y-5">
                    <SectionCard className="p-6 lg:p-8">
                      <SectionHeading section={section} />
                      <div className="space-y-4">
                        <Paragraphs items={section.content} />
                      </div>
                    </SectionCard>

                    <div className="grid items-start gap-5 lg:grid-cols-2">
                      {section.groupes.map((groupe) => {
                        const c =
                          groupe.tone === "amber"
                            ? { border: "border-[var(--sand-300)]", bg: "bg-[var(--sand-100)]", head: "text-[var(--sand-800)]", chip: "bg-[var(--sand-300)] text-[var(--sand-900)]", dot: "bg-[var(--sand-600)]" }
                            : { border: "border-[var(--clay-200)]", bg: "bg-[var(--clay-50)]", head: "text-[var(--clay-800)]", chip: "bg-[var(--clay-200)] text-[var(--clay-800)]", dot: "bg-[var(--clay-700)]" };

                        return (
                          <div
                            key={groupe.id}
                            className={`h-full rounded-3xl border ${c.border} ${c.bg} p-6`}
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
                      <div className="rounded-3xl border border-[var(--clay-200)] bg-[var(--clay-50)] p-6 lg:p-8">
                        <h3 className="text-lg font-bold text-[var(--clay-800)]">
                          {fr(section.repartition.title)}
                        </h3>
                        <p className="mb-5 mt-2 text-[15px] leading-[1.75] text-[var(--sand-900)]/80">
                          {fr(section.repartition.intro)}
                        </p>
                        <div className="grid gap-4 sm:grid-cols-3">
                          {section.repartition.figures.map((figure, i) => (
                            <StatTile key={i} figure={figure} tone="clay" />
                          ))}
                        </div>
                        <p className="mt-5 text-sm leading-relaxed text-[var(--sand-900)]/70">
                          {fr(section.repartition.note)}
                        </p>
                      </div>
                    )}
                  </div>
                );
              }

              /* Depuis quand : schéma vaccinal + encadré réglementaire */
              if (section.schemaVaccinal) {
                return (
                  <div key={section.id} id={section.id} className="scroll-mt-28 space-y-5">
                    <SectionCard className="p-6 lg:p-8">
                      <SectionHeading section={section} />
                      <div className="space-y-4">
                        <Paragraphs items={section.content} />
                      </div>
                    </SectionCard>

                    <div className="space-y-5 rounded-3xl border border-[var(--sand-300)] bg-white/70 p-6 lg:p-8">
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
                      <div className="rounded-3xl border border-[var(--sand-400)] bg-[var(--sand-150)] p-6 lg:p-8">
                        <p className="text-[15px] leading-[1.75] text-[var(--sand-900)]/85">
                          {fr(section.encadreSecondaire)}
                        </p>
                      </div>
                    )}
                  </div>
                );
              }

              /* Objectifs : jauges de couverture vaccinale */
              if (section.couverture) {
                return (
                  <div key={section.id} id={section.id} className="scroll-mt-28 space-y-5">
                    <SectionCard className="p-6 lg:p-8">
                      <SectionHeading section={section} />
                      <div className="space-y-4">
                        <Paragraphs items={section.content} />
                      </div>
                    </SectionCard>
                    <CouvertureMeter couverture={section.couverture} />
                  </div>
                );
              }

              /* Actions : bloc média cliquable */
              if (section.media) {
                return (
                  <div key={section.id} id={section.id} className="scroll-mt-28 space-y-5">
                    <SectionCard className="p-6 lg:p-8">
                      <SectionHeading section={section} />
                      <div className="space-y-4">
                        <Paragraphs items={section.content} />
                      </div>
                    </SectionCard>

                    <div className="space-y-3">
                      <a
                        href={section.media.linkUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block overflow-hidden rounded-3xl shadow-md transition-shadow hover:shadow-lg"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={section.media.image}
                          alt={section.media.alt}
                          className="h-auto w-full object-cover transition-transform duration-500 hover:scale-105"
                        />
                      </a>
                      <a
                        href={section.media.linkUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 break-all text-sm text-[var(--sand-700)] transition-colors hover:text-[var(--sand-900)]"
                      >
                        <ExternalLink className="h-4 w-4 flex-shrink-0" />
                        <span>{section.media.linkLabel}</span>
                      </a>
                    </div>
                  </div>
                );
              }

              /* Questions illustrées : texte et photo côte à côte */
              if (section.illustration) {
                return (
                  <SectionCard key={section.id} id={section.id} className="overflow-hidden">
                    <div className="grid items-stretch lg:grid-cols-5">
                      <div className="p-6 lg:col-span-3 lg:p-8">
                        <SectionHeading section={section} />
                        <div className="space-y-4">
                          <Paragraphs items={section.content} />
                          {section.items && (
                            <ul className="space-y-2 pt-1">
                              {section.items.map((item, i) => (
                                <li
                                  key={i}
                                  className="flex items-start gap-3 text-[15px] leading-[1.7] text-[var(--sand-900)]/80"
                                >
                                  <CheckCircle2 className="mt-1 h-4 w-4 flex-shrink-0 text-[var(--sand-600)]" />
                                  <span><RichText text={item} /></span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </div>
                      <div className="relative min-h-[240px] lg:col-span-2 lg:min-h-full">
                        <Image
                          src={section.illustration.image}
                          alt={section.illustration.alt}
                          fill
                          className="object-cover"
                          quality={72}
                          sizes="(max-width: 1024px) 100vw, 300px"
                        />
                      </div>
                    </div>
                  </SectionCard>
                );
              }

              /* Questions simples */
              return (
                <SectionCard key={section.id} id={section.id} className="p-6 lg:p-8">
                  <SectionHeading section={section} />
                  <div className="space-y-4">
                    <Paragraphs items={section.content} />
                    {section.items && (
                      <ul className="space-y-2 pt-1">
                        {section.items.map((item, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-3 text-[15px] leading-[1.7] text-[var(--sand-900)]/80"
                          >
                            <CheckCircle2 className="mt-1 h-4 w-4 flex-shrink-0 text-[var(--sand-600)]" />
                            <span><RichText text={item} /></span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </SectionCard>
              );
            })}

          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

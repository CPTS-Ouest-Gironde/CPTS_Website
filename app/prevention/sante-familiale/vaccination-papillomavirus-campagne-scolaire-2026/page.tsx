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
import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import data from "@/app/data/vaccination-papillomavirus-campagne-scolaire-2026.json";

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
  color: string;
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

function RichText({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((part, i) =>
        part.startsWith("**") && part.endsWith("**") ? (
          <strong key={i} className="font-semibold text-foreground">
            {part.slice(2, -2)}
          </strong>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}

const sectionColors: Record<
  string,
  { card: string; title: string; icon: string; chip: string }
> = {
  purple: { card: "border-purple-200 bg-purple-50/30", title: "text-purple-800", icon: "text-purple-500", chip: "hover:border-purple-300 hover:text-purple-800" },
  blue:   { card: "border-blue-200 bg-blue-50/30",     title: "text-blue-800",   icon: "text-blue-500",   chip: "hover:border-blue-300 hover:text-blue-800" },
  red:    { card: "border-red-200 bg-red-50/30",       title: "text-red-800",    icon: "text-red-500",    chip: "hover:border-red-300 hover:text-red-800" },
  amber:  { card: "border-amber-200 bg-amber-50/30",   title: "text-amber-800",  icon: "text-amber-500",  chip: "hover:border-amber-300 hover:text-amber-800" },
  green:  { card: "border-green-200 bg-green-50/30",   title: "text-green-800",  icon: "text-green-500",  chip: "hover:border-green-300 hover:text-green-800" },
  teal:   { card: "border-teal-200 bg-teal-50/30",     title: "text-teal-800",   icon: "text-teal-500",   chip: "hover:border-teal-300 hover:text-teal-800" },
  indigo: { card: "border-indigo-200 bg-indigo-50/30", title: "text-indigo-800", icon: "text-indigo-500", chip: "hover:border-indigo-300 hover:text-indigo-800" },
  orange: { card: "border-orange-200 bg-orange-50/30", title: "text-orange-800", icon: "text-orange-500", chip: "hover:border-orange-300 hover:text-orange-800" },
  sky:    { card: "border-sky-200 bg-sky-50/30",       title: "text-sky-800",    icon: "text-sky-500",    chip: "hover:border-sky-300 hover:text-sky-800" },
};

const sectionIcons: Record<string, LucideIcon> = {
  shield: ShieldCheck,
  syringe: Syringe,
  help: HelpCircle,
  target: Target,
};

/** Tuile de statistique : libellé, valeur en grand, unité. */
function StatTile({
  figure,
  accent,
}: {
  figure: Figure;
  accent: { border: string; rule: string; value: string };
}) {
  return (
    <div className={`rounded-2xl border ${accent.border} bg-card p-5`}>
      <div className={`w-8 h-0.5 rounded-full ${accent.rule} mb-3`} />
      <p className={`text-3xl lg:text-4xl font-semibold tracking-tight ${accent.value}`}>
        {figure.value}
      </p>
      {figure.unit && (
        <p className="text-sm text-muted-foreground mt-1">{figure.unit}</p>
      )}
      <p className="text-sm font-medium text-foreground mt-2 leading-snug">
        {figure.label}
      </p>
    </div>
  );
}

/** Encart chiffré rattaché à une pathologie. */
function StatNote({ stat, tone }: { stat: Stat; tone: string }) {
  const accent =
    tone === "amber"
      ? { bg: "bg-amber-100/60", border: "border-amber-200", value: "text-amber-900", scope: "bg-amber-200/70 text-amber-900" }
      : { bg: "bg-red-100/50", border: "border-red-200", value: "text-red-900", scope: "bg-red-200/70 text-red-900" };

  return (
    <div className={`mt-3 rounded-xl border ${accent.border} ${accent.bg} px-4 py-3`}>
      <span className={`inline-block rounded-full ${accent.scope} px-2.5 py-0.5 text-xs font-semibold`}>
        {stat.scope}
      </span>
      <p className="mt-2 flex flex-wrap items-baseline gap-x-2">
        <span className={`text-2xl font-semibold tracking-tight ${accent.value}`}>
          {stat.value}
        </span>
        <span className="text-sm text-muted-foreground">{stat.unit}</span>
      </p>
      {stat.note && (
        <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">
          {stat.note}
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
    <div className="rounded-2xl border border-green-200 bg-card p-6 lg:p-7">
      <div className="flex flex-wrap items-baseline justify-between gap-2 mb-6">
        <h3 className="text-base font-semibold text-foreground">
          {couverture.title}
        </h3>
        <p className="text-sm text-muted-foreground">
          Repère : {couverture.objectif.label} ({couverture.objectif.display})
        </p>
      </div>

      <div className="space-y-6">
        {couverture.items.map((item) => (
          <div key={item.label}>
            <div className="flex items-baseline justify-between mb-2">
              <span className="text-sm font-medium text-foreground">
                {item.label}
              </span>
              <span className="text-xl font-semibold tracking-tight text-green-800">
                {item.display}
              </span>
            </div>
            <div className="relative h-3 rounded-full bg-green-100">
              <div
                className="absolute inset-y-0 left-0 rounded-full bg-green-600"
                style={{ width: `${item.value}%` }}
              />
              <div
                className="absolute inset-y-[-5px] w-0.5 bg-green-900"
                style={{ left: `${couverture.objectif.value}%` }}
                aria-hidden="true"
              />
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 mt-5 pt-4 border-t border-green-100">
        <span className="w-0.5 h-4 bg-green-900 flex-shrink-0" aria-hidden="true" />
        <p className="text-sm text-muted-foreground leading-relaxed">
          {couverture.objectif.label} : {couverture.objectif.display}. {couverture.note}
        </p>
      </div>
    </div>
  );
}

export default function VaccinationPapillomavirusPage() {
  return (
    <main className="min-h-screen">
      <Header />

      {/* Hero */}
      <section className="relative pt-24 lg:pt-32 pb-12 lg:pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-50 via-purple-50/40 to-background" />
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="max-w-6xl mx-auto">
            <Link
              href={data.backLink.href}
              className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-8"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{data.backLink.label}</span>
            </Link>

            <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              <div className="lg:col-span-7">
                <div className="inline-flex items-center gap-2 rounded-full border border-purple-200 bg-white/70 px-3 py-1 text-sm text-muted-foreground mb-5">
                  <Calendar className="w-4 h-4 text-purple-500" />
                  <span>{data.date}</span>
                </div>
                <h1 className="text-3xl lg:text-5xl font-bold text-foreground text-balance leading-tight">
                  {data.title}
                </h1>
              </div>

              <div className="lg:col-span-5">
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-xl">
                  <Image
                    src={data.image}
                    alt={data.imageAlt}
                    fill
                    className="object-cover"
                    priority
                    quality={75}
                    sizes="(max-width: 1024px) 100vw, 480px"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="pt-4 pb-20 lg:pb-32">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto space-y-12">

            {/* INTRO — paragraphes 1 & 2 */}
            <Card className="border-l-4 border-l-purple-500 border-t-0 border-r-0 border-b-0 rounded-l-none">
              <CardContent className="p-6 lg:p-8 space-y-4">
                {data.intro.paragraphs.map((p, i) => (
                  <p key={i} className="text-muted-foreground leading-relaxed">
                    <RichText text={p.text} />
                  </p>
                ))}
              </CardContent>
            </Card>

            {/* BANNER — schéma vaccinal simplifié */}
            <div className="rounded-2xl bg-primary/10 border border-primary/20 px-6 py-5 text-center">
              <p className="text-lg font-bold text-primary">{data.intro.banner}</p>
            </div>

            {/* INTRO — paragraphes 3 & 4 */}
            <div className="space-y-4">
              {data.intro.paragraphs2.map((p, i) => (
                <p key={i} className="text-muted-foreground leading-relaxed">
                  <RichText text={p} />
                </p>
              ))}
            </div>

            {/* STATS MÉNINGOCOQUES */}
            <div className="rounded-2xl border border-sky-200 bg-sky-50/30 p-6 lg:p-8">
              <p className="font-semibold text-foreground mb-5">
                {data.intro.stats.label}
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                {data.intro.stats.figures.map((figure, i) => (
                  <StatTile
                    key={i}
                    figure={figure}
                    accent={{
                      border: "border-sky-200",
                      rule: "bg-sky-500",
                      value: "text-sky-900",
                    }}
                  />
                ))}
              </div>
              <p className="text-muted-foreground leading-relaxed pt-5">
                {data.intro.conclusion}
              </p>
            </div>

            {/* SOMMAIRE */}
            <nav
              aria-label="Sommaire de l'article"
              className="rounded-2xl border border-border bg-card p-6 lg:p-7"
            >
              <div className="flex items-center gap-2 mb-4">
                <ListOrdered className="w-5 h-5 text-primary" />
                <h2 className="text-base font-semibold text-foreground">
                  Les questions abordées
                </h2>
              </div>
              <ol className="grid sm:grid-cols-2 gap-x-6 gap-y-1">
                {sections.map((section, i) => {
                  const colors = sectionColors[section.color] ?? sectionColors.blue;
                  return (
                    <li key={section.id}>
                      <a
                        href={`#${section.id}`}
                        className={`group flex items-baseline gap-3 rounded-lg border border-transparent px-2 py-2 text-sm text-muted-foreground transition-colors ${colors.chip}`}
                      >
                        <span className="text-xs font-semibold text-muted-foreground/60 tabular-nums">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="leading-snug">{section.navLabel}</span>
                      </a>
                    </li>
                  );
                })}
              </ol>
            </nav>

            {/* SECTIONS */}
            {sections.map((section) => {
              const colors = sectionColors[section.color] ?? sectionColors.blue;
              const Icon = sectionIcons[section.icon] ?? ShieldCheck;

              const heading = (
                <div className="flex items-start gap-3">
                  <Icon className={`w-5 h-5 ${colors.icon} mt-1 flex-shrink-0`} />
                  <h2 className={`text-xl lg:text-2xl font-bold ${colors.title}`}>
                    {section.title}
                  </h2>
                </div>
              );

              const paragraphs = section.content.map((p, i) => (
                <p key={i} className="text-muted-foreground leading-relaxed">
                  <RichText text={p} />
                </p>
              ));

              /* Conséquences : deux familles de HPV + répartition régionale */
              if (section.groupes) {
                return (
                  <div key={section.id} id={section.id} className="scroll-mt-28 space-y-6">
                    <Card className={colors.card}>
                      <CardContent className="p-6 lg:p-8 space-y-4">
                        {heading}
                        {paragraphs}
                      </CardContent>
                    </Card>

                    <div className="grid lg:grid-cols-2 gap-6 items-start">
                      {section.groupes.map((groupe) => {
                        const tone =
                          groupe.tone === "amber"
                            ? { border: "border-amber-200", head: "text-amber-900", chip: "bg-amber-100 text-amber-900", dot: "bg-amber-400" }
                            : { border: "border-red-200", head: "text-red-900", chip: "bg-red-100 text-red-900", dot: "bg-red-400" };

                        return (
                          <div
                            key={groupe.id}
                            className={`rounded-2xl border ${tone.border} bg-card p-6 h-full`}
                          >
                            <span className={`inline-block rounded-full ${tone.chip} px-3 py-1 text-xs font-semibold`}>
                              {groupe.types}
                            </span>
                            <h3 className={`text-lg font-bold ${tone.head} mt-3`}>
                              {groupe.label}
                            </h3>
                            <p className="text-muted-foreground leading-relaxed mt-2">
                              {groupe.resume}
                            </p>

                            <div className="mt-5 space-y-5">
                              {groupe.pathologies.map((pathologie) => (
                                <div key={pathologie.nom}>
                                  <div className="flex items-start gap-2.5">
                                    <span className={`w-1.5 h-1.5 rounded-full ${tone.dot} mt-2 flex-shrink-0`} />
                                    <div>
                                      <p className="font-semibold text-foreground leading-snug">
                                        {pathologie.nom}
                                      </p>
                                      <p className="text-muted-foreground leading-relaxed mt-1">
                                        {pathologie.description}
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
                      <div className="rounded-2xl border border-red-200 bg-red-50/30 p-6 lg:p-8">
                        <h3 className="text-lg font-bold text-red-800">
                          {section.repartition.title}
                        </h3>
                        <p className="text-muted-foreground leading-relaxed mt-2 mb-5">
                          {section.repartition.intro}
                        </p>
                        <div className="grid sm:grid-cols-3 gap-4">
                          {section.repartition.figures.map((figure, i) => (
                            <StatTile
                              key={i}
                              figure={figure}
                              accent={{
                                border: "border-red-200",
                                rule: "bg-red-500",
                                value: "text-red-900",
                              }}
                            />
                          ))}
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed mt-5">
                          {section.repartition.note}
                        </p>
                      </div>
                    )}
                  </div>
                );
              }

              /* Depuis quand : schéma vaccinal + encadré réglementaire */
              if (section.schemaVaccinal) {
                return (
                  <div key={section.id} id={section.id} className="scroll-mt-28 space-y-6">
                    <Card className={colors.card}>
                      <CardContent className="p-6 lg:p-8 space-y-4">
                        {heading}
                        {paragraphs}
                      </CardContent>
                    </Card>

                    {/* Encadré Schéma vaccinal — fond beige/crème */}
                    <div className="rounded-2xl bg-amber-50 border border-amber-200 p-6 lg:p-8 space-y-5">
                      <h3 className="text-lg font-bold text-amber-900">
                        {section.schemaVaccinal.title}
                      </h3>
                      {section.schemaVaccinal.vaccines.map((vaccine, vi) => (
                        <div key={vi} className="space-y-2">
                          <p className="font-bold text-amber-800">{vaccine.name}</p>
                          {vaccine.intro && (
                            <p className="text-sm text-amber-700 italic">{vaccine.intro}</p>
                          )}
                          <ul className="space-y-1.5">
                            {vaccine.doses.map((dose, di) => (
                              <li key={di} className="flex items-start gap-2 text-sm text-amber-800">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 flex-shrink-0" />
                                <span><em>{dose}</em></span>
                              </li>
                            ))}
                          </ul>
                          {vaccine.note && (
                            <p className="text-xs text-amber-700 bg-amber-100 rounded-xl px-4 py-2 mt-2">
                              {vaccine.note}
                            </p>
                          )}
                          {vaccine.nouveauNote && (
                            <div className="flex items-start gap-3 mt-3 rounded-xl bg-green-50 border border-green-200 px-4 py-3">
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-green-500 text-white flex-shrink-0 mt-0.5">
                                NOUVEAU
                              </span>
                              <p className="text-sm text-green-800 leading-relaxed">
                                {vaccine.nouveauNote}
                              </p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Encadré secondaire — fond jaune */}
                    {section.encadreSecondaire && (
                      <div className="rounded-2xl bg-yellow-50 border-2 border-yellow-300 p-6 lg:p-8">
                        <p className="text-sm text-yellow-900 leading-relaxed">
                          {section.encadreSecondaire}
                        </p>
                      </div>
                    )}
                  </div>
                );
              }

              /* Objectifs : jauges de couverture vaccinale */
              if (section.couverture) {
                return (
                  <div key={section.id} id={section.id} className="scroll-mt-28 space-y-6">
                    <Card className={colors.card}>
                      <CardContent className="p-6 lg:p-8 space-y-4">
                        {heading}
                        {paragraphs}
                      </CardContent>
                    </Card>
                    <CouvertureMeter couverture={section.couverture} />
                  </div>
                );
              }

              /* Actions : bloc média cliquable */
              if (section.media) {
                return (
                  <div key={section.id} id={section.id} className="scroll-mt-28 space-y-6">
                    <Card className={colors.card}>
                      <CardContent className="p-6 lg:p-8 space-y-4">
                        {heading}
                        {paragraphs}
                      </CardContent>
                    </Card>

                    <div className="space-y-3">
                      <a
                        href={section.media.linkUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-shadow"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={section.media.image}
                          alt={section.media.alt}
                          className="w-full h-auto object-cover hover:scale-105 transition-transform duration-500"
                        />
                      </a>
                      <a
                        href={section.media.linkUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm text-orange-600 hover:text-orange-700 transition-colors break-all"
                      >
                        <ExternalLink className="w-4 h-4 flex-shrink-0" />
                        <span>{section.media.linkLabel}</span>
                      </a>
                    </div>
                  </div>
                );
              }

              /* Sections illustrées : texte et photo côte à côte */
              if (section.illustration) {
                return (
                  <Card key={section.id} id={section.id} className={`scroll-mt-28 overflow-hidden ${colors.card}`}>
                    <CardContent className="p-0">
                      <div className="grid lg:grid-cols-5 gap-0 items-stretch">
                        <div className="lg:col-span-3 p-6 lg:p-8 space-y-4">
                          {heading}
                          {paragraphs}
                          {section.items && (
                            <ul className="space-y-2 pt-2">
                              {section.items.map((item, i) => (
                                <li key={i} className="flex items-start gap-3 text-muted-foreground">
                                  <CheckCircle2 className={`w-4 h-4 ${colors.icon} mt-1 flex-shrink-0`} />
                                  <span><RichText text={item} /></span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                        <div className="lg:col-span-2 relative min-h-[240px] lg:min-h-full">
                          <Image
                            src={section.illustration.image}
                            alt={section.illustration.alt}
                            fill
                            className="object-cover"
                            quality={72}
                            sizes="(max-width: 1024px) 100vw, 340px"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              }

              /* Sections simples */
              return (
                <Card key={section.id} id={section.id} className={`scroll-mt-28 ${colors.card}`}>
                  <CardContent className="p-6 lg:p-8 space-y-4">
                    {heading}
                    {paragraphs}
                    {section.items && (
                      <ul className="space-y-2 pt-2">
                        {section.items.map((item, i) => (
                          <li key={i} className="flex items-start gap-3 text-muted-foreground">
                            <CheckCircle2 className={`w-4 h-4 ${colors.icon} mt-1 flex-shrink-0`} />
                            <span><RichText text={item} /></span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </CardContent>
                </Card>
              );
            })}

          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

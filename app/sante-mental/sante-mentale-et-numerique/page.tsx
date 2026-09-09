import type { Metadata } from "next";
import { Newsreader } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Calendar, Clock, Phone } from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { BrainMap } from "@/components/sante-mental/brain-map";
import { QuestionsExplorer } from "@/components/sante-mental/questions-explorer";
import { NumeriqueIcon } from "@/components/sante-mental/numerique-icons";
import data from "@/app/data/sante-mentale-numerique.json";

const newsreader = Newsreader({
  subsets: ["latin"],
  weight: ["500", "600"],
  style: ["normal", "italic"],
  variable: "--font-newsreader",
  display: "swap",
});

const serif = "font-(family-name:--font-newsreader)";

// Teinte claire dérivée d'une couleur de zone
const tint = (color: string, pct: number) =>
  `color-mix(in srgb, ${color} ${pct}%, white)`;

export const metadata: Metadata = {
  title: `${data.title} | CPTS Ouest Gironde`,
  description: data.subtitle,
};

function ZoneStrip({
  zones,
  className = "",
}: {
  zones: { id: string; color: string }[];
  className?: string;
}) {
  return (
    <div
      className={`flex h-1.5 rounded-full overflow-hidden ${className}`}
      aria-hidden="true"
    >
      {zones.map((z) => (
        <span
          key={z.id}
          className="flex-1"
          style={{ backgroundColor: z.color }}
        />
      ))}
    </div>
  );
}

function SectionTitle({ title, intro }: { title: string; intro: string }) {
  return (
    <div className="max-w-3xl mx-auto text-center mb-10 md:mb-14">
      <h2
        className={`${serif} text-3xl md:text-4xl lg:text-5xl font-medium text-foreground mb-4 text-balance`}
      >
        {title}
      </h2>
      <p className="text-base md:text-lg text-muted-foreground leading-relaxed text-pretty">
        {intro}
      </p>
    </div>
  );
}

export default function SanteMentaleEtNumeriquePage() {
  const { cerveau, questions, reperes, aide } = data;
  const zones = cerveau.zones;

  return (
    <main className={`min-h-screen ${newsreader.variable}`}>
      <Header />

      {/* HERO */}
      <section className="relative pt-32 pb-12 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-secondary/50 via-background to-background" />
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto">
            <Link
              href={data.backLink.href}
              className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" aria-hidden="true" />
              <span>{data.backLink.label}</span>
            </Link>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground mb-4">
              <span className="inline-flex items-center gap-2">
                <Calendar className="w-4 h-4" aria-hidden="true" />
                {data.date}
              </span>
              <span className="inline-flex items-center gap-2">
                <Clock className="w-4 h-4" aria-hidden="true" />
                {data.readingTime}
              </span>
            </div>
            <h1
              className={`${serif} text-5xl sm:text-6xl lg:text-7xl font-medium text-foreground leading-[1.02] tracking-tight text-balance mb-5`}
            >
              {data.title}
            </h1>
            <ZoneStrip zones={zones} className="w-40 mb-5" />
            <p className="text-lg lg:text-xl text-muted-foreground leading-relaxed text-pretty mb-8 max-w-2xl">
              {data.subtitle}
            </p>
            <div className="rounded-2xl overflow-hidden shadow-xl">
              <div className="relative w-full aspect-[16/9]">
                <Image
                  src={data.heroImage}
                  alt={data.heroImageAlt}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 896px) 100vw, 896px"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 1. LE CERVEAU */}
      <section id="cerveau" className="py-16 md:py-24 bg-background scroll-mt-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <SectionTitle title={cerveau.title} intro={cerveau.intro} />

            <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] gap-10 lg:gap-16 items-start">
              <div className="max-w-[360px] lg:max-w-[440px] mx-auto lg:sticky lg:top-28">
                <BrainMap zones={zones} />
                <p className="mt-3 text-xs text-muted-foreground text-center">
                  Schéma simplifié, les numéros renvoient à la liste.
                </p>
              </div>

              {/* Frise : la ligne passe par le centre des pastilles */}
              <ol>
                {zones.map((zone, i) => {
                  const isLast = i === zones.length - 1;
                  return (
                    <li
                      key={zone.id}
                      className="grid grid-cols-[2.5rem_minmax(0,1fr)] gap-x-5"
                    >
                      <div className="flex flex-col items-center">
                        <span
                          className="w-10 h-10 rounded-full text-white font-bold flex items-center justify-center text-base shrink-0 ring-4 ring-background"
                          style={{ backgroundColor: zone.color }}
                          aria-hidden="true"
                        >
                          {zone.number}
                        </span>
                        {!isLast && (
                          <span
                            className="w-0.5 flex-1 rounded-full opacity-40 my-1"
                            style={{ backgroundColor: zone.color }}
                            aria-hidden="true"
                          />
                        )}
                      </div>
                      <div className={isLast ? "pb-0" : "pb-10"}>
                        <h3
                          className={`${serif} text-2xl md:text-3xl font-medium leading-none pt-1`}
                          style={{ color: zone.color }}
                        >
                          <span className="sr-only">{zone.number}. </span>
                          {zone.title}
                        </h3>
                        <p className="mt-2 text-sm text-muted-foreground">
                          {zone.keyword}, {zone.area}
                        </p>
                        <p className="mt-3 text-base md:text-lg leading-relaxed text-foreground/90">
                          {zone.text}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ol>
            </div>

            <figure className="mt-14 md:mt-20 max-w-3xl mx-auto text-center">
              <ZoneStrip zones={zones} className="w-40 mx-auto mb-5" />
              <blockquote
                className={`${serif} italic text-2xl md:text-3xl text-foreground leading-snug text-balance`}
              >
                {cerveau.conclusion}
              </blockquote>
            </figure>
          </div>
        </div>
      </section>

      {/* 2. LES 10 QUESTIONS */}
      <section id="questions" className="py-16 md:py-24 bg-muted/30 scroll-mt-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <SectionTitle title={questions.title} intro={questions.intro} />
            <QuestionsExplorer
              items={questions.items}
              zones={zones}
              serifClass={serif}
            />
          </div>
        </div>
      </section>

      {/* 3. LES 10 REPÈRES */}
      <section id="reperes" className="py-16 md:py-24 bg-background scroll-mt-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <SectionTitle title={reperes.title} intro={reperes.intro} />

            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-5">
              {reperes.items.map((item, i) => {
                const color = zones[i % zones.length].color;
                return (
                  <li
                    key={item.title}
                    className="flex sm:flex-col items-start sm:items-center sm:text-center gap-4 sm:gap-3 p-5 rounded-2xl bg-background border border-border shadow-sm"
                    style={{ borderTopColor: color, borderTopWidth: 3 }}
                  >
                    <span
                      className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                      style={{ backgroundColor: tint(color, 18), color }}
                    >
                      <NumeriqueIcon name={item.iconName} className="w-6 h-6" />
                    </span>
                    <div>
                      <h3 className="text-base font-bold text-foreground leading-snug">
                        {item.title}
                      </h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                        {item.text}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </section>

      {/* 4. NUMÉROS D'URGENCE */}
      <section id="aide" className="py-16 md:py-24 bg-muted/30 scroll-mt-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="rounded-3xl bg-primary text-primary-foreground p-6 sm:p-10 md:p-12">
              <h2
                className={`${serif} text-3xl md:text-4xl font-medium leading-tight mb-2`}
              >
                {aide.title}
              </h2>
              <p className="text-primary-foreground/80 mb-8">{aide.intro}</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
                {aide.numbers.map((n) => (
                  <div key={n.number}>
                    <a
                      href={`tel:${n.number}`}
                      className="group inline-flex items-center gap-4 rounded-2xl bg-primary-foreground text-primary pl-4 pr-6 py-3 shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-foreground/50"
                    >
                      <span className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                        <Phone className="w-5 h-5" aria-hidden="true" />
                      </span>
                      <span className="flex flex-col leading-none">
                        <span
                          className={`${serif} text-5xl sm:text-6xl font-medium tracking-tight`}
                        >
                          {n.number}
                        </span>
                        <span className="mt-1.5 text-xs font-semibold text-primary/70">
                          Appeler ce numéro
                        </span>
                      </span>
                    </a>
                    <p className="mt-4 text-lg font-semibold leading-snug">
                      {n.label}
                    </p>
                    <p className="mt-1 text-primary-foreground/80 leading-relaxed">
                      {n.description}
                    </p>
                  </div>
                ))}
              </div>

              <ul className="mt-10 pt-8 border-t border-primary-foreground/25 space-y-3">
                {aide.links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="group inline-flex items-start gap-2 text-primary-foreground hover:underline underline-offset-4"
                    >
                      <ArrowRight
                        className="w-4 h-4 mt-1 shrink-0 group-hover:translate-x-1 transition-transform"
                        aria-hidden="true"
                      />
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <p className="mt-6 text-sm text-muted-foreground text-center">
              {data.sources}
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

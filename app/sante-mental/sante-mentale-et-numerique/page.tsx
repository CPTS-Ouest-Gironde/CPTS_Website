import type { Metadata } from "next";
import { Newsreader } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Calendar,
  Check,
  Clock,
  ExternalLink,
  Minus,
  Phone,
  Plus,
  Sparkles,
} from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
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

// Encre brune des affiches, pour les blocs pleins
const ink = "#3F3A34";

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

function SectionTitle({ title, intro }: { title: string; intro?: string }) {
  return (
    <div className="max-w-3xl mx-auto text-center mb-10 md:mb-14">
      <h2
        className={`${serif} text-3xl md:text-4xl lg:text-5xl font-medium text-foreground mb-4 text-balance`}
      >
        {title}
      </h2>
      {intro && (
        <p className="text-base md:text-lg text-muted-foreground leading-relaxed text-pretty">
          {intro}
        </p>
      )}
    </div>
  );
}

function PhoneButton({ number, color }: { number: string; color: string }) {
  // Les numéros longs (0 800…) passent en corps réduit pour tenir dans la colonne
  const isLong = number.replace(/\s/g, "").length > 5;
  return (
    <a
      href={`tel:${number.replace(/\s/g, "")}`}
      className="group inline-flex max-w-full items-center gap-4 rounded-2xl bg-white text-foreground pl-4 pr-6 py-3 shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/50"
      style={{ color }}
    >
      <span
        className="w-12 h-12 rounded-full text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform"
        style={{ backgroundColor: color }}
      >
        <Phone className="w-5 h-5" aria-hidden="true" />
      </span>
      <span className="flex flex-col leading-none">
        <span
          className={`${serif} font-medium tracking-tight whitespace-nowrap ${
            isLong ? "text-2xl sm:text-3xl" : "text-4xl sm:text-5xl"
          }`}
        >
          {number}
        </span>
        <span className="mt-1.5 text-xs font-semibold text-foreground/60">
          Appeler ce numéro
        </span>
      </span>
    </a>
  );
}

export default function SanteMentaleEtNumeriquePage() {
  const {
    intro,
    balance,
    cerveau,
    impacts,
    pistes,
    mesures,
    aideQuand,
    aideOu,
    recap,
    questions,
    reperes,
    sources,
  } = data;
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

      {/* INTRO + CHIFFRES */}
      <section className="py-14 md:py-20 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="max-w-3xl mx-auto space-y-4 mb-10 md:mb-12">
              {intro.paragraphs.map((p) => (
                <p
                  key={p}
                  className="text-lg md:text-xl text-foreground leading-relaxed text-pretty"
                >
                  {p}
                </p>
              ))}
            </div>
            <dl className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
              {intro.figures.map((f, i) => {
                const color = zones[i % zones.length].color;
                return (
                  <div
                    key={f.value}
                    className="rounded-2xl bg-background border border-border p-5 md:p-6"
                    style={{ borderTopColor: color, borderTopWidth: 3 }}
                  >
                    <dt className="sr-only">Chiffre clé</dt>
                    <dd>
                      <span
                        className={`${serif} block text-4xl md:text-5xl font-medium leading-none tracking-tight`}
                        style={{ color }}
                      >
                        {f.value}
                      </span>
                      <span className="block mt-3 text-sm text-muted-foreground leading-snug">
                        {f.label}
                      </span>
                    </dd>
                  </div>
                );
              })}
            </dl>
            <p
              className="mt-8 max-w-3xl mx-auto flex items-start gap-3 rounded-2xl border px-5 py-4 text-base md:text-lg text-foreground leading-relaxed"
              style={{
                backgroundColor: tint(zones[0].color, 12),
                borderColor: tint(zones[0].color, 40),
              }}
            >
              <AlertTriangle
                className="w-5 h-5 mt-1 shrink-0"
                style={{ color: zones[0].color }}
                aria-hidden="true"
              />
              {intro.alert}
            </p>
          </div>
        </div>
      </section>

      {/* AMI OU ENNEMI */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <SectionTitle title={balance.title} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-start">
              <div
                className="rounded-3xl border p-6 md:p-8"
                style={{
                  backgroundColor: tint(zones[1].color, 10),
                  borderColor: tint(zones[1].color, 40),
                }}
              >
                <h3 className="flex items-center gap-3 text-2xl font-bold text-foreground mb-6">
                  <span
                    className="w-10 h-10 rounded-full text-white flex items-center justify-center"
                    style={{ backgroundColor: zones[1].color }}
                  >
                    <Plus className="w-5 h-5" aria-hidden="true" />
                  </span>
                  {balance.plus.title}
                </h3>
                <ul className="space-y-4">
                  {balance.plus.items.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-3 text-base leading-relaxed text-foreground/90"
                    >
                      <Check
                        className="w-5 h-5 mt-1 shrink-0"
                        style={{ color: zones[1].color }}
                        aria-hidden="true"
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div
                className="rounded-3xl border p-6 md:p-8"
                style={{
                  backgroundColor: tint(zones[3].color, 10),
                  borderColor: tint(zones[3].color, 40),
                }}
              >
                <h3 className="flex items-center gap-3 text-2xl font-bold text-foreground mb-3">
                  <span
                    className="w-10 h-10 rounded-full text-white flex items-center justify-center"
                    style={{ backgroundColor: zones[3].color }}
                  >
                    <Minus className="w-5 h-5" aria-hidden="true" />
                  </span>
                  {balance.minus.title}
                </h3>
                <p className="text-base font-medium text-foreground mb-5">
                  {balance.minus.intro}
                </p>
                <ul className="space-y-4">
                  {balance.minus.items.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-3 text-base leading-relaxed text-foreground/90"
                    >
                      <span
                        className="mt-2.5 w-2 h-2 rounded-full shrink-0"
                        style={{ backgroundColor: zones[3].color }}
                        aria-hidden="true"
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* LE CERVEAU */}
      <section id="cerveau" className="py-16 md:py-24 bg-background scroll-mt-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <SectionTitle title={cerveau.title} intro={cerveau.intro} />

            <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] gap-10 lg:gap-16 items-start">
              <div className="w-full max-w-[360px] lg:max-w-[440px] mx-auto lg:sticky lg:top-28">
                <div className="relative w-full aspect-[1097/1287]">
                  <Image
                    src={cerveau.image}
                    alt={cerveau.imageAlt}
                    fill
                    className="object-contain"
                    sizes="(max-width: 1024px) 360px, 440px"
                  />
                </div>
                <p className="mt-3 text-xs text-muted-foreground text-center">
                  Les numéros renvoient à la liste.
                </p>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-muted-foreground mb-6">
                  {cerveau.zonesTitle}
                </h3>
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
                          <h4
                            className={`${serif} text-2xl md:text-3xl font-medium leading-none pt-1`}
                            style={{ color: zone.color }}
                          >
                            <span className="sr-only">{zone.number}. </span>
                            {zone.title}
                          </h4>
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

      {/* IMPACTS DES RÉSEAUX SOCIAUX */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <SectionTitle title={impacts.title} intro={impacts.intro} />
            <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-8 lg:gap-12 items-start">
              <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-lg lg:sticky lg:top-28">
                <Image
                  src={impacts.image}
                  alt={impacts.imageAlt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 440px"
                />
              </div>
              <ol className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {impacts.items.map((item, i) => {
                  const color = zones[i % zones.length].color;
                  return (
                    <li
                      key={item.title}
                      className="rounded-2xl bg-background border border-border p-5"
                      style={{ borderLeftColor: color, borderLeftWidth: 4 }}
                    >
                      <h3 className="text-base font-bold text-foreground leading-snug">
                        {item.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                        {item.text}
                      </p>
                    </li>
                  );
                })}
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* PISTES DE PRÉVENTION */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <SectionTitle title={pistes.title} intro={pistes.intro} />
            <ul className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6">
              {pistes.items.map((item, i) => {
                const color = zones[[1, 0, 4][i] ?? i].color;
                return (
                  <li
                    key={item.measure}
                    className="flex flex-col rounded-3xl border p-6 md:p-8"
                    style={{
                      backgroundColor: tint(color, 12),
                      borderColor: tint(color, 45),
                    }}
                  >
                    <span
                      className={`${serif} text-5xl md:text-6xl font-medium leading-none tracking-tight`}
                      style={{ color }}
                    >
                      {item.effect}
                    </span>
                    <span className="mt-2 text-sm text-muted-foreground">
                      {item.effectLabel}
                    </span>
                    <p
                      className="mt-6 pt-5 border-t text-base md:text-lg font-medium leading-snug text-foreground"
                      style={{ borderColor: tint(color, 45) }}
                    >
                      {item.measure}
                    </p>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </section>

      {/* MESURES PUBLIQUES */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-6xl mx-auto space-y-16 md:space-y-20">
            <div>
              <SectionTitle title={mesures.title} />
              <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {mesures.items.map((item) => (
                  <li
                    key={item.title}
                    className="flex flex-col rounded-2xl bg-background border border-border p-6"
                  >
                    <h3 className="text-lg font-bold text-foreground leading-snug">
                      {item.title}
                    </h3>
                    <p className="mt-3 text-sm md:text-base leading-relaxed text-muted-foreground flex-1">
                      {item.text}
                    </p>
                    {item.link && (
                      <a
                        href={item.link.href}
                        target={item.link.href.startsWith("http") ? "_blank" : undefined}
                        rel={item.link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                        className="mt-5 self-start inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-white shadow-sm hover:-translate-y-0.5 hover:shadow-md transition-all focus-visible:outline-none focus-visible:ring-4"
                        style={{ backgroundColor: zones[0].color }}
                      >
                        {item.link.href.startsWith("tel:") ? (
                          <Phone className="w-4 h-4" aria-hidden="true" />
                        ) : (
                          <ExternalLink className="w-4 h-4" aria-hidden="true" />
                        )}
                        {item.link.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            {/* Règle 3-6-9-12 */}
            <div>
              <div className="max-w-3xl mx-auto text-center mb-10">
                <h3
                  className={`${serif} text-3xl md:text-4xl font-medium text-foreground mb-3`}
                >
                  {mesures.regle.title}
                </h3>
                <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                  {mesures.regle.intro}
                </p>
              </div>
              <ol className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-3">
                {mesures.regle.steps.map((step, i) => {
                  const color = zones[i].color;
                  return (
                    <li
                      key={step.age}
                      className="flex flex-col rounded-3xl bg-background border border-border overflow-hidden"
                    >
                      <div
                        className="px-5 py-4 text-white"
                        style={{ backgroundColor: color }}
                      >
                        <span className="block text-xs font-semibold opacity-90">
                          Étape {i + 1}
                        </span>
                        <span
                          className={`${serif} block text-2xl font-medium leading-tight`}
                        >
                          {step.age}
                        </span>
                      </div>
                      <div className="p-5 flex-1">
                        <h4 className="text-base font-bold text-foreground leading-snug">
                          {step.title}
                        </h4>
                        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                          {step.text}
                        </p>
                        {step.rules && (
                          <ol className="mt-3 space-y-1.5">
                            {step.rules.map((rule, j) => (
                              <li
                                key={rule}
                                className="flex items-start gap-2 text-sm text-foreground/90"
                              >
                                <span
                                  className="w-5 h-5 rounded-full text-[11px] font-bold text-white flex items-center justify-center shrink-0 mt-0.5"
                                  style={{ backgroundColor: color }}
                                  aria-hidden="true"
                                >
                                  {j + 1}
                                </span>
                                {rule}
                              </li>
                            ))}
                          </ol>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ol>
            </div>

            {/* Les 4 pas */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-lg">
                <Image
                  src={mesures.quatrePas.image}
                  alt={mesures.quatrePas.imageAlt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
              <div>
                <h3
                  className={`${serif} text-3xl md:text-4xl font-medium text-foreground mb-6 text-balance`}
                >
                  {mesures.quatrePas.title}
                </h3>
                <ul className="space-y-3">
                  {mesures.quatrePas.items.map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-4 rounded-2xl bg-background border border-border px-5 py-4 text-lg font-semibold text-foreground"
                    >
                      <span
                        className="w-9 h-9 rounded-full text-white flex items-center justify-center shrink-0"
                        style={{ backgroundColor: zones[3].color }}
                      >
                        <Minus className="w-5 h-5" aria-hidden="true" />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Nouveautés 2026 */}
            <div>
              <h3
                className={`${serif} text-3xl md:text-4xl font-medium text-foreground mb-6 text-center`}
              >
                {mesures.nouveautes.title}
              </h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {mesures.nouveautes.items.map((item) => (
                  <li
                    key={item.title}
                    className="rounded-2xl bg-background border-2 p-6"
                    style={{ borderColor: tint(zones[4].color, 50) }}
                  >
                    <h4 className="flex items-start gap-3 text-lg font-bold text-foreground leading-snug">
                      <Sparkles
                        className="w-5 h-5 mt-1 shrink-0"
                        style={{ color: zones[4].color }}
                        aria-hidden="true"
                      />
                      {item.title}
                    </h4>
                    <p className="mt-3 text-sm md:text-base leading-relaxed text-muted-foreground">
                      {item.text}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* DEMANDER DE L'AIDE */}
      <section id="aide" className="py-16 md:py-24 bg-background scroll-mt-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-6xl mx-auto space-y-14 md:space-y-16">
            <div className="max-w-3xl mx-auto">
              <h2
                className={`${serif} text-3xl md:text-4xl lg:text-5xl font-medium text-foreground mb-5 text-center text-balance`}
              >
                {aideQuand.title}
              </h2>
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed text-center mb-6">
                {aideQuand.text}
              </p>
              <ul className="flex flex-wrap justify-center gap-2">
                {aideQuand.signals.map((s) => (
                  <li
                    key={s}
                    className="rounded-full border border-border bg-muted/40 px-4 py-2 text-sm font-medium text-foreground"
                  >
                    {s}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <SectionTitle title={aideOu.title} intro={aideOu.intro} />

              <div
                className="rounded-3xl text-white p-6 sm:p-10 mb-8"
                style={{ backgroundColor: ink }}
              >
                <h3
                  className={`${serif} text-2xl md:text-3xl font-medium leading-tight mb-8`}
                >
                  {aideOu.lignes.title}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {aideOu.lignes.items.map((n, i) => (
                    <div key={n.number}>
                      <PhoneButton number={n.number} color={zones[[0, 3, 1][i] ?? 0].color} />
                      <p className="mt-4 text-lg font-semibold leading-snug">
                        {n.label}
                      </p>
                      <p className="mt-1 text-white/75 leading-relaxed">
                        {n.text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {[aideOu.professionnels, aideOu.structures].map((group) => (
                  <div
                    key={group.title}
                    className="rounded-3xl bg-background border border-border p-6 md:p-8"
                  >
                    <h3 className="text-xl font-bold text-foreground mb-5">
                      {group.title}
                    </h3>
                    <ul className="space-y-4">
                      {group.items.map((item) => (
                        <li key={item.name} className="flex items-start gap-3">
                          <span
                            className="mt-2.5 w-2 h-2 rounded-full shrink-0"
                            style={{ backgroundColor: zones[0].color }}
                            aria-hidden="true"
                          />
                          <div>
                            <p className="font-semibold text-foreground leading-snug">
                              {item.name}
                            </p>
                            <p className="mt-1 text-sm md:text-base leading-relaxed text-muted-foreground">
                              {item.text}
                            </p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <ul className="mt-8 flex flex-wrap gap-x-8 gap-y-3">
                {aideOu.links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="group inline-flex items-start gap-2 font-medium hover:underline underline-offset-4"
                      style={{ color: zones[0].color }}
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
          </div>
        </div>
      </section>

      {/* RÉCAPITULATIF */}
      <section className="py-16 md:py-20 bg-muted/30">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2
              className={`${serif} text-3xl md:text-4xl font-medium text-foreground mb-6`}
            >
              {recap.title}
            </h2>
            <ZoneStrip zones={zones} className="w-40 mx-auto mb-6" />
            <p
              className={`${serif} italic text-2xl md:text-3xl text-foreground leading-snug text-balance mb-6`}
            >
              {recap.text}
            </p>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              {recap.lead}
            </p>
          </div>
        </div>
      </section>

      {/* LES 10 QUESTIONS */}
      <section id="questions" className="py-16 md:py-24 bg-background scroll-mt-24">
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

      {/* LES 10 REPÈRES */}
      <section id="reperes" className="py-16 md:py-24 bg-muted/30 scroll-mt-24">
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

            <div className="mt-14 max-w-3xl mx-auto text-sm text-muted-foreground space-y-2">
              <p>
                <span className="font-semibold text-foreground">
                  {sources.title} :
                </span>{" "}
                {sources.items.join(", ")}.
              </p>
              <p>
                <span className="font-semibold text-foreground">
                  Bibliographie :
                </span>{" "}
                {sources.bibliographie}
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

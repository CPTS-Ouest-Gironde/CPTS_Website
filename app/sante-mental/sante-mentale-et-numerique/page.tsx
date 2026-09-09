import type { Metadata } from "next";
import { Newsreader } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Baby,
  BatteryLow,
  BedDouble,
  Bike,
  BookOpenCheck,
  Calendar,
  Clock,
  Hand,
  HeartHandshake,
  HeartPulse,
  House,
  Leaf,
  LockKeyhole,
  MessagesSquare,
  MonitorSmartphone,
  MoonStar,
  Phone,
  Scale,
  ShieldAlert,
  ShieldCheck,
  Timer,
  Tornado,
  TreePine,
  type LucideIcon,
} from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { BrainMap } from "@/components/sante-mental/brain-map";
import data from "@/app/data/sante-mentale-numerique.json";

const newsreader = Newsreader({
  subsets: ["latin"],
  weight: ["500", "600"],
  style: ["normal", "italic"],
  variable: "--font-newsreader",
  display: "swap",
});

const serif = "font-(family-name:--font-newsreader)";

const iconMap: Record<string, LucideIcon> = {
  Baby,
  BatteryLow,
  BedDouble,
  Bike,
  BookOpenCheck,
  Hand,
  HeartHandshake,
  HeartPulse,
  House,
  Leaf,
  LockKeyhole,
  MessagesSquare,
  MonitorSmartphone,
  MoonStar,
  Scale,
  ShieldAlert,
  ShieldCheck,
  Timer,
  Tornado,
  TreePine,
};

function Icon({ name, className }: { name: string; className?: string }) {
  const I = iconMap[name] ?? Leaf;
  return <I className={className} aria-hidden="true" />;
}

export const metadata: Metadata = {
  title: `${data.title} | CPTS Ouest Gironde`,
  description: data.subtitle,
};

export default function SanteMentaleEtNumeriquePage() {
  const { cerveau, questions, reperes, aide } = data;

  return (
    <main className={`min-h-screen ${newsreader.variable}`}>
      <Header />

      {/* HERO */}
      <section className="relative pt-28 lg:pt-36 pb-10 overflow-hidden bg-gradient-to-b from-secondary/40 to-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <Link
              href={data.backLink.href}
              className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-8"
            >
              <ArrowLeft className="w-4 h-4" aria-hidden="true" />
              <span>{data.backLink.label}</span>
            </Link>

            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground mb-5">
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
              className={`${serif} text-5xl sm:text-6xl lg:text-7xl font-medium text-foreground leading-[1.02] tracking-tight text-balance mb-6`}
            >
              {data.title}
            </h1>
            <p className="text-lg lg:text-xl text-muted-foreground leading-relaxed text-pretty max-w-2xl">
              {data.subtitle}
            </p>

            {data.heroImage && (
              <div className="mt-10 rounded-2xl overflow-hidden shadow-lg">
                <div className="relative w-full aspect-[4/3] sm:aspect-[21/9]">
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
            )}
          </div>
        </div>
      </section>

      {/* CORPS DE L'ARTICLE */}
      <div className="container mx-auto px-4 lg:px-8 py-10 lg:py-16">
        <div className="max-w-5xl mx-auto lg:grid lg:grid-cols-[200px_minmax(0,1fr)] lg:gap-16">
          {/* Sommaire : chips horizontales sur mobile, colonne fixe sur desktop */}
          <nav
            aria-label="Sommaire de l'article"
            className="mb-8 lg:mb-0"
          >
            <ol className="flex flex-wrap lg:flex-col gap-2 lg:gap-0 lg:sticky lg:top-28 lg:border-l lg:border-border">
              {data.toc.map((item) => (
                <li key={item.id} className="shrink-0">
                  <a
                    href={`#${item.id}`}
                    className="block rounded-full lg:rounded-none border lg:border-0 border-border bg-background px-4 py-2 lg:px-4 lg:py-2.5 text-sm text-foreground/80 hover:text-primary hover:border-primary lg:hover:bg-secondary/40 lg:border-l-2 lg:border-l-transparent lg:hover:border-l-primary lg:-ml-px transition-colors"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <article className="min-w-0 space-y-20 lg:space-y-28">
            {/* 1. LE CERVEAU */}
            <section id="cerveau" className="scroll-mt-28">
              <h2
                className={`${serif} text-3xl sm:text-4xl font-medium text-foreground leading-tight mb-4`}
              >
                {cerveau.title}
              </h2>
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-2xl mb-10">
                {cerveau.intro}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-[260px_minmax(0,1fr)] gap-10 md:gap-12 items-start">
                <div className="max-w-[300px] mx-auto md:mx-0 md:sticky md:top-28">
                  <BrainMap zones={cerveau.zones} />
                  <p className="mt-3 text-xs text-muted-foreground text-center md:text-left">
                    Schéma simplifié, les numéros renvoient à la liste.
                  </p>
                </div>

                <ol className="space-y-8">
                  {cerveau.zones.map((zone) => (
                    <li
                      key={zone.id}
                      className="grid grid-cols-[2.25rem_minmax(0,1fr)] gap-x-4"
                    >
                      <span
                        className="w-9 h-9 rounded-full text-white font-bold flex items-center justify-center text-base shrink-0"
                        style={{ backgroundColor: zone.color }}
                        aria-hidden="true"
                      >
                        {zone.number}
                      </span>
                      <div
                        className="border-l-2 pl-4 -ml-[calc(1.125rem+1px)] pt-1 pb-1"
                        style={{ borderColor: zone.color }}
                      >
                        <h3
                          className={`${serif} text-2xl font-medium text-foreground leading-none`}
                        >
                          <span className="sr-only">{zone.number}. </span>
                          {zone.title}
                        </h3>
                        <p className="mt-2 text-sm text-muted-foreground">
                          {zone.keyword}, {zone.area}
                        </p>
                        <p className="mt-3 text-base leading-relaxed text-foreground/90">
                          {zone.text}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>

              <figure className="mt-14 max-w-2xl">
                <div
                  className="flex h-1.5 rounded-full overflow-hidden mb-5"
                  aria-hidden="true"
                >
                  {cerveau.zones.map((z) => (
                    <span
                      key={z.id}
                      className="flex-1"
                      style={{ backgroundColor: z.color }}
                    />
                  ))}
                </div>
                <blockquote
                  className={`${serif} italic text-2xl sm:text-3xl text-foreground leading-snug`}
                >
                  {cerveau.conclusion}
                </blockquote>
              </figure>
            </section>

            {/* 2. LES 10 QUESTIONS */}
            <section id="questions" className="scroll-mt-28">
              <h2
                className={`${serif} text-3xl sm:text-4xl font-medium text-foreground leading-tight mb-4`}
              >
                {questions.title}
              </h2>
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-2xl mb-6">
                {questions.intro}
              </p>

              <dl className="border-t border-border">
                {questions.items.map((item) => (
                  <div
                    key={item.question}
                    className="border-b border-border py-7 grid grid-cols-[1.5rem_minmax(0,1fr)] gap-x-4"
                  >
                    <Icon
                      name={item.iconName}
                      className="w-6 h-6 text-primary mt-0.5"
                    />
                    <div className="max-w-2xl">
                      <dt
                        className={`${serif} text-xl sm:text-2xl font-medium text-foreground leading-snug`}
                      >
                        {item.question}
                      </dt>
                      <dd className="mt-3 space-y-3">
                        <p className="text-base leading-relaxed text-foreground/90">
                          {item.answer}
                        </p>
                        <p className="rounded-lg bg-secondary/50 px-4 py-3 text-base leading-relaxed text-secondary-foreground">
                          <strong className="font-semibold">Conseil :</strong>{" "}
                          {item.advice}
                        </p>
                      </dd>
                    </div>
                  </div>
                ))}
              </dl>
            </section>

            {/* 3. LES 10 REPÈRES */}
            <section id="reperes" className="scroll-mt-28">
              <h2
                className={`${serif} text-3xl sm:text-4xl font-medium text-foreground leading-tight mb-4`}
              >
                {reperes.title}
              </h2>
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-2xl mb-10">
                {reperes.intro}
              </p>

              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-8">
                {reperes.items.map((item) => (
                  <li
                    key={item.title}
                    className="grid grid-cols-[2.75rem_minmax(0,1fr)] gap-x-4"
                  >
                    <span className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                      <Icon name={item.iconName} className="w-5 h-5" />
                    </span>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground leading-snug">
                        {item.title}
                      </h3>
                      <p className="mt-1.5 text-base leading-relaxed text-muted-foreground">
                        {item.text}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </section>

            {/* 4. NUMÉROS D'URGENCE */}
            <section id="aide" className="scroll-mt-28">
              <div className="rounded-3xl bg-primary text-primary-foreground p-6 sm:p-10">
                <h2
                  className={`${serif} text-3xl sm:text-4xl font-medium leading-tight mb-2`}
                >
                  {aide.title}
                </h2>
                <p className="text-primary-foreground/80 mb-8">{aide.intro}</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
                  {aide.numbers.map((n) => (
                    <div key={n.number}>
                      <a
                        href={`tel:${n.number}`}
                        className={`${serif} inline-flex items-center gap-3 text-6xl sm:text-7xl font-medium leading-none tracking-tight hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-foreground rounded-lg`}
                      >
                        <Phone
                          className="w-8 h-8 sm:w-9 sm:h-9 shrink-0"
                          aria-hidden="true"
                        />
                        {n.number}
                      </a>
                      <p className="mt-3 text-lg font-semibold leading-snug">
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
                        className="inline-flex items-start gap-2 text-primary-foreground hover:underline underline-offset-4"
                      >
                        <ArrowRight
                          className="w-4 h-4 mt-1 shrink-0"
                          aria-hidden="true"
                        />
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <p className="mt-6 text-sm text-muted-foreground">{data.sources}</p>
            </section>
          </article>
        </div>
      </div>

      <Footer />
    </main>
  );
}

// @ts-nocheck
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Archivo_Black, Caveat } from "next/font/google";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Reveal } from "@/components/sante-voyage/reveal";
import { JourneyNav } from "@/components/sante-voyage/journey-nav";
import { TravelChecklist } from "@/components/sante-voyage/travel-checklist";
import {
  ArrowLeft,
  AlertTriangle,
  Baby,
  Bug,
  Calendar,
  CheckCircle2,
  ChevronDown,
  Droplets,
  HeartPulse,
  Moon,
  Mountain,
  Plane,
  Rat,
  ShieldCheck,
  Stamp,
  Syringe,
  Users,
  type LucideIcon,
} from "lucide-react";
import data from "@/app/data/sante-voyage.json";

const displayFont = Archivo_Black({ weight: "400", subsets: ["latin"] });
const handFont = Caveat({ weight: ["600", "700"], subsets: ["latin"] });

const profilIconMap: Record<string, LucideIcon> = {
  Baby,
  Users,
  HeartPulse,
};

const description =
  "Santé en voyage : consultation avant le départ, trousse de secours, vaccinations, moustiques, eau et alimentation, phlébite, mal des montagnes, jet lag. Les recommandations sanitaires essentielles aux voyageurs.";

export const metadata: Metadata = {
  title: `${data.title} | CPTS Ouest Gironde`,
  description,
  alternates: {
    canonical: "/prevention/sante-familiale/sante-voyage",
  },
};

// Rend le texte en interprétant les marqueurs **gras**.
// strongClass permet d'adapter la couleur du gras aux fonds sombres.
function renderInline(text: string, strongClass = "font-bold text-stone-900") {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith("**") && part.endsWith("**") ? (
      <strong key={i} className={strongClass}>
        {part.slice(2, -2)}
      </strong>
    ) : (
      part
    )
  );
}

// En-tête de chapitre : numéro géant + étiquette tamponnée.
function ChapterHeading({
  num,
  label,
  title,
}: {
  num: string;
  label: string;
  title: string;
}) {
  return (
    <div className="relative mb-10 lg:mb-14">
      <span
        aria-hidden
        className={`${displayFont.className} absolute -top-8 lg:-top-16 -left-2 text-[7rem] lg:text-[12rem] leading-none text-amber-400/40 select-none pointer-events-none`}
      >
        {num}
      </span>
      <div className="relative pt-10 lg:pt-16">
        <span
          className={`${handFont.className} inline-block text-2xl text-amber-600 -rotate-2 mb-1`}
        >
          {label}
        </span>
        <h2
          className={`${displayFont.className} text-2xl sm:text-3xl lg:text-5xl uppercase text-stone-900 leading-tight text-balance`}
        >
          {title}
        </h2>
        <div className="mt-4 flex items-center gap-2" aria-hidden>
          <span className="w-16 h-1 bg-stone-900 rounded-full" />
          <Plane className="w-4 h-4 text-stone-900 rotate-45" />
          <span className="flex-1 border-t-2 border-dashed border-stone-300" />
        </div>
      </div>
    </div>
  );
}

// Bandeau d'alerte médicale (fièvre au retour, perméthrine, phlébite…).
function AlertBanner({
  tone,
  title,
  children,
}: {
  tone: "danger" | "warning";
  title: string;
  children: React.ReactNode;
}) {
  const styles =
    tone === "danger"
      ? "bg-red-600 text-white"
      : "bg-stone-900 text-amber-50";
  return (
    <div className={`${styles} rounded-2xl p-6 lg:p-8 relative overflow-hidden`}>
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-2 bg-[repeating-linear-gradient(-45deg,#fbbf24_0_12px,#1c1917_12px_24px)]"
      />
      <div className="flex items-start gap-4 pt-2">
        <AlertTriangle className="w-7 h-7 flex-shrink-0 mt-0.5" />
        <div>
          <p className={`${displayFont.className} uppercase text-sm tracking-widest mb-2`}>
            {title}
          </p>
          <div className="text-sm lg:text-base leading-relaxed opacity-95">{children}</div>
        </div>
      </div>
    </div>
  );
}

export default function SanteVoyagePage() {
  return (
    <main className="min-h-screen bg-amber-50">
      <Header />

      {/* ============ HERO — carte d'embarquement ============ */}
      <section className="relative bg-amber-400 min-h-screen flex items-center pt-28 lg:pt-32 pb-16 overflow-hidden">
        {/* Décor : soleil + trajectoire pointillée */}
        <div
          aria-hidden
          className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-amber-300 animate-sv-float"
        />
        {/* Trajectoire pointillée : d'un bord à l'autre — longe le bas sous le texte, remonte derrière le billet */}
        <svg
          aria-hidden
          className="absolute inset-0 w-full h-full opacity-30"
          viewBox="0 0 1200 600"
          preserveAspectRatio="none"
        >
          <path
            d="M -20 515 C 280 560, 560 500, 800 380 C 980 290, 1120 200, 1260 80"
            fill="none"
            stroke="#1c1917"
            strokeWidth="3"
            strokeDasharray="2 16"
            strokeLinecap="round"
          />
        </svg>

        <div className="container mx-auto px-4 lg:px-8 relative z-10 w-full">
          <div className="max-w-7xl mx-auto">
            <Link
              href={data.backLink.href}
              className="inline-flex items-center gap-2 text-stone-900/70 hover:text-stone-900 transition-colors mb-10 text-sm font-semibold"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{data.backLink.label}</span>
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-12 lg:gap-24 items-center">
              {/* Titre éditorial */}
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <span className="inline-flex items-center gap-2 bg-stone-900 text-amber-400 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest">
                    <Plane className="w-3.5 h-3.5 rotate-45" />
                    {data.kicker}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-stone-900/70 text-xs font-semibold">
                    <Calendar className="w-3.5 h-3.5" />
                    {data.date}
                  </span>
                </div>
                <h1
                  className={`${displayFont.className} text-3xl sm:text-4xl lg:text-6xl uppercase text-stone-900 leading-[1.05] text-balance mb-7`}
                >
                  {data.title}
                </h1>
                <p className={`${handFont.className} text-xl lg:text-3xl text-stone-800 -rotate-1 max-w-2xl`}>
                  {data.subtitle}
                </p>
              </div>

              {/* Carte d'embarquement */}
              <Reveal from="right">
                <div className="relative bg-amber-50 rounded-2xl shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-500 lg:scale-110">
                  {/* Encoches du ticket */}
                  <span aria-hidden className="absolute -left-3 top-2/3 w-6 h-6 rounded-full bg-amber-400" />
                  <span aria-hidden className="absolute -right-3 top-2/3 w-6 h-6 rounded-full bg-amber-400" />

                  <div className="p-6">
                    <div className="flex items-center justify-between mb-5">
                      <span className={`${displayFont.className} text-xs uppercase tracking-widest text-stone-900`}>
                        Carte d&apos;embarquement
                      </span>
                      <Plane className="w-5 h-5 text-stone-900 rotate-45" />
                    </div>
                    <div className="flex items-center justify-between gap-4 mb-6">
                      <div>
                        <p className="text-[10px] uppercase tracking-widest text-stone-500 mb-1">Départ</p>
                        <p className={`${displayFont.className} text-lg text-stone-900`}>{data.hero.boardingPass.from}</p>
                      </div>
                      <div aria-hidden className="flex-1 border-t-2 border-dashed border-stone-300 relative">
                        <Plane className="w-4 h-4 text-amber-600 rotate-45 absolute left-1/2 -translate-x-1/2 -top-2 bg-amber-50" />
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] uppercase tracking-widest text-stone-500 mb-1">Arrivée</p>
                        <p className={`${displayFont.className} text-lg text-stone-900`}>{data.hero.boardingPass.to}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-3 text-stone-900">
                      <div>
                        <p className="text-[10px] uppercase tracking-widest text-stone-500 mb-1">Vol</p>
                        <p className="font-bold text-sm">{data.hero.boardingPass.flight}</p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-widest text-stone-500 mb-1">Porte</p>
                        <p className="font-bold text-sm">{data.hero.boardingPass.gate}</p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-widest text-stone-500 mb-1">Siège</p>
                        <p className="font-bold text-sm">{data.hero.boardingPass.seat}</p>
                      </div>
                    </div>
                  </div>

                  <div className="border-t-2 border-dashed border-stone-300 p-4 flex items-center justify-between">
                    <p className="text-[10px] uppercase tracking-widest text-stone-500">
                      Passager · {data.hero.boardingPass.passenger}
                    </p>
                    {/* Code-barres décoratif */}
                    <div aria-hidden className="flex items-end gap-[3px] h-6">
                      {[3, 1, 2, 1, 3, 2, 1, 3, 1, 2, 3, 1, 2, 1, 3].map((w, i) => (
                        <span key={i} className="bg-stone-900 h-full" style={{ width: `${w}px` }} />
                      ))}
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>

        {/* Indice de scroll */}
        <div
          aria-hidden
          className="absolute bottom-5 left-1/2 -translate-x-1/2 flex flex-col items-center gap-0.5 text-stone-900/70"
        >
          <span className={`${handFont.className} text-lg`}>Embarquement</span>
          <ChevronDown className="w-5 h-5 animate-bounce" />
        </div>
      </section>

      {/* ============ TICKER — panneau d'aéroport ============ */}
      <div className="bg-stone-900 py-3 overflow-hidden" aria-hidden>
        <div className="flex w-max animate-sv-marquee">
          {[0, 1].map((copy) => (
            <div key={copy} className="flex items-center flex-shrink-0">
              {data.ticker.map((item) => (
                <span
                  key={`${copy}-${item}`}
                  className="flex items-center gap-3 px-6 text-amber-400 text-sm font-bold uppercase tracking-widest whitespace-nowrap"
                >
                  <Plane className="w-3.5 h-3.5 rotate-45 flex-shrink-0" />
                  {item}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ============ NAV STICKY — plan de vol ============ */}
      <JourneyNav chapters={data.chapters} />

      {/* ============ INTRO ============ */}
      <section className="py-14 lg:py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto space-y-6">
            {data.intro.paragraphs.map((p, i) => (
              <Reveal key={i} delay={i * 120}>
                <p
                  className={
                    i === 0
                      ? "text-xl lg:text-2xl font-semibold text-stone-900 leading-relaxed"
                      : "text-base lg:text-lg text-stone-600 leading-relaxed"
                  }
                >
                  {renderInline(p)}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============ IMAGE PRINCIPALE — polaroid ============ */}
      <section className="pb-14 lg:pb-20">
        <div className="container mx-auto px-4 lg:px-8">
          <Reveal from="zoom">
            <div className="max-w-3xl mx-auto bg-white p-3 pb-14 shadow-xl rotate-1 hover:rotate-0 transition-transform duration-500 relative">
              <div className="relative w-full aspect-[16/10]">
                <Image
                  src={data.hero.image}
                  alt={data.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 768px"
                />
              </div>
              <p className={`${handFont.className} absolute bottom-3 left-0 right-0 text-center text-xl text-stone-600`}>
                Prêts au décollage ?
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============ CHAPITRE 01 — AVANT LE DÉPART ============ */}
      <section id="avant-le-depart" className="py-14 lg:py-20 scroll-mt-32">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <Reveal>
              <ChapterHeading num="01" label="Étape n°1" title={data.avantDepart.title} />
            </Reveal>

            {/* Consultation */}
            <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-6 lg:gap-10 mb-12">
              <Reveal from="left">
                <div className="bg-stone-900 text-amber-50 rounded-3xl p-8 lg:p-10 text-center lg:w-56 flex flex-col items-center justify-center rotate-[-1deg]">
                  <span className={`${displayFont.className} text-5xl lg:text-6xl text-amber-400 leading-none`}>
                    4-8
                  </span>
                  <span className={`${handFont.className} text-2xl mt-2`}>semaines avant</span>
                  <span className="text-xs uppercase tracking-widest opacity-70 mt-1">le départ</span>
                </div>
              </Reveal>
              <Reveal from="right" delay={100}>
                <div>
                  <h3 className={`${displayFont.className} text-lg lg:text-xl uppercase text-stone-900 mb-3`}>
                    {data.avantDepart.consultation.title}
                  </h3>
                  <p className="text-stone-600 leading-relaxed mb-4">
                    {renderInline(data.avantDepart.consultation.lead)}
                  </p>
                  {/* Publics concernés : étiquettes bagage */}
                  <ul className="flex flex-wrap gap-2 mb-4">
                    {data.avantDepart.consultation.publics.map((p) => (
                      <li
                        key={p}
                        className="bg-amber-100 border border-amber-300 text-stone-800 text-sm px-3.5 py-1.5 rounded-full font-medium"
                      >
                        {p}
                      </li>
                    ))}
                  </ul>
                  <p className="text-stone-600 leading-relaxed text-sm lg:text-base">
                    {data.avantDepart.consultation.outro}
                  </p>
                </div>
              </Reveal>
            </div>

            {/* Couverture médicale */}
            <Reveal>
              <div className="bg-white/70 border-2 border-dashed border-stone-300 rounded-3xl p-6 lg:p-8 mb-12">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-amber-400 text-stone-900 flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <h3 className={`${displayFont.className} text-lg lg:text-xl uppercase text-stone-900`}>
                    {data.avantDepart.couverture.title}
                  </h3>
                </div>
                <ul className="space-y-3">
                  {data.avantDepart.couverture.bullets.map((b, i) => (
                    <li key={i} className="flex items-start gap-3 text-stone-600 text-sm lg:text-base leading-relaxed">
                      <CheckCircle2 className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
                      <span>{renderInline(b)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>

            {/* Trousse de secours interactive */}
            <Reveal>
              <div className="mb-4">
                <h3 className={`${displayFont.className} text-lg lg:text-xl uppercase text-stone-900 mb-2`}>
                  {data.avantDepart.trousse.title}
                </h3>
                <p className="text-stone-600 text-sm lg:text-base mb-6">{data.avantDepart.trousse.subtitle}</p>
                <TravelChecklist groups={data.avantDepart.trousse.groups} />
              </div>
            </Reveal>
            <Reveal delay={100}>
              <AlertBanner tone="warning" title="Attention">
                <p>{data.avantDepart.trousse.warning}</p>
              </AlertBanner>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ============ CHAPITRE 02 — VACCINATIONS ============ */}
      <section id="vaccinations" className="py-14 lg:py-20 scroll-mt-32 bg-amber-100/60">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <Reveal>
              <ChapterHeading num="02" label="Étape n°2" title={data.vaccinations.title} />
            </Reveal>

            <Reveal>
              <p className="text-stone-600 leading-relaxed text-base lg:text-lg mb-4 max-w-3xl">
                {renderInline(data.vaccinations.lead)}
              </p>
              <ul className="flex flex-wrap gap-2 mb-12">
                {data.vaccinations.criteria.map((c) => (
                  <li
                    key={c}
                    className="bg-white border border-stone-300 text-stone-700 text-sm px-3.5 py-1.5 rounded-full font-medium"
                  >
                    {c}
                  </li>
                ))}
              </ul>
            </Reveal>

            {/* A — Calendrier vaccinal : tampons de passeport */}
            <Reveal>
              <div className="mb-12">
                <div className="flex items-center gap-3 mb-4">
                  <span className={`${displayFont.className} w-9 h-9 rounded-full bg-stone-900 text-amber-400 flex items-center justify-center`}>
                    {data.vaccinations.calendrier.badge}
                  </span>
                  <h3 className={`${displayFont.className} text-lg lg:text-xl uppercase text-stone-900`}>
                    {data.vaccinations.calendrier.title}
                  </h3>
                </div>
                <p className="text-stone-600 leading-relaxed mb-6">{data.vaccinations.calendrier.lead}</p>
                <ul className="flex flex-wrap gap-3 lg:gap-4 mb-6">
                  {data.vaccinations.calendrier.vaccins.map((v, i) => (
                    <li
                      key={v}
                      className={`${handFont.className} text-lg lg:text-xl border-2 border-stone-900/70 text-stone-800 rounded-lg px-4 py-1.5 bg-white/60 ${
                        i % 2 === 0 ? "rotate-2" : "-rotate-2"
                      }`}
                    >
                      <Stamp className="w-4 h-4 inline-block mr-1.5 -mt-1 text-amber-600" aria-hidden />
                      {v}
                    </li>
                  ))}
                </ul>
                <p className="text-stone-600 text-sm lg:text-base mb-5">{data.vaccinations.calendrier.note}</p>
                <AlertBanner tone="warning" title="Rougeole : vigilance">
                  <p>{renderInline(data.vaccinations.calendrier.alerte, "font-bold text-amber-400")}</p>
                </AlertBanner>
              </div>
            </Reveal>

            {/* B — Vaccinations recommandées */}
            <div className="mb-12">
              <Reveal>
                <div className="flex items-center gap-3 mb-6">
                  <span className={`${displayFont.className} w-9 h-9 rounded-full bg-stone-900 text-amber-400 flex items-center justify-center`}>
                    {data.vaccinations.recommandees.badge}
                  </span>
                  <h3 className={`${displayFont.className} text-lg lg:text-xl uppercase text-stone-900`}>
                    {data.vaccinations.recommandees.title}
                  </h3>
                </div>
              </Reveal>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {data.vaccinations.recommandees.vaccins.map((vaccin, i) => (
                  <Reveal key={vaccin.name} delay={(i % 2) * 100} from={i % 2 === 0 ? "left" : "right"}>
                    <div className="h-full bg-white rounded-2xl p-6 shadow-sm border border-amber-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                      <div className="flex items-center gap-2.5 mb-3">
                        <Syringe className="w-4 h-4 text-amber-600 flex-shrink-0" aria-hidden />
                        <h4 className={`${displayFont.className} text-sm uppercase tracking-wide text-stone-900`}>
                          {vaccin.name}
                        </h4>
                      </div>
                      {vaccin.paragraphs?.map((p, j) => (
                        <p key={j} className="text-sm text-stone-600 leading-relaxed mb-2">
                          {renderInline(p)}
                        </p>
                      ))}
                      {vaccin.bullets && (
                        <ul className="space-y-1.5 mb-2">
                          {vaccin.bullets.map((b, j) => (
                            <li key={j} className="flex items-start gap-2 text-sm text-stone-600 leading-relaxed">
                              <span aria-hidden className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 flex-shrink-0" />
                              <span>{b}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                      {vaccin.extra?.map((p, j) => (
                        <p key={j} className="text-sm text-stone-600 leading-relaxed mb-2">
                          {p}
                        </p>
                      ))}
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>

            {/* C — Fièvre jaune, obligatoire */}
            <Reveal>
              <div className="bg-stone-900 text-amber-50 rounded-3xl p-7 lg:p-10 relative overflow-hidden">
                <span
                  aria-hidden
                  className={`${displayFont.className} absolute -right-4 -bottom-6 text-[8rem] text-amber-400/10 uppercase select-none pointer-events-none`}
                >
                  C
                </span>
                <div className="flex items-center gap-3 mb-4 relative">
                  <span className={`${displayFont.className} w-9 h-9 rounded-full bg-amber-400 text-stone-900 flex items-center justify-center flex-shrink-0`}>
                    {data.vaccinations.obligatoires.badge}
                  </span>
                  <h3 className={`${displayFont.className} text-lg lg:text-xl uppercase`}>
                    {data.vaccinations.obligatoires.title}
                  </h3>
                </div>
                <div className="relative">
                  <span className={`${handFont.className} inline-block text-3xl text-amber-400 -rotate-2 mb-3`}>
                    {data.vaccinations.obligatoires.vaccin.name}
                  </span>
                  <p className="leading-relaxed mb-4 opacity-90">
                    {renderInline(data.vaccinations.obligatoires.vaccin.lead, "font-bold text-amber-400")}
                  </p>
                  <ul className="space-y-2 mb-4">
                    {data.vaccinations.obligatoires.vaccin.bullets.map((b, i) => (
                      <li key={i} className="flex items-start gap-3 leading-relaxed opacity-90">
                        <CheckCircle2 className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="leading-relaxed opacity-90">
                    {renderInline(data.vaccinations.obligatoires.vaccin.outro, "font-bold text-amber-400")}
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ============ CHAPITRE 03 — PENDANT LE VOYAGE ============ */}
      <section id="pendant-le-voyage" className="py-14 lg:py-20 scroll-mt-32">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-5xl mx-auto space-y-16">
            <Reveal>
              <ChapterHeading num="03" label="Étape n°3" title={data.pendant.title} />
            </Reveal>

            {/* Moustiques */}
            <div>
              <Reveal>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-400 text-stone-900 flex items-center justify-center">
                    <Bug className="w-5 h-5" />
                  </div>
                  <h3 className={`${displayFont.className} text-lg lg:text-xl uppercase text-stone-900`}>
                    {data.pendant.moustiques.title}
                  </h3>
                </div>
                <p className="text-stone-600 leading-relaxed mb-4">{data.pendant.moustiques.lead}</p>
                <ul className="flex flex-wrap gap-2 mb-5">
                  {data.pendant.moustiques.maladies.map((m) => (
                    <li
                      key={m}
                      className={`${displayFont.className} text-xs uppercase tracking-wide bg-stone-900 text-amber-400 px-3.5 py-2 rounded-lg`}
                    >
                      {m}
                    </li>
                  ))}
                </ul>
                <p className="text-stone-600 leading-relaxed mb-4">{data.pendant.moustiques.transition}</p>
                <ul className="space-y-2.5 mb-6">
                  {data.pendant.moustiques.mesures.map((m) => (
                    <li key={m} className="flex items-start gap-3 text-stone-600 leading-relaxed">
                      <CheckCircle2 className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
                      <span>{m}</span>
                    </li>
                  ))}
                </ul>
              </Reveal>
              <Reveal delay={100}>
                <AlertBanner tone="warning" title="Attention">
                  <p>{data.pendant.moustiques.attention}</p>
                </AlertBanner>
              </Reveal>

              {/* Paludisme */}
              <Reveal delay={150}>
                <div className="mt-8 bg-white/70 border-2 border-dashed border-stone-300 rounded-3xl p-6 lg:p-8">
                  <h4 className={`${displayFont.className} text-base lg:text-lg uppercase text-stone-900 mb-3`}>
                    {data.pendant.moustiques.paludisme.title}
                  </h4>
                  <p className="text-stone-600 leading-relaxed mb-4">{data.pendant.moustiques.paludisme.lead}</p>
                  <ol className="space-y-3 mb-4">
                    {data.pendant.moustiques.paludisme.mesures.map((m, i) => (
                      <li key={m} className="flex items-start gap-3 text-stone-700 leading-relaxed">
                        <span className={`${displayFont.className} w-7 h-7 rounded-full bg-amber-400 text-stone-900 flex items-center justify-center text-xs flex-shrink-0`}>
                          {i + 1}
                        </span>
                        <span className="pt-0.5">{m}</span>
                      </li>
                    ))}
                  </ol>
                  <p className="text-stone-600 leading-relaxed mb-6">{data.pendant.moustiques.paludisme.outro}</p>
                  <AlertBanner tone="danger" title="Urgence médicale">
                    <p>{renderInline(data.pendant.moustiques.paludisme.alerte, "font-bold text-white")}</p>
                  </AlertBanner>
                </div>
              </Reveal>
            </div>

            {/* Rongeurs */}
            <Reveal>
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-400 text-stone-900 flex items-center justify-center">
                    <Rat className="w-5 h-5" />
                  </div>
                  <h3 className={`${displayFont.className} text-lg lg:text-xl uppercase text-stone-900`}>
                    {data.pendant.rongeurs.title}
                  </h3>
                </div>
                <div className="space-y-3">
                  {data.pendant.rongeurs.paragraphs.map((p, i) => (
                    <p key={i} className="text-stone-600 leading-relaxed">
                      {p}
                    </p>
                  ))}
                </div>
              </div>
            </Reveal>

            {/* Eau & alimentation */}
            <div>
              <Reveal>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-400 text-stone-900 flex items-center justify-center">
                    <Droplets className="w-5 h-5" />
                  </div>
                  <h3 className={`${displayFont.className} text-lg lg:text-xl uppercase text-stone-900`}>
                    {data.pendant.eau.title}
                  </h3>
                </div>
                <p className="text-stone-600 leading-relaxed mb-4">{data.pendant.eau.lead}</p>
                <ul className="space-y-2.5 mb-8">
                  {data.pendant.eau.regles.map((r) => (
                    <li key={r} className="flex items-start gap-3 text-stone-600 leading-relaxed">
                      <CheckCircle2 className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </Reveal>

              <Reveal delay={100}>
                <div className="bg-white/70 border-2 border-dashed border-stone-300 rounded-3xl p-6 lg:p-8 mb-6">
                  <h4 className={`${displayFont.className} text-base lg:text-lg uppercase text-stone-900 mb-2`}>
                    {data.pendant.eau.assainir.title}
                  </h4>
                  <p className="text-stone-700 font-semibold leading-relaxed mb-6">{data.pendant.eau.assainir.lead}</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {data.pendant.eau.assainir.methodes.map((m, i) => (
                      <div key={m.title} className="bg-amber-50 rounded-2xl p-5 border border-amber-200">
                        <div className="flex items-center gap-2.5 mb-2">
                          <span className={`${displayFont.className} w-7 h-7 rounded-full bg-stone-900 text-amber-400 flex items-center justify-center text-xs flex-shrink-0`}>
                            {i + 1}
                          </span>
                          <h5 className="font-bold text-stone-900 text-sm">{m.title}</h5>
                        </div>
                        <p className="text-sm text-stone-600 leading-relaxed">{m.text}</p>
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-stone-600 leading-relaxed mb-6">
                    <span className="font-bold text-stone-900">À éviter : </span>
                    {data.pendant.eau.assainir.aEviter}
                  </p>
                  {/* Règle d'or */}
                  <div className="bg-amber-400 rounded-2xl p-6 text-center rotate-[-0.5deg]">
                    <p className={`${handFont.className} text-lg text-stone-800 mb-1`}>Règle d&apos;or</p>
                    <p className={`${displayFont.className} text-xl lg:text-3xl uppercase text-stone-900 leading-snug`}>
                      « {data.pendant.eau.assainir.regleOr} »
                    </p>
                    <p className="text-sm text-stone-800/80 mt-2">{data.pendant.eau.assainir.regleOrNote}</p>
                  </div>
                </div>
              </Reveal>

              <Reveal delay={150}>
                <p className="text-stone-600 leading-relaxed mb-3">{data.pendant.eau.reduit.lead}</p>
                <ul className="flex flex-wrap gap-2">
                  {data.pendant.eau.reduit.maladies.map((m) => (
                    <li
                      key={m}
                      className="bg-amber-100 border border-amber-300 text-stone-800 text-sm px-3.5 py-1.5 rounded-full font-medium"
                    >
                      {m}
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>

            {/* Phlébite */}
            <div>
              <Reveal>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-400 text-stone-900 flex items-center justify-center">
                    <Plane className="w-5 h-5" />
                  </div>
                  <h3 className={`${displayFont.className} text-lg lg:text-xl uppercase text-stone-900`}>
                    {data.pendant.phlebite.title}
                  </h3>
                </div>
                <p className="text-stone-600 leading-relaxed mb-6">{data.pendant.phlebite.lead}</p>
              </Reveal>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {data.pendant.phlebite.conseils.map((c, i) => (
                  <Reveal key={c.title} delay={(i % 2) * 100}>
                    <div className="h-full bg-white rounded-2xl p-5 shadow-sm border border-amber-200">
                      <h4 className="font-bold text-stone-900 text-sm mb-1.5">{c.title}</h4>
                      <p className="text-sm text-stone-600 leading-relaxed">{c.text}</p>
                    </div>
                  </Reveal>
                ))}
              </div>
              <Reveal delay={100}>
                <AlertBanner tone="danger" title="Signes d'alerte">
                  <p>{data.pendant.phlebite.alerte}</p>
                </AlertBanner>
              </Reveal>
            </div>

            {/* Mal aigu des montagnes */}
            <div>
              <Reveal>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-400 text-stone-900 flex items-center justify-center">
                    <Mountain className="w-5 h-5" />
                  </div>
                  <h3 className={`${displayFont.className} text-lg lg:text-xl uppercase text-stone-900`}>
                    {data.pendant.mam.title}
                  </h3>
                </div>
                <p className="text-stone-600 leading-relaxed mb-6">{data.pendant.mam.lead}</p>
              </Reveal>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {data.pendant.mam.conseils.map((c, i) => (
                  <Reveal key={c.title} delay={(i % 2) * 100}>
                    <div className="h-full bg-white rounded-2xl p-5 shadow-sm border border-amber-200">
                      <h4 className="font-bold text-stone-900 text-sm mb-1.5">{c.title}</h4>
                      <p className="text-sm text-stone-600 leading-relaxed">{c.text}</p>
                    </div>
                  </Reveal>
                ))}
              </div>
              <Reveal delay={100}>
                <div className="bg-amber-400 rounded-2xl p-6">
                  <p className={`${handFont.className} text-lg text-stone-800 mb-1`}>À retenir</p>
                  <p className="font-bold text-stone-900 leading-relaxed">{data.pendant.mam.aRetenir}</p>
                </div>
              </Reveal>
            </div>

            {/* Jet lag : frise en 3 temps */}
            <div>
              <Reveal>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-400 text-stone-900 flex items-center justify-center">
                    <Moon className="w-5 h-5" />
                  </div>
                  <h3 className={`${displayFont.className} text-lg lg:text-xl uppercase text-stone-900`}>
                    {data.pendant.jetlag.title}
                  </h3>
                </div>
                <p className="text-stone-600 leading-relaxed mb-8">{data.pendant.jetlag.lead}</p>
              </Reveal>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {data.pendant.jetlag.phases.map((phase, i) => (
                  <Reveal key={phase.title} delay={i * 120}>
                    <div className="h-full bg-stone-900 text-amber-50 rounded-2xl p-6 relative overflow-hidden">
                      <span
                        aria-hidden
                        className={`${displayFont.className} absolute -right-2 -top-4 text-[5rem] text-amber-400/10 select-none pointer-events-none`}
                      >
                        {i + 1}
                      </span>
                      <h4 className={`${handFont.className} text-2xl text-amber-400 mb-4 relative`}>{phase.title}</h4>
                      <ul className="space-y-3 relative">
                        {phase.conseils.map((c, j) => (
                          <li key={j} className="text-sm leading-relaxed opacity-90">
                            {renderInline(c, "font-bold text-amber-400")}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ CHAPITRE 04 — PROFILS ============ */}
      <section id="profils" className="py-14 lg:py-20 scroll-mt-32 bg-amber-100/60">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <Reveal>
              <ChapterHeading num="04" label="Étape n°4" title={data.profils.title} />
            </Reveal>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              {data.profils.items.map((item, i) => {
                const Icon = profilIconMap[item.iconName] ?? Users;
                return (
                  <Reveal key={item.title} delay={i * 120}>
                    <div className="h-full bg-white rounded-3xl p-6 lg:p-7 shadow-sm border border-amber-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                      <div className="w-12 h-12 rounded-2xl bg-amber-400 text-stone-900 flex items-center justify-center mb-4">
                        <Icon className="w-6 h-6" />
                      </div>
                      <h3 className="font-bold text-stone-900 text-base mb-3 leading-snug">{item.title}</h3>
                      {item.lead && <p className="text-sm text-stone-600 leading-relaxed mb-3">{item.lead}</p>}
                      {item.bullets && (
                        <ul className="space-y-1.5 mb-3">
                          {item.bullets.map((b) => (
                            <li key={b} className="flex items-start gap-2 text-sm text-stone-600 leading-relaxed">
                              <span aria-hidden className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 flex-shrink-0" />
                              <span>{b}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                      {item.paragraphs?.map((p, j) => (
                        <p key={j} className="text-sm text-stone-600 leading-relaxed mb-2">
                          {renderInline(p)}
                        </p>
                      ))}
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ============ SOURCE + RETOUR ============ */}
      <section className="py-14 lg:py-20 bg-stone-900 text-amber-50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <Reveal>
              <Plane className="w-8 h-8 text-amber-400 rotate-45 mx-auto mb-5" aria-hidden />
              <p className={`${handFont.className} text-2xl lg:text-3xl text-amber-400 mb-4`}>Bon voyage, et bonne santé !</p>
              <p className="text-sm lg:text-base opacity-80 leading-relaxed mb-8">
                Source : {data.source}
              </p>
              <Link
                href={data.backLink.href}
                className="inline-flex items-center gap-2 bg-amber-400 text-stone-900 px-6 py-3 rounded-full font-bold text-sm hover:bg-amber-300 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                {data.backLink.label}
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

// @ts-nocheck
import type { Metadata } from "next";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  Phone,
  ExternalLink,
  Info,
  RefreshCw,
  ShieldAlert,
  MapPin,
  PlayCircle,
  BookOpen,
  ListChecks,
  ClipboardList,
  NotebookPen,
  BellRing,
  ZoomIn,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import data from "@/app/data/face-aux-violences.json";

const description =
  "Face aux violences, vous n'êtes pas seules : numéros d'urgence, dispositifs (3919, Angela, MonShérif, Mémo de Vie), violentomètre, grille d'évaluation du danger et lieux d'accueil sur la métropole bordelaise.";

export const metadata: Metadata = {
  title: `${data.title} | CPTS Ouest Gironde`,
  description,
  alternates: {
    canonical: "/prevention/sante-familiale/face-aux-violences",
  },
};

// Rend le texte en interprétant les marqueurs **gras**.
function renderInline(text: string) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith("**") && part.endsWith("**") ? (
      <strong key={i} className="font-semibold text-foreground">
        {part.slice(2, -2)}
      </strong>
    ) : (
      part
    )
  );
}

// Palette par zone du violentomètre.
const TONE = {
  saine: { dot: "bg-emerald-500", chip: "bg-emerald-100 text-emerald-800", card: "border-emerald-200 bg-emerald-50/50" },
  vigilance: { dot: "bg-amber-500", chip: "bg-amber-100 text-amber-800", card: "border-amber-200 bg-amber-50/50" },
  danger: { dot: "bg-red-500", chip: "bg-red-100 text-red-700", card: "border-red-200 bg-red-50/50" },
};

export default function FaceAuxViolencesPage() {
  return (
    <main className="min-h-screen">
      <Header />

      {/* Hero */}
      <section className="relative pt-24 lg:pt-32 pb-12 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-fuchsia-50/40 to-background" />
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto">
            <Link
              href={data.backLink.href}
              className="inline-flex items-center gap-2 text-purple-700 hover:text-purple-800 transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{data.backLink.label}</span>
            </Link>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
              <Calendar className="w-4 h-4" />
              <span>{data.date}</span>
            </div>
            <h1 className="text-3xl lg:text-5xl font-bold text-foreground mb-8 text-balance">
              {data.title}
            </h1>
            <div className="rounded-2xl overflow-hidden shadow-xl bg-purple-50">
              <div className="relative w-full aspect-[16/9]">
                <Image
                  src={data.image}
                  alt={data.title}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, 900px"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="pt-4 pb-20 lg:pb-32">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto space-y-12">

            {/* INTRO */}
            <Card className="border-l-4 border-l-purple-500 border-t-0 border-r-0 border-b-0 rounded-l-none">
              <CardContent className="p-6 lg:p-8 space-y-4">
                <p className="text-lg font-semibold text-foreground leading-relaxed">
                  {renderInline(data.intro.text)}
                </p>
                {data.intro.paragraphs.map((p, i) => (
                  <p key={i} className="text-muted-foreground leading-relaxed">
                    {renderInline(p)}
                  </p>
                ))}
              </CardContent>
            </Card>

            {/* LE SAVIEZ-VOUS */}
            <div>
              <h2 className="text-xl font-bold text-foreground mb-6 uppercase tracking-wide flex items-center gap-2">
                <Info className="w-5 h-5 text-purple-600" />
                {data.saviezVous.title}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                {data.saviezVous.items.map((item, i) => (
                  <Card key={i} className="border-purple-200 bg-purple-50/30">
                    <CardContent className="p-5 lg:p-6 space-y-2">
                      <p className="font-bold text-purple-700">{item.label}</p>
                      <p className="text-sm text-muted-foreground leading-relaxed">{item.text}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Cycle des violences */}
              <Card className="border-purple-200 bg-white">
                <CardContent className="p-6 lg:p-8 space-y-5">
                  <div className="flex items-center gap-2">
                    <RefreshCw className="w-5 h-5 text-purple-600" />
                    <h3 className="text-lg lg:text-xl font-bold text-foreground">{data.saviezVous.cycle.title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">{data.saviezVous.cycle.intro}</p>
                  <ol className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {data.saviezVous.cycle.phases.map((phase, i) => (
                      <li key={i} className="flex items-start gap-3 p-4 rounded-xl bg-purple-50/50 border border-purple-100">
                        <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-purple-600 text-sm font-bold text-white">
                          {i + 1}
                        </span>
                        <div>
                          <p className="font-semibold text-foreground text-sm uppercase tracking-wide">{phase.name}</p>
                          <p className="text-sm text-muted-foreground leading-relaxed mt-0.5">{phase.text}</p>
                        </div>
                      </li>
                    ))}
                  </ol>
                  <p className="text-sm font-semibold text-purple-700 italic text-center bg-purple-50 border border-purple-100 rounded-xl py-3">
                    {data.saviezVous.cycle.note}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* AIDES — numéros */}
            <div>
              <h2 className="text-xl font-bold text-foreground mb-6 uppercase tracking-wide flex items-center gap-2">
                <Phone className="w-5 h-5 text-purple-600" />
                {data.aides.title}
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* National */}
                <Card className="border-purple-200">
                  <CardContent className="p-6 space-y-4">
                    <h3 className="text-base font-bold text-purple-700 uppercase tracking-wide">
                      {data.aides.national.title}
                    </h3>
                    <ul className="rounded-xl border border-purple-100 overflow-hidden divide-y divide-purple-100">
                      {data.aides.national.items.map((it, i) => (
                        <li key={i} className="grid grid-cols-[8.5rem_1fr] items-stretch">
                          <span className="flex items-center justify-center px-3 py-3 bg-purple-50 border-r border-purple-100 font-bold text-purple-700 text-base tabular-nums whitespace-nowrap text-center">
                            {it.num}
                          </span>
                          <span className="px-4 py-3 text-sm text-muted-foreground leading-relaxed">
                            {it.text}
                          </span>
                        </li>
                      ))}
                    </ul>
                    <div className="grid grid-cols-1 gap-2 pt-3 border-t border-purple-100">
                      {data.aides.national.links.map((l, i) => (
                        <a
                          key={i}
                          href={l.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2.5 rounded-xl border border-purple-200 bg-purple-50/40 hover:bg-purple-100 hover:border-purple-300 transition-colors px-4 py-2.5 text-sm font-semibold text-purple-700"
                        >
                          <ExternalLink className="w-4 h-4 flex-shrink-0" />
                          <span className="flex-1 leading-snug">{l.label}</span>
                        </a>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Gironde */}
                <Card className="border-purple-200">
                  <CardContent className="p-6 space-y-4">
                    <h3 className="text-base font-bold text-purple-700 uppercase tracking-wide">
                      {data.aides.gironde.title}
                    </h3>
                    <ul className="space-y-3">
                      {data.aides.gironde.items.map((it, i) => (
                        <li key={i} className="flex items-start gap-2.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-2 flex-shrink-0" />
                          <span className="text-sm text-muted-foreground leading-relaxed">
                            <strong className="font-semibold text-foreground">{it.name}</strong> — {it.text}
                            {it.link && (
                              <>
                                {" "}
                                <a
                                  href={it.link.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 font-medium text-purple-700 hover:text-purple-800 transition-colors"
                                >
                                  {it.link.label}
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                              </>
                            )}
                          </span>
                        </li>
                      ))}
                    </ul>

                    {/* Angela */}
                    <div className="rounded-xl bg-fuchsia-50 border border-fuchsia-200 p-4 space-y-3">
                      <div className="flex items-center gap-4">
                        <div className="relative h-20 w-44 flex-shrink-0 rounded-lg overflow-hidden bg-white border border-fuchsia-100">
                          <Image
                            src={data.aides.gironde.angela.image}
                            alt={data.aides.gironde.angela.title}
                            fill
                            className="object-contain p-1.5"
                            sizes="176px"
                          />
                        </div>
                        <p className="font-bold text-fuchsia-700">{data.aides.gironde.angela.title}</p>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {data.aides.gironde.angela.text}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* OUTILS */}
            <div>
              <h2 className="text-xl font-bold text-foreground mb-6 uppercase tracking-wide flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-purple-600" />
                {data.outils.title}
              </h2>

              <div className="space-y-8">

                {/* Violentomètre — affiche haute + légende des 3 zones à côté */}
                <div className="rounded-2xl border border-purple-200 overflow-hidden bg-white">
                  <div className="flex items-center gap-3 bg-purple-600 px-5 py-4 lg:px-7">
                    <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-white/20 text-white">
                      <ListChecks className="h-5 w-5" />
                    </span>
                    <h3 className="text-base lg:text-lg font-bold text-white">{data.outils.violentometre.name}</h3>
                  </div>
                  <div className="p-6 lg:p-8">
                    <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                      {data.outils.violentometre.text}
                    </p>
                    <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,360px)_1fr] gap-8 items-start">
                      {/* Affiche */}
                      <figure className="mx-auto w-full max-w-[360px]">
                        <div className="relative w-full aspect-[471/1280] rounded-xl overflow-hidden border border-purple-100 bg-white shadow-sm">
                          <Image
                            src={data.outils.violentometre.image}
                            alt="Le violentomètre : échelle d'auto-évaluation des comportements dans le couple"
                            fill
                            className="object-contain"
                            sizes="(max-width: 1024px) 100vw, 360px"
                          />
                        </div>
                        <figcaption className="text-xs text-muted-foreground text-center mt-2 italic">
                          Le violentomètre — échelle d'auto-évaluation graduée de 1 à 23.
                        </figcaption>
                      </figure>

                      {/* Légende des 3 zones */}
                      <div className="space-y-4">
                        {data.outils.violentometre.legend.map((zone, i) => {
                          const tone = TONE[zone.tone];
                          return (
                            <div key={i} className={`rounded-xl border ${tone.card} p-5`}>
                              <div className="flex items-center gap-3 mb-2">
                                <span className={`h-3 w-3 rounded-full flex-shrink-0 ${tone.dot}`} />
                                <p className="font-bold text-foreground uppercase tracking-wide text-sm">{zone.level}</p>
                                <span className={`ml-auto rounded-full px-2.5 py-0.5 text-xs font-bold ${tone.chip}`}>
                                  {zone.range}
                                </span>
                              </div>
                              <p className="text-sm font-semibold text-foreground mb-1">{zone.subtitle}</p>
                              <p className="text-sm text-muted-foreground leading-relaxed">{zone.text}</p>
                            </div>
                          );
                        })}
                        <p className="text-xs text-muted-foreground leading-relaxed italic px-1">
                          Plus le curseur descend dans l'échelle, plus la situation est préoccupante.
                          Au-delà de la zone verte, parlez-en et faites-vous accompagner.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Grille d'évaluation du danger */}
                <div className="rounded-2xl border border-purple-200 overflow-hidden bg-white">
                  <div className="flex items-center gap-3 bg-purple-600 px-5 py-4 lg:px-7">
                    <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-white/20 text-white">
                      <ClipboardList className="h-5 w-5" />
                    </span>
                    <h3 className="text-base lg:text-lg font-bold text-white">{data.outils.grille.name}</h3>
                  </div>
                  <div className="p-6 lg:p-8 space-y-6">
                    <p className="text-sm text-muted-foreground leading-relaxed">{data.outils.grille.text}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {data.outils.grille.images.map((img, i) => (
                        <a
                          key={i}
                          href={img.src}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group relative block rounded-xl overflow-hidden border border-purple-100 bg-white shadow-sm cursor-zoom-in"
                        >
                          <div className="relative w-full aspect-[1087/1536]">
                            <Image
                              src={img.src}
                              alt={img.alt}
                              fill
                              className="object-contain transition-transform duration-300 group-hover:scale-[1.02]"
                              sizes="(max-width: 640px) 100vw, 420px"
                            />
                          </div>
                          <span className="absolute bottom-2 right-2 inline-flex items-center gap-1 rounded-full bg-purple-600/90 text-white text-xs font-semibold px-2.5 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <ZoomIn className="w-3 h-3" /> Agrandir
                          </span>
                        </a>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Mémo de Vie + MonShérif */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                  {/* Mémo de Vie */}
                  <div className="rounded-2xl border border-purple-200 overflow-hidden bg-white flex flex-col">
                    <div className="flex items-center gap-3 bg-purple-600 px-5 py-4 lg:px-7">
                      <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-white/20 text-white">
                        <NotebookPen className="h-5 w-5" />
                      </span>
                      <h3 className="text-base lg:text-lg font-bold text-white">{data.outils.memoDeVie.name}</h3>
                    </div>
                    <div className="p-6 space-y-4 flex flex-col flex-1">
                      <p className="text-sm font-semibold text-foreground">{data.outils.memoDeVie.intro}</p>
                      <ul className="space-y-2">
                        {data.outils.memoDeVie.items.map((it, i) => (
                          <li key={i} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                            <span className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-2 flex-shrink-0" />
                            <span className="leading-relaxed">{renderInline(it)}</span>
                          </li>
                        ))}
                      </ul>
                      <p className="text-sm font-semibold text-purple-700 bg-purple-50 border border-purple-100 rounded-lg px-3 py-2">
                        Ce site dispose du bouton « VITE JE QUITTE » pour votre protection.
                      </p>
                      <div className="mt-auto pt-2 flex flex-col items-center gap-4">
                        <div className="relative w-full max-w-[300px] aspect-[768/443] rounded-lg overflow-hidden border border-purple-100 bg-white">
                          <Image
                            src={data.outils.memoDeVie.image}
                            alt="QR code vers memo-de-vie.org"
                            fill
                            className="object-contain"
                            sizes="(max-width: 1024px) 100vw, 300px"
                          />
                        </div>
                        <a
                          href={data.outils.memoDeVie.link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 rounded-full bg-purple-600 hover:bg-purple-700 transition-colors px-5 py-2.5 text-sm font-semibold text-white"
                        >
                          {data.outils.memoDeVie.link.label}
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* MonShérif */}
                  <div className="rounded-2xl border border-purple-200 overflow-hidden bg-white flex flex-col">
                    <div className="flex items-center gap-3 bg-purple-600 px-5 py-4 lg:px-7">
                      <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-white/20 text-white">
                        <BellRing className="h-5 w-5" />
                      </span>
                      <h3 className="text-base lg:text-lg font-bold text-white">{data.outils.monsherif.name}</h3>
                    </div>
                    <div className="p-6 space-y-3 flex flex-col flex-1">
                      <div className="relative w-full aspect-[275/183] rounded-lg overflow-hidden border border-purple-100 bg-white mb-1">
                        <Image
                          src={data.outils.monsherif.image}
                          alt="Le Bouton MonShérif"
                          fill
                          className="object-contain"
                          sizes="(max-width: 1024px) 100vw, 420px"
                        />
                      </div>
                      {data.outils.monsherif.paragraphs.map((p, i) => (
                        <p key={i} className="text-sm text-muted-foreground leading-relaxed">{p}</p>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* LIEUX D'ACCUEIL */}
            <div>
              <h2 className="text-xl font-bold text-foreground mb-6 uppercase tracking-wide flex items-center gap-2">
                <MapPin className="w-5 h-5 text-purple-600" />
                {data.lieux.title}
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-[1fr_minmax(0,400px)] gap-8 items-start">
                <ul className="space-y-3">
                  {data.lieux.items.map((it, i) => (
                    <li key={i} className="rounded-xl border border-purple-100 bg-purple-50/30 p-4">
                      <p className="font-bold text-purple-700 text-sm">{it.name}</p>
                      <p className="text-sm text-muted-foreground leading-relaxed mt-1">{it.text}</p>
                    </li>
                  ))}
                </ul>
                <figure className="mx-auto w-full max-w-[400px] lg:sticky lg:top-24">
                  <div className="relative w-full aspect-[1407/2048] rounded-xl overflow-hidden border border-purple-100 bg-white shadow-sm">
                    <Image
                      src={data.lieux.image}
                      alt="Victime ou témoin de violences sexuelles ou sexistes : un tchat en ligne gratuit 24h/24"
                      fill
                      className="object-contain"
                      sizes="(max-width: 1024px) 100vw, 300px"
                    />
                  </div>
                </figure>
              </div>
            </div>

            {/* TÉMOIGNAGES & RESSOURCES */}
            <div>
              <h2 className="text-xl font-bold text-foreground mb-6 uppercase tracking-wide flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-purple-600" />
                {data.temoignages.title}
              </h2>

              <div className="space-y-3 mb-6">
                {data.temoignages.videos.map((v, i) => (
                  <a
                    key={i}
                    href={v.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-3 rounded-xl border border-purple-100 bg-white hover:bg-purple-50/40 transition-colors p-4"
                  >
                    <PlayCircle className="w-6 h-6 text-purple-600 flex-shrink-0 mt-0.5" />
                    <div className="min-w-0">
                      <p className="font-semibold text-foreground text-sm">{v.label}</p>
                      <p className="text-sm text-muted-foreground leading-relaxed mt-0.5">{v.desc}</p>
                    </div>
                    <ExternalLink className="w-4 h-4 text-purple-400 flex-shrink-0 ml-auto mt-1" />
                  </a>
                ))}
              </div>

              <Card className="border-purple-200 bg-purple-50/30">
                <CardContent className="p-6 space-y-3">
                  <p className="text-sm font-semibold text-foreground">À lire, à voir :</p>
                  <ul className="space-y-2">
                    {data.temoignages.culture.map((c, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                        <span className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-2 flex-shrink-0" />
                        <span className="leading-relaxed">{renderInline(c)}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

// @ts-nocheck
import type { Metadata } from "next";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  ExternalLink,
  ListChecks,
  AlertTriangle,
  Phone,
  Home,
  Footprints,
  HeartPulse,
  type LucideIcon,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ChuteTestChrono } from "@/components/chute-test-chrono";
import { ChuteVideos } from "@/components/chute-videos";
import data from "@/app/data/chute-personne-agee.json";

const GroupIconMap: Record<string, LucideIcon> = { Home, Footprints, HeartPulse };

const description =
  "Chute de la personne âgée : chiffres, causes, complications et tous les bons réflexes pour prévenir les chutes à domicile. Conseils, test de risque et aides financières.";

export const metadata: Metadata = {
  title: `${data.title} | CPTS Ouest Gironde`,
  description,
  alternates: {
    canonical: "/prevention/sante-familiale/chute-personne-agee",
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

export default function ChutePersonneAgeePage() {
  return (
    <main className="min-h-screen">
      <Header />

      {/* Hero */}
      <section className="relative pt-24 lg:pt-32 pb-12 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-orange-50/40 to-background" />
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto">
            <Link
              href={data.backLink.href}
              className="inline-flex items-center gap-2 text-amber-700 hover:text-amber-800 transition-colors mb-6"
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
            <div className="rounded-2xl overflow-hidden shadow-xl bg-amber-50">
              <div className="relative w-full aspect-[16/9]">
                <Image
                  src={data.image}
                  alt={data.title}
                  fill
                  className="object-contain"
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
            <Card className="border-l-4 border-l-amber-500 border-t-0 border-r-0 border-b-0 rounded-l-none">
              <CardContent className="p-6 lg:p-8 space-y-4">
                <p className="text-lg font-semibold text-foreground leading-relaxed">{data.intro.text}</p>
                {data.intro.paragraphs.map((p, i) => (
                  <p key={i} className="text-muted-foreground leading-relaxed">{renderInline(p)}</p>
                ))}
              </CardContent>
            </Card>

            {/* CHIFFRES CLÉS — bento */}
            <div>
              <h2 className="text-xl font-bold text-foreground mb-6 uppercase tracking-wide">{data.chiffres.title}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                {data.chiffres.stats.map((s, i) => {
                  const colors = ["bg-[#d97706]", "bg-[#b45309]", "bg-[#92400e]"];
                  return (
                    <div key={i} className={`${colors[i]} rounded-2xl p-6 flex flex-col items-center text-center text-white`}>
                      <span className="text-3xl font-black mb-2">{s.value}</span>
                      <span className="text-xs leading-snug opacity-90">{s.label}</span>
                    </div>
                  );
                })}
              </div>
              <p className="text-sm text-muted-foreground italic leading-relaxed bg-amber-50 border border-amber-100 rounded-xl p-4">
                {data.chiffres.note}
              </p>
            </div>

            {/* 5 AXES */}
            <Card className="border-amber-200 bg-amber-50/40">
              <CardContent className="p-6 lg:p-8 space-y-4">
                <div className="flex items-center gap-2">
                  <ListChecks className="w-5 h-5 text-amber-600" />
                  <h2 className="text-xl lg:text-2xl font-bold text-foreground">{data.axes.title}</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {data.axes.items.map((axe, i) => (
                    <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-white border border-amber-100">
                      <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-amber-600 text-sm font-bold text-white">
                        {i + 1}
                      </span>
                      <span className="text-sm text-muted-foreground leading-relaxed">{axe}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* COMPLICATIONS */}
            <Card className="border-orange-200 bg-orange-50/30">
              <CardContent className="p-6 lg:p-8 space-y-3">
                <h2 className="text-xl lg:text-2xl font-bold text-foreground">{data.complications.title}</h2>
                {data.complications.paragraphs.map((p, i) => (
                  <p key={i} className="text-sm text-muted-foreground leading-relaxed">{renderInline(p)}</p>
                ))}
              </CardContent>
            </Card>

            {/* PROFIL */}
            <Card className="border-amber-200 bg-amber-50/30">
              <CardContent className="p-6 lg:p-8 space-y-4">
                <h2 className="text-xl lg:text-2xl font-bold text-foreground">{data.profil.title}</h2>
                <ul className="space-y-2">
                  {data.profil.bullets.map((b, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 flex-shrink-0" />
                      <span className="leading-relaxed">{renderInline(b)}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* CAUSES */}
            <Card className="border-orange-200 bg-orange-50/30">
              <CardContent className="p-6 lg:p-8 space-y-4">
                <h2 className="text-xl lg:text-2xl font-bold text-foreground">{data.causes.title}</h2>
                <p className="text-sm font-semibold text-foreground">{data.causes.lead}</p>
                <ul className="space-y-2">
                  {data.causes.bullets.map((b, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                      <AlertTriangle className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                      <span className="leading-relaxed">{renderInline(b)}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* PRÉVENTION — conseils groupés par priorité */}
            <div>
              <h2 className="text-xl font-bold text-foreground mb-2 uppercase tracking-wide">{data.prevention.title}</h2>
              {data.prevention.intro && (
                <p className="text-sm text-muted-foreground mb-6">{data.prevention.intro}</p>
              )}
              <div className="space-y-6">
                {data.prevention.groups.map((group, gi) => {
                  const GroupIcon = GroupIconMap[group.iconName];
                  return (
                    <div key={gi} className="rounded-2xl border border-amber-200 overflow-hidden bg-white">
                      <div className="flex items-center gap-3 bg-amber-500 px-5 py-4 lg:px-7">
                        <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-white/20 text-white">
                          {GroupIcon && <GroupIcon className="h-5 w-5" />}
                        </span>
                        <h3 className="text-base lg:text-lg font-bold text-white">{group.title}</h3>
                      </div>
                      <ul className="divide-y divide-amber-100">
                        {group.items.map((item, i) => (
                          <li key={i} className="flex items-start gap-3 px-5 py-4 lg:px-7">
                            <CheckCircle2 className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                            <div className="space-y-1.5">
                              <p className="font-semibold text-foreground text-sm lg:text-base">{item.label}</p>
                              {item.text && (
                                <p className="text-sm text-muted-foreground leading-relaxed">{renderInline(item.text)}</p>
                              )}
                              {item.subItems && (
                                <ul className="space-y-1.5 pt-0.5">
                                  {item.subItems.map((s, j) => (
                                    <li key={j} className="flex items-start gap-2 text-sm text-muted-foreground">
                                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 flex-shrink-0" />
                                      <span className="leading-relaxed">{s}</span>
                                    </li>
                                  ))}
                                </ul>
                              )}
                              {item.link && (
                                <a
                                  href={item.link.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700 hover:text-amber-800 transition-colors"
                                >
                                  <ExternalLink className="w-3 h-3" />
                                  {item.link.label}
                                </a>
                              )}
                            </div>
                          </li>
                        ))}
                      </ul>
                      {group.focus && (
                        <div className="border-t border-amber-100 bg-amber-50/40 px-5 py-6 lg:px-7 flex flex-col items-center gap-5 text-center">
                          <figure className="w-full max-w-sm">
                            <div className="relative w-full aspect-[3/4] rounded-xl overflow-hidden border border-amber-100 bg-white shadow-sm">
                              <Image src={group.focus.poster.src} alt={group.focus.poster.alt} fill className="object-contain" sizes="384px" />
                            </div>
                          </figure>
                          <div className="max-w-xl space-y-1.5">
                            <p className="font-semibold text-foreground">{group.focus.label}</p>
                            <p className="text-sm text-muted-foreground leading-relaxed">{group.focus.text}</p>
                          </div>
                          <figure className="w-full max-w-sm">
                            <div className="relative w-full aspect-[3/2] rounded-xl overflow-hidden border border-amber-100 bg-white shadow-sm">
                              <Image src={group.focus.wide.src} alt={group.focus.wide.alt} fill className="object-contain" sizes="384px" />
                            </div>
                          </figure>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* TEST */}
            <Card className="border-amber-300 bg-amber-50/60">
              <CardContent className="p-6 lg:p-8 space-y-4">
                <h2 className="text-xl lg:text-2xl font-bold text-foreground">{data.test.title}</h2>
                {data.test.paragraphs.map((p, i) => (
                  <p key={i} className="text-sm text-muted-foreground leading-relaxed">{renderInline(p)}</p>
                ))}
                <ChuteTestChrono />
              </CardContent>
            </Card>

            {/* VIDÉOS */}
            <ChuteVideos
              title={data.videos.title}
              intro={data.videos.intro}
              items={data.videos.items}
            />

            {/* AIDES FINANCIÈRES */}
            <Card className="border-amber-200 bg-amber-50/40">
              <CardContent className="p-6 lg:p-8 space-y-5">
                <h2 className="text-xl lg:text-2xl font-bold text-foreground">{data.aides.title}</h2>
                {data.aides.paragraphs.map((p, i) => (
                  <p key={i} className="text-sm text-muted-foreground leading-relaxed">{p}</p>
                ))}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {data.aides.ccas.map((c, i) => (
                    <div key={i} className="rounded-xl bg-white border border-amber-100 p-4">
                      <p className="font-bold text-foreground text-sm">{c.ville}</p>
                      <p className="text-xs text-muted-foreground mt-1">{c.adresse}</p>
                      <a
                        href={`tel:${c.tel.replace(/\s/g, "")}`}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700 hover:text-amber-800 transition-colors mt-2"
                      >
                        <Phone className="w-3 h-3" />
                        {c.tel}
                      </a>
                    </div>
                  ))}
                </div>
                <div className="space-y-2 pt-1">
                  <p className="text-sm font-semibold text-foreground">Ressources utiles :</p>
                  <ul className="space-y-2">
                    {data.aides.links.map((l, i) => (
                      <li key={i}>
                        <a
                          href={l.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-sm text-amber-700 hover:text-amber-800 transition-colors"
                        >
                          <ExternalLink className="w-4 h-4 flex-shrink-0" />
                          <span>{l.label}</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* LINKEDIN */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-foreground">{data.linkedin.title}</h2>
              <p className="text-sm text-muted-foreground">{data.linkedin.text}</p>

              <div className="flex justify-center">
                <div className="relative w-full max-w-[560px] h-[680px] sm:h-[640px] rounded-2xl overflow-hidden border border-blue-100 bg-white shadow-sm transition-shadow hover:shadow-md">
                  <a
                    href={data.linkedin.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Ouvrir le post LinkedIn : ${data.linkedin.title}`}
                    className="absolute inset-0 z-10"
                  />
                  <iframe
                    src={data.linkedin.embedUrl}
                    className="w-full h-full pointer-events-none"
                    frameBorder="0"
                    allowFullScreen
                    title={data.linkedin.title}
                    loading="lazy"
                  />
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

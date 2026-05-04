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
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import data from "@/app/data/vaccination-papillomavirus-campagne-scolaire-2025.json";

function RichText({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((part, i) =>
        part.startsWith("**") && part.endsWith("**") ? (
          <strong key={i}>{part.slice(2, -2)}</strong>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}

const sectionColors: Record<string, { card: string; title: string; icon: string; bullet: string }> = {
  purple: { card: "border-purple-200 bg-purple-50/30", title: "text-purple-800", icon: "text-purple-500", bullet: "bg-purple-400" },
  blue:   { card: "border-blue-200 bg-blue-50/30",     title: "text-blue-800",   icon: "text-blue-500",   bullet: "bg-blue-400" },
  red:    { card: "border-red-200 bg-red-50/30",       title: "text-red-800",    icon: "text-red-500",    bullet: "bg-red-400" },
  amber:  { card: "border-amber-200 bg-amber-50/30",   title: "text-amber-800",  icon: "text-amber-500",  bullet: "bg-amber-400" },
  green:  { card: "border-green-200 bg-green-50/30",   title: "text-green-800",  icon: "text-green-500",  bullet: "bg-green-400" },
  teal:   { card: "border-teal-200 bg-teal-50/30",     title: "text-teal-800",   icon: "text-teal-500",   bullet: "bg-teal-400" },
  indigo: { card: "border-indigo-200 bg-indigo-50/30", title: "text-indigo-800", icon: "text-indigo-500", bullet: "bg-indigo-400" },
  orange: { card: "border-orange-200 bg-orange-50/30", title: "text-orange-800", icon: "text-orange-500", bullet: "bg-orange-400" },
  sky:    { card: "border-sky-200 bg-sky-50/30",       title: "text-sky-800",    icon: "text-sky-500",    bullet: "bg-sky-400" },
};

export default function VaccinationPapillomavirusPage() {
  return (
    <main className="min-h-screen">
      <Header />

      {/* Hero */}
      <section className="relative pt-24 lg:pt-32 pb-12 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-50 via-purple-50/40 to-background" />
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto">
            <Link
              href={data.backLink.href}
              className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{data.backLink.label}</span>
            </Link>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
              <Calendar className="w-4 h-4" />
              <span>{data.date}</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-8 text-balance">
              {data.title}
            </h1>
            <div className="rounded-2xl overflow-hidden shadow-xl">
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
            <Card className="border-sky-200 bg-sky-50/30">
              <CardContent className="p-6 lg:p-8 space-y-3">
                <p className="font-semibold text-foreground">{data.intro.stats.label}</p>
                <ul className="space-y-2">
                  {data.intro.stats.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-muted-foreground">
                      <CheckCircle2 className="w-4 h-4 text-sky-500 mt-1 flex-shrink-0" />
                      <span><RichText text={item} /></span>
                    </li>
                  ))}
                </ul>
                <p className="text-muted-foreground leading-relaxed pt-2">{data.intro.conclusion}</p>
              </CardContent>
            </Card>

            {/* SECTIONS */}
            {data.sections.map((section) => {
              const colors = sectionColors[section.color] ?? sectionColors.blue;

              if (section.id === "depuis-quand") {
                return (
                  <div key={section.id} className="space-y-6">
                    <Card className={colors.card}>
                      <CardContent className="p-6 lg:p-8 space-y-4">
                        <div className="flex items-start gap-3">
                          <Syringe className={`w-5 h-5 ${colors.icon} mt-1 flex-shrink-0`} />
                          <h2 className={`text-xl lg:text-2xl font-bold ${colors.title}`}>{section.title}</h2>
                        </div>
                        {section.content.map((p, i) => (
                          <p key={i} className="text-muted-foreground leading-relaxed">
                            <RichText text={p} />
                          </p>
                        ))}
                      </CardContent>
                    </Card>

                    {/* Encadré Schéma vaccinal — fond beige/crème */}
                    {section.schemaVaccinal && (
                      <div className="rounded-2xl bg-amber-50 border border-amber-200 p-6 lg:p-8 space-y-5">
                        <h3 className="text-lg font-bold text-amber-900">{section.schemaVaccinal.title}</h3>
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
                            {(vaccine as { nouveauNote?: string }).nouveauNote && (
                              <div className="flex items-start gap-3 mt-3 rounded-xl bg-green-50 border border-green-200 px-4 py-3">
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-green-500 text-white flex-shrink-0 mt-0.5">
                                  NOUVEAU
                                </span>
                                <p className="text-sm text-green-800 leading-relaxed">
                                  {(vaccine as { nouveauNote?: string }).nouveauNote}
                                </p>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Encadré secondaire — fond jaune */}
                    {section.encadreSecondaire && (
                      <div className="rounded-2xl bg-yellow-50 border-2 border-yellow-300 p-6 lg:p-8">
                        <p className="text-sm text-yellow-900 leading-relaxed">{section.encadreSecondaire}</p>
                      </div>
                    )}
                  </div>
                );
              }

              if (section.id === "pourquoi-11-ans") {
                return (
                  <Card key={section.id} className={colors.card}>
                    <CardContent className="p-6 lg:p-8 space-y-4">
                      <div className="flex items-start gap-3">
                        <HelpCircle className={`w-5 h-5 ${colors.icon} mt-1 flex-shrink-0`} />
                        <h2 className={`text-xl lg:text-2xl font-bold ${colors.title}`}>{section.title}</h2>
                      </div>
                      {section.content.map((p, i) => (
                        <p key={i} className="text-muted-foreground leading-relaxed">
                          <RichText text={p} />
                        </p>
                      ))}
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
              }

              if (section.id === "actions") {
                return (
                  <div key={section.id} className="space-y-6">
                    <Card className={colors.card}>
                      <CardContent className="p-6 lg:p-8 space-y-4">
                        <h2 className={`text-xl lg:text-2xl font-bold ${colors.title}`}>{section.title}</h2>
                        {section.content.map((p, i) => (
                          <p key={i} className="text-muted-foreground leading-relaxed">
                            <RichText text={p} />
                          </p>
                        ))}
                      </CardContent>
                    </Card>

                    {/* Bloc média — image cliquable */}
                    {section.media && (
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
                    )}
                  </div>
                );
              }

              return (
                <Card key={section.id} className={colors.card}>
                  <CardContent className="p-6 lg:p-8 space-y-4">
                    <div className="flex items-start gap-3">
                      <ShieldCheck className={`w-5 h-5 ${colors.icon} mt-1 flex-shrink-0`} />
                      <h2 className={`text-xl lg:text-2xl font-bold ${colors.title}`}>{section.title}</h2>
                    </div>
                    {section.content.map((p, i) => (
                      <p key={i} className="text-muted-foreground leading-relaxed">
                        <RichText text={p} />
                      </p>
                    ))}
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

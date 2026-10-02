// @ts-nocheck
import type { Metadata } from "next";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Calendar, ExternalLink, CalendarDays, Leaf, Users, LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import data from "@/app/data/octobre-rose-2026.json";

const IconMap: Record<string, LucideIcon> = { CalendarDays, Leaf, Users };

const pageTitle = `${data.title} | CPTS Ouest Gironde`;

export const metadata: Metadata = {
  title: pageTitle,
  description: data.description,
  alternates: {
    canonical: "/prevention/sante-familiale/octobre-rose-2026",
  },
  openGraph: {
    title: pageTitle,
    description: data.description,
    type: "article",
    locale: "fr_FR",
    images: [{ url: `https://cpts-ouest-gironde.fr${data.image}`, alt: data.imageAlt }],
  },
  twitter: {
    card: "summary_large_image",
    title: pageTitle,
    description: data.description,
  },
};

export default function OctobreRose2026Page() {
  return (
    <main className="min-h-screen">
      <Header />

      {/* Hero */}
      <section className="relative pt-24 lg:pt-32 pb-12 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-50 via-rose-50/40 to-background" />
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto">
            <Link href={data.backLink.href} className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-6">
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
                <Image src={data.image} alt={data.imageAlt} fill className="object-cover" priority sizes="(max-width: 768px) 100vw, 900px" />
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
            <Card className="border-l-4 border-l-pink-400 border-t-0 border-r-0 border-b-0 rounded-l-none">
              <CardContent className="p-6 lg:p-8 space-y-4">
                <p className="text-lg font-semibold text-foreground leading-relaxed">{data.intro.text}</p>
                {data.intro.paragraphs.map((p, i) => (
                  <p key={i} className="text-muted-foreground leading-relaxed">{p}</p>
                ))}
              </CardContent>
            </Card>

            {/* CHIFFRES CLÉS — bento */}
            <div>
              <h2 className="text-xl font-bold text-foreground mb-6 uppercase tracking-wide">{data.chiffres.title}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                {data.chiffres.stats.map((s, i) => {
                  const colors = ["bg-[#e91e8c]", "bg-[#c2185b]", "bg-[#ad1457]"];
                  return (
                    <div key={i} className={`${colors[i]} rounded-2xl p-6 flex flex-col items-center text-center text-white`}>
                      <span className="text-3xl font-black mb-2">{s.value}</span>
                      <span className="text-xs leading-snug opacity-90">{s.label}</span>
                    </div>
                  );
                })}
              </div>
              <p className="text-sm text-muted-foreground italic leading-relaxed bg-pink-50 border border-pink-100 rounded-xl p-4">
                {data.chiffres.note}
              </p>
            </div>

            {/* SECTION 1 — Examens / âge */}
            <Card className="border-pink-200 bg-pink-50/30">
              <CardContent className="p-6 lg:p-8 space-y-4">
                <h2 className="text-xl lg:text-2xl font-bold text-foreground">{data.sections[0].title}</h2>
                <div className="space-y-3">
                  {data.sections[0].items.map((item, i) => (
                    <div key={i} className="flex items-start gap-4 p-4 rounded-xl bg-white border border-pink-100">
                      <div className="px-3 py-1 rounded-full bg-pink-100 text-pink-700 text-xs font-bold flex-shrink-0 whitespace-nowrap">
                        {item.age}
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">{item.text}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* SECTION 2 — Comment ça marche */}
            <Card className="border-rose-200 bg-rose-50/30">
              <CardContent className="p-6 lg:p-8 space-y-4">
                <h2 className="text-xl lg:text-2xl font-bold text-foreground">{data.sections[1].title}</h2>
                <p className="text-sm font-semibold text-foreground">{data.sections[1].intro}</p>
                <ul className="space-y-2">
                  {data.sections[1].steps.map((step, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-2 flex-shrink-0" />
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
                {data.sections[1].paragraphs.map((p, i) => (
                  <p key={i} className="text-sm text-muted-foreground leading-relaxed">{p}</p>
                ))}
              </CardContent>
            </Card>

            {/* SECTION 3 — Facteurs de risque */}
            <Card className="border-fuchsia-200 bg-fuchsia-50/30">
              <CardContent className="p-6 lg:p-8 space-y-5">
                <h2 className="text-xl lg:text-2xl font-bold text-foreground">{data.sections[2].title}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {data.sections[2].factors.map((f, i) => {
                    const Icon = IconMap[f.iconName];
                    return (
                      <div key={i} className="flex flex-col items-start gap-3 p-4 rounded-xl bg-white border border-fuchsia-100 shadow-sm">
                        <div className="w-9 h-9 rounded-full bg-fuchsia-100 flex items-center justify-center flex-shrink-0">
                          {Icon && <Icon className="w-4 h-4 text-fuchsia-700" />}
                        </div>
                        <div>
                          <p className="font-bold text-foreground text-sm mb-1">{f.label}</p>
                          <p className="text-xs text-muted-foreground leading-relaxed">{f.text}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* SECTION 4 — Showroom */}
            <Card className="border-pink-200 bg-pink-50/30">
              <CardContent className="p-6 lg:p-8 space-y-4">
                <h2 className="text-xl lg:text-2xl font-bold text-foreground">{data.sections[3].title}</h2>
                {data.sections[3].paragraphs.map((p, i) => (
                  <p key={i} className="text-sm text-muted-foreground leading-relaxed">{p}</p>
                ))}
                <a
                  href={data.sections[3].link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-pink-600 text-white text-sm font-semibold hover:bg-pink-700 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  {data.sections[3].link.label}
                </a>
              </CardContent>
            </Card>

            {/* SECTION 5 — Actions territoire */}
            <Card className="border-rose-200 bg-rose-50/30">
              <CardContent className="p-6 lg:p-8 space-y-5">
                <div>
                  <h2 className="text-xl lg:text-2xl font-bold text-foreground">{data.sections[4].title}</h2>
                  <p className="text-sm text-pink-600 font-semibold mt-1">{data.sections[4].subtitle}</p>
                </div>
                <div className="space-y-3">
                  {data.sections[4].events.map((event, i) => {
                    const linkClass = "inline-flex items-center gap-1.5 text-xs font-semibold text-pink-600 hover:text-pink-700 transition-colors";
                    const isInternal = event.link?.url.startsWith("/");
                    return (
                      <div key={i} className="p-4 rounded-xl bg-white border border-rose-100">
                        <p className="font-bold text-foreground text-sm mb-1">{event.title}</p>
                        <p className="text-sm text-muted-foreground leading-relaxed mb-2">{event.text}</p>
                        {event.items.length > 0 && (
                          <ul className="space-y-1.5 mb-3">
                            {event.items.map((item, j) => (
                              <li key={j} className="flex items-start gap-2 text-sm text-muted-foreground">
                                <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-2 flex-shrink-0" />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                        {event.link && (isInternal ? (
                          <Link href={event.link.url} className={linkClass}>
                            <ExternalLink className="w-3 h-3" />
                            {event.link.label}
                          </Link>
                        ) : (
                          <a href={event.link.url} target="_blank" rel="noopener noreferrer" className={linkClass}>
                            <ExternalLink className="w-3 h-3" />
                            {event.link.label}
                          </a>
                        ))}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

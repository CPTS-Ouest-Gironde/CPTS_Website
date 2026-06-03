// @ts-nocheck
import type { Metadata } from "next";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Calendar, CheckCircle2, Youtube } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import data from "@/app/data/juin-vert-2026.json";

const description =
  "Juin Vert : tout savoir sur le dépistage du cancer du col de l'utérus et le virus HPV. Frottis, fréquence, vaccination, idées reçues — l'essentiel pour vous protéger.";

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

export const metadata: Metadata = {
  title: `${data.title} | CPTS Ouest Gironde`,
  description,
  alternates: {
    canonical: "/prevention/sante-familiale/juin-vert-2026",
  },
};

export default function JuinVert2026Page() {
  return (
    <main className="min-h-screen">
      <Header />

      {/* Hero */}
      <section className="relative pt-24 lg:pt-32 pb-12 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-emerald-50/40 to-background" />
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto">
            <Link
              href={data.backLink.href}
              className="inline-flex items-center gap-2 text-green-700 hover:text-green-800 transition-colors mb-6"
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
            <div className="rounded-2xl overflow-hidden shadow-xl bg-green-50">
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
            <Card className="border-l-4 border-l-green-500 border-t-0 border-r-0 border-b-0 rounded-l-none">
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
                  const colors = ["bg-[#2e9e5b]", "bg-[#1f8f4d]", "bg-[#16703c]"];
                  return (
                    <div key={i} className={`${colors[i]} rounded-2xl p-6 flex flex-col items-center text-center text-white`}>
                      <span className="text-3xl font-black mb-2">{s.value}</span>
                      <span className="text-xs leading-snug opacity-90">{s.label}</span>
                    </div>
                  );
                })}
              </div>
              <p className="text-sm text-muted-foreground italic leading-relaxed bg-green-50 border border-green-100 rounded-xl p-4">
                {data.chiffres.note}
              </p>
            </div>

            {/* FAQ */}
            <div className="space-y-6">
              {data.faq.map((item) => (
                <Card key={item.id} className="border-green-200 bg-green-50/30">
                  <CardContent className="p-6 lg:p-8 space-y-4">
                    <h2 className="text-xl lg:text-2xl font-bold text-foreground">{item.title}</h2>
                    {item.lead && (
                      <p className="text-sm text-muted-foreground leading-relaxed">{renderInline(item.lead)}</p>
                    )}
                    {item.bullets && (
                      <ul className="space-y-2">
                        {item.bullets.map((b, i) => (
                          <li key={i} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                            <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <span className="leading-relaxed">{renderInline(b)}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                    {item.paragraphs?.map((p, i) => (
                      <p key={i} className="text-sm text-muted-foreground leading-relaxed">{renderInline(p)}</p>
                    ))}
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* VIDÉO */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Youtube className="w-5 h-5 text-green-600" />
                <h2 className="text-xl font-bold text-foreground uppercase tracking-wide">En vidéo</h2>
              </div>
              <div className="rounded-2xl overflow-hidden shadow-lg border border-green-100 bg-black">
                <div className="relative w-full aspect-video">
                  <iframe
                    src={data.video.embedUrl}
                    className="absolute inset-0 w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title={data.video.title}
                    loading="lazy"
                  />
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-3">
                {data.video.title} — {data.video.source}
              </p>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

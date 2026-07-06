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
  Phone,
  Users,
  ClipboardList,
  FileText,
  ExternalLink,
  AlertTriangle,
  MapPin,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import data from "@/app/data/canicule.json";

const description =
  "Conseils canicule : reconnaître les personnes fragiles, adopter les bons gestes face aux fortes chaleurs et s'inscrire sur le registre canicule de votre commune.";

// Détecte les numéros de téléphone (ex : 05 56 55 66 55) et les emails
// pour les rendre cliquables (tel: / mailto:).
const PHONE_REGEX = /^0\d(?:[ .]?\d{2}){4}$/;
const PHONE_OR_EMAIL = /(\b0\d(?:[ .]?\d{2}){4}\b|[\w.+-]+@[\w-]+(?:\.[\w-]+)+)/g;

function linkify(text: string) {
  return text.split(PHONE_OR_EMAIL).map((part, i) => {
    if (PHONE_REGEX.test(part)) {
      return (
        <a
          key={i}
          href={`tel:${part.replace(/[ .]/g, "")}`}
          className="underline underline-offset-2 hover:text-orange-600 transition-colors"
        >
          {part}
        </a>
      );
    }
    if (part.includes("@")) {
      return (
        <a
          key={i}
          href={`mailto:${part}`}
          className="underline underline-offset-2 hover:text-orange-600 transition-colors break-all"
        >
          {part}
        </a>
      );
    }
    return part;
  });
}

// Rend le texte en interprétant les marqueurs **gras**.
function renderInline(text: string) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith("**") && part.endsWith("**") ? (
      <strong key={i} className="font-semibold text-foreground">
        {linkify(part.slice(2, -2))}
      </strong>
    ) : (
      <span key={i}>{linkify(part)}</span>
    )
  );
}

export const metadata: Metadata = {
  title: `${data.title} | CPTS Ouest Gironde`,
  description,
  alternates: {
    canonical: "/prevention/sante-familiale/canicule",
  },
};

export default function CaniculePage() {
  return (
    <main className="min-h-screen">
      <Header />

      {/* Hero */}
      <section className="relative pt-32 lg:pt-32 pb-12 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-amber-50/40 to-background" />
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto">
            <Link
              href={data.backLink.href}
              className="inline-flex items-center gap-2 text-orange-700 hover:text-orange-800 transition-colors mb-6"
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
            <div className="rounded-2xl overflow-hidden shadow-xl bg-orange-50">
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
            <Card className="border-l-4 border-l-orange-500 border-t-0 border-r-0 border-b-0 rounded-l-none">
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

            {/* CONSEILS — image + liste */}
            <div>
              <h2 className="text-xl font-bold text-foreground mb-6 uppercase tracking-wide">
                {data.conseils.title}
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                <div className="rounded-2xl overflow-hidden shadow-lg border border-orange-100 bg-white">
                  <div className="relative w-full aspect-[3/4]">
                    <Image
                      src={data.conseils.image.src}
                      alt={data.conseils.image.alt}
                      fill
                      className="object-contain"
                      sizes="(max-width: 1024px) 100vw, 450px"
                    />
                  </div>
                </div>
                <div>
                  <ul className="space-y-3">
                    {data.conseils.items.map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-muted-foreground">
                        <CheckCircle2 className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
                        <span className="leading-relaxed">{renderInline(item)}</span>
                      </li>
                    ))}
                  </ul>
                  {data.conseils.emergency && (
                    <div className="mt-6 flex items-center gap-3 rounded-xl bg-red-50 border border-red-200 px-4 py-3">
                      <Phone className="w-5 h-5 text-red-600 flex-shrink-0" />
                      <span className="text-sm font-semibold text-red-700">
                        {data.conseils.emergency.split(/\b(15)\b/).map((part, i) =>
                          part === "15" ? (
                            <a
                              key={i}
                              href="tel:15"
                              className="underline underline-offset-2 hover:text-red-800 transition-colors"
                            >
                              15
                            </a>
                          ) : (
                            part
                          )
                        )}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* PROCHES */}
            <div className="flex items-start gap-4 rounded-2xl bg-orange-500 px-6 py-6 text-white">
              <Users className="w-7 h-7 flex-shrink-0" />
              <div>
                <h2 className="text-lg font-bold mb-1">{data.proches.title}</h2>
                <p className="text-sm leading-relaxed opacity-95">{data.proches.text}</p>
              </div>
            </div>

            {/* ALERTE VIGILANCE ORANGE */}
            <Card className="border-2 border-orange-400 bg-orange-50/50 overflow-hidden py-0 gap-0">
              <div className="flex items-start gap-3 bg-orange-500 px-6 py-4 text-white">
                <AlertTriangle className="w-6 h-6 flex-shrink-0 mt-0.5" />
                <div>
                  <h2 className="text-lg font-bold uppercase tracking-wide">
                    {data.alerte.title}
                  </h2>
                  <p className="text-sm leading-relaxed opacity-95">
                    {renderInline(data.alerte.intro)}
                  </p>
                </div>
              </div>
              <CardContent className="p-6 lg:p-8 space-y-8">
                <p className="text-sm font-semibold text-foreground leading-relaxed">
                  {renderInline(data.alerte.text)}
                </p>
                {data.alerte.communes.map((commune, i) => (
                  <div key={i} className="space-y-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-orange-600 flex-shrink-0" />
                      <h3 className="text-base font-bold text-foreground">
                        {commune.name}
                      </h3>
                    </div>
                    {commune.blocks.map((block, j) => (
                      <div key={j} className="space-y-2 pl-7">
                        {block.title && (
                          <h4 className="text-sm font-semibold text-orange-700">
                            {block.title}
                          </h4>
                        )}
                        <ul className="space-y-2">
                          {block.items.map((item, k) => (
                            <li
                              key={k}
                              className="flex items-start gap-2 text-sm text-muted-foreground"
                            >
                              <span className="mt-2 h-1.5 w-1.5 rounded-full bg-orange-400 flex-shrink-0" />
                              <span className="leading-relaxed">
                                {renderInline(item)}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* REGISTRE CANICULE — affiche Mérignac + card */}
            <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,340px)_1fr] gap-8 items-start">
              <div className="rounded-2xl overflow-hidden shadow-lg border border-orange-100 bg-white w-full max-w-sm mx-auto lg:mx-0">
                <div className="relative w-full aspect-[1754/2480]">
                  <Image
                    src={data.registre.image.src}
                    alt={data.registre.image.alt}
                    fill
                    className="object-contain"
                    sizes="(max-width: 1024px) 100vw, 340px"
                  />
                </div>
              </div>
              <Card className="border-orange-200 bg-orange-50/30">
                <CardContent className="p-6 lg:p-8 space-y-4">
                  <div className="flex items-center gap-2">
                    <ClipboardList className="w-5 h-5 text-orange-600" />
                    <h2 className="text-xl lg:text-2xl font-bold text-foreground">
                      {data.registre.title}
                    </h2>
                  </div>
                  {data.registre.paragraphs.map((p, i) => (
                    <p key={i} className="text-sm text-muted-foreground leading-relaxed">
                      {renderInline(p)}
                    </p>
                  ))}
                  <p className="text-sm text-muted-foreground italic leading-relaxed bg-white border border-orange-100 rounded-xl p-4">
                    {renderInline(data.registre.condition)}
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {data.registre.ctas.map((cta, i) => (
                      <a
                        key={i}
                        href={cta.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-full bg-orange-500 hover:bg-orange-600 transition-colors px-5 py-2.5 text-sm font-semibold text-white"
                      >
                        {cta.label}
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* RESSOURCE — document Drive intégré */}
            <div className="rounded-2xl border border-orange-200 bg-white overflow-hidden">
              <div className="flex items-center justify-between gap-4 bg-orange-50 px-6 py-4 border-b border-orange-100">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-orange-100">
                    <FileText className="w-5 h-5 text-orange-600" />
                  </span>
                  <div>
                    <h2 className="text-base font-bold text-foreground leading-tight">
                      {data.ressource.title}
                    </h2>
                    <p className="text-xs text-muted-foreground leading-snug mt-0.5">
                      {data.ressource.text}
                    </p>
                  </div>
                </div>
                <a
                  href={data.ressource.cta.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden sm:inline-flex items-center gap-2 rounded-full border border-orange-300 text-orange-700 hover:bg-orange-100 transition-colors px-4 py-2 text-sm font-semibold flex-shrink-0"
                >
                  {data.ressource.cta.label}
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
              <div className="relative w-full aspect-[1/1.414] bg-neutral-100">
                <iframe
                  src={data.ressource.embedUrl}
                  className="absolute inset-0 w-full h-full"
                  allow="autoplay"
                  title={data.ressource.title}
                  loading="lazy"
                />
              </div>
              <a
                href={data.ressource.cta.url}
                target="_blank"
                rel="noopener noreferrer"
                className="sm:hidden flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-orange-700 hover:bg-orange-50 transition-colors border-t border-orange-100"
              >
                {data.ressource.cta.label}
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

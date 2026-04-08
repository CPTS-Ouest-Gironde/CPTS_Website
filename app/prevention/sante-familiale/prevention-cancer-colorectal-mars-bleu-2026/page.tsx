import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  ExternalLink,
  MapPin,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import data from "@/app/data/cancer-colorectal-mars-bleu-2026.json";

export default function CancerColorectalPage() {
  const {
    intro,
    chiffresClés,
    facteurs,
    depistage,
    participation,
    commentSeFaireDepister,
    exclus,
    evenements,
    linkedin,
  } = data;
  const isResourceHubExternal =
    "resourceHub" in commentSeFaireDepister &&
    !!commentSeFaireDepister.resourceHub &&
    /^https?:\/\//.test(commentSeFaireDepister.resourceHub.url);
  const exclusHighlights = ["patients à hauts risques", "symptômes suspects"];

  const renderExclusItem = (text: string) => {
    const escapedTerms = exclusHighlights.map((term) =>
      term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
    );
    const regex = new RegExp(`(${escapedTerms.join("|")})`, "gi");

    return text.split(regex).map((part, index) => {
      const isHighlighted = exclusHighlights.some(
        (term) => term.toLowerCase() === part.toLowerCase()
      );

      return isHighlighted ? (
        <strong key={index} className="font-semibold text-foreground">
          {part}
        </strong>
      ) : (
        <span key={index}>{part}</span>
      );
    });
  };


  return (
    <main className="min-h-screen">
      <Header />

      {/* Hero */}
      <section className="relative pt-28 lg:pt-32 pb-12 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 via-blue-700/5 to-background" />
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto">
            {/* Back link */}
            <Link
              href={data.backLink.href}
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
            >
              <ArrowLeft className="w-4 h-4" />
              {data.backLink.label}
            </Link>

            {/* Date */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
              <Calendar className="w-4 h-4" />
              <span>{data.date}</span>
            </div>

            {/* Title */}
            <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-8 text-balance">
              {data.title}
            </h1>

            {/* Hero image */}
            <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden shadow-xl">
              <Image
                src={data.image}
                alt={data.title}
                fill
                className="object-cover"
                priority
                quality={85}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="pt-4 pb-20 lg:pb-32">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto space-y-12">

            {/* INTRO */}
            <Card className="border-l-4 border-l-blue-800 border-t-0 border-r-0 border-b-0 rounded-l-none bg-blue-50/30">
              <CardContent className="p-6 lg:p-8 space-y-4">
                <p className="text-lg font-semibold text-foreground leading-relaxed">
                  {intro.text}
                </p>
                {intro.paragraphs.map((p, i) => (
                  <p key={i} className="text-muted-foreground leading-relaxed">
                    {p}
                  </p>
                ))}
              </CardContent>
            </Card>

            {/* CHIFFRES CLÉS */}
            <div className="space-y-4">
              <h2 className="text-2xl lg:text-3xl font-bold text-foreground">
                Chiffres clés
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {chiffresClés.map((c, i) => (
                  <div
                    key={i}
                    className="rounded-2xl p-6 text-white flex flex-col gap-2 shadow-sm"
                    style={{ backgroundColor: c.color }}
                  >
                    <span className="text-3xl font-bold">{c.value}</span>
                    <span className="text-sm opacity-90">{c.label}</span>
                  </div>
                ))}
              </div>

              {"resourceHub" in commentSeFaireDepister &&
                commentSeFaireDepister.resourceHub && (
                  <div className="rounded-2xl border border-cyan-200 bg-cyan-50/40 p-5 sm:p-6 space-y-3">
                    <h3 className="text-lg font-semibold text-foreground">
                      {commentSeFaireDepister.resourceHub.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {commentSeFaireDepister.resourceHub.text}
                    </p>
                    <a
                      href={commentSeFaireDepister.resourceHub.url}
                      target={isResourceHubExternal ? "_blank" : undefined}
                      rel={isResourceHubExternal ? "noopener noreferrer" : undefined}
                      className="inline-flex items-center gap-2 rounded-full bg-cyan-700 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-cyan-800"
                    >
                      {commentSeFaireDepister.resourceHub.urlLabel}
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                )}
            </div>

            {/* FACTEURS DE RISQUE */}
            <Card className="border-orange-200 bg-orange-50/30 relative">
              <div className="absolute -top-5 left-6 w-10 h-10 rounded-full bg-orange-200 flex items-center justify-center shadow-sm">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
              </div>
              <CardContent className="p-6 lg:p-8 space-y-4 pt-8">
                <h2 className="text-2xl lg:text-3xl font-bold text-foreground mt-2">
                  {facteurs.title}
                </h2>
                <p className="text-muted-foreground">{facteurs.intro}</p>
                <ul className="space-y-2">
                  {facteurs.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                      <ChevronRight className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* DÉPISTAGE */}
            <Card className="border-blue-200 bg-blue-50/30 relative">
              <CardContent className="p-6 lg:p-8 space-y-4">
                <h2 className="text-2xl lg:text-3xl font-bold text-foreground">
                  {depistage.title}
                </h2>
                <p className="text-muted-foreground">{depistage.intro}</p>

                {/* Avantages */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {depistage.avantages.map((a, i) => (
                    <div key={i} className="flex items-start gap-2 p-3 rounded-xl bg-white border border-blue-100">
                      <CheckCircle2 className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-foreground">{a}</span>
                    </div>
                  ))}
                </div>

                <p className="text-sm text-muted-foreground italic bg-white/60 rounded-xl p-4 border border-blue-100">
                  {depistage.hemoccult}
                </p>
                <p className="text-sm text-muted-foreground">
                  <strong className="font-semibold text-foreground">
                    {depistage.coloscopie}
                  </strong>
                </p>
              </CardContent>
            </Card>

            {/* PARTICIPATION */}
            <Card className="border-amber-200 bg-amber-50/30">
              <CardContent className="p-6 lg:p-8 space-y-4">
                <h2 className="text-2xl lg:text-3xl font-bold text-foreground">
                  {participation.title}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="rounded-xl bg-white border border-amber-100 p-4">
                    <p className="text-sm font-semibold text-amber-700 mb-1">Gironde</p>
                    <p className="text-sm text-muted-foreground">{participation.gironde}</p>
                  </div>
                  <div className="rounded-xl bg-white border border-amber-100 p-4">
                    <p className="text-sm font-semibold text-amber-700 mb-1">Europe</p>
                    <p className="text-sm text-muted-foreground">{participation.europe}</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground font-medium">
                  {participation.conclusion}
                </p>
              </CardContent>
            </Card>

            {/* COMMENT SE FAIRE DÉPISTER */}
            <div className="space-y-6">
              <h2 className="text-2xl lg:text-3xl font-bold text-foreground">
                {commentSeFaireDepister.title}
              </h2>

              {/* Affiche Mars Bleu — avant la phrase */}
              <div className="relative w-full max-w-sm mx-auto rounded-2xl overflow-hidden shadow-md">
                <Image
                  src={commentSeFaireDepister.affiche}
                  alt={commentSeFaireDepister.afficheAlt}
                  width={480}
                  height={640}
                  className="w-full h-auto"
                  quality={85}
                />
              </div>

              <p className="text-muted-foreground">{commentSeFaireDepister.intro}</p>

              {/* Sources */}
              <div className="space-y-3">
                {commentSeFaireDepister.sources.map((s, i) => (
                  <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-white border border-blue-100 shadow-sm">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold text-blue-800">{i + 1}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      <span className="font-bold text-foreground">{s.label}</span>
                      {" "}
                      {s.text}
                      {"url" in s && s.url && (
                        <a
                          href={s.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-blue-700 hover:underline ml-1 font-medium"
                        >
                          {s.urlLabel}
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </p>
                  </div>
                ))}
              </div>

              {/* Kit image + vidéo */}
              <div className="space-y-4">
                <div className="relative w-full rounded-2xl overflow-hidden shadow-md">
                  <Image
                    src={commentSeFaireDepister.kitImage}
                    alt={commentSeFaireDepister.kitImageAlt}
                    width={900}
                    height={400}
                    className="w-full h-auto"
                    quality={85}
                  />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-foreground">{commentSeFaireDepister.tutoTitle}</h3>
                  {commentSeFaireDepister.videoUrl && (
                    <div className="flex justify-center">
                      <div className="relative w-full max-w-sm aspect-[9/16] rounded-2xl overflow-hidden shadow-md bg-black">
                        <iframe
                          src={commentSeFaireDepister.videoUrl}
                          className="absolute inset-0 w-full h-full"
                          allow="autoplay"
                          allowFullScreen
                          title={commentSeFaireDepister.tutoTitle}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* EXCLUS AU TEST */}
            <Card className="border-rose-200 bg-rose-50/30">
              <CardContent className="p-6 lg:p-8 space-y-4">
                <h2 className="text-2xl lg:text-3xl font-bold text-foreground">
                  {exclus.title}
                </h2>
                <ul className="space-y-3">
                  {exclus.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                      <ChevronRight className="w-4 h-4 text-rose-500 mt-0.5 flex-shrink-0" />
                      <span>{renderExclusItem(item)}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* ÉVÉNEMENTS LOCAUX */}
            <Card className="border-blue-200 bg-blue-50/20">
              <CardContent className="p-6 lg:p-8 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-blue-800" />
                  </div>
                  <h2 className="text-2xl lg:text-3xl font-bold text-foreground">
                    {evenements.title}
                  </h2>
                </div>
                <div className="space-y-6">
                  {evenements.items.map((evt, i) => {
                    const hasProgram = "program" in evt && Array.isArray(evt.program);

                    if (hasProgram) {
                      const program = evt.program ?? [];

                      return (
                        <div key={i} className="space-y-5">
                          <div className="flex flex-col lg:flex-row gap-5 lg:gap-6">
                            <div className="flex-1 space-y-3 min-w-0">
                              <p className="inline-flex rounded-full bg-cyan-100 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-cyan-800">
                                Acteur local
                              </p>
                              <h3 className="text-xl lg:text-2xl font-bold text-foreground">
                                {"title" in evt && evt.title ? evt.title : evt.label}
                              </h3>
                              <p className="text-sm lg:text-base text-muted-foreground leading-relaxed">
                                {"textBold" in evt && evt.textBold && (
                                  <strong className="font-semibold text-foreground">{evt.textBold} </strong>
                                )}
                                {evt.text}
                              </p>
                              {"link" in evt && evt.link && (
                                <a
                                  href={evt.link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-2 rounded-full bg-cyan-700 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-cyan-800"
                                >
                                  {"linkLabel" in evt && evt.linkLabel ? evt.linkLabel : "Voir le détail"}
                                  <ExternalLink className="w-3.5 h-3.5" />
                                </a>
                              )}
                            </div>

                            {"image" in evt && evt.image && (
                              <div className="w-full lg:w-72 rounded-2xl border border-cyan-100 bg-white p-3 self-start">
                                <Image
                                  src={evt.image}
                                  alt={evt.imageAlt ?? ""}
                                  width={1000}
                                  height={520}
                                  className="w-full h-auto"
                                  quality={85}
                                />
                              </div>
                            )}
                          </div>

                          <div className="grid gap-3">
                            {program.map((event, eventIndex) => (
                              <div key={`${event.date}-${event.location}-${eventIndex}`}>
                                <div className="rounded-xl border border-cyan-100 bg-cyan-50/40 p-4 space-y-2">
                                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
                                    <span className="inline-flex w-fit rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
                                      {event.date}
                                    </span>
                                    <p className="text-sm font-medium text-foreground">
                                      {event.location}
                                    </p>
                                  </div>
                                  {"details" in event && Array.isArray(event.details) && (
                                    <ul className="space-y-1.5">
                                      {event.details.map((detail, detailIndex) => (
                                        <li
                                          key={`${event.date}-${detailIndex}`}
                                          className="text-sm text-muted-foreground"
                                        >
                                          • {detail}
                                        </li>
                                      ))}
                                    </ul>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    }

                    return (
                      <div key={i} className="space-y-3">
                        <p className="text-sm text-muted-foreground">
                          <span className="font-bold text-foreground">{evt.label} — </span>
                          {evt.text}
                        </p>
                        {"image" in evt && evt.image && (
                          <div className="relative w-full rounded-2xl overflow-hidden shadow-md">
                            <Image
                              src={evt.image}
                              alt={evt.imageAlt ?? ""}
                              width={900}
                              height={500}
                              className="w-full h-auto"
                              quality={85}
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* LINKEDIN */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-foreground">{linkedin.title}</h2>
              <p className="text-sm text-muted-foreground">{linkedin.text}</p>

              <div className="flex justify-center">
                <div className="relative w-full max-w-[560px] h-[980px] sm:h-[900px] lg:h-[820px] rounded-2xl overflow-hidden border border-blue-100 bg-white shadow-sm transition-shadow hover:shadow-md">
                  <a
                    href={linkedin.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Ouvrir le post LinkedIn: ${linkedin.title}`}
                    className="absolute inset-0 z-10"
                  />
                  <iframe
                    src={linkedin.embedUrl}
                    className="w-full h-full pointer-events-none"
                    frameBorder="0"
                    allowFullScreen
                    title={linkedin.title}
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

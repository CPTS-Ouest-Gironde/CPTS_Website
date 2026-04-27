"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Calendar, Clock, MapPin, CheckCircle2, ExternalLink, Users, Info } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import data from "@/app/data/formations.json";

type FormationStatus = "available" | "complete" | "past" | "upcoming";

interface Formation {
  id: string;
  title: string;
  subtitle?: string;
  date: string;
  status: FormationStatus;
  category: string;
  duration?: string;
  location?: string;
  link?: string;
  linkLabel?: string;
  note?: string;
  speakers?: string;
  partners?: string;
  images?: { src: string; alt: string }[];
  partnerLinks?: { label: string; url: string }[];
  registrationStatusLabel?: string;
}

interface FormationWithMeta extends Formation {
  effectiveStatus: FormationStatus;
  parsedDate: Date | null;
}

const FRENCH_MONTHS: Record<string, number> = {
  janvier: 0,
  fevrier: 1,
  février: 1,
  mars: 2,
  avril: 3,
  mai: 4,
  juin: 5,
  juillet: 6,
  aout: 7,
  août: 7,
  septembre: 8,
  octobre: 9,
  novembre: 10,
  decembre: 11,
  décembre: 11,
};

function parseFormationDate(value: string): Date | null {
  const normalized = value.trim().toLowerCase();

  const slashPattern =
    /(\d{1,2})(?:\s*\/\s*\d{1,2}){1,2}\s+([a-zéûêôîàç]+)\s+(\d{4})/i;
  const slashMatch = normalized.match(slashPattern);
  if (slashMatch) {
    const day = Number.parseInt(slashMatch[1], 10);
    const month = FRENCH_MONTHS[slashMatch[2]];
    const year = Number.parseInt(slashMatch[3], 10);
    if (Number.isInteger(day) && month !== undefined && Number.isInteger(year)) {
      return new Date(year, month, day, 12, 0, 0, 0);
    }
  }

  const rangePattern =
    /(\d{1,2})(?:\s*(?:,|et|au|-)\s*\d{1,2})*\s+([a-zéûêôîàç]+)\s+(\d{4})/i;
  const rangeMatch = normalized.match(rangePattern);
  if (rangeMatch) {
    const day = Number.parseInt(rangeMatch[1], 10);
    const month = FRENCH_MONTHS[rangeMatch[2]];
    const year = Number.parseInt(rangeMatch[3], 10);
    if (Number.isInteger(day) && month !== undefined && Number.isInteger(year)) {
      return new Date(year, month, day, 12, 0, 0, 0);
    }
  }

  return null;
}

function normalizeStatus(formation: Formation, today: Date): FormationWithMeta {
  const parsedDate = parseFormationDate(formation.date);
  let effectiveStatus = formation.status;

  if (
    parsedDate &&
    parsedDate < today &&
    (formation.status === "available" || formation.status === "upcoming")
  ) {
    effectiveStatus = "past";
  }

  return {
    ...formation,
    effectiveStatus,
    parsedDate,
  };
}

function sortByTemporalOrder(items: FormationWithMeta[]): FormationWithMeta[] {
  return [...items].sort((a, b) => {
    if (a.parsedDate && b.parsedDate) return a.parsedDate.getTime() - b.parsedDate.getTime();
    if (a.parsedDate && !b.parsedDate) return -1;
    if (!a.parsedDate && b.parsedDate) return 1;
    return a.title.localeCompare(b.title, "fr");
  });
}

function sortArchivesByDateDesc(items: FormationWithMeta[]): FormationWithMeta[] {
  return [...items].sort((a, b) => {
    if (a.parsedDate && b.parsedDate) return b.parsedDate.getTime() - a.parsedDate.getTime();
    if (a.parsedDate && !b.parsedDate) return -1;
    if (!a.parsedDate && b.parsedDate) return 1;
    return a.title.localeCompare(b.title, "fr");
  });
}

export default function FormationsPage() {
  const [activeTab, setActiveTab] = useState<"simairlec" | "autres">("simairlec");

  const formationsSimairlec2026: Formation[] = data.formationsSimairlec2026 as Formation[];
  const formationsSimairlecArchives: Formation[] = data.formationsSimairlecArchives as Formation[];
  const autresFormations2026: Formation[] = data.autresFormations2026 as Formation[];
  const autresFormationsArchives: Formation[] = data.autresFormationsArchives as Formation[];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const simairlecCurrent = sortByTemporalOrder(
    formationsSimairlec2026.map((formation) => normalizeStatus(formation, today)),
  );
  const simairlecArchives = sortArchivesByDateDesc(
    formationsSimairlecArchives.map((formation) => normalizeStatus(formation, today)),
  );

  const autresCurrentAll = autresFormations2026.map((formation) =>
    normalizeStatus(formation, today),
  );
  const autresCurrent = sortByTemporalOrder(
    autresCurrentAll.filter((formation) => formation.effectiveStatus !== "past"),
  );
  const autresArchivesMerged = sortArchivesByDateDesc([
    ...autresCurrentAll.filter((formation) => formation.effectiveStatus === "past"),
    ...autresFormationsArchives.map((formation) => normalizeStatus(formation, today)),
  ]);

  const getStatusBadge = (status: FormationStatus) => {
    switch (status) {
      case "available":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
            <Calendar className="w-3.5 h-3.5" />
            Inscriptions ouvertes
          </span>
        );
      case "complete":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-muted text-muted-foreground text-xs font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Complet
          </span>
        );
      case "upcoming":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-semibold">
            <Calendar className="w-3.5 h-3.5" />
            À venir
          </span>
        );
      case "past":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 text-gray-500 text-xs font-semibold">
            Terminée
          </span>
        );
    }
  };

  const FormationCard = ({ formation }: { formation: FormationWithMeta }) => (
    <Card className={`border-2 rounded-2xl overflow-hidden ${
      formation.effectiveStatus === "available"
        ? "border-primary/20 bg-primary/5"
        : formation.effectiveStatus === "upcoming"
        ? "border-amber-200 bg-amber-50/30"
        : formation.effectiveStatus === "complete"
        ? "border-gray-200 bg-muted/30"
        : "border-gray-200 bg-gray-50/50"
    }`}>
      <CardContent className="p-6">
        <div className="flex flex-col gap-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <h3 className="text-lg font-bold text-foreground leading-tight">
                {formation.title}
              </h3>
              {formation.subtitle && (
                <p className="text-sm text-muted-foreground mt-0.5 italic">{formation.subtitle}</p>
              )}
            </div>
            {getStatusBadge(formation.effectiveStatus)}
          </div>

          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" />
              <span>{formation.date}</span>
            </div>
            {formation.duration && (
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                <span>{formation.duration}</span>
              </div>
            )}
            {formation.location && (
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                <span>{formation.location}</span>
              </div>
            )}
          </div>

          {formation.speakers && (
            <div className="flex items-start gap-2 text-sm text-muted-foreground">
              <Users className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              <span>{formation.speakers}</span>
            </div>
          )}

          {formation.partners && (
            <div className="text-sm text-muted-foreground">
              <span className="font-medium">Partenaires : </span>
              {formation.partners}
            </div>
          )}

          {formation.partnerLinks && formation.partnerLinks.length > 0 && (
            <div className="text-sm text-muted-foreground">
              <span className="font-medium">Partenaires : </span>
              <span className="inline-flex flex-wrap gap-x-3 gap-y-1">
                {formation.partnerLinks.map((partner) => (
                  <a
                    key={partner.url}
                    href={partner.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:text-primary/80 hover:underline font-medium"
                  >
                    {partner.label}
                  </a>
                ))}
              </span>
            </div>
          )}

          {formation.note && (
            <div className="flex items-start gap-2 text-sm text-muted-foreground bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">
              <Info className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
              <span className="italic">{formation.note}</span>
            </div>
          )}

          {formation.link && (
            <a
              href={formation.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-semibold text-sm transition-colors"
            >
              {formation.linkLabel || "S'inscrire sur Digiforma"}
              <ExternalLink className="w-4 h-4" />
            </a>
          )}

          {!formation.link && formation.registrationStatusLabel && (
            <p className="text-sm font-semibold text-muted-foreground">
              {formation.registrationStatusLabel}
            </p>
          )}

          {formation.images && formation.images.length > 0 && (
            <details className="group rounded-xl border border-border/70 bg-background/80 px-4 py-3">
              <summary className="cursor-pointer list-none text-sm font-semibold text-foreground/90">
                <span className="inline-flex items-center gap-2">
                  Voir les visuels du webinaire
                  <span className="text-xs text-muted-foreground transition-transform group-open:rotate-180">▾</span>
                </span>
              </summary>
              <div className="mt-3 grid grid-cols-1 gap-3">
                {formation.images.map((image) => (
                  <div key={image.src} className="overflow-hidden rounded-lg border border-border/60 bg-card">
                    <div
                      className={`relative bg-white ${
                        image.src.includes("logo-participants")
                          ? "aspect-[1198/226]"
                          : "aspect-[1198/1204]"
                      }`}
                    >
                      <Image
                        src={image.src}
                        alt={image.alt}
                        fill
                        className={`object-contain ${
                          image.src.includes("logo-participants") ? "p-2 md:p-3" : "p-1"
                        }`}
                        sizes="(max-width: 768px) 100vw, 720px"
                        quality={85}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </details>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-16 lg:py-20 bg-gradient-to-br from-primary/5 to-accent/5">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-4xl mx-auto text-center space-y-6">
              <h1 className="text-4xl lg:text-6xl font-bold text-foreground text-balance">
                Les formations
              </h1>
              <p className="text-xl lg:text-2xl text-muted-foreground text-pretty">
                Les formations prises en charge par la CPTS pour ses adhérents
              </p>
              <div className="flex items-center justify-center gap-2 pt-4">
                <a
                  href="https://airlecairespace.com/fr/simairlec-fr/trainings-fr/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-white hover:bg-primary/90 font-semibold transition-colors"
                >
                  Simairlec - Formations en simulation
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Tabs Navigation */}
        <section className="sticky top-16 z-20 bg-background/95 backdrop-blur-sm border-b border-border">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="flex justify-center gap-2 py-4">
              <button
                onClick={() => setActiveTab("simairlec")}
                className={`px-6 py-3 rounded-full font-semibold transition-all ${
                  activeTab === "simairlec"
                    ? "bg-primary text-white shadow-lg"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                Simairlec 2026
              </button>
              <button
                onClick={() => setActiveTab("autres")}
                className={`px-6 py-3 rounded-full font-semibold transition-all ${
                  activeTab === "autres"
                    ? "bg-primary text-white shadow-lg"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                Soirées thématiques
              </button>
            </div>
          </div>
        </section>

        {/* Formations Simairlec */}
        {activeTab === "simairlec" && (
          <section className="py-16 lg:py-20">
            <div className="container mx-auto px-4 lg:px-8">
              <div className="max-w-5xl mx-auto space-y-12">
                {/* Formations 2026 */}
                <div>
                  <div className="flex items-center gap-3 mb-8">
                    <h2 className="text-3xl font-bold text-foreground">
                      Formations 2026
                    </h2>
                    <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold">
                      {simairlecCurrent.filter(f => f.effectiveStatus === "available").length} disponibles
                    </span>
                  </div>
                  <div className="grid gap-4">
                    {simairlecCurrent.map((formation) => (
                      <FormationCard key={formation.id} formation={formation} />
                    ))}
                  </div>
                </div>

                {/* Archives */}
                <div>
                  <div className="flex items-center gap-3 mb-8">
                    <h2 className="text-3xl font-bold text-muted-foreground">
                      Archives
                    </h2>
                  </div>
                  <div className="grid gap-4 opacity-60">
                    {simairlecArchives.map((formation) => (
                      <FormationCard key={formation.id} formation={formation} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Soirées thématiques */}
        {activeTab === "autres" && (
          <section className="py-16 lg:py-20">
            <div className="container mx-auto px-4 lg:px-8">
              <div className="max-w-5xl mx-auto space-y-12">

                {/* Formations 2026 */}
                <div>
                  <div className="flex items-center gap-3 mb-8">
                    <h2 className="text-3xl font-bold text-foreground">
                      Soirées thématiques 2026
                    </h2>
                    <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold">
                      {autresCurrent.length} soirées
                    </span>
                  </div>
                  <div className="grid gap-4">
                    {autresCurrent.map((formation) => (
                      <FormationCard key={formation.id} formation={formation} />
                    ))}
                  </div>
                </div>

                {/* Archives */}
                <div>
                  <div className="flex items-center gap-3 mb-8">
                    <h2 className="text-3xl font-bold text-muted-foreground">
                      Archives
                    </h2>
                  </div>
                  <div className="grid gap-4 opacity-60">
                    {autresArchivesMerged.map((formation) => (
                      <FormationCard key={formation.id} formation={formation} />
                    ))}
                  </div>
                </div>

              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}

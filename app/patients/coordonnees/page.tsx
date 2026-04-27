"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Phone,
  Search,
  ShieldCheck,
  Flame,
  Ambulance,
  Pill,
  Hospital,
  Heart,
  Stethoscope,
  Baby,
  HeartPulse,
  Hand,
  Eye,
  Ear,
  Footprints,
  ShieldAlert,
  GraduationCap,
  ExternalLink,
  AlertTriangle,
  FlaskConical,
  MessageSquare,
  Smile,
  Brain,
  School,
  Network,
  FileText,
  Copy,
} from "lucide-react";
import coordonneesData from "@/app/data/coordonnees.json";
import { AnnuaireModal } from "@/components/sante-mental/annuaire-modal";

const iconMap: Record<string, React.ElementType> = {
  Phone,
  ShieldCheck,
  Flame,
  Ambulance,
  Pill,
  Hospital,
  Heart,
  Stethoscope,
  Baby,
  HeartPulse,
  Hand,
  Eye,
  Ear,
  Footprints,
  ShieldAlert,
  GraduationCap,
  AlertTriangle,
};

export default function CoordonneesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("tous");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const copyPhone = async (phone: string) => {
    try {
      await navigator.clipboard.writeText(phone);
    } catch {
      // No-op if clipboard is unavailable
    }
  };

  // Filter and search contacts
  const filteredContacts = useMemo(() => {
    let contacts = coordonneesData.allContacts;

    // Apply category filter
    if (activeFilter !== "tous") {
      contacts = contacts.filter((c) => c.category === activeFilter);
    }

    // Apply search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      contacts = contacts.filter(
        (c) =>
          c.label.toLowerCase().includes(query) ||
          c.number.toLowerCase().includes(query) ||
          c.description.toLowerCase().includes(query)
      );
    }

    return contacts;
  }, [searchQuery, activeFilter]);

  return (
    <main className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-background to-secondary/10">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-foreground leading-tight">
                {coordonneesData.hero.title}
              </h1>
              <p className="text-lg lg:text-xl text-muted-foreground leading-relaxed">
                {coordonneesData.hero.subtitle}
              </p>
            </div>
            <div className="relative">
              <div className="aspect-square relative">
                <Image
                  src={coordonneesData.hero.illustration}
                  alt="Centre d'appel"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4">
          <Card className="shadow-lg">
            <CardContent className="p-6 space-y-6">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Rechercher un service, un numéro..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-14 text-lg rounded-2xl"
                />
              </div>

              {/* Filters */}
              <div className="flex flex-wrap gap-2">
                {coordonneesData.filters.map((filter) => (
                  <Badge
                    key={filter.id}
                    variant={activeFilter === filter.id ? "default" : "outline"}
                    className="cursor-pointer px-4 py-2 text-sm hover:bg-primary/10 transition-colors rounded-full"
                    onClick={() => setActiveFilter(filter.id)}
                  >
                    {filter.label}
                  </Badge>
                ))}
              </div>

              {/* Results Count */}
              <p className="text-sm text-muted-foreground">
                {filteredContacts.length} contact
                {filteredContacts.length > 1 ? "s" : ""} trouvé
                {filteredContacts.length > 1 ? "s" : ""}
              </p>

              {/* Contacts Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredContacts.map((contact) => {
                  const Icon = iconMap[contact.iconName] || Phone;
                  return (
                    <Card
                      key={contact.id}
                      className="hover:shadow-md transition-shadow border-2"
                    >
                      <CardContent className="p-4 space-y-3">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <Icon className="w-5 h-5 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-sm text-foreground mb-1 leading-tight">
                              {contact.label}
                            </h3>
                            {contact.number && (
                              <a
                                href={`tel:${contact.number.replace(/\s/g, "")}`}
                                className="text-lg font-bold text-primary hover:underline block"
                              >
                                {contact.number}
                              </a>
                            )}
                            {contact.phone2 && (
                              <a
                                href={`tel:${contact.phone2.replace(/\s/g, "")}`}
                                className="text-sm text-muted-foreground hover:underline block mt-1"
                              >
                                {contact.phone2}
                              </a>
                            )}
                            {contact.description && (
                              <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                                {contact.description}
                              </p>
                            )}
                            {contact.link && (
                              <Link
                                href={contact.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-primary hover:underline flex items-center gap-1 mt-2"
                              >
                                Prendre RDV
                                <ExternalLink className="w-3 h-3" />
                              </Link>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {filteredContacts.length === 0 && (
                <div className="text-center py-12">
                  {activeFilter === "sante-mentale" ? (
                    <div className="space-y-4">
                      <p className="text-muted-foreground text-lg">
                        Pour consulter l'annuaire complet des professionnels de santé mentale
                      </p>
                      <button
                        onClick={() => setIsModalOpen(true)}
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-lg font-semibold transition-all duration-300 hover:bg-primary/90 hover:shadow-lg"
                      >
                        Accéder à l'annuaire santé mentale
                      </button>
                    </div>
                  ) : (
                    <p className="text-muted-foreground">
                      Aucun contact trouvé pour votre recherche
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Consultations Non Programmées Section */}
      <section className="py-16 bg-secondary/10">
        <div className="container mx-auto px-4 max-w-6xl">
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div className="grid lg:grid-cols-[55%_45%] gap-0">
                {/* Text Content */}
                <div className="p-8 lg:p-10 space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-destructive/10 flex items-center justify-center">
                      <Phone className="w-6 h-6 text-destructive" />
                    </div>
                    <h2 className="text-2xl lg:text-3xl font-bold text-foreground">
                      {coordonneesData.consultationsNonProgrammees.title}
                    </h2>
                  </div>
                  <ol className="space-y-4">
                    {coordonneesData.consultationsNonProgrammees.steps.map(
                      (step, index) => (
                        <li key={index} className="flex gap-3">
                          <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                            {index + 1}
                          </span>
                          <span className="text-muted-foreground leading-relaxed">
                            {step}
                          </span>
                        </li>
                      )
                    )}
                  </ol>
                </div>

                {/* Image */}
                <div className="relative h-full min-h-[300px] lg:min-h-[400px]">
                  <Image
                    src={coordonneesData.consultationsNonProgrammees.image}
                    alt="Consultations non programmées"
                    fill
                    className="object-contain p-6"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Urgences Non Vitales Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4 text-destructive">
            {coordonneesData.urgencesNonVitales.title}
          </h2>
          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {coordonneesData.urgencesNonVitales.items.map((item, index) => {
              const phonesFromDescription =
                item.description?.match(/\b0\d(?:[\s.]\d{2}){4}\b/g) ?? [];
              const phoneNumbers = Array.from(
                new Set([item.phone, ...phonesFromDescription].filter(Boolean))
              ) as string[];

              return (
                <Card key={index} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6 space-y-3">
                    <h3 className="font-bold text-foreground">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {item.description}
                    </p>
                    {item.details && (
                      <p className="text-sm text-muted-foreground">
                        {item.details}
                      </p>
                    )}
                    {phoneNumbers.length > 0 && (
                      <div className="space-y-2">
                        {phoneNumbers.map((phone) => (
                          <div key={phone} className="flex items-center gap-2">
                            <a
                              href={`tel:${phone.replace(/[\s.]/g, "")}`}
                              className="text-primary hover:underline font-semibold block"
                            >
                              {phone}
                            </a>
                            <button
                              type="button"
                              onClick={() => copyPhone(phone)}
                              className="inline-flex items-center justify-center rounded-md border border-primary/30 p-1.5 text-primary hover:bg-primary/10 transition-colors"
                              aria-label={`Copier le numéro ${phone}`}
                              title="Copier le numéro"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    {item.link && (
                      <Link
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline flex items-center gap-2 text-sm"
                      >
                        Accéder au service
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Ressources Santé Mentale Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {coordonneesData.ressourcesSanteMentale.map((resource) => (
              <Card
                key={resource.id}
                className="flex flex-col overflow-hidden"
              >
                {/* Image Section - Full visibility */}
                <div className="relative aspect-[4/3] bg-muted">
                  <Image
                    src={resource.image}
                    alt={resource.title}
                    fill
                    className="object-contain p-4"
                  />
                </div>

                {/* Content Section */}
                <CardContent className="p-6 space-y-4 flex flex-col flex-1">
                  <div className="space-y-3">
                    <h3 className="font-bold text-xl text-foreground">
                      {resource.title}
                    </h3>
                    {resource.subtitle && (
                      <p className="text-sm text-muted-foreground">
                        {resource.subtitle}
                      </p>
                    )}
                    {resource.phone && (
                      <div className="bg-primary/10 rounded-lg p-3 border-2 border-primary">
                        <p className="text-lg font-bold text-primary text-center">
                          {resource.phone}
                        </p>
                      </div>
                    )}
                    {resource.schedule && (
                      <p className="text-sm text-muted-foreground text-center">
                        {resource.schedule}
                      </p>
                    )}
                  </div>

                  {/* Buttons Section */}
                  {resource.buttons && resource.buttons.length > 0 && (
                    <div className="space-y-2 mt-auto">
                      {(resource.id === "3114" || resource.id === "3919") && (
                        <Link
                          href={resource.id === "3114" ? "tel:3114" : "tel:3919"}
                          className="block w-full"
                        >
                          <div
                            className={`${
                              resource.id === "3114"
                                ? "bg-amber-200 hover:bg-amber-300 border-amber-300 text-amber-900"
                                : "bg-rose-200 hover:bg-rose-300 border-rose-300 text-rose-900"
                            } border rounded-lg px-4 py-3 text-center text-sm font-semibold transition-colors flex items-center justify-center gap-2`}
                          >
                            <Phone className="w-4 h-4" />
                            {resource.id === "3114"
                              ? "Appeler le 3114"
                              : "Appeler le 39 19"}
                          </div>
                        </Link>
                      )}
                      {resource.buttons?.map((button, index) => (
                        <Link
                          key={index}
                          href={button.pdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block w-full"
                        >
                          <div className="bg-muted hover:bg-muted/70 rounded-lg px-4 py-3 text-center text-sm font-medium text-foreground transition-colors flex items-center justify-center gap-2">
                            <FileText className="w-4 h-4" />
                            {button.label}
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Infos du Territoire Section */}
      <section className="py-16 bg-secondary/10">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Infos du territoire
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {coordonneesData.territoireInfos.map((info) => {
              const iconMap: Record<string, React.ElementType> = {
                laboratoires: FlaskConical,
                orthophoniste: MessageSquare,
                "soins-dentaires": Smile,
                "sante-mentale": Brain,
                "sante-etudiants": School,
                "coordination-girondac": Network,
              };
              const IconComponent = iconMap[info.id] || FlaskConical;

              return (
                <Card key={info.id}>
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <IconComponent className="w-6 h-6 text-primary" />
                      </div>
                      <div className="space-y-2 min-w-0">
                        <h3
                          className="font-bold text-foreground"
                          dangerouslySetInnerHTML={{
                            __html: info.title.replace(
                              /SANTÉ MENTALE|LES LABORATOIRES DE BIOLOGIE|ORTHOPHONISTE|SOINS DENTAIRES EN URGENCE|LA SANTE DES ETUDIANTS|DISPOSITIF D'APPUI à la COORDINATION GIRONDAC/g,
                              (match) =>
                                `<span class="text-destructive">${match}</span>`
                            ),
                          }}
                        />
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {info.description}
                        </p>
                        {info.id === "sante-mentale" ? (
                          <button
                            onClick={() => setIsModalOpen(true)}
                            className="text-primary hover:underline flex items-center gap-2 text-sm mt-2"
                          >
                            En savoir plus
                            <ExternalLink className="w-4 h-4" />
                          </button>
                        ) : info.link ? (
                          <Link
                            href={info.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline flex items-center gap-2 text-sm mt-2"
                          >
                            En savoir plus
                            <ExternalLink className="w-4 h-4" />
                          </Link>
                        ) : null}
                        {info.link2 && (
                          <Link
                            href={info.link2}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline flex items-center gap-2 text-sm"
                          >
                            Secteurs de rattachement
                            <ExternalLink className="w-4 h-4" />
                          </Link>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <Footer />

      <AnnuaireModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </main>
  );
}

"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import {
  Phone,
  MapPin,
  Copy,
  Check,
  ArrowLeft,
  Baby,
  GraduationCap,
  Briefcase,
  TreeDeciduous,
  ExternalLink,
  AlertTriangle,
  BookOpen,
  Users,
  HeartHandshake,
  Shield,
  PhoneCall,
  Mail,
} from "lucide-react";
import Image from "next/image";
import annuaireData from "@/app/data/annuaire-santé-mental.json";

interface AnnuaireModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type AgeCategory = null | string;

interface Resource {
  name: string;
  type: string;
  address: string;
  phone: string;
  email?: string;
  website: string;
  coverage: string;
  access: string;
  notes: string;
  source?: string;
}

interface Section {
  section_title: string;
  resources: Resource[];
}

interface AgeGroup {
  age_group: string;
  sections: Section[];
}

function PhoneLink({ phone }: { phone: string }) {
  const [copied, setCopied] = useState(false);

  if (phone === "non précisé" || phone === "à venir") return null;

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(phone);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  // Format phone for tel: link (remove dots and spaces)
  const telLink = `tel:${phone.replace(/[\s.]/g, "")}`;
  const isFreeCall = phone.startsWith("0800") || phone === "3114" || phone === "119" || phone === "3919" || phone === "15 / 112";

  return (
    <div className="flex items-center gap-2 text-xs">
      <Phone className="w-3 h-3 text-muted-foreground flex-shrink-0" />
      <a
        href={telLink}
        className="text-primary hover:underline font-medium"
        title="Cliquer pour appeler"
      >
        {phone}
      </a>
      {isFreeCall && (
        <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full font-medium">
          Gratuit
        </span>
      )}
      <button
        onClick={handleCopy}
        className="p-1 rounded hover:bg-muted transition-colors flex-shrink-0"
        title="Copier le numéro"
        aria-label="Copier le numéro de téléphone"
      >
        {copied ? (
          <Check className="w-3 h-3 text-green-600" />
        ) : (
          <Copy className="w-3 h-3 text-muted-foreground hover:text-foreground" />
        )}
      </button>
    </div>
  );
}

// Age selection icons and colors
const ageConfig: Record<string, { icon: typeof Baby; color: string; iconColor: string }> = {
  "0–6 ans": {
    icon: Baby,
    color: "bg-pink-50 border-pink-200 hover:bg-pink-100",
    iconColor: "text-pink-600",
  },
  "7–12 ans": {
    icon: BookOpen,
    color: "bg-orange-50 border-orange-200 hover:bg-orange-100",
    iconColor: "text-orange-600",
  },
  "Adolescents / Jeunes adultes (jusqu'à 25 ans)": {
    icon: GraduationCap,
    color: "bg-violet-50 border-violet-200 hover:bg-violet-100",
    iconColor: "text-violet-600",
  },
  "Étudiants de l'enseignement supérieur": {
    icon: GraduationCap,
    color: "bg-indigo-50 border-indigo-200 hover:bg-indigo-100",
    iconColor: "text-indigo-600",
  },
  "Adultes (25–60 ans)": {
    icon: Briefcase,
    color: "bg-sky-50 border-sky-200 hover:bg-sky-100",
    iconColor: "text-sky-600",
  },
  "Seniors (60 ans et +)": {
    icon: TreeDeciduous,
    color: "bg-amber-50 border-amber-200 hover:bg-amber-100",
    iconColor: "text-amber-600",
  },
  "Tous âges": {
    icon: Users,
    color: "bg-emerald-50 border-emerald-200 hover:bg-emerald-100",
    iconColor: "text-emerald-600",
  },
};

// Formulaire d'orientation par âge
function AgeSelectionForm({
  onSelect,
}: {
  onSelect: (category: AgeCategory) => void;
}) {
  const ageGroups = annuaireData.age_groups as AgeGroup[];

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-xl font-bold text-foreground">
          Pour mieux vous orienter
        </h3>
        <p className="text-muted-foreground text-sm">
          Sélectionnez votre tranche d'âge pour voir les structures adaptées
        </p>
      </div>

      <div className="grid gap-3">
        {ageGroups.map((group) => {
          const config = ageConfig[group.age_group] || {
            icon: Users,
            color: "bg-gray-50 border-gray-200 hover:bg-gray-100",
            iconColor: "text-gray-600",
          };
          const Icon = config.icon;

          return (
            <button
              key={group.age_group}
              onClick={() => onSelect(group.age_group === "Tous âges" ? null : group.age_group)}
              className={`group relative flex items-center gap-4 p-4 rounded-2xl border-2 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg ${config.color}`}
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-white/80 shadow-sm">
                <Icon className={`w-6 h-6 ${config.iconColor}`} />
              </div>
              <div className="text-left flex-1">
                <p className="font-bold text-foreground">{group.age_group}</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-white/80 flex items-center justify-center group-hover:bg-white transition-colors">
                <svg
                  className="w-4 h-4 text-muted-foreground group-hover:translate-x-0.5 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </button>
          );
        })}
      </div>

      <button
        onClick={() => onSelect(null)}
        className="w-full text-center text-sm text-muted-foreground hover:text-primary transition-colors py-2"
      >
        Voir tout l'annuaire
      </button>
    </div>
  );
}

// Resource card component
function ResourceCard({ resource }: { resource: Resource }) {
  const hasAddress = resource.address !== "non précisé" && resource.address !== "à venir";
  const hasEmail = !!resource.email && resource.email !== "non précisé" && resource.email !== "à venir";
  const hasWebsite = resource.website !== "non précisé" && resource.website !== "à venir";
  const hasNotes = resource.notes !== "non précisé" && resource.notes !== "à venir";
  const isComingSoon = resource.name === "à venir";

  if (isComingSoon) {
    return (
      <div className="bg-muted/50 p-4 rounded-xl border border-dashed border-muted-foreground/30">
        <p className="text-muted-foreground text-sm italic text-center">
          Informations à venir prochainement
        </p>
      </div>
    );
  }

  return (
    <div className="bg-background/50 p-4 rounded-xl space-y-2">
      <div className="flex items-start justify-between gap-2">
        <p className="font-semibold text-sm">{resource.name}</p>
        <span className="text-[10px] bg-muted px-2 py-0.5 rounded-full text-muted-foreground whitespace-nowrap">
          {resource.type}
        </span>
      </div>

      {hasAddress && (
        <div className="flex items-start gap-2 text-xs text-muted-foreground">
          <MapPin className="w-3 h-3 mt-0.5 flex-shrink-0" />
          <span>{resource.address}</span>
        </div>
      )}

      <PhoneLink phone={resource.phone} />

      {hasEmail && (
        <div className="flex items-center gap-2 text-xs">
          <Mail className="w-3 h-3 text-muted-foreground flex-shrink-0" />
          <a
            href={`mailto:${resource.email}`}
            className="text-primary hover:underline font-medium break-all"
            title="Envoyer un email"
          >
            {resource.email}
          </a>
        </div>
      )}

      {hasWebsite && (
        <a
          href={resource.website}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-xs text-primary hover:underline"
        >
          <ExternalLink className="w-3 h-3" />
          <span>Accéder au site</span>
        </a>
      )}

      {hasNotes && (
        <p className="text-xs text-muted-foreground italic bg-muted/50 p-2 rounded-lg">
          {resource.notes}
        </p>
      )}
    </div>
  );
}

// Emergency numbers section with improved design
function EmergencyNumbersSection({ resources }: { resources: Resource[] }) {
  // Separate 3114 from other numbers
  const numero3114 = resources.find(r => r.phone === "3114");
  const urgences = resources.find(r => r.phone === "15 / 112");
  const otherNumbers = resources.filter(r => r.phone !== "3114" && r.phone !== "15 / 112");

  return (
    <div className="space-y-4 pt-6 border-t-2 border-amber-300">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-amber-100">
          <PhoneCall className="w-5 h-5 text-amber-600" />
        </div>
        <h3 className="text-lg font-bold text-foreground">Numéros d'urgence et d'écoute</h3>
      </div>

      {/* 3114 - Hero card with official logo */}
      {numero3114 && (
        <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl p-6 border-2 border-amber-200 shadow-sm">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex-shrink-0">
              <a href="tel:3114" className="block hover:scale-105 transition-transform">
                <Image
                  src="/santé-mental/3114-annuaire.png"
                  alt="3114 - Numéro national de prévention du suicide"
                  width={160}
                  height={80}
                  className="object-contain"
                />
              </a>
            </div>
            <div className="flex-1 text-center md:text-left">
              <h4 className="text-lg font-bold text-amber-900 mb-1">
                Numéro national de prévention du suicide
              </h4>
              <p className="text-amber-800 text-sm mb-3">
                24h/24, 7j/7 - Gratuit et confidentiel
              </p>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-semibold">
                  Gratuit
                </span>
                <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full font-semibold">
                  Anonyme
                </span>
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-semibold">
                  24h/24
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Urgences 15/112 */}
      {urgences && (
        <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-2xl p-4 border-2 border-red-200">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <Shield className="w-7 h-7 text-red-600" />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-red-900">Urgences vitales</h4>
              <p className="text-red-700 text-sm">SAMU / Urgences européennes</p>
            </div>
            <a
              href="tel:15"
              className="px-5 py-2.5 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-colors text-lg"
            >
              15 / 112
            </a>
          </div>
        </div>
      )}

      {/* Other emergency numbers in grid */}
      <Card className="border-gray-200 rounded-2xl overflow-hidden bg-white">
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-wide">
              Lignes d'écoute et d'aide
            </h4>
            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-semibold">
              Tous gratuits
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {otherNumbers.map((resource, idx) => (
              <div
                key={idx}
                className="bg-gray-50 hover:bg-gray-100 p-3 rounded-xl transition-colors group"
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm">
                    <HeartHandshake className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-foreground truncate" title={resource.name}>
                      {resource.name}
                    </p>
                    <a
                      href={`tel:${resource.phone.replace(/[\s.]/g, "")}`}
                      className="text-primary font-bold text-sm hover:underline mt-1 inline-block"
                    >
                      {resource.phone}
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Deduplicate resources across all age groups for the "full directory" view
function buildDeduplicatedSections(ageGroups: AgeGroup[]): Section[] {
  const resourceKey = (r: Resource) => `${r.name}|${r.phone}|${r.address}`;
  const sectionMap = new Map<string, { resources: Resource[]; seen: Set<string> }>();
  const sectionOrder: string[] = [];

  for (const group of ageGroups) {
    for (const section of group.sections) {
      if (!sectionMap.has(section.section_title)) {
        sectionMap.set(section.section_title, { resources: [], seen: new Set() });
        sectionOrder.push(section.section_title);
      }
      const entry = sectionMap.get(section.section_title)!;
      for (const resource of section.resources) {
        const key = resourceKey(resource);
        if (!entry.seen.has(key)) {
          entry.seen.add(key);
          entry.resources.push(resource);
        }
      }
    }
  }

  return sectionOrder.map((title) => ({
    section_title: title,
    resources: sectionMap.get(title)!.resources,
  }));
}

// Contenu de l'annuaire filtré
function AnnuaireContent({
  category,
  onBack,
}: {
  category: AgeCategory;
  onBack: () => void;
}) {
  const ageGroups = annuaireData.age_groups as AgeGroup[];
  const isEmergencySection = (sectionTitle: string) =>
    sectionTitle.toLowerCase().includes("urgence");

  // Always show "Tous âges" section (emergency numbers) for specific age categories
  const tousAgesGroup = ageGroups.find(g => g.age_group === "Tous âges");
  const showTousAges = category !== null && category !== "Tous âges" && tousAgesGroup;
  const tousAgesAidantsSections = (tousAgesGroup?.sections || []).filter(
    (s) => !isEmergencySection(s.section_title)
  );
  const tousAgesEmergencyResources =
    tousAgesGroup?.sections.find((s) => isEmergencySection(s.section_title))
      ?.resources || [];

  // For "full directory" view: deduplicated flat sections
  const isFullView = category === null;
  const deduplicatedSections = isFullView ? buildDeduplicatedSections(ageGroups) : [];

  // For specific age group view
  const filteredGroups = isFullView
    ? []
    : ageGroups.filter(g => g.age_group === category);

  return (
    <div className="space-y-6">
      {/* Bouton retour */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span className="text-sm font-medium">Modifier ma sélection</span>
      </button>

      <div className="text-center space-y-1">
        <h3 className="text-xl font-bold text-foreground">
          {isFullView ? "Annuaire complet" : `Ressources : ${category}`}
        </h3>
        {category && category !== "Tous âges" && (
          <p className="text-muted-foreground text-sm">
            Voici les structures adaptées à votre profil
          </p>
        )}
      </div>

      {/* Vue annuaire complet : sections dédupliquées */}
      {isFullView && deduplicatedSections.map((section) => {
        if (isEmergencySection(section.section_title)) {
          return (
            <EmergencyNumbersSection
              key={section.section_title}
              resources={section.resources}
            />
          );
        }
        return (
          <Card key={section.section_title} className="border-border rounded-2xl overflow-hidden bg-card">
            <CardContent className="p-5">
              <h4 className="text-base font-bold text-card-foreground mb-4">
                {section.section_title}
              </h4>
              <div className="grid md:grid-cols-2 gap-3">
                {section.resources.map((resource, idx) => (
                  <ResourceCard key={idx} resource={resource} />
                ))}
              </div>
            </CardContent>
          </Card>
        );
      })}

      {/* Vue par tranche d'âge : affichage normal par groupe */}
      {!isFullView && filteredGroups.map((group) => {
        if (group.age_group === "Tous âges") {
          const emergencySection = group.sections.find((s) =>
            isEmergencySection(s.section_title)
          );
          const otherSections = group.sections.filter(
            (s) => !isEmergencySection(s.section_title)
          );

          return (
            <div key={group.age_group} className="space-y-4">
              {otherSections.map((section) => (
                <Card key={section.section_title} className="border-border rounded-2xl overflow-hidden bg-card">
                  <CardContent className="p-5">
                    <h4 className="text-base font-bold text-card-foreground mb-4">
                      {section.section_title}
                    </h4>
                    <div className="grid md:grid-cols-2 gap-3">
                      {section.resources.map((resource, idx) => (
                        <ResourceCard key={idx} resource={resource} />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
              {emergencySection && (
                <EmergencyNumbersSection resources={emergencySection.resources} />
              )}
            </div>
          );
        }

        return (
          <div key={group.age_group} className="space-y-4">
            {group.sections.map((section) => (
              <Card key={section.section_title} className="border-border rounded-2xl overflow-hidden bg-card">
                <CardContent className="p-5">
                  <h4 className="text-base font-bold text-card-foreground mb-4 flex items-center gap-2">
                    {section.section_title.includes("urgence") && (
                      <AlertTriangle className="w-4 h-4 text-red-500" />
                    )}
                    {section.section_title}
                  </h4>
                  <div className="grid md:grid-cols-2 gap-3">
                    {section.resources.map((resource, idx) => (
                      <ResourceCard key={idx} resource={resource} />
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        );
      })}

      {/* Numéros d'urgence et aidants affichés pour toutes les catégories d'âge */}
      {showTousAges && (
        <div className="space-y-4 pt-2">
          {tousAgesAidantsSections.map((section) => (
            <Card
              key={section.section_title}
              className="border-border rounded-2xl overflow-hidden bg-card"
            >
              <CardContent className="p-5">
                <h4 className="text-base font-bold text-card-foreground mb-4">
                  {section.section_title}
                </h4>
                <div className="grid md:grid-cols-2 gap-3">
                  {section.resources.map((resource, idx) => (
                    <ResourceCard key={idx} resource={resource} />
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}

          <EmergencyNumbersSection resources={tousAgesEmergencyResources} />
        </div>
      )}
    </div>
  );
}

export function AnnuaireModal({ isOpen, onClose }: AnnuaireModalProps) {
  const [selectedCategory, setSelectedCategory] = useState<AgeCategory | "form">(
    "form"
  );

  // Reset to form when modal closes
  const handleClose = () => {
    setSelectedCategory("form");
    onClose();
  };

  const handleSelect = (category: AgeCategory) => {
    setSelectedCategory(category);
  };

  const handleBack = () => {
    setSelectedCategory("form");
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg md:max-w-2xl lg:max-w-5xl max-h-[85vh] overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-muted-foreground/20 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-muted-foreground/30">
        <DialogHeader>
          <DialogTitle className="text-2xl lg:text-3xl">
            Annuaire Santé Mentale
          </DialogTitle>
          <DialogDescription className="text-base">
            Trouvez les professionnels et structures près de chez vous
          </DialogDescription>
        </DialogHeader>

        <div className="mt-6">
          {selectedCategory === "form" ? (
            <AgeSelectionForm onSelect={handleSelect} />
          ) : (
            <AnnuaireContent category={selectedCategory} onBack={handleBack} />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

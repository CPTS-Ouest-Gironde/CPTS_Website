"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import {
  Phone,
  MapPin,
  Clock,
  Copy,
  Check,
  ExternalLink,
  HeartHandshake,
} from "lucide-react";
import annuaireData from "@/app/data/sante-de-la-femme-annuaire.json";

interface Resource {
  name: string;
  type: string;
  address: string;
  phone: string;
  hours: string;
  services: string;
  website: string;
}

interface Section {
  section_title: string;
  resources: Resource[];
}

interface Commune {
  commune: string;
  sections: Section[];
}

const NOT_PROVIDED = new Set(["non précisé", "à venir"]);
const isProvided = (value: string) => !!value && !NOT_PROVIDED.has(value);

function PhoneLink({ phone }: { phone: string }) {
  const [copied, setCopied] = useState(false);

  if (!isProvided(phone)) return null;

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

  return (
    <div className="flex items-center gap-2 text-xs">
      <Phone className="w-3 h-3 text-muted-foreground flex-shrink-0" />
      <a
        href={`tel:${phone.replace(/[\s.]/g, "")}`}
        className="text-primary hover:underline font-medium"
        title="Cliquer pour appeler"
      >
        {phone}
      </a>
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

function ResourceCard({ resource }: { resource: Resource }) {
  return (
    <div className="bg-background/50 p-4 rounded-xl space-y-2 border border-border/60">
      <div className="flex items-start justify-between gap-2">
        <p className="font-semibold text-sm">{resource.name}</p>
        <span className="text-[10px] bg-muted px-2 py-0.5 rounded-full text-muted-foreground whitespace-nowrap">
          {resource.type}
        </span>
      </div>

      {isProvided(resource.address) && (
        <div className="flex items-start gap-2 text-xs text-muted-foreground">
          <MapPin className="w-3 h-3 mt-0.5 flex-shrink-0" />
          <span>{resource.address}</span>
        </div>
      )}

      <PhoneLink phone={resource.phone} />

      {isProvided(resource.hours) && (
        <div className="flex items-start gap-2 text-xs text-muted-foreground">
          <Clock className="w-3 h-3 mt-0.5 flex-shrink-0" />
          <span>{resource.hours}</span>
        </div>
      )}

      {isProvided(resource.website) && (
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

      {isProvided(resource.services) && (
        <p className="text-xs text-muted-foreground italic bg-muted/50 p-2 rounded-lg">
          {resource.services}
        </p>
      )}
    </div>
  );
}

function CommuneDirectory({ commune }: { commune: Commune }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {commune.sections.map((section) => {
        const isWide = section.resources.length >= 3;
        return (
          <Card
            key={section.section_title}
            className={`border-border rounded-2xl overflow-hidden bg-card ${
              isWide ? "lg:col-span-2" : ""
            }`}
          >
            <CardContent className="p-5">
              <h3 className="text-base font-bold text-card-foreground mb-4 flex items-center gap-2">
                <HeartHandshake className="w-4 h-4 text-primary" />
                {section.section_title}
              </h3>
              <div
                className={
                  isWide
                    ? "grid sm:grid-cols-2 lg:grid-cols-3 gap-3"
                    : "grid gap-3"
                }
              >
                {section.resources.map((resource, idx) => (
                  <ResourceCard key={idx} resource={resource} />
                ))}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

export function SanteFemmeAnnuaire() {
  const communes = annuaireData.communes as Commune[];

  return (
    <Tabs defaultValue={communes[0]?.commune} className="w-full max-w-5xl mx-auto">
      <TabsList className="mx-auto mb-8 h-11 rounded-full">
        {communes.map((commune) => (
          <TabsTrigger
            key={commune.commune}
            value={commune.commune}
            className="rounded-full px-6 text-sm font-semibold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            {commune.commune}
          </TabsTrigger>
        ))}
      </TabsList>

      {communes.map((commune) => (
        <TabsContent key={commune.commune} value={commune.commune}>
          <CommuneDirectory commune={commune} />
        </TabsContent>
      ))}
    </Tabs>
  );
}

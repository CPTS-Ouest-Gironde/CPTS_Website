import type { LucideIcon } from "lucide-react";
import { CalendarDays, ExternalLink, HeartPulse, MapPin } from "lucide-react";
import { SimpleActualitePage } from "@/components/simple-actualite-page";
import data from "@/app/data/journee-coeur-des-femmes.json";

const iconMap: Record<string, LucideIcon> = {
  CalendarDays,
  MapPin,
  HeartPulse,
};

export default function JourneeCoeurDesFemmesPage() {
  return (
    <SimpleActualitePage
      title={data.title}
      imageSrc={data.image}
      imageAlt={data.imageAlt}
      heroClassName="bg-gradient-to-br from-pink-100 via-pink-50/60 to-background"
      posterCardClassName="border-pink-200"
      intro={
        <div className="space-y-6">
          <div className="rounded-2xl border border-pink-200 bg-pink-50 p-5 lg:p-6 space-y-4">
            <p className="text-base lg:text-lg font-semibold text-foreground">
              {data.intro}
            </p>
            <p className="inline-block rounded-full bg-white border border-pink-300 px-4 py-2 text-sm lg:text-base font-semibold text-pink-700">
              {data.evenement.chiffre}
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {data.infos.map((info) => {
              const Icon = iconMap[info.iconName];
              return (
                <div
                  key={info.label}
                  className="rounded-2xl border border-border bg-card p-5 space-y-2"
                >
                  <div className="flex items-center gap-2 text-pink-600">
                    {Icon && <Icon className="w-5 h-5" aria-hidden="true" />}
                    <span className="text-xs font-semibold uppercase tracking-wide">
                      {info.label}
                    </span>
                  </div>
                  <p className="text-foreground font-medium leading-snug">
                    {info.text}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 lg:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <p className="text-muted-foreground leading-relaxed">
              {data.inscription.note}
            </p>
            <a
              href={data.inscription.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-pink-600 text-white px-5 py-2.5 text-sm font-semibold hover:bg-pink-700 transition-colors flex-shrink-0"
            >
              {data.inscription.label}
              <ExternalLink className="w-4 h-4" aria-hidden="true" />
            </a>
          </div>

          <div className="space-y-3">
            <p className="text-muted-foreground leading-relaxed">
              {data.evenement.financement}
            </p>
            <div className="space-y-2">
              <p className="font-semibold text-foreground">
                {data.partenaires.title}
              </p>
              <ul className="flex flex-wrap gap-2">
                {data.partenaires.items.map((item) => (
                  <li
                    key={item}
                    className="rounded-full border border-border bg-card px-3 py-1 text-sm text-muted-foreground"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      }
    />
  );
}

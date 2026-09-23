import type { LucideIcon } from "lucide-react";
import { CalendarDays, ExternalLink, MapPin, Users } from "lucide-react";
import { SimpleActualitePage } from "@/components/simple-actualite-page";
import data from "@/app/data/sante-mentale-jeunes-2026.json";

const iconMap: Record<string, LucideIcon> = {
  CalendarDays,
  MapPin,
  Users,
};

export default function SanteMentaleJeunes2026Page() {
  return (
    <SimpleActualitePage
      title={data.title}
      imageSrc={data.image}
      imageAlt={data.imageAlt}
      posterAspectClassName="aspect-[4/5]"
      intro={
        <div className="space-y-6">
          <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5 lg:p-6 space-y-4">
            <p className="text-base lg:text-lg font-semibold text-foreground">
              {data.intro}
            </p>
            <p className="text-muted-foreground leading-relaxed">
              {data.objectif}
            </p>
            <p className="inline-block rounded-full bg-white border border-primary/30 px-4 py-2 text-sm lg:text-base font-semibold text-primary">
              {data.accroche}
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
                  <div className="flex items-center gap-2 text-primary">
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

          <div className="rounded-2xl border border-border bg-card p-5 lg:p-6 space-y-4">
            <p className="font-semibold text-foreground">{data.programmeTitle}</p>
            <ol className="grid gap-4 sm:grid-cols-2">
              {data.programmeItems.map((item, index) => (
                <li key={item.title} className="flex gap-3">
                  <span
                    className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center"
                    aria-hidden="true"
                  >
                    {index + 1}
                  </span>
                  <div className="space-y-1">
                    <p className="font-semibold text-foreground">{item.title}</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {item.text}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="space-y-2">
            <p className="font-semibold text-foreground">
              {data.intervenants.title}
            </p>
            <ul className="flex flex-wrap gap-2">
              {data.intervenants.items.map((item) => (
                <li
                  key={item}
                  className="rounded-full border border-border bg-card px-3 py-1 text-sm text-muted-foreground"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 lg:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <p className="text-muted-foreground leading-relaxed">
              {data.inscription.note}
            </p>
            <a
              href={data.inscription.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-primary text-primary-foreground px-5 py-2.5 text-sm font-semibold hover:bg-primary/90 transition-colors flex-shrink-0"
            >
              {data.inscription.label}
              <ExternalLink className="w-4 h-4" aria-hidden="true" />
            </a>
          </div>

          <div className="space-y-3">
            <p className="font-semibold text-foreground">{data.video.title}</p>
            <p className="text-muted-foreground leading-relaxed">
              {data.video.text}
            </p>
            <div className="aspect-video w-full rounded-xl overflow-hidden shadow-lg">
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube-nocookie.com/embed/${data.video.youtubeId}`}
                title={data.video.title}
                frameBorder="0"
                allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
            <p className="text-xs text-muted-foreground">{data.video.source}</p>
          </div>
        </div>
      }
    />
  );
}

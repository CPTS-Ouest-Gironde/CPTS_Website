import type { LucideIcon } from "lucide-react";
import { ArrowRight, CalendarDays, Footprints, MapPin } from "lucide-react";
import { SimpleActualitePage } from "@/components/simple-actualite-page";
import data from "@/app/data/octobre-rose-pessac-2026.json";

const iconMap: Record<string, LucideIcon> = {
  CalendarDays,
  MapPin,
  Footprints,
};

export default function OctobreRosePessac2026Page() {
  return (
    <SimpleActualitePage
      title={data.title}
      imageSrc={data.image}
      imageAlt={data.imageAlt}
      carrousel={[
        { src: data.programme.image, alt: data.programme.imageAlt },
      ]}
      intro={
        <div className="space-y-6">
          <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5 lg:p-6 space-y-4">
            <p className="text-base lg:text-lg font-semibold text-foreground">
              {data.intro}
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

          <div className="rounded-2xl border border-border bg-card p-5 lg:p-6 space-y-3">
            <p className="font-semibold text-foreground">{data.programmeTitle}</p>
            <ul className="space-y-2">
              {data.programmeItems.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 text-muted-foreground leading-relaxed"
                >
                  <span
                    className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary"
                    aria-hidden="true"
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3">
            <p className="font-semibold text-foreground">
              {data.autresRendezVous.title}
            </p>
            <ul className="flex flex-wrap gap-2">
              {data.autresRendezVous.items.map((item) => (
                <li
                  key={item}
                  className="rounded-full border border-border bg-card px-3 py-1 text-sm text-muted-foreground"
                >
                  {item}
                </li>
              ))}
            </ul>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {data.autresRendezVous.note}
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 lg:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <p className="text-muted-foreground leading-relaxed">
              {data.depistage.text}
            </p>
            <a
              href={data.depistage.link}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-primary text-primary-foreground px-5 py-2.5 text-sm font-semibold hover:bg-primary/90 transition-colors flex-shrink-0"
            >
              {data.depistage.label}
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </a>
          </div>
        </div>
      }
    />
  );
}

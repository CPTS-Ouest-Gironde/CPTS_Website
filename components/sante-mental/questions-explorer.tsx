"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight, ChevronDown } from "lucide-react";
import { NumeriqueIcon } from "@/components/sante-mental/numerique-icons";

type Zone = { id: string; number: number; title: string; color: string };

type Question = {
  iconName: string;
  question: string;
  answer: string;
  advice: string;
  zone: string;
};

// Teinte claire dérivée de la couleur de zone (fonds, bordures)
const tint = (color: string, pct: number) =>
  `color-mix(in srgb, ${color} ${pct}%, white)`;

export function QuestionsExplorer({
  items,
  zones,
  serifClass,
}: {
  items: Question[];
  zones: Zone[];
  serifClass: string;
}) {
  // -1 = tout replié (mobile). Sur desktop, la première question reste affichée.
  const [open, setOpen] = useState(0);
  const active = open < 0 ? 0 : open;
  const zoneOf = (id: string) => zones.find((z) => z.id === id) ?? zones[0];

  const Detail = ({ item }: { item: Question }) => {
    const zone = zoneOf(item.zone);
    return (
      <div className="space-y-4">
        <p className="text-base leading-relaxed text-foreground/90">
          {item.answer}
        </p>
        <p
          className="rounded-xl px-4 py-3 text-base leading-relaxed text-foreground border-l-4"
          style={{
            backgroundColor: tint(zone.color, 14),
            borderColor: zone.color,
          }}
        >
          <strong className="font-semibold">Conseil :</strong> {item.advice}
        </p>
        <a
          href="#cerveau"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <span
            className="w-5 h-5 rounded-full text-[11px] font-bold text-white flex items-center justify-center"
            style={{ backgroundColor: zone.color }}
            aria-hidden="true"
          >
            {zone.number}
          </span>
          Zone du cerveau concernée : {zone.title}
        </a>
      </div>
    );
  };

  return (
    <>
      {/* Mobile et tablette : accordéon */}
      <ul className="lg:hidden border-t border-border">
        {items.map((item, i) => {
          const zone = zoneOf(item.zone);
          const isOpen = open === i;
          return (
            <li key={item.question} className="border-b border-border">
              <button
                type="button"
                onClick={() => setOpen(isOpen ? -1 : i)}
                aria-expanded={isOpen}
                aria-controls={`q-panel-${i}`}
                className="w-full grid grid-cols-[1.5rem_minmax(0,1fr)_1.25rem] gap-x-3 items-start py-5 text-left"
              >
                <NumeriqueIcon
                  name={item.iconName}
                  className="w-6 h-6 mt-0.5"
                  style={{ color: zone.color }}
                />
                <span
                  className={`${serifClass} text-xl font-medium text-foreground leading-snug`}
                >
                  {item.question}
                </span>
                <ChevronDown
                  className={`w-5 h-5 mt-1 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`}
                  aria-hidden="true"
                />
              </button>
              {isOpen && (
                <div id={`q-panel-${i}`} className="pb-6 pl-9">
                  <Detail item={item} />
                </div>
              )}
            </li>
          );
        })}
      </ul>

      {/* Desktop : liste à gauche, réponse à droite */}
      <div className="hidden lg:grid grid-cols-[minmax(0,5fr)_minmax(0,7fr)] gap-10 items-start">
        <ul
          role="tablist"
          aria-orientation="vertical"
          className="border-l border-border"
        >
          {items.map((item, i) => {
            const zone = zoneOf(item.zone);
            const isActive = active === i;
            return (
              <li key={item.question}>
                <button
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-controls="q-detail"
                  onClick={() => setOpen(i)}
                  className={`w-full grid grid-cols-[1.25rem_minmax(0,1fr)] gap-x-3 items-start px-4 py-3 text-left -ml-px border-l-2 transition-colors hover:bg-muted/60 ${
                    isActive ? "text-foreground" : "text-foreground/70"
                  }`}
                  style={{
                    borderColor: isActive ? zone.color : "transparent",
                    backgroundColor: isActive ? tint(zone.color, 10) : undefined,
                  }}
                >
                  <NumeriqueIcon
                    name={item.iconName}
                    className="w-5 h-5 mt-0.5"
                    style={{ color: zone.color }}
                  />
                  <span
                    className={`text-[15px] leading-snug ${isActive ? "font-semibold" : "font-medium"}`}
                  >
                    {item.question}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>

        <div
          id="q-detail"
          role="tabpanel"
          className="sticky top-28 rounded-2xl border border-border bg-background p-8"
          style={{ borderTopColor: zoneOf(items[active].zone).color, borderTopWidth: 4 }}
        >
          <div className="flex items-start gap-4 mb-5">
            <span
              className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
              style={{
                backgroundColor: tint(zoneOf(items[active].zone).color, 18),
                color: zoneOf(items[active].zone).color,
              }}
            >
              <NumeriqueIcon
                name={items[active].iconName}
                className="w-6 h-6"
              />
            </span>
            <h3
              className={`${serifClass} text-2xl xl:text-3xl font-medium text-foreground leading-snug`}
            >
              {items[active].question}
            </h3>
          </div>

          <Detail item={items[active]} />

          <div className="mt-8 pt-5 border-t border-border flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => setOpen(Math.max(0, active - 1))}
              disabled={active === 0}
              className="inline-flex items-center gap-2 text-sm font-medium text-foreground/80 hover:text-primary disabled:opacity-40 disabled:hover:text-foreground/80 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" aria-hidden="true" />
              Question précédente
            </button>
            <span className="text-sm text-muted-foreground tabular-nums">
              {active + 1} / {items.length}
            </span>
            <button
              type="button"
              onClick={() => setOpen(Math.min(items.length - 1, active + 1))}
              disabled={active === items.length - 1}
              className="inline-flex items-center gap-2 text-sm font-medium text-foreground/80 hover:text-primary disabled:opacity-40 disabled:hover:text-foreground/80 transition-colors"
            >
              Question suivante
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

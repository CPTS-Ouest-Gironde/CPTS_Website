"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import Image from "next/image";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { DispositifCard } from "./components/DispositifCard";
import { DispositifContent } from "./components/DispositifContent";
import { TestezVousModal } from "@/components/testez-vous-modal";
import { Dialog, DialogContent, DialogTitle, VisuallyHidden } from "@/components/ui/dialog";
import {
  accordionItemsAcces,
  accordionItemsParcours,
  accordionItemsPrevention,
  accordionItemsSSE,
} from "./data";

/* Les libellés courts sont des extraits littéraux des titres de section existants.
   Les identifiants des dispositifs sont inchangés : les liens entrants type
   #sante-mentale continuent de fonctionner. */
const groups = [
  {
    id: "acces-soins",
    step: "01",
    title: "Améliorer l'accès aux soins",
    navLabel: "Accès aux soins",
    bgHue: 114,
    accentHue: 132,
    illustration: "/actions-outils/acces-soins.svg",
    items: accordionItemsAcces,
  },
  {
    id: "parcours",
    step: "02",
    title: "Organisation des parcours pluriprofessionnels des patients",
    navLabel: "Parcours pluriprofessionnels",
    bgHue: 125,
    accentHue: 140,
    illustration: "/actions-outils/parcour-pluripro.svg",
    items: accordionItemsParcours,
  },
  {
    id: "sse",
    step: "03",
    title: "Situations Sanitaires Exceptionnelles (SSE)",
    navLabel: "SSE",
    bgHue: 137,
    accentHue: 148,
    illustration: null,
    items: accordionItemsSSE,
  },
  {
    id: "prevention",
    step: "04",
    title: "Développer des actions territoriales de prévention",
    navLabel: "Actions de prévention",
    bgHue: 148,
    accentHue: 156,
    illustration: null,
    items: accordionItemsPrevention,
  },
];

/* Minuscules + suppression des accents : « diabete » doit trouver « diabétique ». */
const normalize = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

/* Une nuance par catégorie : seule la teinte varie, la luminosité et la saturation
   restent constantes pour que les 5 aient le même poids visuel. */
const shades = (bgHue: number, accentHue: number) => ({
  card: `oklch(0.958 0.055 ${bgHue})`,
  cardBorder: `oklch(0.87 0.075 ${bgHue})`,
  soft: `oklch(0.966 0.045 ${bgHue})`,
  border: `oklch(0.89 0.07 ${bgHue})`,
  strong: `oklch(0.45 0.12 ${accentHue})`,
});

const entries = groups.flatMap((group) =>
  group.items.map((item) => ({
    item,
    group,
    haystack: normalize(`${item.title} ${item.content ?? ""} ${group.title}`),
  }))
);

export default function ActionsOutilsPage() {
  const [query, setQuery] = useState("");
  const [activeGroup, setActiveGroup] = useState<string>("all");
  const [openId, setOpenId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sseImage, setSseImage] = useState<{ src: string; alt: string } | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  // Fiche à rouvrir quand on referme le questionnaire, et demande de
  // repositionnement sur le bouton qui l'avait ouvert.
  const [epofReturnId, setEpofReturnId] = useState<string | null>(null);
  const [restoreEpofPosition, setRestoreEpofPosition] = useState(false);
  const openIdRef = useRef<string | null>(null);

  const results = useMemo(() => {
    // Chaque mot saisi doit être présent, quel que soit son ordre :
    // « mentale sante » trouve autant que « santé mentale ».
    const tokens = normalize(query).split(/\s+/).filter(Boolean);

    return entries.filter((entry) => {
      const matchesGroup = activeGroup === "all" || entry.group.id === activeGroup;
      const matchesQuery = tokens.every((token) => entry.haystack.includes(token));
      return matchesGroup && matchesQuery;
    });
  }, [query, activeGroup]);

  const openEntry = useMemo(
    () => entries.find((entry) => entry.item.id === openId) ?? null,
    [openId]
  );

  const openDispositif = (id: string) => {
    setOpenId(id);
    window.history.replaceState(null, "", `${window.location.pathname}#${id}`);
  };

  const closeDispositif = () => {
    setOpenId(null);
    window.history.replaceState(null, "", window.location.pathname);
  };

  // Lien entrant : /professionnels/actions-outils#sante-mentale ouvre le bon dispositif
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash && entries.some((entry) => entry.item.id === hash)) {
      setOpenId(hash);
    }
  }, []);

  // « / » place le curseur dans la recherche, comme sur les outils de documentation
  useEffect(() => {
    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key !== "/" || event.metaKey || event.ctrlKey) return;

      const target = event.target as HTMLElement | null;
      const isTyping =
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target?.isContentEditable;

      if (isTyping) return;

      event.preventDefault();
      searchRef.current?.focus();
    };

    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, []);

  useEffect(() => {
    openIdRef.current = openId;
  }, [openId]);

  useEffect(() => {
    const handleOpenModal = () => {
      // Le questionnaire est une modale maison rendue dans l'arbre de la page,
      // alors que la fiche dispositif est un Dialog Radix porté en fin de body :
      // à z-index égal le Dialog passe devant et garde le focus. On referme donc
      // la fiche avant d'ouvrir le questionnaire plutôt que de les empiler,
      // en retenant laquelle rouvrir ensuite.
      setEpofReturnId(openIdRef.current);
      setOpenId(null);
      setIsModalOpen(true);
    };

    window.addEventListener('open-epof-modal', handleOpenModal);
    return () => {
      window.removeEventListener('open-epof-modal', handleOpenModal);
    };
  }, []);

  // Rouvre la fiche puis replace la vue sur le bouton du questionnaire.
  useEffect(() => {
    if (!restoreEpofPosition || !openId) return;

    let second = 0;
    const first = requestAnimationFrame(() => {
      second = requestAnimationFrame(() => {
        document
          .querySelector<HTMLElement>("[data-epof-trigger]")
          ?.scrollIntoView({ block: "center" });
        setRestoreEpofPosition(false);
      });
    });

    return () => {
      cancelAnimationFrame(first);
      if (second) cancelAnimationFrame(second);
    };
  }, [restoreEpofPosition, openId]);

  const handleCloseEpof = () => {
    setIsModalOpen(false);
    if (epofReturnId) {
      setOpenId(epofReturnId);
      setEpofReturnId(null);
      setRestoreEpofPosition(true);
    }
  };

  useEffect(() => {
    const handleOpenSseImage = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      setSseImage(detail);
    };
    window.addEventListener('open-sse-image', handleOpenSseImage);
    return () => {
      window.removeEventListener('open-sse-image', handleOpenSseImage);
    };
  }, []);

  const filters = [
    {
      id: "all",
      label: "Tous",
      count: entries.length,
      title: "",
      bgHue: 131,
      accentHue: 145,
      // Vue « Tous » : illustration générique de l'équipe pluriprofessionnelle
      illustration: "/actions-outils/acces-soins.svg" as string | null,
    },
    ...groups.map((group) => ({
      id: group.id,
      label: group.navLabel,
      count: group.items.length,
      title: group.title,
      bgHue: group.bgHue,
      accentHue: group.accentHue,
      illustration: group.illustration,
    })),
  ];

  const activeFilter = filters.find((filter) => filter.id === activeGroup) ?? filters[0];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        {/* En-tête de page */}
        <section className="relative pt-28 lg:pt-36 pb-8 lg:pb-10 overflow-hidden bg-gradient-to-br from-primary/5 via-secondary/10 to-background">
          <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-primary/10 blur-3xl pointer-events-none" />

          <div className="container mx-auto px-4 lg:px-8 relative z-10">
            <div className="max-w-6xl mx-auto grid gap-8 lg:grid-cols-[1fr_340px] lg:items-center">
              <div className="space-y-5">
                <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
                  Espace professionnel
                </div>

                <h1 className="text-4xl lg:text-6xl font-bold text-foreground text-balance">
                  Nos actions &amp; vos outils
                </h1>

                <p className="text-base lg:text-lg text-muted-foreground leading-relaxed max-w-[68ch]">
                  {activeFilter.id === "all"
                    ? `${entries.length} dispositifs répartis en ${groups.length} domaines d'action.`
                    : activeFilter.title}
                </p>
              </div>

              {/* Emplacement réservé : la hauteur ne bouge pas quand une catégorie
                  n'a pas encore d'illustration. */}
              <div className="hidden lg:block relative aspect-[4/3]">
                {activeFilter.illustration && (
                  <Image
                    key={activeFilter.illustration}
                    src={activeFilter.illustration}
                    alt=""
                    aria-hidden="true"
                    fill
                    priority
                    className="object-contain animate-in fade-in duration-500"
                    sizes="340px"
                  />
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Barre de recherche et filtres, collante sous l'en-tête du site */}
        <div className="sticky top-28 z-30 border-y border-border bg-background/90 backdrop-blur-md">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-6xl mx-auto py-3 space-y-3">
              <div className="relative">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  ref={searchRef}
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Rechercher un dispositif, un parcours, un document…"
                  aria-label="Rechercher un dispositif"
                  className="w-full rounded-full border border-border bg-card py-2.5 pl-11 pr-24 text-sm text-foreground placeholder:text-muted-foreground transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 [&::-webkit-search-cancel-button]:hidden"
                />
                {query ? (
                  <button
                    type="button"
                    onClick={() => {
                      setQuery("");
                      searchRef.current?.focus();
                    }}
                    aria-label="Effacer la recherche"
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                  </button>
                ) : (
                  <kbd className="pointer-events-none absolute right-4 top-1/2 hidden -translate-y-1/2 rounded border border-border bg-muted px-1.5 py-0.5 text-[11px] font-medium text-muted-foreground sm:block">
                    /
                  </kbd>
                )}
              </div>

              <div className="flex items-center gap-2 overflow-x-auto pb-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                <SlidersHorizontal className="hidden h-4 w-4 flex-shrink-0 text-muted-foreground sm:block" />
                {filters.map((filter) => {
                  const isActive = activeGroup === filter.id;
                  const filterTint = shades(filter.bgHue, filter.accentHue);

                  return (
                    <button
                      key={filter.id}
                      type="button"
                      onClick={() => setActiveGroup(filter.id)}
                      aria-pressed={isActive}
                      style={{
                        backgroundColor: isActive ? filterTint.strong : filterTint.soft,
                        borderColor: isActive ? filterTint.strong : filterTint.border,
                        color: isActive ? "white" : filterTint.strong,
                      }}
                      className="flex-shrink-0 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors hover:brightness-[0.97]"
                    >
                      {filter.label}
                      <span className="ml-1.5 text-xs opacity-70">
                        {filter.count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Grille de dispositifs */}
        <section className="py-8 lg:py-12">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-6xl mx-auto">
              <p className="mb-5 text-sm text-muted-foreground" aria-live="polite">
                {results.length} dispositif{results.length > 1 ? "s" : ""}
                {query && ` pour « ${query} »`}
              </p>

              {results.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {results.map((entry, index) => (
                    <DispositifCard
                      key={entry.item.id}
                      item={entry.item}
                      groupStep={entry.group.step}
                      groupLabel={entry.group.navLabel}
                      tint={shades(entry.group.bgHue, entry.group.accentHue)}
                      index={index}
                      onOpen={openDispositif}
                    />
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-border bg-card px-6 py-16 text-center">
                  <p className="text-base font-semibold text-foreground">
                    Aucun dispositif ne correspond à cette recherche
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setQuery("");
                      setActiveGroup("all");
                    }}
                    className="mt-4 inline-flex items-center rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                  >
                    Réinitialiser les filtres
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* Modale du dispositif */}
      <Dialog
        open={!!openEntry}
        onOpenChange={(open) => {
          if (!open) closeDispositif();
        }}
      >
        <DialogContent
          aria-describedby={undefined}
          className="flex max-h-[88vh] w-[calc(100%-1.5rem)] max-w-3xl lg:max-w-5xl xl:max-w-6xl flex-col gap-0 overflow-hidden rounded-2xl p-0"
        >
          {openEntry && (
            <>
              <div className="flex-shrink-0 border-b border-border px-5 py-5 lg:px-8">
                <p className="mb-1.5 flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  <span className="text-primary">{openEntry.group.step}</span>
                  {openEntry.group.navLabel}
                </p>
                <DialogTitle className="pr-8 text-xl font-bold text-foreground text-balance lg:text-2xl">
                  {openEntry.item.title}
                </DialogTitle>
              </div>

              <div className="overflow-y-auto px-5 py-6 lg:px-8">
                <DispositifContent item={openEntry.item} />
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <TestezVousModal isOpen={isModalOpen} onClose={handleCloseEpof} />

      <Dialog open={!!sseImage} onOpenChange={() => setSseImage(null)}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden">
          <VisuallyHidden>
            <DialogTitle>{sseImage?.alt ?? "Aperçu"}</DialogTitle>
          </VisuallyHidden>
          {sseImage && (
            <div className="p-6">
              <div className="relative w-full bg-muted rounded-2xl overflow-hidden">
                <img
                  src={sseImage.src}
                  alt={sseImage.alt}
                  className="w-full h-auto"
                />
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

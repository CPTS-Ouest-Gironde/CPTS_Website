"use client";

import { useState, useEffect, useMemo } from "react";
import { ArrowLeft } from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { DispositifNav, type DispositifGroup } from "./components/DispositifNav";
import { DispositifPanel } from "./components/DispositifPanel";
import { TestezVousModal } from "@/components/testez-vous-modal";
import { Dialog, DialogContent, DialogTitle, VisuallyHidden } from "@/components/ui/dialog";
import {
  accordionItemsAcces,
  accordionItemsParcours,
  accordionItemsPrevention,
  accordionItemsSSE,
} from "./data";

/* Les libellés courts sont des extraits littéraux des titres de section existants,
   aucun intitulé n'est inventé. Les identifiants des dispositifs sont inchangés :
   les liens entrants type #sante-mentale continuent de fonctionner. */
const groups: DispositifGroup[] = [
  {
    id: "acces-soins",
    step: "01",
    title: "Améliorer l'accès aux soins",
    navLabel: "Accès aux soins",
    items: accordionItemsAcces,
  },
  {
    id: "parcours",
    step: "02",
    title: "Organisation des parcours pluriprofessionnels des patients",
    navLabel: "Parcours pluriprofessionnels",
    items: accordionItemsParcours,
  },
  {
    id: "sse",
    step: "03",
    title: "Situations Sanitaires Exceptionnelles (SSE)",
    navLabel: "SSE",
    items: accordionItemsSSE,
  },
  {
    id: "prevention",
    step: "04",
    title: "Développer des actions territoriales de prévention",
    navLabel: "Actions de prévention",
    items: accordionItemsPrevention,
  },
];

const allItems = groups.flatMap((group) =>
  group.items.map((item) => ({ item, group }))
);

export default function ActionsOutilsPage() {
  const [activeId, setActiveId] = useState<string>(allItems[0].item.id);
  const [mobileView, setMobileView] = useState<"list" | "detail">("list");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sseImage, setSseImage] = useState<{ src: string; alt: string } | null>(null);

  const knownIds = useMemo(() => new Set(allItems.map((entry) => entry.item.id)), []);

  const active = useMemo(
    () => allItems.find((entry) => entry.item.id === activeId) ?? allItems[0],
    [activeId]
  );

  const selectDispositif = (id: string) => {
    setActiveId(id);
    setMobileView("detail");
    window.history.replaceState(null, "", `${window.location.pathname}#${id}`);
    // Le conteneur est un point d'ancrage stable, contrairement au panneau qui est remplacé
    document.getElementById("dispositifs")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (!hash || !knownIds.has(hash)) return;

    setActiveId(hash);
    setMobileView("detail");
    requestAnimationFrame(() => {
      document.getElementById("dispositifs")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  }, [knownIds]);

  useEffect(() => {
    const handleOpenModal = () => {
      setIsModalOpen(true);
    };

    window.addEventListener('open-epof-modal', handleOpenModal);
    return () => {
      window.removeEventListener('open-epof-modal', handleOpenModal);
    };
  }, []);

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

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        {/* En-tête de page */}
        <section className="relative pt-28 lg:pt-36 pb-10 lg:pb-14 overflow-hidden bg-gradient-to-br from-primary/5 via-secondary/10 to-background">
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-primary/10 blur-3xl pointer-events-none" />

          <div className="container mx-auto px-4 lg:px-8 relative z-10">
            <div className="max-w-6xl mx-auto space-y-5">
              <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
                Espace professionnel
              </div>

              <h1 className="text-4xl lg:text-6xl font-bold text-foreground text-balance">
                Nos actions &amp; vos outils
              </h1>

              <p className="text-base lg:text-lg text-muted-foreground leading-relaxed max-w-[68ch]">
                {allItems.length} dispositifs répartis en {groups.length} domaines
                d&apos;action.
              </p>
            </div>
          </div>
        </section>

        {/* Liste à gauche, dispositif sélectionné à droite */}
        <section id="dispositifs" className="py-8 lg:py-12 scroll-mt-28">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-6xl mx-auto lg:grid lg:grid-cols-[290px_1fr] lg:gap-8 lg:items-start">
              {/* Colonne de gauche */}
              <aside
                className={`${
                  mobileView === "detail" ? "hidden" : "block"
                } lg:block lg:sticky lg:top-32 lg:max-h-[calc(100vh-9rem)] lg:overflow-y-auto lg:pr-2 rounded-2xl border border-border bg-card p-4 lg:bg-transparent lg:border-0 lg:p-0`}
              >
                <DispositifNav
                  groups={groups}
                  activeId={activeId}
                  onSelect={selectDispositif}
                />
              </aside>

              {/* Colonne de droite */}
              <div
                className={`${
                  mobileView === "list" ? "hidden" : "block"
                } lg:block`}
              >
                <button
                  type="button"
                  onClick={() => setMobileView("list")}
                  className="lg:hidden inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-4 text-sm font-medium"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Tous les dispositifs
                </button>

                <DispositifPanel
                  item={active.item}
                  groupLabel={active.group.title}
                />
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      <TestezVousModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

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

"use client";

import { useState, useEffect, useMemo } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import Image from "next/image";
import { AccordionSection } from "./components/AccordionSection";
import { TestezVousModal } from "@/components/testez-vous-modal";
import { Dialog, DialogContent, DialogTitle, VisuallyHidden } from "@/components/ui/dialog";
import {
  accordionItemsAcces,
  accordionItemsParcours,
  accordionItemsPrevention,
  accordionItemsSSE,
} from "./data";

/* Sections de la page. Les libellés courts de la barre de navigation sont des
   extraits littéraux des titres de section, aucun intitulé n'est inventé.
   Les identifiants sont préfixés « section- » pour ne pas entrer en collision
   avec les ancres d'accordéon existantes (#sante-mentale, #parcours-ic, ...). */
const sections = [
  {
    id: "section-acces-soins",
    step: "01",
    title: "Améliorer l'accès aux soins",
    navLabel: "Accès aux soins",
    items: accordionItemsAcces,
    illustration: "/actions-outils/acces-soins.svg",
    tinted: false,
  },
  {
    id: "section-parcours",
    step: "02",
    title: "Organisation des parcours pluriprofessionnels des patients",
    navLabel: "Parcours pluriprofessionnels",
    items: accordionItemsParcours,
    illustration: "/actions-outils/parcour-pluripro.svg",
    tinted: true,
  },
  {
    id: "section-sse",
    step: "03",
    title: "Situations Sanitaires Exceptionnelles (SSE)",
    navLabel: "SSE",
    items: accordionItemsSSE,
    illustration: null,
    tinted: false,
  },
  {
    id: "section-prevention",
    step: "04",
    title: "Développer des actions territoriales de prévention",
    navLabel: "Actions de prévention",
    items: accordionItemsPrevention,
    illustration: null,
    tinted: true,
  },
];

export default function ActionsOutilsPage() {
  const [openAccordions, setOpenAccordions] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sseImage, setSseImage] = useState<{ src: string; alt: string } | null>(null);

  const knownIds = useMemo(
    () => new Set(sections.flatMap((section) => section.items.map((item) => item.id))),
    []
  );

  const toggleAccordion = (id: string) => {
    setOpenAccordions((previous) => {
      const isOpen = previous.includes(id);
      const next = isOpen
        ? previous.filter((openId) => openId !== id)
        : [...previous, id];

      // L'ancre reflète le dernier panneau ouvert, pour que l'URL reste partageable
      const url = isOpen
        ? window.location.pathname
        : `${window.location.pathname}#${id}`;
      window.history.replaceState(null, "", url);

      return next;
    });
  };

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (!hash) return;

    // Ancre d'accordéon : on ouvre le panneau visé. Ancre de section : simple défilement.
    if (knownIds.has(hash)) {
      setOpenAccordions([hash]);
    }

    requestAnimationFrame(() => {
      document.getElementById(hash)?.scrollIntoView({
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

  const totalItems = sections.reduce((total, section) => total + section.items.length, 0);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        {/* En-tête de page */}
        <section className="relative pt-28 lg:pt-36 pb-12 lg:pb-16 overflow-hidden bg-gradient-to-br from-primary/5 via-secondary/10 to-background">
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-primary/10 blur-3xl pointer-events-none" />

          <div className="container mx-auto px-4 lg:px-8 relative z-10">
            <div className="max-w-5xl mx-auto space-y-6">
              <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
                Espace professionnel
              </div>

              <h1 className="text-4xl lg:text-6xl font-bold text-foreground text-balance">
                Nos actions &amp; vos outils
              </h1>

              <p className="text-base lg:text-lg text-muted-foreground leading-relaxed max-w-[68ch]">
                {totalItems} dispositifs répartis en {sections.length} domaines
                d&apos;action.
              </p>

              {/* Sommaire d'entrée */}
              <div className="flex flex-wrap gap-2.5 pt-2">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    type="button"
                    onClick={() => scrollToSection(section.id)}
                    className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground shadow-sm transition-colors hover:border-primary/40 hover:bg-primary/5 hover:text-primary"
                  >
                    <span className="text-xs font-bold text-primary">
                      {section.step}
                    </span>
                    {section.navLabel}
                    <span className="text-xs text-muted-foreground">
                      {section.items.length}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Barre de navigation collante */}
        <div className="sticky top-28 z-30 border-y border-border bg-background/90 backdrop-blur-md">
          <div className="container mx-auto px-4 lg:px-8">
            <nav
              aria-label="Sections de la page"
              className="max-w-5xl mx-auto flex gap-1 overflow-x-auto py-2.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {sections.map((section) => (
                <button
                  key={section.id}
                  type="button"
                  onClick={() => scrollToSection(section.id)}
                  className="flex-shrink-0 rounded-full px-3.5 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
                >
                  {section.navLabel}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {sections.map((section) => (
          <section
            key={section.id}
            id={section.id}
            className={`relative py-14 lg:py-20 overflow-hidden scroll-mt-44 ${
              section.tinted ? "bg-muted/40" : "bg-background"
            }`}
          >
            {section.illustration && (
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-8 right-0 w-64 xl:w-80 hidden xl:block opacity-70">
                  <Image
                    src={section.illustration}
                    alt=""
                    width={320}
                    height={320}
                    className="w-full h-auto"
                    aria-hidden="true"
                  />
                </div>
              </div>
            )}

            <div className="container mx-auto px-4 lg:px-8 relative z-10">
              <div className="max-w-5xl mx-auto">
                {/* Titre de section aligné à gauche, avec repère de progression */}
                <div className="mb-8 lg:mb-10">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                      {section.step}
                    </span>
                    <span className="h-px flex-1 bg-border" />
                  </div>
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground text-balance max-w-3xl">
                    {section.title}
                  </h2>
                </div>

                <AccordionSection
                  items={section.items}
                  openAccordions={openAccordions}
                  onToggle={toggleAccordion}
                />
              </div>
            </div>
          </section>
        ))}
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

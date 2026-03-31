"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import Image from "next/image";
import { AccordionSection } from "./components/AccordionSection";
import { TestezVousModal } from "@/components/testez-vous-modal";
import {
  accordionItemsAcces,
  accordionItemsParcours,
  accordionItemsPrevention,
  accordionItemsSSE,
} from "./data";

export default function ActionsOutilsPage() {
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleAccordion = (id: string) => {
    setOpenAccordion(openAccordion === id ? null : id);
  };

  useEffect(() => {
    const handleOpenModal = () => {
      setIsModalOpen(true);
    };

    window.addEventListener('open-epof-modal', handleOpenModal);
    return () => {
      window.removeEventListener('open-epof-modal', handleOpenModal);
    };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-20">
        {/* Section Améliorer l'accès aux soins */}
        <section className="py-16 lg:py-20 relative overflow-hidden">
          {/* Illustrations décoratives */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full blur-3xl" />
            <div className="absolute top-1/2 -left-32 w-96 h-96 bg-gradient-to-tr from-secondary/10 to-primary/5 rounded-full blur-3xl" />

            {/* Illustration personnage - Équipe de professionnels de santé */}
            <div className="absolute right-10 w-94 lg:w-100 hidden lg:block">
              <Image
                src="/actions-outils/acces-soins.svg"
                alt=""
                width={320}
                height={320}
                className="w-full h-auto"
                aria-hidden="true"
              />
            </div>
          </div>

          <div className="container mx-auto px-4 lg:px-8 relative z-10">
            <div className="max-w-5xl mx-auto">
              {/* Titre de section */}
              <div className="text-center mb-12">
                <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                  Améliorer l'accès aux soins
                </h2>
                <div className="w-24 h-1 bg-primary mx-auto rounded-full" />
              </div>

              {/* Accordéons */}
              <AccordionSection
                items={accordionItemsAcces}
                openAccordion={openAccordion}
                onToggle={toggleAccordion}
              />
            </div>
          </div>
        </section>

        {/* Section Organisation des parcours */}
        <section className="py-16 lg:py-20 bg-gradient-to-br from-primary/5 to-accent/5 relative overflow-hidden">
          {/* Illustrations décoratives */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-20 right-10 w-72 h-72 bg-gradient-to-bl from-accent/20 to-transparent rounded-full blur-3xl" />
            <div className="absolute bottom-20 -left-20 w-80 h-80 bg-gradient-to-tr from-primary/15 to-transparent rounded-full blur-3xl" />

            {/* Illustration - Parcours pluriprofessionnels */}
            <div className="absolute top-0 left-0 w-64 lg:w-79.5 hidden lg:block">
              <Image
                src="/actions-outils/parcour-pluripro.svg"
                alt=""
                width={320}
                height={320}
                className="w-full h-auto"
                aria-hidden="true"
              />
            </div>
          </div>

          <div className="container mx-auto px-4 lg:px-8 relative z-10">
            <div className="max-w-5xl mx-auto">
              {/* Titre de section */}
              <div className="text-center mb-12">
                <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                  Organisation des parcours pluriprofessionnels des patients
                </h2>
                <div className="w-24 h-1 bg-primary mx-auto rounded-full" />
              </div>

              {/* Accordéons */}
              <AccordionSection
                items={accordionItemsParcours}
                openAccordion={openAccordion}
                onToggle={toggleAccordion}
              />
            </div>
          </div>
        </section>

        {/* Section SSE */}
        <section className="py-16 lg:py-20 bg-gradient-to-br from-primary/5 to-accent/5 relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-20 right-10 w-72 h-72 bg-gradient-to-bl from-accent/20 to-transparent rounded-full blur-3xl" />
            <div className="absolute bottom-20 -left-20 w-80 h-80 bg-gradient-to-tr from-primary/15 to-transparent rounded-full blur-3xl" />
          </div>

          <div className="container mx-auto px-4 lg:px-8 relative z-10">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                  Situations Sanitaires Exceptionnelles (SSE)
                </h2>
                <div className="w-24 h-1 bg-primary mx-auto rounded-full" />
              </div>

              <AccordionSection
                items={accordionItemsSSE}
                openAccordion={openAccordion}
                onToggle={toggleAccordion}
              />
            </div>
          </div>
        </section>

        {/* Section Prévention territoriale */}
        <section className="py-16 lg:py-20 relative overflow-hidden">
          {/* Illustrations décoratives */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute -top-10 left-1/4 w-64 h-64 bg-gradient-to-br from-secondary/15 to-accent/10 rounded-full blur-3xl" />
            <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-gradient-to-tl from-primary/10 to-transparent rounded-full blur-3xl" />
          </div>

          <div className="container mx-auto px-4 lg:px-8 relative z-10">
            <div className="max-w-5xl mx-auto">
              {/* Titre de section */}
              <div className="text-center mb-12">
                <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                  Développer des actions territoriales de prévention
                </h2>
                <div className="w-24 h-1 bg-primary mx-auto rounded-full" />
              </div>

              {/* Accordéons */}
              <AccordionSection
                items={accordionItemsPrevention}
                openAccordion={openAccordion}
                onToggle={toggleAccordion}
              />
            </div>
          </div>
        </section>
      </main>

      <Footer />

      <TestezVousModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}

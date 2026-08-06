import type { Metadata } from "next";

import data from "@/app/data/sante-voyage.json";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { BeforeDepartureSection } from "@/components/sante-voyage/before-depart-section";
import { DuringTravelSection } from "@/components/sante-voyage/during-travel-section";
import {
  TravelArticleFooter,
  TravelerProfilesSection,
} from "@/components/sante-voyage/traveler-profiles-section";
import { TravelHero } from "@/components/sante-voyage/travel-hero";
import { VaccinationsSection } from "@/components/sante-voyage/vaccinations-section";

const description =
  "Santé en voyage : consultation avant le départ, trousse de secours, vaccinations, moustiques, eau et alimentation, phlébite, mal des montagnes, jet lag. Les recommandations sanitaires essentielles aux voyageurs.";

export const metadata: Metadata = {
  title: `${data.title} | CPTS Ouest Gironde`,
  description,
  alternates: {
    canonical: "/prevention/sante-familiale/sante-voyage",
  },
};

export default function SanteVoyagePage() {
  return (
    <main className="min-h-screen max-w-full overflow-x-clip bg-amber-50">
      <Header />
      <TravelHero />
      <BeforeDepartureSection />
      <VaccinationsSection />
      <DuringTravelSection />
      <TravelerProfilesSection />
      <TravelArticleFooter />
      <Footer />
    </main>
  );
}

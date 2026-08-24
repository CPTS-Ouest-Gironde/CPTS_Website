import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Link2 } from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: "Professionnels - Santé mentale - Les dispositifs du territoire",
  description:
    "Ressources santé mentale réservées aux professionnels de santé du territoire.",
};

const resources = [
  {
    id: "approche-therapeutique-adultes",
    title: "Approche thérapeutique - 20-25 ans et Adultes",
    url: "https://drive.google.com/file/d/16kFiLLw0WEFHSfabybW_D5Oeujil9D8T/view?usp=drive_link",
  },
  {
    id: "parcours-sante-mentale-jeunes",
    title: "Parcours en santé mentale - adolescent et jeune adulte",
    url: "https://drive.google.com/file/d/1fWCY1od1W0ndnMiL8ROoJGJqjiv5xJem/view?usp=drive_link",
  },
  {
    id: "dispositif-orientation-psychiatrie",
    title: "Dispositif CPTS d'orientation en Psychiatrie",
    url: "/Flyer%20Orientation%20PSY-VF_page-0001.webp",
    associatedDoc: {
      title: "Formulaire de demande d'orientation",
      url: "/espace-pro/demande-orientation-psy",
    },
  },
  {
    id: "dispositif-rcp-psy",
    title: "Dispositif CPTS RCP Psy",
    url: "https://drive.google.com/file/d/13qCAHMzb-vZKm5ZFR_sKuxK0TtqlbsB5/view?usp=drive_link",
    associatedDoc: {
      title: "Questionnaires RCP Psy",
      url: "https://drive.google.com/file/d/1YCQvqQ3PVIhVuMA9qYjwkyXEN3IqVEGV/view?usp=drive_link",
    },
  },
];

export default function DispositifsTerritoireProfessionnelsPage() {
  return (
    <main className="min-h-screen bg-[#f6f7f3]">
      <Header />

      <section className="pt-28 lg:pt-32 pb-12 border-b border-[#dbe6db] bg-[#e9f3e9]">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <Link
              href="/professionnels/actions-outils#sante-mentale"
              className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Retour à la page Actions et outils</span>
            </Link>

            <div className="grid lg:grid-cols-[1fr_460px] gap-6 lg:gap-8 items-center">
              <div className="space-y-4 max-w-4xl">
                <p className="inline-flex items-center rounded-full bg-primary/10 text-primary px-3 py-1 text-xs font-semibold uppercase tracking-wide">
                  Espace professionnel sécurisé
                </p>

                <h1 className="text-3xl lg:text-5xl font-bold text-foreground text-balance">
                  Santé mentale - Les dispositifs du territoire
                </h1>

                <p className="text-muted-foreground leading-relaxed text-base lg:text-lg">
                  Retrouvez toutes les informations utiles sur les dispositifs du territoire.
                </p>

                <p className="text-muted-foreground leading-relaxed font-medium">
                  L&apos;annuaire des professionnels est disponible sur demande auprès de la CPTS.
                </p>
              </div>

              <div className="relative aspect-[3/2] w-full max-w-lg mx-auto lg:max-w-none rounded-2xl overflow-hidden border border-border/60 bg-white shadow-sm">
                <Image
                  src="/linkpage/sante-mentale/hero-sm.webp"
                  alt="Illustration : des professionnels de santé s'orientent parmi les dispositifs du territoire"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 460px"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="pt-10 lg:pt-12 pb-20 lg:pb-28">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 md:auto-rows-fr gap-5">
            {resources.map((resource) => (
              <div
                key={resource.id}
                id={resource.id}
                className="h-full min-h-[172px] rounded-2xl border border-[#dbe6db] bg-[#fcfffb] p-5 lg:p-6 shadow-sm flex flex-col justify-between scroll-mt-24 target:ring-2 target:ring-primary/40 target:border-primary/40 transition-shadow"
              >
                <div>
                  <div className="h-1.5 w-16 rounded-full bg-emerald-500/70 mb-4" />
                  <h2 className="text-base lg:text-lg text-foreground font-semibold leading-snug">
                    {resource.title}
                  </h2>
                </div>

                <div className="mt-4 flex flex-col gap-2">
                  <a
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group/main inline-flex items-center gap-2 rounded-full bg-emerald-50 text-emerald-700 px-3 py-1.5 text-sm font-semibold border border-emerald-200/80 hover:bg-emerald-100 transition-colors w-fit"
                  >
                    Ouvrir le document
                    <ExternalLink className="w-4 h-4 flex-shrink-0 group-hover/main:translate-x-0.5 group-hover/main:-translate-y-0.5 transition-transform" />
                  </a>
                  {resource.associatedDoc && (
                    <div className="pt-2 border-t border-[#dbe6db] mt-1">
                      <p className="text-xs text-muted-foreground mb-1.5 font-medium">Document associé</p>
                      <a
                        href={resource.associatedDoc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group/doc inline-flex items-center gap-2 rounded-full bg-slate-50 text-slate-600 px-3 py-1.5 text-sm font-medium border border-slate-200 hover:bg-slate-100 transition-colors w-fit"
                      >
                        <Link2 className="w-3.5 h-3.5 flex-shrink-0 text-slate-400" />
                        {resource.associatedDoc.title}
                        <ExternalLink className="w-3.5 h-3.5 flex-shrink-0 group-hover/doc:translate-x-0.5 group-hover/doc:-translate-y-0.5 transition-transform" />
                      </a>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="max-w-5xl mx-auto mt-6 rounded-xl border border-[#dbe6db] bg-white px-4 py-3 sm:px-5 sm:py-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <p className="text-sm text-muted-foreground">
                Besoin de l&apos;annuaire des professionnels ?
              </p>
              <Link
                href="/#contact"
                className="inline-flex items-center justify-center rounded-full border border-primary/30 bg-primary/5 px-4 py-2 text-sm font-semibold text-primary hover:bg-primary/10 transition-colors w-fit"
              >
                Contacter la CPTS
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

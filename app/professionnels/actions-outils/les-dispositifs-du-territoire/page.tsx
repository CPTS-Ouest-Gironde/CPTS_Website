import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: "Professionnels - Santé mentale - Les dispositifs du territoire",
  description:
    "Ressources santé mentale réservées aux professionnels de santé du territoire.",
};

const resources = [
  {
    title: "Approche thérapeutique - 20-25 ans et Adultes",
    url: "https://drive.google.com/file/d/1eAaTZ-nzebCkaPySyX3HmImYdES2JhF1/view?usp=sharing",
  },
  {
    title: "Parcours en santé mentale - adolescent et jeune adulte",
    url: "https://drive.google.com/file/d/1ZT6Fs-2bdBW4Jog_3AVt-OfFUJuD-Gaw/view?usp=sharing",
  },
  {
    title: "Dispositif CPTS d'orientation en Psychiatrie",
    url: "https://drive.google.com/file/d/1GXIU-BjD5RATI_PDWO9h8a14bBT_aeXT/view?usp=sharing",
  },
  {
    title: "Formulaire de demande d'orientation",
    url: "https://drive.google.com/file/d/1fzr_8eXxO0hHNvGL4U-u0GglSizZKRP6/view?usp=sharing",
  },
  {
    title: "Dispositif CPTS RCP Psy",
    url: "https://drive.google.com/file/d/1iq3Lx5O0vm5RKdbQcd8Lvp0b4LWtWnDQ/view?usp=sharing",
  },
  {
    title: "Questionnaires RCP Psy",
    url: "https://drive.google.com/file/d/1QKbDXk3f2Y_zIQA82ox-QeLpVptBmBQN/view?usp=sharing",
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
              href="/professionnels/actions-outils"
              className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Retour à la page Actions et outils</span>
            </Link>

            <div className="grid lg:grid-cols-[1fr_360px] gap-6 lg:gap-8 items-center">
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

              <div className="relative aspect-[16/10] w-full max-w-md mx-auto lg:max-w-none">
                <Image
                  src="/linkpage/sante-mentale/hero-sante-mentale-dispositif.webp"
                  alt="Illustration des dispositifs en santé mentale"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 360px"
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
              <a
                key={resource.title}
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group h-full min-h-[172px] rounded-2xl border border-[#dbe6db] bg-[#fcfffb] p-5 lg:p-6 shadow-sm hover:shadow-md hover:border-primary/35 transition-all duration-200 flex flex-col justify-between focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
              >
                <div>
                  <div className="h-1.5 w-16 rounded-full bg-emerald-500/70 mb-4" />
                  <h2 className="text-base lg:text-lg text-foreground font-semibold leading-snug">
                    {resource.title}
                  </h2>
                </div>

                <div className="mt-4">
                  <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 text-emerald-700 px-3 py-1.5 text-sm font-semibold border border-emerald-200/80">
                    Ouvrir le document
                    <ExternalLink className="w-4 h-4 flex-shrink-0 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </span>
                </div>
              </a>
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

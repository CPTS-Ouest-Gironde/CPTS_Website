import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: "Mars Bleu, c'est quoi ? Pour qui ?",
  description:
    "Ressources Mars Bleu pour sensibiliser au dépistage du cancer colorectal.",
};

const resources = [
  {
    title: "Le Cancer, c'est quoi ?",
    url: "https://drive.google.com/file/d/1YcvNSfllBq9-2WMuA1E-Zlu8QXbDxur4/view?usp=sharing",
  },
  {
    title: "Quiz : Le cancer colorectal",
    url: "https://tally.so/r/3jJ7dJ",
  },
  {
    title: "Les symptômes du cancer colorectal",
    url: "https://youtu.be/KQ7obbYOCwI?t=1",
  },
  {
    title: "Mon kit dépistage",
    url: "https://monkit.depistage-colorectal.fr/#/accueil",
  },
  {
    title: "Inspectez votre matériel",
    url: "https://youtu.be/Q3s0WPlC8OQ",
  },
  {
    title: "Agir pour sa santé",
    url: "https://www.calameo.com/institut-national-du-cancer/read/007759608c3c16e4ac7c2",
  },
];

export default function MarsBleuRessourcesPage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />

      <section className="relative pt-28 lg:pt-32 pb-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 via-blue-700/5 to-background" />
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="max-w-5xl mx-auto">
            <Link
              href="/prevention/sante-familiale/prevention-cancer-colorectal-mars-bleu-2026"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              Retour à l&apos;article Mars Bleu
            </Link>

            <div className="grid lg:grid-cols-[1fr_340px] gap-6 lg:gap-8 items-center">
              <div>
                <h1 className="text-3xl lg:text-5xl font-bold text-foreground mb-4 text-balance">
                  Mars Bleu, c&apos;est quoi ? Pour qui ?
                </h1>
                <p className="text-base lg:text-lg text-muted-foreground leading-relaxed max-w-4xl">
                  À l&apos;occasion de Mars Bleu, sensibilisons notre entourage au dépistage des cancers, plus particulièrement le dépistage du cancer colorectal.
                </p>
              </div>

              <div className="relative w-full max-w-[240px] sm:max-w-[300px] lg:max-w-none aspect-[4/3] mx-auto lg:mx-0">
                <Image
                  src="/linkpage/mars-bleu/mars-blue-hero.png"
                  alt="Mars Bleu 2026 - prévention du cancer colorectal"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 340px"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="pt-8 lg:pt-12 pb-20 lg:pb-28">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-5xl mx-auto space-y-7">
            <article className="rounded-2xl border border-blue-200 bg-blue-50/30 p-5 lg:p-7">
              <h2 className="text-lg lg:text-xl font-bold text-foreground mb-2">
                Vidéo
              </h2>
              <p className="text-sm text-muted-foreground mb-4">
                Une vidéo courte pour comprendre l&apos;essentiel de Mars Bleu.
              </p>
              <div className="w-full max-w-2xl mx-auto aspect-video rounded-xl overflow-hidden shadow-sm bg-black">
                <iframe
                  src="https://www.youtube-nocookie.com/embed/7fljRcyz02A?start=1&rel=0&modestbranding=1"
                  title="Mars Bleu - Sensibilisation au cancer colorectal"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>
            </article>

            <article className="rounded-2xl border border-cyan-200 bg-cyan-50/20 p-5 lg:p-7">
              <h2 className="text-lg lg:text-xl font-bold text-foreground mb-4">
                Ressources Mars Bleu
              </h2>
              <p className="text-sm text-muted-foreground mb-5">
                Documents et outils pratiques à consulter et partager autour de vous.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 md:auto-rows-fr gap-4">
                {resources.map((resource) => (
                  <a
                    key={resource.title}
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group h-full rounded-xl border border-blue-200 bg-blue-50/60 p-4 hover:bg-blue-100/70 hover:shadow-sm transition-all flex flex-col justify-between gap-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40"
                  >
                    <div>
                      <p className="text-sm lg:text-base font-semibold text-foreground leading-snug">
                        {resource.title}
                      </p>
                    </div>
                    <div className="inline-flex items-center gap-2 text-sm font-semibold text-blue-700">
                      Ouvrir la ressource
                      <ExternalLink className="w-4 h-4 text-blue-700 flex-shrink-0 mt-0.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </div>
                  </a>
                ))}
              </div>
            </article>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

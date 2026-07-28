import Image from "next/image";
import {
  Baby,
  Brain,
  ExternalLink,
  Linkedin,
  Phone,
} from "lucide-react";

const linkedinPosts = [
  {
    title: "Incendies : numéros utiles",
    publisher: "ARS Nouvelle-Aquitaine",
    description:
      "Informations au public et accompagnement médico-psychologique d'urgence.",
    image: "/feu/prevention-sante-incendie.jpeg",
    imageAlt:
      "Numéros utiles en cas d'incendie publiés par l'ARS Nouvelle-Aquitaine",
    url: "https://www.linkedin.com/posts/alerteincendie-praezvention-santaez-share-7487822172070260736-jF78/",
  },
  {
    title: "Incendies en Gironde et parcours périnatal",
    publisher: "Laure Mouton — Réseau Périnat Nouvelle-Aquitaine",
    description:
      "Message destiné aux femmes enceintes suivies ou non au CHU de Bordeaux.",
    image: "/feu/parcours-perinatal-incendie.jpeg",
    imageAlt:
      "Consignes du CHU de Bordeaux pour les femmes enceintes proches du terme",
    url: "https://www.linkedin.com/posts/laure-mouton-80009111b_incendies-en-gironde-et-parcours-p%C3%A9rinatal-ugcPost-7487567067194298368-UQtb/",
  },
] as const;

export function FeuDuPorgeAdditionalResources() {
  return (
    <>
      <section className="bg-muted/50 py-14 lg:py-20">
        <div className="container mx-auto max-w-5xl px-4 lg:px-8">
          <h2 className="mb-8 text-2xl font-bold uppercase text-foreground md:text-3xl">
            Contacts spécifiques
          </h2>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <article className="rounded-3xl border-2 border-emerald-500/30 bg-emerald-500/5 p-6 lg:p-8">
              <div className="mb-4 flex items-center gap-3">
                <Baby
                  className="h-7 w-7 shrink-0 text-emerald-700"
                  aria-hidden="true"
                />
                <h3 className="text-xl font-bold text-foreground">
                  Femmes enceintes proches du terme
                </h3>
              </div>
              <p className="mb-5 leading-relaxed text-muted-foreground">
                Si vous habitez une zone évacuée ou prochainement évacuée et
                rencontrez des difficultés, contactez les urgences
                obstétricales du CHU de Bordeaux.
              </p>
              <a
                href="tel:0557820101"
                className="inline-flex items-center gap-2 rounded-full bg-emerald-700 px-5 py-3 font-bold text-white transition-colors hover:bg-emerald-800"
              >
                <Phone className="h-5 w-5" aria-hidden="true" />
                05 57 82 01 01
              </a>
            </article>

            <article className="rounded-3xl border-2 border-violet-500/30 bg-violet-500/5 p-6 lg:p-8">
              <div className="mb-4 flex items-center gap-3">
                <Brain
                  className="h-7 w-7 shrink-0 text-violet-700"
                  aria-hidden="true"
                />
                <h3 className="text-xl font-bold text-foreground">
                  Soutien psychologique
                </h3>
              </div>
              <p className="mb-2 leading-relaxed text-muted-foreground">
                Pour les personnes directement exposées à un événement
                traumatique nécessitant un accompagnement
                médico-psychologique d&apos;urgence.
              </p>
              <p className="mb-5 text-sm font-semibold text-foreground">
                Pour le public et les professionnels, de 9 h à 17 h.
              </p>
              <a
                href="tel:0800719912"
                className="inline-flex items-center gap-2 rounded-full bg-violet-700 px-5 py-3 font-bold text-white transition-colors hover:bg-violet-800"
              >
                <Phone className="h-5 w-5" aria-hidden="true" />
                0 800 719 912
              </a>
            </article>
          </div>
        </div>
      </section>

      <section className="py-14 lg:py-20">
        <div className="container mx-auto max-w-5xl px-4 lg:px-8">
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#0A66C2]">
              <Linkedin className="h-6 w-6 text-white" aria-hidden="true" />
            </div>
            <h2 className="text-2xl font-bold uppercase text-foreground md:text-3xl">
              Publications LinkedIn utiles
            </h2>
          </div>

          <div className="mx-auto grid w-[90%] grid-cols-1 gap-6 md:grid-cols-2">
            {linkedinPosts.map((post) => (
              <a
                key={post.url}
                href={post.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group overflow-hidden rounded-3xl border border-border bg-background shadow-sm transition-all hover:-translate-y-1 hover:border-[#0A66C2]/40 hover:shadow-xl"
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-muted">
                  <Image
                    src={post.image}
                    alt={post.imageAlt}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
                <div className="p-6">
                  <p className="mb-2 text-sm font-semibold text-[#0A66C2]">
                    {post.publisher}
                  </p>
                  <h3 className="mb-3 text-xl font-bold text-foreground">
                    {post.title}
                  </h3>
                  <p className="mb-5 text-sm leading-relaxed text-muted-foreground">
                    {post.description}
                  </p>
                  <span className="inline-flex items-center gap-2 font-semibold text-[#0A66C2]">
                    Voir la publication
                    <ExternalLink className="h-4 w-4" aria-hidden="true" />
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

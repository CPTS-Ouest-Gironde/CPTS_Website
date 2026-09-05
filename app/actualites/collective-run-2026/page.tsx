import { SimpleActualitePage } from "@/components/simple-actualite-page";

const BASE = "/actu/collective-run-2026";

const PROGRAMME = [
  { heure: "9h00", label: "Café d'accueil et ouverture du village partenaires" },
  { heure: "9h40", label: "Discours officiels" },
  { heure: "9h55", label: "Échauffement collectif et festif avec la Batucada" },
  { heure: "10h00", label: "Départ officiel" },
  { heure: "12h00", label: "Clôture du parcours" },
  { heure: "13h00", label: "Fin de l'évènement" },
];

export default function CollectiveRun2026Page() {
  return (
    <SimpleActualitePage
      title="La Collective RUN"
      imageSrc={`${BASE}/affiche-collective-run-2026.webp`}
      imageAlt="Affiche La Collective RUN, 2ème édition, samedi 12 septembre 2026 à partir de 9h00"
      posterAspectClassName="aspect-square"
      carrousel={[
        {
          src: `${BASE}/parcours.webp`,
          alt: "Plan du parcours : boucle de 3,114 km reliant le CH Charles Perrens au campus Carreire de l'Université de Bordeaux",
        },
        {
          src: `${BASE}/programme.webp`,
          alt: "Programme de la matinée, de l'accueil à 9h00 à la fin de l'évènement à 13h00",
        },
        {
          src: `${BASE}/produits-solidaires.webp`,
          alt: "Produits solidaires aux couleurs de la Collective RUN : t-shirt technique et tote bag",
        },
        {
          src: `${BASE}/edition-2025.webp`,
          alt: "Photographies de la première édition de la Collective RUN en 2025",
        },
      ]}
      intro={
        <div className="space-y-6">
          <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5 lg:p-6 space-y-3">
            <p className="text-base lg:text-lg font-semibold text-foreground">
              Un tour en plus, un préjugé en moins pour la prévention du
              suicide !
            </p>
            <p className="text-base lg:text-lg font-semibold text-foreground">
              Le samedi 12 septembre 2026, de 9h00 à 13h00 — boucle de
              3,114 km, marche &amp; course.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              La Collective RUN est un grand défi collectif organisé par le
              Centre Hospitalier Charles Perrens, en partenariat avec la Mairie
              de Bordeaux, au profit de la prévention du suicide. Pendant deux
              heures, professionnels, partenaires et citoyens sont invités à
              parcourir ensemble un maximum de kilomètres sur une boucle
              reliant le CH Charles Perrens au campus Carreire de l&apos;Université
              de Bordeaux.
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 lg:p-6 space-y-3">
            <p className="font-semibold text-foreground">Programme</p>
            <ul className="space-y-2">
              {PROGRAMME.map((item) => (
                <li key={item.heure} className="flex gap-3 text-muted-foreground">
                  <span className="font-semibold text-primary w-14 flex-shrink-0">
                    {item.heure}
                  </span>
                  <span>{item.label}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3">
            <p className="text-muted-foreground leading-relaxed">
              Au-delà du défi sportif, la Collective RUN est un moment de
              sensibilisation et de partage autour de la santé mentale et de la
              prévention du suicide, grâce au village des partenaires.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Des produits solidaires aux couleurs de l&apos;évènement sont
              proposés : chaque achat contribue à soutenir les actions de
              prévention du suicide portées par le Fonds Horizon Psy du CH
              Charles Perrens.
            </p>
          </div>
        </div>
      }
    />
  );
}

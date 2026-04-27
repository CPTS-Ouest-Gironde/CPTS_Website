import { SimpleActualitePage } from "@/components/simple-actualite-page";

export default function EscrimeTherapeutiqueAtvs33Page() {
  return (
    <SimpleActualitePage
      title={"Escrime thérapeutique\u00A0: découverte du protocole ATVS33"}
      imageSrc="/actu/affiche-escrime-therapeutique.webp"
      imageAlt="Escrime thérapeutique ATVS33"
      posterCardClassName="max-w-md"
      intro={
        <div className="space-y-5">
          <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5 lg:p-6 space-y-4 text-base lg:text-lg text-muted-foreground leading-relaxed">
            <p>
              Le 18 mai prochain, en matinée, l&apos;association ATVS33 propose
              aux professionnels du soin de découvrir l&apos;approche du
              protocole d&apos;escrime thérapeutique en faveur des personnes
              victimes de violences sexuelles, en présence de l&apos;équipe
              encadrante.
            </p>
            <p>
              Les ateliers existent depuis 4 ans sur Mérignac. L&apos;escrime
              est choisie pour son langage symbolique et son organisation du
              jeu, qui permettent d&apos;explorer des thématiques liées à la
              reconstruction. Ces ateliers visent à transformer une énergie
              destructrice en une force constructive grâce à la libération des
              émotions.
            </p>
            <p>
              En complément d&apos;un suivi psychologique, l&apos;atelier aide
              les participantes à avancer dans leur processus de guérison, en
              travaillant à la fois sur le corps et l&apos;esprit.
            </p>
            <p>
              Mêlant échanges et mise en pratique, ce temps
              d&apos;expérimentation vous permettra de mieux comprendre et
              sentir ce qui se passe pendant ces ateliers.
            </p>
            <p>
              Ce temps de partage se déroulera à Mérignac, en salle
              d&apos;armes. Le nombre de places est limité pour des raisons
              logistiques (équipements d&apos;escrime).
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 lg:p-6 space-y-3">
            <h2 className="text-xl font-semibold text-foreground">
              Informations pratiques
            </h2>
            <ul className="space-y-2 text-base text-muted-foreground">
              <li>
                <strong className="text-foreground">Date :</strong> 18 mai 2026
              </li>
              <li>
                <strong className="text-foreground">Horaire :</strong> 9h00 –
                11h30
              </li>
              <li>
                <strong className="text-foreground">Lieu :</strong> SAM Mérignac
                – Salle d&apos;armes 1er étage, 68 avenue du Truc, Gymnase
                Robert Brette, 33700 Mérignac (Parking au fond à gauche)
              </li>
            </ul>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 lg:p-6 space-y-4">
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-foreground">
                Inscription par mail
              </h2>
              <ul className="space-y-1 text-base text-muted-foreground">
                <li>
                  <a
                    href="mailto:atvsgironde33@gmail.com"
                    className="text-primary hover:underline"
                  >
                    atvsgironde33@gmail.com
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:Raphaeldevillard@me.com"
                    className="text-primary hover:underline"
                  >
                    Raphaeldevillard@me.com
                  </a>
                </li>
              </ul>
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-foreground">Contact</h2>
              <ul className="space-y-1 text-base text-muted-foreground">
                <li>
                  <strong className="text-foreground">Delphine :</strong>{" "}
                  <a
                    href="tel:+33678887279"
                    className="text-primary hover:underline"
                  >
                    06.78.88.72.79
                  </a>
                </li>
                <li>
                  <strong className="text-foreground">Raphaël :</strong>{" "}
                  <a
                    href="tel:+33682777371"
                    className="text-primary hover:underline"
                  >
                    06.82.77.73.71
                  </a>
                </li>
              </ul>
            </div>

            <a
              href="https://atvs33.fr/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-full bg-primary text-primary-foreground px-4 py-2 text-sm font-semibold hover:bg-primary/90 transition-colors"
            >
              En savoir plus sur l&apos;ATVS33
            </a>
          </div>
        </div>
      }
    />
  );
}

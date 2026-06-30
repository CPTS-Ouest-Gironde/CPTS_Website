import { SimpleActualitePage } from "@/components/simple-actualite-page";

const SOURCE_URL =
  "https://sante.gouv.fr/actualites-presse/presse/communiques-de-presse/article/reduire-les-passages-evitables-et-desengorger-durablement-les-services-d";

const paragraphs = [
  "Chaque année, les services d'urgence prennent en charge près de 20 millions de passages. Si leur fréquentation a cessé d'augmenter, la pression reste considérable sur les professionnels de santé comme sur les établissements.",
  "Les urgences continuent d'être sollicitées pour des situations qui pourraient relever d'autres prises en charge. Dans le même temps, elles accueillent des patients toujours plus âgés, plus fragiles et nécessitant des soins plus complexes. Chaque été comme chaque hiver, cette tension se traduit par des difficultés d'organisation, des temps d'attente parfois excessifs et des fermetures temporaires de structures.",
  "Cette situation n'est plus soutenable. Les urgences doivent pouvoir se concentrer sur leur mission première : prendre en charge les situations les plus graves et les plus urgentes.",
  "Le Gouvernement fixe donc un objectif ambitieux : réduire de moitié les passages évitables aux urgences, soit près de 4 millions de passages en moins chaque année, afin de garantir à chaque patient une réponse plus rapide, plus adaptée et plus efficace.",
];

export default function UrgencesPasUneEvidencePage() {
  return (
    <SimpleActualitePage
      title="Les urgences, ce n'est pas une évidence"
      imageSrc="/actu/urgence-pas-une-evidence.webp"
      imageAlt="Campagne : les urgences, ce n'est pas une évidence"
      posterCardClassName="max-w-none"
      intro={
        <div className="space-y-6">
          <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5 lg:p-6">
            <p className="text-base lg:text-lg font-semibold text-foreground leading-relaxed">
              Réduire de moitié les passages évitables aux urgences pour
              garantir à chaque patient une réponse plus rapide, plus adaptée
              et plus efficace.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl lg:text-2xl font-bold text-foreground">
              Faire face à une pression qui reste trop forte sur les urgences
            </h2>
            {paragraphs.map((text, index) => (
              <p
                key={index}
                className="text-base lg:text-lg text-muted-foreground leading-relaxed"
              >
                {text}
              </p>
            ))}
          </div>

          <a
            href={SOURCE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center rounded-full bg-primary text-primary-foreground px-4 py-2 text-sm font-semibold hover:bg-primary/90 transition-colors"
          >
            Lire l&apos;article complet sur sante.gouv.fr
          </a>
        </div>
      }
    />
  );
}

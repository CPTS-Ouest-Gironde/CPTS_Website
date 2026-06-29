import { SimpleActualitePage } from "@/components/simple-actualite-page";

const REGISTRE_CANICULE_URL =
  "https://www.merignac.com/inscrivez-vous-en-ligne-au-plan-fortes-chaleurs";

export default function RegistreCaniculePage() {
  return (
    <SimpleActualitePage
      title="Registre canicule : protégeons les personnes fragiles"
      imageSrc="/actu/registre-canicule-merignac.webp"
      imageAlt="Affiche Registre canicule de la Ville de Mérignac"
      intro={
        <div className="space-y-6">
          <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5 lg:p-6">
            <p className="text-base lg:text-lg font-semibold text-foreground leading-relaxed">
              En période de fortes chaleurs, les personnes âgées, isolées,
              fragiles ou vulnérables peuvent bénéficier d&apos;une veille
              renforcée grâce au registre canicule de la Ville de Mérignac.
            </p>
          </div>

          <div className="space-y-4">
            <p className="text-base lg:text-lg text-muted-foreground leading-relaxed">
              L&apos;inscription permet aux équipes municipales et au CCAS de
              prendre contact avec les personnes inscrites lors des épisodes de
              canicule, afin de s&apos;assurer qu&apos;elles vont bien et de les
              orienter si nécessaire.
            </p>
            <p className="text-base lg:text-lg text-muted-foreground leading-relaxed">
              Nous avons tous un rôle à jouer : professionnels de santé,
              proches, voisins ou aidants peuvent repérer les personnes à
              risque et les accompagner dans cette démarche simple, réalisée en
              quelques minutes.
            </p>
            <p className="text-base lg:text-lg text-muted-foreground leading-relaxed">
              Pour accéder au formulaire, vous pouvez utiliser le bouton
              ci-dessous ou scanner directement le QR code présent sur
              l&apos;affiche.
            </p>
          </div>

          <a
            href={REGISTRE_CANICULE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center rounded-full bg-primary text-primary-foreground px-4 py-2 text-sm font-semibold hover:bg-primary/90 transition-colors"
          >
            Inscrire une personne sur merignac.com
          </a>
        </div>
      }
    />
  );
}

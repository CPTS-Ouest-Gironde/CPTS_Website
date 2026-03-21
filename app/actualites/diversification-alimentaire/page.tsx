import { SimpleActualitePage } from "@/components/simple-actualite-page";

const DOCTOLIB_URL =
  "https://www.doctolib.fr/dieteticien/merignac/celine-maillard-merignac/booking/availabilities?specialityId=414&telehealth=false&placeId=practice-161680&motiveCategoryIds%5B%5D=391618&motiveIds%5B%5D=13383386&pid=practice-161680&bookingFunnelSource=profile";

export default function DiversificationAlimentairePage() {
  return (
    <SimpleActualitePage
      title="Jeunes parents? Inscrivez vous"
      imageSrc="/actu/affiche-diversification-alimentaire.webp"
      imageAlt="Affiche Diversification Alimentaire - Jeunes parents"
      intro={
        <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5 lg:p-6 space-y-3">
          <p className="text-base lg:text-lg font-semibold text-foreground">
            Atelier proposé tous les deux mois. Places limitées à 15.
          </p>
          <p className="text-muted-foreground">
            Inscriptions en scannant le QR code sur l&apos;affiche ou
            directement sur Doctolib.
          </p>
          <a
            href={DOCTOLIB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center rounded-full bg-primary text-primary-foreground px-4 py-2 text-sm font-semibold hover:bg-primary/90 transition-colors"
          >
            S&apos;inscrire sur Doctolib
          </a>
        </div>
      }
    />
  );
}

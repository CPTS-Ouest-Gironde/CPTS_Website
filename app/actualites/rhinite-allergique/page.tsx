import { SimpleActualitePage } from "@/components/simple-actualite-page";

export default function RhiniteAllergiquePage() {
  return (
    <SimpleActualitePage
      title="Vous souffrez d'une rhinite allergique"
      imageSrc="/actu/affiche-rhinite.webp"
      imageAlt="Affiche rhinite allergique"
      intro={
        <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5 lg:p-6">
          <p className="text-base lg:text-lg text-muted-foreground leading-relaxed">
            Pour la 2ème année consécutive, la CPTS Ouest Gironde renouvelle
            le protocole de délégation de tâches sur la rhinite et
            conjonctivite allergique : les pharmaciens peuvent délivrer des
            médicaments pour vos allergies sans ordonnance. Cette année, 12
            pharmacies supplémentaires participent à améliorer l&apos;accès au
            soin des patients du territoire.
          </p>
        </div>
      }
    />
  );
}

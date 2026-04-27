// Données de navigation centralisées
export const navigationItems = [
  {
    label: "ACCUEIL",
    href: "/",
    type: "link" as const,
  },
  {
    label: "PROFESSIONNELS",
    type: "dropdown" as const,
    items: [
      { label: "Adhésion", href: "/professionnels/adhesion" },
      { label: "Commander des supports", href: "/professionnels/supports" },
      { label: "Nos actions & vos outils", href: "/professionnels/actions-outils" },
      { label: "Les formations", href: "/professionnels/formations" },
    ],
  },
  {
    label: "PATIENTS",
    type: "dropdown" as const,
    items: [
      { label: "Coordonnées utiles", href: "/patients/coordonnees" },
      { label: "L'annuaire des professionnels de santé", href: "/patients/annuaire" },
      { label: "Avez-vous un médecin traitant ?", href: "/patients/medecin-traitant" },
      { label: "Mon Espace de Santé", href: "/patients/mon-espace-sante" },
      { label: "Tuto Espace Santé", href: "/patients/mon-espace-sante/tuto-espace-sante" },
    ],
  },
  {
    label: "PRÉSENTATION",
    type: "dropdown" as const,
    items: [
      { label: "Organisation", href: "/presentation#organisation" },
      { label: "Le territoire", href: "/presentation#territoire" },
      { label: "Pourquoi une communauté", href: "/presentation#pourquoi" },
      { label: "Missions", href: "/presentation#missions" },
      { label: "Le suivi de nos activités", href: "/presentation/suivi-activites" },
    ],
  },
  {
    label: "PRÉVENTION",
    type: "dropdown" as const,
    items: [
      { label: "Votre prévention du mois", href: "/prevention/du-mois" },
      { label: "Éducation thérapeutique", href: "/prevention/education-therapeutique" },
      { label: "Mémos de suivi", href: "/prevention/memos-suivi" },
      { label: "Articles santé familiale", href: "/prevention/sante-familiale" },
    ],
  },
  {
    label: "FAQ",
    href: "/faq",
    type: "link" as const,
  },
] as const;

export type NavigationItem = typeof navigationItems[number];

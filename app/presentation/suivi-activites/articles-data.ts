export interface SuiviArticle {
  slug: string;
  title: string;
  image: string;
  excerpt: string;
  frame: "portrait" | "square" | "landscape" | "wide";
  publishedAt?: string;
}

// Ordre du plus récent au plus ancien
export const suiviArticles: SuiviArticle[] = [
  {
    slug: "soiree-scientifique-cardio-ess-mars-2026",
    title: "Soirée scientifique cardiologie avec l'ESS Nouvelle-Aquitaine — 19 mars 2026",
    image: "/suivi-activite/articles/soiree-cardio-19-mars-2026/1.webp",
    excerpt:
      "La CPTS Ouest Gironde et l'ESS Cardiologie Nouvelle-Aquitaine réunies pour une soirée autour de la téléexpertise, de l'insuffisance cardiaque et de l'exercice coordonné.",
    frame: "landscape",
    publishedAt: "19 mars 2026",
  },
  {
    slug: "simulation-pluriprofessionnelle-simairlec-mars-2026",
    title: "Journée de simulation pluriprofessionnelle avec SIMAIRLEC — 19 mars 2026",
    image: "/suivi-activite/articles/19-mars-simairlec/simairlec-1.webp",
    excerpt:
      "SIMAIRLEC s'est déplacé au Pôle de Santé Robinson à Mérignac pour une journée de simulation pluriprofessionnelle avec mannequin et diffusion vidéo en direct.",
    frame: "landscape",
    publishedAt: "19 mars 2026",
  },
  {
    slug: "webinaire-ville-hop-rhinite-allergique-mars-2026",
    title: "Webinaire Ville Hôp : asthme et rhinite allergique",
    image: "/suivi-activite/articles/CHU-CPTS-rhinite-allergique/1.webp",
    excerpt:
      "Lors du webinaire Ville Hôp du 12 mars, ville et hôpital ont échangé autour de l'asthme et de la rhinite allergique.",
    frame: "landscape",
    publishedAt: "12 mars 2026",
  },
  {
    slug: "atelier-diversification-alimentaire-5-mars-2026",
    title: "Retour sur l’atelier diversification alimentaire du 5 mars 2026",
    image: "/suivi-activite/articles/diversification-alimentaire-2026/1.webp",
    excerpt:
      "Merci à Céline MAILLARD, diététicienne pédiatrique, et aux familles présentes pour leur participation. Prochain atelier le jeudi 7 mai 2026.",
    frame: "landscape",
    publishedAt: "5 mars 2026",
  },
  {
    slug: "soiree-endometriose-formation-fevrier-2026",
    title: "Soirée endométriose du mercredi 4 février 2026",
    image: "/suivi-activite/articles/soirée-endométriose-mars-2026/image.webp",
    excerpt:
      "Formation sur l’endométriose avec mises à jour en physiopathologie, recommandations de traitement et accompagnement pluriprofessionnel.",
    frame: "landscape",
    publishedAt: "4 février 2026",
  },
  {
    slug: "les-matins-prevention-sante-aller-vers-les-usagers",
    title: "Les matins prévention santé : « aller vers » les usagers",
    image: "/suivi-activite/articles/les-matins-prevention-sante.jpg",
    excerpt: "…",
    frame: "square",
    publishedAt: "3 décembre 2025",
  },
  {
    slug: "journee-aller-vers-usagers-martignas-pharmacie-ccas",
    title:
      "Journée « aller vers » les usagers du lundi 24 novembre en collaboration avec la pharmacie du centre de Martignas sur Jalles et le CCAS",
    image: "/suivi-activite/articles/journee-aller-vers.jpg",
    excerpt:
      "Une quarantaine de personnes dont 2 personnes avaient pris un rendez-vous en amont à la pharmacie.",
    frame: "square",
    publishedAt: "3 décembre 2025",
  },
  {
    slug: "deuxieme-atelier-de-diversification-alimentaire",
    title: "2 ème Atelier de diversification alimentaire",
    image:
      "/suivi-activite/articles/deuxieme-atelier-de-diversification-alimentaire.jpg",
    excerpt:
      "Publié le 24 novembre 2025 : retour sur le 2ème atelier animé par Celine MAILLARD, diététicienne.",
    frame: "landscape",
    publishedAt: "24 novembre 2025",
  },
  {
    slug: "premiere-journee-de-prevention-aller-vers",
    title: "1 ère journée de prévention « aller vers »",
    image:
      "/suivi-activite/articles/premiere-journee-de-prevention-aller-vers.jpg",
    excerpt: "…",
    frame: "landscape",
  },
  {
    slug: "les-journees-2025-inter-cpts-a-montpellier",
    title: "Les journées 2025 inter CPTS à Montpellier",
    image: "/suivi-activite/articles/les-journees-2025-inter-cpts.jpg",
    excerpt: "…",
    frame: "landscape",
  },
  {
    slug: "assemblee-generale-cpts-ouest-gironde-octobre-2025",
    title: "Assemblée générale de la CPTS OUEST GIRONDE octobre 2025",
    image: "/suivi-activite/articles/assemble-generale-cpts.jpg",
    excerpt: "L’assemblée générale de la CPTS OUEST GIRONDE a eu lieu ce jeudi 16 octobre 2025.",
    frame: "wide",
  },
  {
    slug: "mardi-14-octobre-2025-une-nouvelle-rcp",
    title:
      "Mardi 14 octobre 2025, une nouvelle RCP a réuni des professionnels de santé issus du milieu libéral",
    image: "/suivi-activite/articles/mardi-14-octobre-2025.jpg",
    excerpt:
      "En ce mardi 14 octobre 2025, une nouvelle RCP a réuni des professionnels de santé issus du milieu libéral.",
    frame: "wide",
  },
  {
    slug: "deuxieme-journee-coeur-des-femmes-merignac-octobre-2025",
    title:
      "2 ème journee Cœur des Femmes au sein de la clinique du sport de Mérignac en ce mercredi 01 octobre 2025.",
    image: "/suivi-activite/articles/deuxieme-journee-coeur-des-femme.jpg",
    excerpt:
      "Les Dr Clément Guinaudeau Stéphanie ainsi que le Dr Mignot Aude ont permis, avec une belle mobilisation, de sensibiliser le public.",
    frame: "portrait",
  },
  {
    slug: "newsletter-numero-6-les-actualites-de-lautomne",
    title: "NEWSLETTER N°6, LES ACTUALITÉS DE L’AUTOMNE",
    image: "/suivi-activite/articles/newsletter-numero-6.jpg",
    excerpt:
      "ARCHIVES 2024 2025 Newsletter-CPTS N°1 Newsletter-CPTS N°2 Newsletter-CPTS N°3 Newsletter…",
    frame: "portrait",
  },
  {
    slug: "premiere-soiree-sante-mentale-maison-de-sante-les-pins",
    title:
      "Une première soirée SANTE MENTALE en collaboration avec la MAISON DE SANTE LES PINS",
    image: "/suivi-activite/articles/premiere-soiree-sante-mentale.jpeg",
    excerpt:
      "Le 12 juin 2025 autour de 2 cas cliniques avec les professionnels du territoire.",
    frame: "wide",
  },
  {
    slug: "nouvelle-rcp-riche-symptomatologie-complexe-lipoedeme",
    title:
      "Une nouvelle RCP riche en échanges sur une symptomatologie complexe du lipoedeme",
    image: "/suivi-activite/articles/nouvelle-rcp-riche.jpeg",
    excerpt:
      "Une nouvelle RCP riche en échanges pluri-professionnels autour de situations complexes.",
    frame: "portrait",
  },
  {
    slug: "premiere-journee-assises-regionales-sante-de-la-femme",
    title: "La 1ere journée des assises régionales de la santé de la femme",
    image: "/suivi-activite/articles/premiere-journee-des-assises-regionales.jpeg",
    excerpt: "La 1ere journée des assises régionales de la santé de la femme.",
    frame: "landscape",
  },
  {
    slug: "soiree-vif-2025-autour-de-la-perinatalite",
    title: "Soirée VIF 2025 autour de la périnatalité.",
    image: "/suivi-activite/articles/soiree-vif-2025.jpg",
    excerpt:
      "Cette année, les professionnels de santé ont été informés des outils de diagnostics e…",
    frame: "portrait",
  },
  {
    slug: "nouvelle-actu-rcp",
    title: "Nouvelle actu rcp",
    image: "/suivi-activite/articles/nouvelle-actu-rcp.jpg",
    excerpt:
      "» Le 18 mars 2025, les professionnels de santé de la Cpts Ouest Gironde se sont retro…",
    frame: "landscape",
  },
  {
    slug: "nouvelle-rcp-janvier-2025",
    title: "NOUVELLE RCP JANVIER 2025",
    image: "/suivi-activite/articles/nouvelle-rcp-2025.jpg",
    excerpt:
      "Ce 21 janvier, 18 professionnels de santé médicaux, paramédicaux, psycho praticiens, …",
    frame: "landscape",
  },
  {
    slug: "formation-situations-sanitaires-exceptionnelles-13-janvier",
    title: "Formation aux Situations Sanitaires Exceptionnelles ce lundi 13 janvier",
    image: "/suivi-activite/articles/formation-aux-situations-sanitaires.png",
    excerpt:
      "« Reprise active pour notre CPTS avec l’équipe Simairlec lors d’une journée…",
    frame: "landscape",
  },
  {
    slug: "nouvelle-rcp-10-decembre-2024-cetb",
    title:
      "NOUVELLE RCP LE 10 DECEMBRE 2024 dans les locaux CETB du pôle ETP ambulatoire de Bordeaux qui nous a accueilli",
    image: "/suivi-activite/articles/nouvelle-rcp-10-decembre-2024.jpg",
    excerpt:
      "Autour de 2 cas complexes médico-sociaux, des professionnels se sont réunis pour échanger.",
    frame: "portrait",
  },
  {
    slug: "journee-mondiale-lutte-violences-faites-aux-femmes",
    title: "Journée mondiale de lutte contre les violences faites aux femmes",
    image: "/suivi-activite/articles/journee-mondiale-lutte-violences-femmes.png",
    excerpt:
      "Dans le cadre de la journée mondiale de lutte contre les violences faites aux femmes, la CPTS s’est mobilisée.",
    frame: "portrait",
  },
];

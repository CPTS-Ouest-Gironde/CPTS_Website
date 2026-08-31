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
    slug: "incendies-saint-jean-dillac-msp-aout-2026",
    title:
      "Incendies à Saint Jean d'Illac : cinq jours pour prendre soin de ceux qui luttaient contre le feu — 11 août 2026",
    image: "/suivi-activite/articles/11-08-2026/post-st-jean-dillac.webp",
    excerpt:
      "Bravo à l'équipe de la future MSP de Saint Jean d'Illac d'avoir su faire « communauté » et d'avoir démontré leur capacité d'initiative et de réactivité en situation de crise.",
    frame: "landscape",
    publishedAt: "11 août 2026",
  },
  {
    slug: "soiree-ville-hopital-parcours-cancerologie-juin-2026",
    title: "Soirée Ville-Hôpital : les parcours en cancérologie — 25 juin 2026",
    image: "/suivi-activite/articles/25-juin-ville-hop/25-juin-ville-hop-1.webp",
    excerpt:
      "Professionnels de ville et équipes du CHU de Bordeaux réunis autour des parcours en cancérologie : coordination ville-hôpital, innovations thérapeutiques, recherche clinique et accompagnement des patients pendant et après les traitements.",
    frame: "landscape",
    publishedAt: "25 juin 2026",
  },
  {
    slug: "equipe-rcp-journee-inter-cpts-nouvelle-aquitaine-juin-2026",
    title:
      "L'équipe RCP à la journée inter-CPTS de Nouvelle-Aquitaine — 11 juin 2026",
    image:
      "/suivi-activite/articles/11-juin-rcp-cas-complexe/rcp-cas-complexe-11-juin-1.webp",
    excerpt:
      "L'équipe RCP de la CPTS Ouest Gironde est intervenue lors de la journée inter-CPTS de Nouvelle-Aquitaine organisée par Agora Lib, pour un atelier de partage d'expérience autour de son dispositif de concertation pluriprofessionnelle.",
    frame: "landscape",
    publishedAt: "11 juin 2026",
  },
  {
    slug: "depistage-diabete-hypertension-pharmacie-formanoir-juin-2026",
    title:
      "Dépistage diabète, hypertension et bilan visuel à la pharmacie Formanoir — juin 2026",
    image: "/suivi-activite/articles/formanoir-juin/formanoir-1.webp",
    excerpt:
      "Deux journées de sensibilisation et de dépistage du diabète et de l'hypertension à la pharmacie Formanoir à Pessac, menées par nos deux infirmières, avec un bilan visuel proposé par Les Opticiens Mobiles.",
    frame: "portrait",
    publishedAt: "1er et 11 juin 2026",
  },
  {
    slug: "soiree-formation-perinatalite-vulnerabilites-sante-mentale-28-avril-2026",
    title: "Soirée de formation périnatalité : vulnérabilités et santé mentale — 28 avril 2026",
    image: "/suivi-activite/articles/28-avril-2026/soiree-28-avril-1.webp",
    excerpt:
      "Soirée pluriprofessionnelle autour des vulnérabilités et de la santé mentale en périnatalité, avec le RPNA, les PMI, l'équipe de psychiatrie périnatale du CHU, la MAISON DE SANTE LES PINS et l'association MAMAN BLUES.",
    frame: "landscape",
    publishedAt: "28 avril 2026",
  },
  {
    slug: "depistage-diabete-pharmacie-arago-28-29-avril-2026",
    title: "Dépistage diabète et HTA à la Pharmacie ARAGO — 28 et 29 avril 2026",
    image: "/suivi-activite/articles/28-29-avril-2026/diabete-28-29-avril.webp",
    excerpt:
      "Plus de 30 usagers accompagnés par nos 2 infirmières lors d'entretiens de 30 minutes pour échanger, informer, réaliser des dépistages et orienter vers des ateliers ETP à Pessac.",
    frame: "landscape",
    publishedAt: "28 et 29 avril 2026",
  },
  {
    slug: "soiree-ville-hopital-cpts-bonom-booste-avril-2026",
    title: "Soirée Ville-Hôpital avec les CPTS BONOM, BOOSTE et Ouest Gironde — 23 avril 2026",
    image: "/suivi-activite/articles/ville-hop-23-avril/ville-hop-1.webp",
    excerpt:
      "Les CPTS BONOM, BOOSTE et Ouest Gironde ont présenté leurs parcours coordonnés au CHU lors de la soirée Ville-Hôpital du 23 avril, favorisant le rapprochement entre médecine de ville et hôpital.",
    frame: "landscape",
    publishedAt: "23 avril 2026",
  },
  {
    slug: "depistage-cancer-sein-fo-jenny-lepreux-avril-2026",
    title: "Dépistage du cancer du sein au Foyer occupationnel Jenny Lepreux — 16 avril 2026",
    image: "/suivi-activite/articles/16-avril-cancer-sein/16-avril-1.webp",
    excerpt:
      "10 résidentes du Foyer occupationnel Jenny Lepreux à Mérignac ont été dépistées avec l'intervention d'une sage-femme et d'une gynécologue adhérentes de la CPTS.",
    frame: "landscape",
    publishedAt: "16 avril 2026",
  },
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

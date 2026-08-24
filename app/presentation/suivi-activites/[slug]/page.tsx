import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, CalendarDays, ExternalLink } from "lucide-react";
import { notFound } from "next/navigation";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { suiviArticles } from "../articles-data";
import { ArticleMediaCarousel } from "@/components/suivi-activite/article-media-carousel";

const VILLE_HOPITAL_CANCEROLOGIE_JUIN_2026_SLUG =
  "soiree-ville-hopital-parcours-cancerologie-juin-2026";
const RCP_INTER_CPTS_JUIN_2026_SLUG =
  "equipe-rcp-journee-inter-cpts-nouvelle-aquitaine-juin-2026";
const DEPISTAGE_FORMANOIR_JUIN_2026_SLUG =
  "depistage-diabete-hypertension-pharmacie-formanoir-juin-2026";
const SOIREE_PERINATALITE_AVRIL_2026_SLUG =
  "soiree-formation-perinatalite-vulnerabilites-sante-mentale-28-avril-2026";
const DEPISTAGE_DIABETE_ARAGO_AVRIL_2026_SLUG =
  "depistage-diabete-pharmacie-arago-28-29-avril-2026";
const SOIREE_VILLE_HOPITAL_AVRIL_2026_SLUG =
  "soiree-ville-hopital-cpts-bonom-booste-avril-2026";
const DEPISTAGE_CANCER_SEIN_AVRIL_2026_SLUG =
  "depistage-cancer-sein-fo-jenny-lepreux-avril-2026";
const SOIREE_CARDIO_MARS_2026_SLUG = "soiree-scientifique-cardio-ess-mars-2026";
const SIMAIRLEC_MARS_2026_SLUG =
  "simulation-pluriprofessionnelle-simairlec-mars-2026";
const WEBINAIRE_RHINITE_ALLERGIQUE_SLUG =
  "webinaire-ville-hop-rhinite-allergique-mars-2026";
const LES_MATINS_SLUG = "les-matins-prevention-sante-aller-vers-les-usagers";
const JOURNEE_ALLER_VERS_SLUG =
  "journee-aller-vers-usagers-martignas-pharmacie-ccas";
const ATELIER_DIVERSIFICATION_5_MARS_2026_SLUG =
  "atelier-diversification-alimentaire-5-mars-2026";
const SOIREE_ENDOMETRIOSE_FEVRIER_2026_SLUG =
  "soiree-endometriose-formation-fevrier-2026";
const DEUXIEME_ATELIER_DIVERSIFICATION_SLUG =
  "deuxieme-atelier-de-diversification-alimentaire";
const PREMIERE_JOURNEE_PREVENTION_ALLER_VERS_SLUG =
  "premiere-journee-de-prevention-aller-vers";
const LES_JOURNEES_2025_INTER_CPTS_SLUG =
  "les-journees-2025-inter-cpts-a-montpellier";

function renderParagraphWithBold(text: string) {
  return text.split(/(\*\*.*?\*\*)/g).map((chunk, index) => {
    if (chunk.startsWith("**") && chunk.endsWith("**")) {
      return (
        <strong key={`${chunk}-${index}`} className="font-semibold text-foreground">
          {chunk.slice(2, -2)}
        </strong>
      );
    }

    return <span key={`${chunk}-${index}`}>{chunk}</span>;
  });
}

const articleDetails = {
  [VILLE_HOPITAL_CANCEROLOGIE_JUIN_2026_SLUG]: {
    paragraphs: [
      "Le 25 juin 2026, une soirée d'échanges a réuni les professionnels de ville et les équipes du CHU de Bordeaux autour des parcours en cancérologie, malgré la canicule.",
      "Au programme : coordination ville-hôpital, innovations thérapeutiques, recherche clinique et accompagnement des patients pendant et après les traitements.",
      "Les interventions ont mis en lumière le rôle essentiel des infirmières de coordination, les outils qui facilitent le partage d'informations entre professionnels et l'importance croissante des soins de support.",
      "Un message fort ressort de cette rencontre : la qualité du parcours patient repose sur une coopération étroite entre tous les acteurs du territoire.",
      "Merci aux intervenants et aux participants pour la richesse des échanges et leur engagement au service des patients.",
    ],
    mediaImages: [
      "/suivi-activite/articles/25-juin-ville-hop/25-juin-ville-hop-1.webp",
      "/suivi-activite/articles/25-juin-ville-hop/25-juin-ville-hop-2.webp",
      "/suivi-activite/articles/25-juin-ville-hop/25-juin-ville-hop-3.webp",
      "/suivi-activite/articles/25-juin-ville-hop/25-juin-ville-hop-4.webp",
      "/suivi-activite/articles/25-juin-ville-hop/25-juin-ville-hop-5.webp",
    ],
  },
  [RCP_INTER_CPTS_JUIN_2026_SLUG]: {
    paragraphs: [
      "Le 11 juin 2026, l'équipe RCP de la CPTS Ouest Gironde est intervenue lors de la journée inter-CPTS de Nouvelle-Aquitaine, organisée par Agora Lib.",
      "L'atelier animé à cette occasion était consacré au partage d'expérience autour des réunions de concertation pluriprofessionnelle (RCP) mises en place sur notre territoire.",
      "De nombreuses CPTS présentes ont manifesté leur intérêt pour ce dispositif « donnant-gagnant ».",
      "Merci à l'équipe RCP pour son intervention et à Agora Lib pour l'organisation de cette journée d'échanges entre CPTS de la région.",
    ],
    mediaImages: [
      "/suivi-activite/articles/11-juin-rcp-cas-complexe/rcp-cas-complexe-11-juin-1.webp",
      "/suivi-activite/articles/11-juin-rcp-cas-complexe/rcp-cas-complexe-11-juin-2.webp",
    ],
  },
  [DEPISTAGE_FORMANOIR_JUIN_2026_SLUG]: {
    paragraphs: [
      "Les 1er et 11 juin 2026, la CPTS Ouest Gironde a organisé deux journées de sensibilisation et de dépistage à la pharmacie Formanoir à Pessac.",
      "Lors de la première journée, plus de 30 patients ont bénéficié d'un dépistage du diabète et de l'hypertension artérielle, réalisé par nos deux infirmières.",
      "Les Opticiens Mobiles étaient également présents pour proposer un bilan visuel aux personnes accueillies.",
      "Ces actions « aller vers », menées au plus près des lieux de vie, permettent d'informer sur les facteurs de risque, de repérer précocement les situations à surveiller et d'orienter vers le médecin traitant lorsque cela est nécessaire.",
      "Merci à la pharmacie Formanoir pour son accueil, aux Opticiens Mobiles pour leur participation et aux infirmières mobilisées sur ces deux journées.",
    ],
    mediaImages: [
      "/suivi-activite/articles/formanoir-juin/formanoir-1.webp",
      "/suivi-activite/articles/formanoir-juin/formanoir-affiche.webp",
    ],
  },
  [SOIREE_PERINATALITE_AVRIL_2026_SLUG]: {
    paragraphs: [
      "Ce 28 avril s'est tenue notre soirée de formation en lien avec le plan santé de la femme en périnatalité (05 février 2026) : « Les vulnérabilités et la santé mentale en périnatalité » était le thème.",
      "Leur prise en charge ne peut se faire qu'en pluridisciplinarité : différents acteurs du territoire nous ont sensibilisés. Les acteurs du RPNA (Laure Mouton) ont présenté l'outil questionnaire Bien Naître. Les PMI (Karine Le Bourgeois-Dehail, Stéphanie Petit Carrié) ont abordé le risque des dérives sectaires liées aux coachs en santé mentale.",
      "Le Pr Sutter-Dallay Anne-Laure (équipe de psychiatrie périnatale de Charles Perrens) nous a rappelé les bases de la prise en charge ainsi que les modalités et lieux d'adressage. Un cas clinique a permis de valoriser la plus-value de l'exercice coordonné avec la psychiatrie libérale de la MAISON DE SANTE LES PINS (Didier Delhaye).",
      "Cette soirée informative a intégré l'association de pairaidance MAMAN BLUES (Mme Mercande), grâce à laquelle la parole de la maman peut être accueillie.",
      "Un grand merci à l'association MARIE CURRY (association d'intérêt général qui valorise le matrimoine culinaire) qui nous a régalé avec son cocktail raffiné !",
      "Merci à Paul BRANGE (sage-femme) et au Dr Kheira Meliani (médecin généraliste) d'avoir organisé et modéré la soirée.",
    ],
    mediaImages: [
      "/suivi-activite/articles/28-avril-2026/soiree-28-avril-1.webp",
      "/suivi-activite/articles/28-avril-2026/soiree-28-avril-2.webp",
      "/suivi-activite/articles/28-avril-2026/soiree-28-avril-3.webp",
      "/suivi-activite/articles/28-avril-2026/soiree-28-avril-4.webp",
      "/suivi-activite/articles/28-avril-2026/soiree-28-avril-5.webp",
    ],
  },
  [DEPISTAGE_DIABETE_ARAGO_AVRIL_2026_SLUG]: {
    paragraphs: [
      "Plus de 30 usagers accompagnés par nos 2 infirmières.",
      "Des entretiens de 30 minutes pour échanger, informer, réaliser des dépistages et orienter vers des ateliers d'éducation thérapeutique (ETP) à Pessac.",
    ],
    mediaImages: [
      "/suivi-activite/articles/28-29-avril-2026/diabete-28-29-avril.webp",
      "/actu/affiche-pharma-ARAGO%2028-29%20avril%20_page-0001.webp",
    ],
  },
  [SOIREE_VILLE_HOPITAL_AVRIL_2026_SLUG]: {
    paragraphs: [
      "Le 23 avril, la soirée Ville-Hôpital a réuni de nombreux professionnels du CHU et les CPTS BONOM, BOOSTE et Ouest Gironde.",
      "Les CPTS ont présenté certains de leurs parcours coordonnés ainsi que plusieurs missions menées pour la prise en charge et l'accès aux soins des patients de leur territoire.",
      "Après une présentation de ce qu'implique l'exercice coordonné, plusieurs parcours ont été abordés, notamment l'habituation aux soins pour les patients en situation de handicap, les boucles IDEL pour faciliter la recherche d'infirmiers en sortie d'hospitalisation, ainsi que la prise en charge des fausses couches spontanées non symptomatiques en ville.",
      "La CPTS Ouest Gironde était représentée par les équipes RCP cas complexes et RCP santé mentale, qui ont présenté les modalités de ces parcours : échanges sécurisés, expertise pluri-professionnelle, ressources hospitalières sollicitées, approche globale du patient (symptômes, contexte médico-social) et écoute de l'ensemble des professionnels impliqués.",
      "Merci au CHU et aux organisateurs de Ville-Hôpital d'avoir rendu cette rencontre possible et de favoriser le rapprochement entre les pratiques coordonnées en ville et l'hôpital.",
    ],
    mediaImages: [
      "/suivi-activite/articles/ville-hop-23-avril/ville-hop-1.webp",
      "/suivi-activite/articles/ville-hop-23-avril/ville-hop-2.webp",
      "/suivi-activite/articles/ville-hop-23-avril/ville-hop-3.webp",
      "/suivi-activite/articles/ville-hop-23-avril/ville-hop-4.webp",
      "/suivi-activite/articles/ville-hop-23-avril/ville-hop-5.webp",
    ],
  },
  [DEPISTAGE_CANCER_SEIN_AVRIL_2026_SLUG]: {
    paragraphs: [
      "Le 16 avril a eu lieu une action de dépistage du cancer du sein au Foyer occupationnel Jenny Lepreux à Mérignac.",
      "10 résidentes ont été dépistées avec l'intervention d'une sage-femme et d'une gynécologue adhérentes de la CPTS.",
      "Les résidentes ont participé activement à la préparation de l'action en travaillant sur les documents de sensibilisation.",
      "Merci à l'équipe du FO pour son accueil, à Isabelle Calafato pour la coordination de la matinée et à TSA&co pour leur accompagnement.",
    ],
    mediaImages: [
      "/suivi-activite/articles/16-avril-cancer-sein/16-avril-1.webp",
      "/suivi-activite/articles/16-avril-cancer-sein/16-avril-2.webp",
    ],
  },
  [SOIREE_CARDIO_MARS_2026_SLUG]: {
    paragraphs: [
      "Le 19 mars 2026, la CPTS Ouest Gironde et l'ESS Cardiologie Nouvelle-Aquitaine se sont réunies pour une soirée scientifique autour de la téléexpertise, de l'insuffisance cardiaque, de la pédiatrie et de l'exercice coordonné.",
      "Six intervenants ont partagé leur expérience de terrain au service d'une médecine de proximité plus connectée.",
    ],
    mediaImages: [
      "/suivi-activite/articles/soiree-cardio-19-mars-2026/1.webp",
      "/suivi-activite/articles/soiree-cardio-19-mars-2026/2.webp",
      "/suivi-activite/articles/soiree-cardio-19-mars-2026/3.webp",
      "/suivi-activite/articles/soiree-cardio-19-mars-2026/4.webp",
      "/suivi-activite/articles/soiree-cardio-19-mars-2026/5.webp",
    ],
  },
  [SIMAIRLEC_MARS_2026_SLUG]: {
    paragraphs: [
      "SIMAIRLEC s'est déplacé au Pôle de Santé Robinson à Mérignac le jeudi 19 mars pour une journée intense de simulation.",
      "Plusieurs mises en situation ont été proposées à l'équipe avec un mannequin, en pluriprofessionnel, avec le matériel disponible dans l'environnement réel et une diffusion vidéo en direct pour les autres apprenants.",
      "Le tout dans la bonne humeur et la bienveillance !",
    ],
    mediaImages: [
      "/suivi-activite/articles/19-mars-simairlec/simairlec-1.webp",
      "/suivi-activite/articles/19-mars-simairlec/simairlec-2.webp",
    ],
  },
  [WEBINAIRE_RHINITE_ALLERGIQUE_SLUG]: {
    paragraphs: [
      "Lors du webinaire Ville Hôp du 12 mars, ville et hôpital ont échangé autour de l'asthme et de la rhinite allergique.",
      "Le CHU de Bordeaux propose une prise en charge en Hôpital de Jour : exploration fonctionnelle respiratoire, imagerie, bilan allergologique et éducation au traitement.",
      "La CPTS Ouest Gironde propose pour la 2ème année consécutive un protocole de délégation de tâches entre médecins et pharmaciens. 12 pharmacies complémentaires participent cette saison, avec un très bon accueil des patients.",
      "**Dr Fabien Beaufils, Pneumologue — CHU de Bordeaux**",
      "**Dr Christine Cauchetier, Docteur en pharmacie — CPTS Ouest Gironde**",
    ],
    mediaImages: [
      "/suivi-activite/articles/CHU-CPTS-rhinite-allergique/1.webp",
      "/suivi-activite/articles/CHU-CPTS-rhinite-allergique/2.webp",
      "/suivi-activite/articles/CHU-CPTS-rhinite-allergique/3.webp",
      "/suivi-activite/articles/CHU-CPTS-rhinite-allergique/4.webp",
      "/suivi-activite/articles/CHU-CPTS-rhinite-allergique/5.webp",
    ],
  },
  [ATELIER_DIVERSIFICATION_5_MARS_2026_SLUG]: {
    paragraphs: [
      "Merci à Céline MAILLARD, diététicienne pédiatrique, pour l’animation de cet atelier, ainsi qu’aux familles présentes pour leur participation.",
      "Prochain atelier : jeudi 7 mai 2026.",
    ],
    mediaImages: [
      "/suivi-activite/articles/diversification-alimentaire-2026/1.webp",
      "/suivi-activite/articles/diversification-alimentaire-2026/2.webp",
      "/suivi-activite/articles/diversification-alimentaire-2026/3.webp",
    ],
  },
  [SOIREE_ENDOMETRIOSE_FEVRIER_2026_SLUG]: {
    paragraphs: [
      "Ce mercredi 4 février, notre CPTS Ouest Gironde proposait une formation sur le thème de l’endométriose, pilotée par Marie-Amélie Bonnet, sage-femme à Mérignac.",
      "Au programme : les nouveautés en physiopathologie et les nouvelles recommandations de traitement, présentées par le Dr Adrien Crestani d’IFEM Endo.",
      "Il a rappelé l’importance d’un suivi pluriprofessionnel : rééducation, psychologue, psychiatre, sage-femme, gynécologue, médecin généraliste.",
      "Un grand merci au centre VIVMED pour avoir éclairé nos adhérents sur les errances diagnostiques dans la prise en charge des vulvodynies, souvent étirées sur près de 2 ans.",
      "Leur accompagnement pluridisciplinaire est disponible à Mérignac depuis décembre 2025 : contact@vivmed.fr",
      "Enfin, un coup de projecteur sur l’association DisDameDonc et son programme d’ETP Endométriose : 4 demi-journées pour les patientes, et une 1ère en Nouvelle-Aquitaine.",
    ],
    mediaImages: [
      "/suivi-activite/articles/soirée-endométriose-mars-2026/image.webp",
      "/suivi-activite/articles/soirée-endométriose-mars-2026/image2.webp",
      "/suivi-activite/articles/soirée-endométriose-mars-2026/image3.webp",
      "/suivi-activite/articles/soirée-endométriose-mars-2026/image4.webp",
    ],
  },
  [LES_MATINS_SLUG]: {
    paragraphs: [
      "Un grand merci au CCAS de nous avoir convié ce jeudi 27 novembre 2025 pour ce dépistage des agents et du public Pessacais.",
      "Une prévention Diabète leur a été proposée par la CPTS ainsi que des ateliers nutrition animés par les pôles ETP et la Maison du diabète.",
      "Grâce au questionnaire Findrisk, une trentaine de personnes ont été sensibilisées : des pré-diabètes dépistés ont pu être redirigés vers le médecin traitant et également vers le pôle ETP présent, venu animer un atelier sur les mesures hygiéno-diététiques.",
      "Pour ceux dont la tension artérielle était limite, une éducation de l’automesure tensionnelle a été faite ainsi que la délivrance de feuilles d’automesure CPAM.",
      "Des conseils d’hygiène de vie alimentaire et sportive ont pu être transmis.",
      "Une belle matinée de prévention primaire réalisée en présence d’Émilie Loubiat IDE ETP, Dr Françoise Debost, Dr Céline Lazerowitch et Dr Méliani Nedjari Kheira.",
    ],
    mediaImages: [
      "/suivi-activite/articles/les-matins-prev/carrousel-1.webp",
      "/suivi-activite/articles/les-matins-prev/carrousel-2.webp",
      "/suivi-activite/articles/les-matins-prev/carrousel-3.webp",
      "/suivi-activite/articles/les-matins-prev/carrousel-4.webp",
    ],
  },
  [JOURNEE_ALLER_VERS_SLUG]: {
    paragraphs: [
      "Une quarantaine de personnes dont 2 personnes avaient pris un rendez-vous en amont à la pharmacie.",
      "Il a été réalisé 20 tests Findrisk qui ont conduit à 6 tests glycémiques qui n’ont révélé que des résultats inférieurs aux valeurs de référence mais nous ont permis d’évoquer la pathologie diabétique, ses facteurs de risque et les mesures hygiénodiététiques appropriées pour diminuer les risques de survenue d’un diabète de type 2.",
      "15 personnes étaient en pré-diabète ou diabète déjà connus, nous avons pu revoir avec 6 d’entre elles les examens de surveillance à réaliser et diffuser la documentation SOPHIA.",
      "Les 5 personnes restantes ont pris des informations pour leur entourage.",
      "39 de ces personnes ont plus de 60 ans, 1 moins de 40 ans.",
      "3 femmes ont présentés de gros soucis d’isolement et de souffrance psychologique du a l’état de santé de leur compagnon et/ou leur passage à la retraite. Le numéro vert du soutien psychologique a été donné à l’une d’entre elle…",
      "1 personne a présenté des Troubles du Comportement Alimentaire avec « addiction au sucre »",
      "Un grand merci au CCAS et la Pharmacie du Centre d’avoir permis aux 2 IDE la réalisation de cette journée : Karim Kherradji Infirmier de Pratique Avancée Emilie Laroche Loubiat Infirmière",
    ],
    mediaImages: ["/suivi-activite/articles/journee-aller-vers/media.webp"],
  },
  [DEUXIEME_ATELIER_DIVERSIFICATION_SLUG]: {
    paragraphs: [
      "2ème atelier de diversification alimentaire animé par Celine MAILLARD, diététicienne, le 20 novembre 2025.",
      "L’atelier a réuni cinq parents et une orthophoniste.",
      "Les questions portaient surtout sur les nouvelles recommandations, la peur de l’étouffement, l’évolution des textures, les réflexes nauséeux, et les produits du commerce (aliments pour bébé et matériel autour du repas).",
      "Avec la diététicienne, les parents ont pu voir :",
      "- la structure des repas, les textures et l’équilibre alimentaire d’un bébé ;",
      "- la place du lait et l’introduction des autres produits laitiers ;",
      "- les aliments à risque d’étouffement ou de toxi-infection ;",
      "- quelques notions sur les perturbateurs endocriniens.",
      "L’alternance théorie/pratique, l’interactivité et les jeux ont été très appréciés.",
      "Prochain atelier dans 2 mois : n’hésitez pas à vous inscrire !",
    ],
    mediaImages: [
      "/suivi-activite/articles/diversification-alimentaire/Affiche-divers-alimentaire.webp",
    ],
  },
  [PREMIERE_JOURNEE_PREVENTION_ALLER_VERS_SLUG]: {
    paragraphs: [
      "**1 ère journée de prévention « aller vers »** sur le marché solidaire de Pessac organisé avec l’ESAAC sur le thème de **la vaccination HPV et la prévention VIF**.",
      "Quel étonnant enthousiasme de la part des usagers ! Touchés par le fait de venir à eux, d’imprimer des flyers en différentes langues et de prendre le temps d’écouter leurs réticences, ils ont déconstruit des idées reçues sur la vaccination.",
      "Une dizaine de parents ont verbalisé le désir de protéger leurs enfants suite à la sensibilisation !",
      "Un grand merci à l’ESAAC de nous avoir reçu et accompagné.",
      "Merci aux sages-femmes et infirmières pour leur investissement.",
      "Distributions d’autotests HPV fournis par le laboratoire Synlab.",
      "Un très bon retour sur le questionnaire de satisfaction et des idées des usagers pour les prochains thèmes à aborder !",
    ],
    mediaImages: [
      "/suivi-activite/articles/premiere-journee-allee-vers/media-1.webp",
      "/suivi-activite/articles/premiere-journee-allee-vers/media-2.webp",
      "/suivi-activite/articles/premiere-journee-allee-vers/media-3.webp",
      "/suivi-activite/articles/premiere-journee-allee-vers/media-4.webp",
      "/suivi-activite/articles/premiere-journee-allee-vers/media-5.webp",
    ],
  },
  [LES_JOURNEES_2025_INTER_CPTS_SLUG]: {
    paragraphs: [
      "Les journées 2025 inter CPTS se sont déroulées à Montpellier avec un intérêt pour la **santé mentale** des soignants et des coordinateurs de CPTS !",
      "L’amendement pour renommer les CPTS, qui a depuis été voté, a beaucoup fait réagir les participants..les CPTS deviendraient les **Communautés France Santé** avec des rôles nouveaux de pilotage de dispositifs homologués France Santé ..",
      "La CPAM souhaite renforcer **l’évaluation individuelle des CPTS** et améliorer **la lisibilité des dispositifs**.",
      "Enfin, et c est le plus important, beaucoup de partages d’expériences inter CPTS au cours des nombreux ateliers animés : **les partenaires patients** sont remis aux centres des prises en charge, les délégations de tâches et certains parcours **articles 51** ont été abordés etc..",
      "Des échanges riches, des contacts et des idées nouvelles pour essayer d’aborder sereinement cette année 2025/2026 malgré le temps politique orageux..",
    ],
    mediaImages: [
      "/suivi-activite/articles/2025-inter-CPTS/media-1.webp",
      "/suivi-activite/articles/2025-inter-CPTS/media-2.webp",
      "/suivi-activite/articles/2025-inter-CPTS/media-3.webp",
      "/suivi-activite/articles/2025-inter-CPTS/media-4.webp",
    ],
  },
} as const;

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateStaticParams() {
  return suiviArticles.map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = suiviArticles.find((item) => item.slug === slug);

  if (!article) {
    return {
      title: "Article introuvable",
    };
  }

  return {
    title: `${article.title} | Suivi des activités`,
  };
}

export default async function SuiviActiviteArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = suiviArticles.find((item) => item.slug === slug);

  if (!article) {
    notFound();
  }

  const details =
    articleDetails[article.slug as keyof typeof articleDetails] ?? null;
  const mediaImages = details?.mediaImages ?? [];
  const hasCarousel = mediaImages.length > 1;
  const hasSingleImage = mediaImages.length === 1;
  const singleImageTitle =
    article.slug === DEUXIEME_ATELIER_DIVERSIFICATION_SLUG
      ? "Affiche de l’atelier"
      : "Photo de la journée";
  const articleRegistrationUrl =
    article.slug === ATELIER_DIVERSIFICATION_5_MARS_2026_SLUG
      ? "https://www.doctolib.fr/dieteticien/merignac/celine-maillard-merignac/booking/availabilities?specialityId=414&telehealth=false&placeId=practice-763409&motiveIds%5B%5D=13383386&pid=practice-763409&source=profile"
      : null;
  const webinarVideoEmbedUrl =
    article.slug === WEBINAIRE_RHINITE_ALLERGIQUE_SLUG
      ? "https://www.youtube-nocookie.com/embed/-O7xYjJR3uE?rel=0&modestbranding=1"
      : null;

  return (
    <main className="min-h-screen bg-background">
      <Header />

      <section className="relative pt-28 lg:pt-32 pb-4 overflow-hidden bg-gradient-to-br from-primary/5 via-secondary/10 to-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <Link
              href="/presentation/suivi-activites#fil-actu"
              className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Retour au fil d&apos;actu</span>
            </Link>

            <h1 className="text-3xl lg:text-5xl font-bold text-foreground mb-6 text-balance">
              {article.title}
            </h1>

            {article.publishedAt && (
              <p className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-muted-foreground mb-6">
                <CalendarDays className="w-4 h-4 text-primary" />
                {article.publishedAt}
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="pb-20 lg:pb-28 pt-6">
        <div className="container mx-auto px-4 lg:px-8">
          {details ? (
            <div className="max-w-5xl mx-auto space-y-8">
              <div className="grid lg:grid-cols-2 gap-6 items-start">
                {/* Image principale */}
                <div className="rounded-3xl border border-border bg-card p-3 lg:p-4 shadow-sm">
                  <div className="relative bg-muted/40 rounded-2xl overflow-hidden" style={{ aspectRatio: article.frame === "portrait" ? "3/4" : article.frame === "square" ? "1/1" : "4/3" }}>
                    <Image
                      src={article.image}
                      alt={article.title}
                      fill
                      priority
                      quality={72}
                      className="object-contain p-2 md:p-3"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                  </div>
                </div>

                {/* Contenu texte */}
                <article className="rounded-3xl border border-border bg-card p-6 lg:p-8 h-full">
                  <div className="space-y-4">
                    <h2 className="text-xl font-bold text-foreground">
                      {article.title}
                    </h2>
                    {details.paragraphs.map((paragraph, index) => (
                      <p
                        key={`${paragraph}-${index}`}
                        className="text-muted-foreground leading-relaxed"
                      >
                        {renderParagraphWithBold(paragraph)}
                      </p>
                    ))}
                    {articleRegistrationUrl && (
                      <div className="space-y-3 pt-2">
                        <p className="text-muted-foreground leading-relaxed">
                          Inscriptions au prochain atelier :
                        </p>
                        <a
                          href={articleRegistrationUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 rounded-full bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-800"
                        >
                          Voir les disponibilités Doctolib
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    )}
                  </div>
                </article>
              </div>

              {webinarVideoEmbedUrl && (
                <article className="rounded-3xl border border-border bg-card p-4 lg:p-6">
                  <h3 className="text-xl font-bold text-foreground mb-4">
                    Vidéo du webinaire
                  </h3>
                  <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black/90">
                    <iframe
                      src={webinarVideoEmbedUrl}
                      title="Webinaire Ville Hôp : asthme et rhinite allergique"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full"
                    />
                  </div>
                </article>
              )}

              {hasCarousel && (
                <article className="rounded-3xl border border-border bg-card p-4 lg:p-6">
                  <h3 className="text-xl font-bold text-foreground mb-4">
                    Galerie photo
                  </h3>
                  <ArticleMediaCarousel
                    images={mediaImages.map((src, index) => ({
                      src,
                      alt: `${article.title} - photo ${index + 1}`,
                    }))}
                  />
                </article>
              )}

              {hasSingleImage && (
                <article className="rounded-3xl border border-border bg-card p-4 lg:p-6">
                  <h3 className="text-xl font-bold text-foreground mb-4">
                    {singleImageTitle}
                  </h3>
                  <div className="relative h-[360px] sm:h-[460px] md:h-[560px] bg-muted/40 rounded-2xl overflow-hidden">
                    <Image
                      src={mediaImages[0]}
                      alt={`${article.title} - photo`}
                      fill
                      quality={70}
                      className="object-contain p-2 md:p-4"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 85vw, 1000px"
                    />
                  </div>
                </article>
              )}
            </div>
          ) : (
            <div className="max-w-4xl mx-auto rounded-3xl border border-border bg-card p-6 lg:p-10">
              <p className="text-muted-foreground leading-relaxed text-lg">
                Contenu de l&apos;article à venir.
              </p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}

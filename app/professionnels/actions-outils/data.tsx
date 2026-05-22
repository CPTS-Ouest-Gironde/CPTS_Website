"use client";

import { AccordionItem } from "./types";
import { ImageCarousel } from "./components/ImageCarousel";
import { RcpTeamCard } from "./components/RcpTeamCard";
import { ZoomableImage } from "./components/ZoomableImage";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { DownloadButton } from "@/components/download-button";

export const accordionItemsAcces: AccordionItem[] = [
  {
    id: "patient-sans-medecin",
    title: "Patient sans médecin traitant",
    content: `Pour de multiples raisons (déménagement, départ à la retraite du médecin, éloignement du soin, etc.), des patients peuvent se retrouver sans médecin traitant sur le territoire de la CPTS.

Professionnels de santé, si vous êtes sollicités par un patient à la recherche d'un médecin traitant, La CPTS Ouest Gironde vous propose un outil sous la forme d'un bref questionnaire afin de faciliter cette recherche en 4 étapes.

De plus, une assistante médicale répond aux appels de patients en recherche de médecin traitant au 07 75 78 70 46

Étape 1 : Remplissage du questionnaire par le patient seul ou avec votre aide, ce qui permettra de mieux identifier et connaitre son état de santé

Étape 2 : Le questionnaire sera transmis par le professionnel de santé à la CPTS via la messagerie de santé sécurisée cpts.ouestgironde.33@na.mssante.fr

Étape 3 : Le questionnaire sera étudié par les médecins adhérents du territoire de la CPTS qui prennent potentiellement de nouveaux patients

Étape 4 : L'assistante médicale de la CPTS contactera le patient et l'informera de la suite donnée à son dossier`,
    files: [
      {
        name: "Questionnaire MÉDECIN - Patient sans médecin traitant",
        url: "/actions-outils/medecin-traitan/Questionnaire-MEDECIN-Patient-sans-MT-A-TELECHARGER.pdf",
      },
      {
        name: "Questionnaire PARAMÉDICAL - Patient sans médecin traitant",
        url: "/actions-outils/medecin-traitan/Patient-sans-MT-Questionnaire-PARAMED-nov-23.pdf",
      },
    ],
  },
  {
    id: "renoncement-soins",
    title: "Renoncement aux soins",
    content: `La CPTS a signé une convention avec la Mission Accompagnement Santé (MAS)

Sont concernées par ce partenariat, toutes les personnes reçues et suivies par les professionnels de santé de la CPTS qui présenteraient des difficultés d'accès au système de santé, aux droits sociaux, un renoncement aux soins

Comment : Saisir la CPAM de situations d'assurés via un formulaire de saisine à envoyer à cpts.ouestgironde.33@na.mssante.fr (formulaire joint)`,
    files: [
      {
        name: "Formulaire MAS",
        url: "/actions-outils/Formulaire-MAS-a-telecharger.pdf",
      },
    ],
  },
  {
    id: "soins-non-programmes-snp",
    title: "Soins non programmés SNP",
    content: "",
    files: [
      {
        name: "Affiche pour les rhinites allergiques",
        url: "https://drive.google.com/file/d/1uuVGvvxw-8opQ1dra0wGogIhPY4LXlK3/view?usp=drive_link",
      },
      {
        name: "Je souhaite participer au SAS",
        url: "https://drive.google.com/file/d/1WVB2B-RZ33Km7G_8crJ4uK-B0WG05fsk/view?usp=sharing",
      },
    ],
    customContent: (
      <div className="space-y-6">
        <ul className="list-disc pl-6 space-y-4 text-muted-foreground leading-relaxed">
          <li>
            En 2025, mise en place d'un protocole local de coopération « Prise
            en charge d'une{" "}
            <span className="font-bold text-primary">
              rhinite ou d'une rhino-conjonctivite allergique saisonnière
            </span>{" "}
            par le pharmacien d'officine » avec une équipe de 5 médecins
            délégants et 12 pharmaciens délégués.
          </li>
          <li>
            En 2024, fonctionnement des protocoles nationaux de coopération
            <span className="font-bold text-primary">
              {" "}
              Odynophagie et Cystite
            </span>{" "}
            avec une équipe constituée de 13 médecins généralistes et 13
            pharmaciens. Les inclusions ont commencé le 20 mars 2024.
          </li>
          <li>
            Il est désormais possible depuis 2021 sur tout le territoire
            d'accéder au Service d'Accès aux Soins (SAS): c'est un dispositif
            qui vise à améliorer l'accès aux soins pour tous les citoyens. Il
            s'agit d'un service d'orientation médicale accessible via le numéro
            15, qui répond aux demandes de soins urgents ou non programmés, 24
            heures sur 24 et 7 jours sur 7.
            <br />
            <br />
            <span className="font-semibold">Objectifs du SAS :</span>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Réduire les inégalités d'accès aux soins</li>
              <li>
                Améliorer la coordination entre la médecine de ville et
                l'hôpital
              </li>
              <li>Désengorger les services d'urgences hospitalières</li>
            </ul>
            <br />
            <span className="font-semibold">Fonctionnement du SAS :</span>
            <ol className="list-decimal pl-6 mt-2 space-y-1">
              <li>
                Un assistant de régulation médicale (ARM) évalue le degré
                d'urgence de l'appel
              </li>
              <li>
                L'appelant est orienté vers :
                <ul className="list-disc pl-6 mt-1 space-y-1">
                  <li>Des secours immédiats (SMUR, pompiers)</li>
                  <li>Un médecin régulateur (urgentiste ou généraliste)</li>
                  <li>
                    Un opérateur de soins non programmés pour trouver un
                    rendez-vous
                  </li>
                </ul>
              </li>
              <li>
                Le SAS propose :
                <ul className="list-disc pl-6 mt-1 space-y-1">
                  <li>Un conseil médical</li>
                  <li>Une téléconsultation</li>
                  <li>Une consultation en cabinet sous 48h</li>
                </ul>
              </li>
            </ol>
          </li>
        </ul>
      </div>
    ),
  },
  {
    id: "annuaire-adherents",
    title: "Annuaire des adhérents",
    content: "",
    files: [],
    customContent: (
      <div className="space-y-6">
        <p className="text-muted-foreground leading-relaxed text-lg">
          Accédez à l'annuaire complet des professionnels de santé adhérents à
          la CPTS Ouest Gironde.
        </p>
        <div className="flex justify-center pt-4">
          <Link
            href="/patients/annuaire"
            className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-primary text-white rounded-xl font-semibold transition-all duration-300 hover:bg-primary/90 hover:shadow-xl hover:scale-[1.02]"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
            Consulter l'annuaire
          </Link>
        </div>
      </div>
    ),
  },
];

export const accordionItemsParcours: AccordionItem[] = [
  {
    id: "parcours-ic",
    title: "Parcours IC (Insuffisance Cardiaque)",
    content: "",
    files: [],
    customContent: (
      <div className="space-y-8">
        {/* Introduction */}
        <div className="bg-gradient-to-br from-primary/5 to-accent/5 p-6 rounded-xl">
          <p className="text-foreground leading-relaxed text-lg">
            En relation avec la campagne nationale de l'assurance maladie
            concernant l'insuffisance cardiaque,
            <span className="font-semibold text-primary">
              {" "}
              la CPTS propose un parcours sur son territoire
            </span>{" "}
            qui met l'accent sur :
          </p>
        </div>

        {/* Liste des points clés */}
        <div className="grid gap-4">
          <div className="bg-primary/5 p-5 rounded-lg border-l-4 border-primary">
            <p className="text-foreground leading-relaxed">
              <span className="font-bold text-primary text-lg">
                La détection précoce
              </span>{" "}
              de l'insuffisance cardiaque
            </p>
          </div>

          <div className="bg-primary/5 p-5 rounded-lg border-l-4 border-primary">
            <p className="text-foreground leading-relaxed">
              <span className="font-bold text-primary text-lg">
                La relation privilégiée médecin généraliste / cardiologue
              </span>{" "}
              pour la prise en charge de cette pathologie sans oublier le rôle
              de l'infirmière en optimisant le délai de consultation par le
              cardiologue au moyen d'une lettre de demande identifiée CPTS OUEST
              GIRONDE
            </p>
          </div>

          <div className="bg-primary/5 p-5 rounded-lg border-l-4 border-primary">
            <p className="text-foreground leading-relaxed">
              <span className="font-bold text-primary text-lg">
                La réduction au recours à l'hospitalisation
              </span>{" "}
              uniquement en cas de nécessité
            </p>
          </div>

          <div className="bg-primary/5 p-5 rounded-lg border-l-4 border-primary">
            <p className="text-foreground leading-relaxed">
              <span className="font-bold text-primary text-lg">
                La surveillance conjointe
              </span>{" "}
              en complémentarité du médecin traitant, du cardiologue, de
              l'infirmière, du kinésithérapeute, du pharmacien et de l'hôpital à
              domicile (Fondation Bagatelle)
            </p>
          </div>

          <div className="bg-primary/5 p-5 rounded-lg border-l-4 border-primary">
            <p className="text-foreground leading-relaxed">
              <span className="font-bold text-primary text-lg">
                La nécessité d'une titration
              </span>{" "}
              avec incrémentation des thérapeutiques en fonction de leur
              tolérance pouvant se réaliser au niveau d'une structure d'hôpital
              de jour dont il faut susciter l'intérêt précoce et la détection
              des complications permettra une meilleure fluidité du parcours
            </p>
          </div>
        </div>

        {/* Amélioration du dépistage */}
        <div className="bg-primary/5 p-5 rounded-lg border-l-4 border-primary">
          <p className="text-foreground leading-relaxed">
            <span className="font-bold text-primary text-lg">
              Pour améliorer la détection.
            </span>{" "}
            <span className="font-bold">
              Une communication sur l'insuffisance cardiaque est disponible sur
              le site internet de la CPTS, dans l'onglet{" "}
              <Link
                href="/prevention/memos-suivi"
                className="font-bold text-primary hover:text-primary/80 underline transition-colors"
              >
                Prévention
              </Link>
              .
            </span>{" "}
            Les personnes consultant l'article peuvent s'auto évaluer via un
            questionnaire en ligne. Un QR code a été envoyé aux pharmaciens
            adhérents afin qu'ils testent les usagers au comptoir et contribuer
            ainsi à l'amélioration du dépistage.
          </p>
        </div>

        {/* Auto-évaluation EPOF */}
        <div className="flex justify-center">
          <button
            onClick={() => {
              const event = new CustomEvent("open-epof-modal");
              window.dispatchEvent(event);
            }}
            className="w-full max-w-md py-5 px-10 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-xl hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
          >
            Testez-vous : auto-évaluation EPOF
          </button>
        </div>

        {/* Sous-titre */}
        <div className="pt-6 border-t-2 border-gray-200">
          <h3 className="text-2xl font-bold text-foreground mb-6">
            Pour faciliter la prise en charge pluriprofessionnelle
          </h3>
          <div className="space-y-4">
            {/* <p className="text-muted-foreground leading-relaxed">
              La sensibilisation des cardiologues à une prise en charge rapide
              des patients adressés par les médecins traitants est facilitée par
              une lettre identifiée CPTS
            </p> */}
            <div className="bg-primary/5 p-5 rounded-lg border-l-4 border-primary">
              <p className="text-foreground leading-relaxed">
                <span className="font-bold text-primary text-lg">
                  Mise à disposition d'un IPA
                </span>{" "}
                depuis janvier 2025. Les consultations ont lieu les vendredis
                après-midi dans les locaux de la clinique Saint Martin de Pessac
                et aussi au domicile sur rdv pour être au plus proche des
                patients.
              </p>
            </div>

            {/* Carrousel IPA */}
            <ImageCarousel
              images={[1, 2, 3, 4, 5, 6].map((num) => ({
                src: `/IPA/${num}.jpg`,
                alt: `IPA slide ${num}`,
              }))}
            />
          </div>
        </div>

        {/* Texte après le carrousel */}
        <div className="space-y-3 pt-6">
          <p className="text-muted-foreground leading-relaxed">
            La sensibilisation des structures d'hôpital de jour
          </p>
          <p className="leading-relaxed">
            <a
              href="/professionnels/supports"
              className="text-primary hover:text-primary/80 font-semibold underline transition-colors"
            >
              Un livret à destination des professionnels de santé
            </a>
          </p>
          <h4 className="font-bold text-foreground text-lg pt-2">
            Pour la surveillance conjointe des patients :
          </h4>
          <p className="leading-relaxed">
            <a
              href="/professionnels/supports"
              className="text-primary hover:text-primary/80 font-semibold underline transition-colors"
            >
              Un carnet a été créé pour les patients
            </a>
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Un carnet à destination des patients remis par un professionnel de
            santé
          </p>
        </div>
      </div>
    ),
  },
  {
    id: "patient-diabetique",
    title: "Patient Diabétique",
    content: "",
    files: [],
    customContent: (
      <div className="space-y-8">
        {/* Contenu texte */}
        <div className="bg-gradient-to-br from-primary/5 to-accent/5 p-6 rounded-xl">
          <p className="text-foreground leading-relaxed text-lg mb-4">
            Conventions avec le Pôle ETP et la Maison de la nutrition Diabète
            coeur
          </p>
          <div className="flex flex-wrap gap-3 mb-4">
            <a
              href="https://www.poletpna.fr/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-lg font-semibold transition-all duration-300 hover:bg-primary/90 hover:shadow-lg"
            >
              Pôle ETP
              <ExternalLink className="w-4 h-4" aria-hidden="true" />
            </a>
            <a
              href="https://www.maisonnutrition33.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-lg font-semibold transition-all duration-300 hover:bg-primary/90 hover:shadow-lg"
            >
              Maison de la nutrition diabète coeur
              <ExternalLink className="w-4 h-4" aria-hidden="true" />
            </a>
          </div>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Mise en place d'ateliers ETP dans les 4 communes de la CPTS et
            Journées d'information grand public.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Les ateliers d'éducation thérapeutique : vous pouvez solliciter
            votre médecin pour vous inscrire.
          </p>
        </div>

        {/* IPA Diabète */}
        <div className="bg-primary/5 p-5 rounded-lg border-l-4 border-primary">
          <p className="text-foreground leading-relaxed">
            Un IPA se met à disposition sur le territoire pour travailler en
            collaboration avec vos professionnels de santé pour améliorer votre
            suivi dans la chronicité.
          </p>
        </div>

        {/* Carrousel */}
        <ImageCarousel
          images={[1, 2, 3, 4, 5, 6].map((num) => ({
            src: `/IPA/${num}.jpg`,
            alt: `Parcours IC slide ${num}`,
          }))}
        />
      </div>
    ),
  },
  {
    id: "sante-mentale",
    title: "Santé mentale",
    content: "",
    files: [],
    customContent: (
      <div className="space-y-8">
        {/* Section 1: Dispositifs du Territoire */}
        <div>
          <h3 className="text-2xl font-bold text-foreground mb-6">
            1/ Les Dispositifs du Territoire :
          </h3>
          <div className="grid gap-3">
            <DownloadButton
              fileName="Questions Psy"
              fileUrl="/actions-outils/sante-mentale/Questions-Psy.pdf"
            />
            <DownloadButton
              fileName="emsi²"
              fileUrl="/actions-outils/sante-mentale/emsi%C2%B2.pdf"
            />
          </div>
        </div>

        {/* Section 2: Re-Med + Réponse Psy */}
        <div className="bg-gradient-to-br from-primary/5 to-accent/5 p-6 rounded-xl">
          <h4 className="text-xl font-bold text-foreground mb-4">
            Dispositif réservé aux médecins généralistes du territoire:
          </h4>
          <div className="space-y-3">
            <div className="bg-white p-5 rounded-lg border-l-4 border-primary">
              <p className="font-bold text-primary text-lg mb-2">Re-Med</p>
              <p className="text-sm text-muted-foreground italic">
                (pour obtenir la ligne directe, rendez-vous sur Plexus Santé -
                projet Parcours Santé mentale 'boite à outils')
              </p>
            </div>
            <div className="bg-white p-5 rounded-lg border-l-4 border-primary">
              <p className="font-bold text-primary text-lg mb-2">Réponse Psy</p>
              <p className="text-sm text-muted-foreground italic">
                (pour obtenir la ligne directe, rendez-vous sur Plexus Santé -
                projet Parcours Santé mentale 'boite à outils')
              </p>
            </div>
          </div>
        </div>

        {/* Section 3: Organisation de soirées pluriprofessionnelles */}
        <div>
          <h3 className="text-2xl font-bold text-foreground mb-6">
            2/ Organisation de soirées pluriprofessionnelles
          </h3>
          <p className="text-muted-foreground leading-relaxed">
            Des soirées pluriprofessionnelles sont organisées régulièrement pour
            favoriser les échanges entre professionnels de santé du territoire.
          </p>
        </div>

        {/* Section 4: Nouveaux dispositifs */}
        <div>
          <h3 className="text-2xl font-bold text-foreground mb-6">
            3/ Des nouveaux dispositifs proposés par la CPTS avec les acteurs du
            territoire
          </h3>

          {/* RCP Psy */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-bold tracking-wide">
                Dispositif N°1
              </span>
            </div>
            <div className="flex items-center gap-3 mb-4 flex-wrap">
              <span
                className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-500 text-white font-semibold text-xs rounded-md animate-badge-glow"
                role="status"
                aria-label="Nouveauté"
              >
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
                Nouveauté
              </span>
              <h4 className="text-xl font-bold text-primary">
                Les RCP Psy de la CPTS
              </h4>
              <Link
                href="/professionnels/actions-outils/les-dispositifs-du-territoire"
                className="sm:ml-auto inline-flex items-center justify-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary/20"
              >
                Accéder aux ressources
                <ExternalLink className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
            <p className="text-muted-foreground leading-relaxed mb-4">
              cf onglet Réunion de Concertation Pluriprofessionnelle
            </p>
          </div>

          {/* Demande d'orientation */}
          <div className="mb-2 flex items-center gap-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-bold tracking-wide">
              Dispositif N°2
            </span>
          </div>
          <div className="bg-primary/5 p-6 rounded-xl space-y-4">
            <div className="flex items-center gap-3 flex-wrap">
              <h4 className="text-xl font-bold text-foreground">
                Demande d'orientation
              </h4>
              <Link
                href="/professionnels/actions-outils/les-dispositifs-du-territoire"
                className="sm:ml-auto inline-flex items-center justify-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary/20"
              >
                Accéder aux ressources
                <ExternalLink className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Vous êtes en difficulté avec une prise en charge en santé mentale
              ? Vous souhaitez un avis spécialisé pour une orientation.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Une infirmière en psychiatrie de la Maison de santé les Pins
              (clinique psychiatrique , 35 rue du blayais 33600 Pessac) propose
              un temps dédié pour vous répondre
            </p>

            <div className="space-y-3">
              <p className="font-semibold text-foreground">Comment ?</p>
              <ul className="space-y-2 text-muted-foreground leading-relaxed">
                <li>
                  • Remplir le formulaire de demande d'orientation disponible
                  sur Plexus Santé
                </li>
                <li>
                  • Envoyer le formulaire par messagerie de santé sécurisée à{" "}
                  <a
                    href="mailto:elise.patenere@pro.mssante.fr"
                    className="text-primary hover:underline font-semibold"
                  >
                    elise.patenere@pro.mssante.fr
                  </a>
                </li>
                <li>
                  • L'IDE Psy (Elise Patenere) répond par un mail au
                  Professionnel de Santé proposant une orientation possible
                  ( et/ou rdv téléphonique si besoin pour expliciter
                  l'orientation).
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "reunions-concertation",
    title: "Des réunions de Concertation Pluriprofessionnelle",
    content: "",
    files: [],
    customContent: (
      <div className="space-y-8">
        {/* Bandeau intro */}
        <div className="bg-gradient-to-br from-primary/5 to-accent/5 p-6 rounded-xl">
          <p className="text-foreground leading-relaxed text-lg">
            La CPTS Ouest Gironde propose deux dispositifs de Concertation
            Pluriprofessionnelle complémentaires, selon la nature de la
            situation rencontrée par votre patient.
          </p>
        </div>

        {/* Empilé : chaque RCP contient une liste numérotée + un bloc "Pourquoi", qui respirent mieux pleine largeur. La distinction visuelle se fait par les deux nuances de vert. */}
        <div className="space-y-8">
          {/* RCP Cas complexes */}
          <div className="bg-primary/5 border-2 border-primary/15 rounded-xl p-6 lg:p-8 space-y-6">
            <h3 className="text-2xl font-bold text-foreground">
              RCP cas complexes CPTS Ouest Gironde
            </h3>
            <ZoomableImage
              src="/actions-outils/RCP-cas-complexe.webp"
              alt="Infographie du parcours RCP cas complexes CPTS Ouest Gironde en 5 étapes : situation initiale en impasse diagnostique, demande adressée à la CPTS, déroulement de la RCP, synthèse et plan d'action concertée, bénéfices pour le patient et le professionnel"
              width={1536}
              height={1024}
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 90vw, 800px"
            />
            <RcpTeamCard
              label="Équipe RCP cas complexes :"
              members="Dr Ismahène Abed, Dr Christophe Adam, Dr Sophie Clément Perrin, Claire Laborde, Hugo Ledoux, Dr Monika Nguon"
              variant="complex"
            />
            <div>
              <h4 className="text-xl font-bold text-foreground mb-4">
                Pourquoi solliciter une RCP cas complexes ?
              </h4>
              <div className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  Si la prise en charge d'un de vos patients vous paraît
                  complexe, difficile, insatisfaisante... car il reste
                  douloureux, essoufflé, symptomatique...
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Professionnels de santé, si vous êtes préoccupés, en manque
                  de réseau ou de solutions pratiques
                </p>
              </div>
            </div>
            <div>
              <h4 className="text-xl font-bold text-foreground mb-4">
                Comment ?
              </h4>
              <ol className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">
                    1
                  </span>
                  <p className="text-muted-foreground leading-relaxed pt-0.5">
                    Remplir le questionnaire requérant (disponible sur Plexus
                    Santé - Projet RCP 'boite à outils')
                  </p>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">
                    2
                  </span>
                  <p className="text-muted-foreground leading-relaxed pt-0.5">
                    Proposer le questionnaire patient à votre patient (même
                    espace Plexus)
                  </p>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">
                    3
                  </span>
                  <p className="text-muted-foreground leading-relaxed pt-0.5">
                    La CPTS organise un temps d'échanges pluriprofessionnel à
                    partir du parcours de soins du patient (avis de médecin
                    généraliste, spécialiste, infirmier, kinésithérapeute,
                    podologue, psychologue, sage-femme…) avec propositions de
                    résolutions de problèmes
                  </p>
                </li>
              </ol>
            </div>
            <p className="text-primary font-semibold">
              40 minutes d'échanges par dossier maximum
            </p>
          </div>

          {/* RCP Psy */}
          <div className="bg-secondary/60 border-2 border-primary/15 rounded-xl p-6 lg:p-8 space-y-6">
            <h3 className="text-2xl font-bold text-foreground">
              RCP Psy CPTS Ouest Gironde
            </h3>
            <RcpTeamCard
              label="Équipe RCP Psy :"
              members="Dr Comby Viallard, Dr Piat, Dr Ledieu, Dr Meliani Nedjari, Tifanie Akiki, Morgane Sini, Elise Patenere"
              variant="psy"
            />
            <div>
              <h4 className="text-xl font-bold text-foreground mb-4">
                Pourquoi solliciter une RCP Psy ?
              </h4>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-2 h-2 bg-primary rounded-full mt-2" />
                  <p className="text-muted-foreground leading-relaxed">
                    Réunir les professionnels qui gravitent autour de votre
                    patient pour une cohérence dans la prise en charge (médecin
                    généraliste, spécialistes, psychologue, professionnels
                    paramédicaux, professionnels socioéducatifs, du milieu
                    scolaire ou du travail etc.)
                  </p>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-2 h-2 bg-primary rounded-full mt-2" />
                  <p className="text-muted-foreground leading-relaxed">
                    Solliciter un appui diagnostic en équipe pluridisciplinaire
                  </p>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-2 h-2 bg-primary rounded-full mt-2" />
                  <p className="text-muted-foreground leading-relaxed">
                    Solliciter un avis thérapeutique et aide à la prescription
                  </p>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-2 h-2 bg-primary rounded-full mt-2" />
                  <p className="text-muted-foreground leading-relaxed">
                    Solliciter une aide à l'orientation: les dispositifs
                    sanitaires ou médico-sociaux spécialisés ressources sociales
                    et droits des patients
                  </p>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-xl font-bold text-foreground mb-4">
                Comment ?
              </h4>
              <ol className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">
                    1
                  </span>
                  <p className="text-muted-foreground leading-relaxed pt-0.5">
                    Remplir le questionnaire requérant
                  </p>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">
                    2
                  </span>
                  <p className="text-muted-foreground leading-relaxed pt-0.5">
                    Proposer le questionnaire à destination de votre patient
                    (disponible sur Plexus Projet Santé mentale 'boite à
                    outils')
                  </p>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">
                    3
                  </span>
                  <p className="text-muted-foreground leading-relaxed pt-0.5">
                    Envoyer les questionnaires aux membres de la RCP ainsi que
                    la liste des intervenants que vous souhaitez inviter lors de
                    cette réunion
                  </p>
                </li>
              </ol>
            </div>
          </div>
        </div>

        {/* Calendrier commun aux deux RCP */}
        <div className="bg-white p-6 rounded-xl border-2 border-primary/20">
          <h4 className="text-xl font-bold text-foreground mb-4">
            Prochaines réunions 2026&nbsp;:
          </h4>
          <p className="text-muted-foreground">
            15 septembre 2026 – Autour d'un buffet
          </p>
        </div>
      </div>
    ),
  },
];

export const accordionItemsPrevention: AccordionItem[] = [
  {
    id: "depistage-organise",
    title: "Des campagnes de dépistage organisé",
    content: "",
    files: [],
    customContent: (
      <div className="space-y-5">
        <p className="text-muted-foreground leading-relaxed">
          Une prévention ciblée – vers les patients en retard dans leur
          dépistage pour leur proposer une solution de proximité.
        </p>
        <ul className="list-disc pl-6 space-y-2 text-muted-foreground leading-relaxed">
          <li>
            Pour le <span className="font-bold">Cancer du Col de l'Utérus</span>
          </li>
          <li>
            Pour le <span className="font-bold">Cancer du sein</span>
          </li>
          <li>
            Pour le <span className="font-bold">Cancer Colo Rectal</span>
          </li>
        </ul>
        <p className="text-muted-foreground leading-relaxed">
          Via des Campagnes d'appels sortants CAPSO : l'Assurance Maladie
          téléphone aux assurés
        </p>
        <p className="text-muted-foreground leading-relaxed">
          Avec des opérations « aller vers » grâce à des professionnels de
          santé qui se déplacent dans les quartiers
        </p>
        <p className="text-muted-foreground leading-relaxed">
          Une action de dépistage a été menée à la RPA Jean Brocas de Mérignac
          le 29 novembre 2024 (avec 3 Gynécologues, 1 sage femme, 1 médecin
          généraliste adhérentes de la CPTS)
        </p>
        <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-4 space-y-2">
          <p className="text-sm font-semibold text-emerald-700">
            Action du 16 avril 2026 — Foyer occupationnel Jenny Lepreux, Mérignac
          </p>
          <p className="text-muted-foreground leading-relaxed text-sm">
            Le 16 avril a eu lieu une action de dépistage du cancer du sein au
            Foyer occupationnel Jenny Lepreux à Mérignac.
          </p>
          <p className="text-muted-foreground leading-relaxed text-sm">
            10 résidentes ont été dépistées avec l&apos;intervention d&apos;une
            sage-femme et d&apos;une gynécologue adhérentes de la CPTS.
          </p>
          <p className="text-muted-foreground leading-relaxed text-sm">
            Les résidentes ont participé activement à la préparation de l&apos;action
            en travaillant sur les documents de sensibilisation.
          </p>
          <p className="text-muted-foreground leading-relaxed text-sm">
            Merci à l&apos;équipe du FO pour son accueil, à Isabelle Calafato pour
            la coordination de la matinée et à TSA&amp;co pour leur accompagnement.
          </p>
        </div>
      </div>
    ),
  },
  {
    id: "violences-intrafamiliales",
    title: "Dépister et prendre en charge les violences intrafamiliales",
    content: "",
    customContent: (
      <ul className="list-disc pl-6 space-y-3 text-muted-foreground leading-relaxed">
        <li>
          Le mardi 28 avril 2026 aura lieu la soirée annuelle sur le thème cette
          année des vulnérabilités et santé mentale en périnatalité avec la
          participation de Pr Sutter du CH de Charles Perrens et en partenariat
          avec le RPNA et la PMI. Un dépliant à destination des professionnels
          de santé sur les démarches et ressources du territoire est disponible
          sur commande
        </li>
        <li>
          Une soirée d'(in)formation a eu lieu le 27 mars 2025 à la{" "}
          <span className="font-semibold text-fuchsia-600">
            Maison de la Femme à Mérignac
          </span>{" "}
          en partenariat avec le Pôle territorial de solidarité Porte du Médoc
          et le réseau Périnatalité Nouvelle Aquitaine sur le thème Violences
          intrafamiliales et Périnatalité.
        </li>
        <li>
          Distribution de sachets annualisée dans nos{" "}
          <span className="font-semibold text-green-600">pharmacies</span>{" "}
          adhérentes avec le violentomètre en lien avec la Journée mondiale de
          prévention contre les violences faites aux femmes.
        </li>
        <li>
          Une journée de formation a eu lieu le 8 novembre 2023 en partenariat{" "}
          <span className="font-semibold text-red-600">VICT'AID</span>, le CAUVA
          et RPNA à la Maison des Associations de Mérignac – Madame ALBIGES, en
          qualité de chef du pôle VIF de VICT'AID et de Madame LARS en qualité
          de juriste référente ont animé cette avec l'aide du RPNA et de
          l'UMJ-CAUVA.
        </li>
      </ul>
    ),
    files: [],
  },
  {
    id: "sante-familiale",
    title: "La santé familiale",
    content: "",
    customContent: (
      <div className="space-y-4">
        <div className="rounded-xl border border-gray-200 bg-primary/5 p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-muted-foreground leading-relaxed">
              Des fiches de suivi disponibles sur le site
            </p>
            <Link
              href="/prevention/memos-suivi"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-primary text-white rounded-lg font-semibold transition-all duration-300 hover:bg-primary/90 hover:shadow-lg whitespace-nowrap"
            >
              Accéder
            </Link>
          </div>
        </div>
        <div className="rounded-xl border border-gray-200 bg-primary/5 p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-muted-foreground leading-relaxed">
              Mise à disposition en version papier d'un livret sur la
              diversification alimentaire (pôle de santé Robinson)
            </p>
            <Link
              href="/professionnels/supports"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-primary text-white rounded-lg font-semibold transition-all duration-300 hover:bg-primary/90 hover:shadow-lg whitespace-nowrap"
            >
              Accéder
            </Link>
          </div>
        </div>
        <div className="rounded-xl border border-gray-200 bg-primary/5 p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-muted-foreground leading-relaxed">
              Une Campagne d'information sur le dispositif Medprev
            </p>
            <a
              href="https://medprev.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-primary text-white rounded-lg font-semibold transition-all duration-300 hover:bg-primary/90 hover:shadow-lg whitespace-nowrap"
            >
              Accéder
              <ExternalLink className="w-4 h-4" aria-hidden="true" />
            </a>
          </div>
        </div>
        <p className="text-muted-foreground leading-relaxed">
          La "doudou liste", mise en place par la CPAM et la CAF vous rappelle
          les rdv importants pendant et après votre grossesse.
        </p>
      </div>
    ),
    files: [],
  },
  {
    id: "sport-sante",
    title: "Le Sport Santé",
    content: "",
    files: [
      {
        name: "Livret MSS",
        url: "/actions-outils/livret-MSS-.pdf",
      },
    ],
    customContent: (
      <div className="space-y-4">
        <p className="text-muted-foreground leading-relaxed">
          L'activité physique régulière est un déterminant majeur de l'état de
          santé des individus et des populations à tous les âges de la vie. De
          nombreuses solutions existent pour se dépenser au quotidien selon son
          âge, sa condition physique, son état de santé et ses besoins.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          L'
          <span className="font-bold text-primary">
            activité physique adaptée
          </span>{" "}
          (APA) est une thérapeutique non médicamenteuse validée. Ses bénéfices
          sont nombreux. Depuis la loi du 2 mars 2022 tous les médecins peuvent
          prescrire une{" "}
          <span className="font-bold text-primary">
            activité physique adaptée
          </span>{" "}
          à leurs patients atteints ou non de pathologie chronique, sédentaires
          ou non.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          La prescription de l'activité physique devient donc un acte médical
          indispensable qui doit être maîtrisé par l'ensemble du corps médical.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          La Maison Sport Santé de Mérignac prend le relais suite à la
          prescription du médecin. 📞 06 58 55 58 78
        </p>
      </div>
    ),
  },
  {
    id: "etude-lombalgie",
    title: "Étude Lombalgie Aiguë - Appel à Projets PREPS",
    content: `Projet NA-PLUMALODOS : Effet d'un programme de prévention des récidives d'épisodes de lombalgie aiguë, assisté par l'application AXOMOVE : étude randomisée de supériorité avec un suivi de 2 ans.

Porteur du projet: CHU Bordeaux Pr De Seze

Les professionnels de santé de la CPTS impliqués: Médecins Généralistes et Kinésithérapeutes`,
    files: [],
  },
  {
    id: "prevention-epuisement",
    title: "Prévention de l'épuisement chez les soignants",
    content: "",
    customContent: (
      <div className="pt-2 space-y-5">
        <p className="text-muted-foreground leading-relaxed">
          L’association MOTS (Médecins Organisation Travail Santé) accompagne
          les soignants confrontés à des situations d’épuisement professionnel,
          de souffrance au travail ou de burn-out. Elle propose une écoute
          confidentielle, un soutien personnalisé et une orientation adaptée.
        </p>
        <a
          href="https://www.association-mots.org/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-primary text-white rounded-lg font-semibold transition-all duration-300 hover:bg-primary/90 hover:shadow-lg"
        >
          Découvrir l’association MOTS
          <ExternalLink className="w-4 h-4" aria-hidden="true" />
        </a>
        <img
          src="/actions-outils/MOTS.png"
          alt="Association MOTS"
          className="w-full max-w-md rounded-xl shadow-lg"
        />
      </div>
    ),
    files: [],
  },
];

export const accordionItemsSSE: AccordionItem[] = [
  {
    id: "sse-presentation",
    title: "SSE — Situations Sanitaires Exceptionnelles",
    content: "",
    files: [],
    customContent: (
      <div className="space-y-5">
        <p className="text-muted-foreground leading-relaxed">
          Une situation sanitaire exceptionnelle (SSE) se caractérise par la
          survenue d'un événement émergent, inhabituel et/ou méconnu qui dépasse
          le cadre de la gestion courante d'une situation sanitaire. Ces
          situations sont susceptibles d'engendrer de façon immédiate et
          imprévisible une augmentation sensible de la demande de soins ou une
          perturbation de l'organisation de l'offre de soins.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          Le facteur déclencheur d'une SSE peut être d'origine purement
          sanitaire (ex. : pandémie du Covid-19), ou alors lié à des événements
          extérieurs au domaine sanitaire tels que la survenue d'un événement
          majeur sur le territoire (aléa naturel, anthropique ou technologique)
          avec des répercussions sanitaires.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          Les CPTS ont joué un rôle actif pendant la crise sanitaire Covid-19 et
          ont démontré que, dans la réponse aux situations sanitaires
          exceptionnelles, elles constituent un lien pertinent entre les
          différents acteurs engagés sur un territoire.
        </p>
        <div className="flex flex-col gap-6 pt-2">
          {/* Miniature vidéo */}
          <div className="space-y-2">
            <h4 className="font-semibold text-primary text-sm uppercase tracking-wide">
              Vidéo — Le sac d&apos;urgence
            </h4>
            <a
              href="https://drive.google.com/file/d/18mvxT6HEz-V5P32GdLCbF-BY3z0D30w3/view?usp=drive_link"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative block w-full max-w-lg rounded-xl overflow-hidden border border-border shadow-sm hover:shadow-md transition-all duration-200"
            >
              <img
                src="/actions-outils/SSE/migna-sac-urgence.webp"
                alt="Sac D'urgence En Pôle santé — Dr Chloé Galmiche"
                className="w-full h-auto"
              />
              <div className="absolute inset-0 bg-black/35 group-hover:bg-black/50 transition-colors flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-white/95 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200">
                  <svg className="w-5 h-5 text-primary ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent px-3 py-2">
                <p className="text-white text-xs font-medium">Voir la vidéo →</p>
              </div>
            </a>
          </div>

          {/* Schéma SSE */}
          <div className="space-y-2">
            <h4 className="font-semibold text-primary text-sm uppercase tracking-wide">
              Organisation du dispositif
            </h4>
            <button
              className="group relative block w-full text-left"
              onClick={() => window.dispatchEvent(new CustomEvent("open-sse-image", { detail: { src: "/actions-outils/SSE/schema-SSE.webp", alt: "Schéma du dispositif SSE — ORSAN et coordination territoriale" } }))}
              aria-label="Agrandir le schéma"
            >
              <img
                src="/actions-outils/SSE/schema-SSE.webp"
                alt="Schéma du dispositif SSE — ORSAN et coordination territoriale"
                className="w-full h-auto rounded-xl border border-border shadow-sm group-hover:opacity-90 transition-opacity"
              />
              <div className="absolute top-2 right-2 w-8 h-8 rounded-lg bg-background/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow">
                <svg className="w-4 h-4 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" /></svg>
              </div>
            </button>
          </div>

          {/* Flyer */}
          <div className="space-y-2">
            <h4 className="font-semibold text-primary text-sm uppercase tracking-wide">
              Formation SimAirlec — Sensibilisation SSE
            </h4>
            <button
              className="group relative block w-full text-left"
              onClick={() => window.dispatchEvent(new CustomEvent("open-sse-image", { detail: { src: "/actions-outils/SSE/Flyer SSE_page-0001.webp", alt: "Flyer SSE — Sensibilisation au SSE et CPTS" } }))}
              aria-label="Agrandir le flyer"
            >
              <img
                src="/actions-outils/SSE/Flyer SSE_page-0001.webp"
                alt="Flyer SSE — Sensibilisation au SSE et CPTS"
                className="w-full h-auto rounded-xl border border-border shadow-sm group-hover:opacity-90 transition-opacity"
              />
              <div className="absolute top-2 right-2 w-8 h-8 rounded-lg bg-background/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow">
                <svg className="w-4 h-4 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" /></svg>
              </div>
            </button>
          </div>
        </div>
      </div>
    ),
  },
];

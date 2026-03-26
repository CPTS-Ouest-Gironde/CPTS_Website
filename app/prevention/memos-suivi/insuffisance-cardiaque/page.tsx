"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { TestezVousModal } from "@/components/testez-vous-modal";
import {
  ArrowLeft,
  Heart,
  Activity,
  Stethoscope,
  Calendar,
  AlertTriangle,
  Bus,
  Check,
  X,
} from "lucide-react";
import { BackgroundGradient0 } from "@/components/background-gradient";

// Interfaces partagées (identiques à memos-suivi/page.tsx)
interface MemoLink {
  label: string;
  url: string;
}

interface TextSegment {
  type: "text" | "bold" | "underline";
  text: string;
}

interface MemoSection {
  title: string;
  points: (string | TextSegment[])[];
  image?: string;
  imageLink?: string;
  imageNoClick?: boolean;
  imageHalfSize?: boolean;
  images?: string[];
}

interface MemoContent {
  intro?: string | TextSegment[];
  points?: string[];
  subtitle?: string;
  images?: string[];
  links?: MemoLink[];
  sections?: MemoSection[];
  pdfEmbed?: string;
}

interface Memo {
  id: string;
  title: string;
  image: string;
  color: string;
  content?: MemoContent;
}

export default function InsuffisanceCardiaquePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <main className="min-h-screen relative">
      <Header />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center z-10">
        <div className="container mx-auto px-4 lg:px-8">
          <Link
            href="/prevention/memos-suivi"
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-8 font-semibold"
          >
            <ArrowLeft className="w-5 h-5" />
            Retour aux Mémos de Suivi
          </Link>

          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
            <div className="flex-1 text-center lg:text-left space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-widest border border-emerald-200">
                <Heart className="w-4 h-4" />
                Mémo de suivi
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-foreground leading-tight">
                L'Insuffisance Cardiaque
              </h1>

              <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Comprendre, prévenir et vivre avec l'insuffisance cardiaque
              </p>
            </div>

            <div className="flex-1 w-full max-w-md lg:max-w-lg">
              <div className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src="/prevention/memo-suivi/IC/coeur-dans-mains.jpg"
                  alt="Cœur dans les mains"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 600px"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Qu'est-ce que l'insuffisance cardiaque */}
      <section className="py-12 lg:py-16 relative z-10 bg-gradient-to-br from-blue-50/30 to-indigo-50/20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-center mb-12">
              <div className="space-y-6">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                  Qu'est-ce que l'insuffisance cardiaque ?
                </h2>
                <div className="space-y-4 text-base leading-relaxed text-muted-foreground">
                  <p>
                    L'insuffisance cardiaque correspond à une{" "}
                    <strong className="text-foreground font-bold">
                      défaillance du cœur droit ou gauche ou des deux
                    </strong>
                    .
                  </p>
                  <p>
                    La défaillance du{" "}
                    <strong className="text-foreground font-bold">
                      cœur gauche
                    </strong>{" "}
                    rend le débit du sang insuffisant pour remplir les besoins
                    du corps tandis que la défaillance du{" "}
                    <strong className="text-foreground font-bold">
                      cœur droit
                    </strong>{" "}
                    signe une faiblesse à pomper le sang du corps vers le cœur.
                  </p>
                  <p>
                    C'est une{" "}
                    <strong className="text-foreground font-bold">
                      maladie chronique qui touche 1,5 millions de patients
                    </strong>
                    . C'est une maladie grave, trop souvent ignorée, elle est la{" "}
                    <strong className="text-foreground font-bold">
                      1ère cause de décès dans le monde
                    </strong>{" "}
                    !
                  </p>
                  <p>
                    Elle est responsable d'
                    <strong className="text-foreground font-bold">
                      1 décès toutes les 7 min en France
                    </strong>{" "}
                    : 55% sont des femmes.
                  </p>
                </div>
              </div>

              <div className="relative w-full aspect-square">
                <Image
                  src="/prevention/memo-suivi/IC/défaillance-coeur.jpg"
                  alt="Défaillance du cœur"
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 500px"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* QUELS SYMPTÔMES (EPOF) */}
      <section
        id="epof"
        className="py-12 lg:py-16 relative z-10 scroll-mt-28 lg:scroll-mt-32 bg-gradient-to-br from-emerald-50/30 to-teal-50/20"
      >
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold uppercase tracking-widest mb-4">
                <Activity className="w-4 h-4" />
                Symptômes
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Quels symptômes ? L'EPOF
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Les 4 signes d'alerte principaux de l'insuffisance cardiaque
              </p>
            </div>

            {/* Explication des symptômes gauche/droite */}
            <div className="grid md:grid-cols-2 gap-6 mb-10">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border-2 border-blue-200">
                <h3 className="text-lg font-bold text-foreground mb-3">
                  Insuffisance cardiaque gauche
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Vous souffrirez de{" "}
                  <strong className="text-foreground">
                    difficultés respiratoires
                  </strong>{" "}
                  de plus en plus ressenties pour des efforts de moins en moins
                  importants. Cette dyspnée est liée à l'accumulation de sang
                  dans les poumons.
                </p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl p-6 border-2 border-purple-200">
                <h3 className="text-lg font-bold text-foreground mb-3">
                  Insuffisance cardiaque droite
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  L'accumulation de liquides dans les chevilles et les jambes se
                  traduira par un{" "}
                  <strong className="text-foreground">gonflement</strong>{" "}
                  pouvant aller des chevilles jusqu'au ventre. Cet œdème vous
                  fera prendre du poids rapidement et ressentir une sensation de
                  lourdeur et de fatigue.
                </p>
              </div>
            </div>

            <p className="text-center text-muted-foreground mb-8">
              Vos symptômes vont évoluer de façon{" "}
              <strong className="text-foreground">
                chronique et progressive
              </strong>
            </p>

            {/* Cards EPOF sur une ligne */}
            <div className="grid grid-cols-4 gap-3 md:gap-4 mb-8">
              <div className="bg-white rounded-2xl p-4 md:p-6 shadow-lg border-2 border-emerald-100 text-center">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-2 md:mb-3 mx-auto">
                  <span className="text-2xl md:text-3xl font-black text-emerald-700">
                    E
                  </span>
                </div>
                <h3 className="font-bold text-foreground text-xs md:text-base mb-1">
                  Essoufflement
                </h3>
                <p className="text-[10px] md:text-sm text-muted-foreground hidden md:block">
                  Dyspnée inhabituelle
                </p>
              </div>

              <div className="bg-white rounded-2xl p-4 md:p-6 shadow-lg border-2 border-emerald-100 text-center">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-2 md:mb-3 mx-auto">
                  <span className="text-2xl md:text-3xl font-black text-emerald-700">
                    P
                  </span>
                </div>
                <h3 className="font-bold text-foreground text-xs md:text-base mb-1">
                  Prise de poids
                </h3>
                <p className="text-[10px] md:text-sm text-muted-foreground hidden md:block">
                  + 2-3 kg rapide
                </p>
              </div>

              <div className="bg-white rounded-2xl p-4 md:p-6 shadow-lg border-2 border-emerald-100 text-center">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-2 md:mb-3 mx-auto">
                  <span className="text-2xl md:text-3xl font-black text-emerald-700">
                    O
                  </span>
                </div>
                <h3 className="font-bold text-foreground text-xs md:text-base mb-1">
                  Œdèmes
                </h3>
                <p className="text-[10px] md:text-sm text-muted-foreground hidden md:block">
                  Gonflements jambes
                </p>
              </div>

              <div className="bg-white rounded-2xl p-4 md:p-6 shadow-lg border-2 border-emerald-100 text-center">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-2 md:mb-3 mx-auto">
                  <span className="text-2xl md:text-3xl font-black text-emerald-700">
                    F
                  </span>
                </div>
                <h3 className="font-bold text-foreground text-xs md:text-base mb-1">
                  Fatigue
                </h3>
                <p className="text-[10px] md:text-sm text-muted-foreground hidden md:block">
                  Excessive inhabituelle
                </p>
              </div>
            </div>

            <div className="flex flex-col items-center gap-8">
              <div className="relative w-full max-w-lg aspect-[4/3]">
                <Image
                  src="/prevention/memo-suivi/IC/epof.jpg"
                  alt="EPOF - Signes d'insuffisance cardiaque"
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, 500px"
                />
              </div>

              <button
                onClick={() => setIsModalOpen(true)}
                className="w-full max-w-md py-5 px-10 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-xl hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
              >
                Testez-vous : auto-évaluation EPOF
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* POURQUOI APPARAIT */}
      <section className="py-12 lg:py-16 relative z-10 bg-gradient-to-br from-slate-50/30 to-gray-50/20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-center">
              Pourquoi apparaît une insuffisance cardiaque ?
            </h2>
            <p className="text-center text-muted-foreground mb-8">
              Elle peut être liée à des causes de maladie ou être due à une
              affection génétique
            </p>

            <div className="space-y-6">
              <div className="bg-gradient-to-br from-blue-50/50 to-indigo-50/30 rounded-2xl p-6 lg:p-8 border border-blue-100">
                <h3 className="text-xl font-bold text-foreground mb-4">
                  Causes principales
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-base leading-relaxed">
                      <strong className="text-foreground font-bold">
                        L'INFARCTUS DU MYOCARDE
                      </strong>{" "}
                      qui abîme de façon irréversible une partie du muscle
                      cardiaque ne lui permet plus de fonctionner correctement.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-base leading-relaxed">
                      <strong className="text-foreground font-bold">
                        L'HYPERTENSION ARTÉRIELLE
                      </strong>
                      , avec une TA mal contrôlée par le traitement, fatigue le
                      cœur qui finit par grossir.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-base leading-relaxed">
                      <strong className="text-foreground font-bold">
                        L'ANGINE DE POITRINE
                      </strong>{" "}
                      correspond à une altération des artères du cœur qui
                      peinent à apporter l'oxygène au muscle du cœur ce qui
                      entraîne son dysfonctionnement.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-base leading-relaxed">
                      <strong className="text-foreground font-bold">
                        L'ATTEINTE DES VALVES CARDIAQUES
                      </strong>{" "}
                      fait dysfonctionner la pompe qu'est le cœur.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-base leading-relaxed">
                      <strong className="text-foreground font-bold">
                        LES TROUBLES DU RYTHME CARDIAQUE
                      </strong>{" "}
                      comme la FIBRILLATION AURICULAIRE
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-base leading-relaxed">
                      <strong className="text-foreground font-bold">
                        LES MYOCARDITES INFECTIEUSES
                      </strong>
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-base leading-relaxed">
                      <strong className="text-foreground font-bold">
                        LES CAUSES TOXIQUES
                      </strong>{" "}
                      comme l'alcool
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-base leading-relaxed">
                      <strong className="text-foreground font-bold">
                        LES MYOCARDITES GÉNÉTIQUES
                      </strong>
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* COMMENT POSER LE DIAGNOSTIC */}
      <section className="py-12 lg:py-16 relative z-10 bg-gradient-to-br from-cyan-50/30 to-sky-50/20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-widest mb-4">
                <Stethoscope className="w-4 h-4" />
                Diagnostic
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Comment poser le diagnostic ?
              </h2>
            </div>

            <p className="text-base leading-relaxed text-muted-foreground mb-8">
              Votre interrogatoire puis l'examen clinique permettent de
              suspecter l'IC. Le médecin demandera des examens complémentaires
              pour confirmer le diagnostic et débuter un traitement pour freiner
              l'évolution de la maladie.
            </p>

            <h3 className="text-xl font-bold text-foreground mb-6">
              Parmi les examens demandés :
            </h3>

            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-lg border-2 border-slate-100">
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-base leading-relaxed">
                      <strong className="text-foreground font-bold">
                        ÉLECTROCARDIOGRAMME
                      </strong>{" "}
                      pour dépister d'éventuels troubles du rythme ou des signes
                      de souffrance cardiaque.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-base leading-relaxed">
                      <strong className="text-foreground font-bold">
                        RADIO DES POUMONS
                      </strong>{" "}
                      pour vérifier si les poumons sont congestionnés et voir la
                      taille du cœur.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-base leading-relaxed">
                      <strong className="text-foreground font-bold">
                        Examens BIOLOGIQUES
                      </strong>{" "}
                      : BNP, PROBNP, ionogramme, clairance rénale, protidémie
                      etc.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-base leading-relaxed">
                      <strong className="text-foreground font-bold">
                        ÉCHOCARDIOGRAPHIE
                      </strong>{" "}
                      qui mesure la fraction d'éjection (FE) du cœur, qui
                      regarde si le cœur est trop gros (hypertrophie
                      ventriculaire).
                    </span>
                  </li>
                </ul>
              </div>

              <div className="bg-amber-50/70 border-2 border-amber-200 rounded-2xl p-6">
                <p className="text-base font-semibold text-amber-900">
                  Ces examens seront répétés lors de votre suivi +++
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* QUEL MODE DE VIE */}
      <section className="py-12 lg:py-16 relative z-10 bg-gradient-to-br from-emerald-50/20 to-teal-50/10">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-center">
              Quel mode de vie faut-il adopter ?
            </h2>

            <p className="text-base leading-relaxed text-muted-foreground mb-8 text-center max-w-3xl mx-auto">
              Votre premier traitement sera de respecter une hygiène de vie.
              Pour éviter la rétention d'eau sur un cœur défaillant, il est
              conseillé de suivre un{" "}
              <strong className="text-foreground">régime pauvre en sel</strong>.
              Il est également fortement recommandé de pratiquer une{" "}
              <strong className="text-foreground">
                activité physique quotidienne
              </strong>{" "}
              : la marche par exemple. Celle-ci peut vous être prescrite par vos
              soignants sous la forme de « sport-santé ».
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-green-200">
                <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-600" />À faire
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <span className="text-green-600 font-bold">•</span>
                    <span className="text-sm leading-relaxed">
                      Activité physique régulière adaptée
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-600 font-bold">•</span>
                    <span className="text-sm leading-relaxed">
                      Alimentation équilibrée, pauvre en sel
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-600 font-bold">•</span>
                    <span className="text-sm leading-relaxed">
                      Se peser 1 fois par semaine
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-600 font-bold">•</span>
                    <span className="text-sm leading-relaxed">
                      Limiter les apports en liquide si conseillé
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-600 font-bold">•</span>
                    <span className="text-sm leading-relaxed">
                      Prendre ses médicaments régulièrement
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-600 font-bold">•</span>
                    <span className="text-sm leading-relaxed">
                      Se faire vacciner (grippe, COVID-19)
                    </span>
                  </li>
                </ul>
              </div>

              <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-2xl p-6 border-2 border-red-200">
                <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                  <X className="w-5 h-5 text-red-600" />À éviter
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <span className="text-red-600 font-bold">•</span>
                    <span className="text-sm leading-relaxed">Tabac</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-red-600 font-bold">•</span>
                    <span className="text-sm leading-relaxed">
                      Alcool en excès
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-red-600 font-bold">•</span>
                    <span className="text-sm leading-relaxed">
                      Sel en excès (plats préparés, charcuterie)
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-red-600 font-bold">•</span>
                    <span className="text-sm leading-relaxed">
                      Sédentarité prolongée
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-red-600 font-bold">•</span>
                    <span className="text-sm leading-relaxed">
                      Prise de poids excessive
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-red-600 font-bold">•</span>
                    <span className="text-sm leading-relaxed">
                      Anti-inflammatoires (AINS) sauf avis médical
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-8 bg-amber-50/70 border-2 border-amber-200 rounded-2xl p-6 lg:p-8">
              <h3 className="text-xl font-bold mb-3 flex items-center gap-3 text-amber-900">
                <AlertTriangle className="w-6 h-6 text-amber-600" />
                Alerter le médecin si :
              </h3>
              <ul className="space-y-2 ml-9 text-amber-900">
                <li className="text-base leading-relaxed">
                  <strong className="font-bold">
                    Prise de poids brutale de + 2 kg en 5 jours
                  </strong>
                </li>
                <li className="text-base leading-relaxed">
                  Aggravation de l'essoufflement
                </li>
                <li className="text-base leading-relaxed">
                  Apparition ou aggravation des œdèmes
                </li>
                <li className="text-base leading-relaxed">
                  Fatigue inhabituelle et croissante
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* QUELS TRAITEMENTS */}
      <section className="py-12 lg:py-16 relative z-10 bg-gradient-to-br from-indigo-50/30 to-purple-50/20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8 text-center">
              Quels traitements ?
            </h2>

            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-lg border-2 border-blue-100">
                <h3 className="text-xl font-bold text-foreground mb-4">
                  Traitements médicamenteux
                </h3>
                <p className="text-base leading-relaxed text-muted-foreground mb-6">
                  Plusieurs classes thérapeutiques ont montré des bénéfices dans
                  l'IC. Il faut savoir que ces médicaments seront introduits
                  progressivement. Il faudra parfois plusieurs mois pour obtenir
                  un traitement optimal.
                </p>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                    <div>
                      <strong className="text-foreground font-bold">IEC</strong>
                      <p className="text-sm text-muted-foreground mt-1">
                        Inhibiteurs de l'enzyme de conversion : réduisent la
                        charge de travail du cœur
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                    <div>
                      <strong className="text-foreground font-bold">
                        B Bloquant
                      </strong>
                      <p className="text-sm text-muted-foreground mt-1">
                        Ralentit le rythme cardiaque et améliore la fonction du
                        cœur
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                    <div>
                      <strong className="text-foreground font-bold">
                        Sacubitril / Valsartan
                      </strong>
                      <p className="text-sm text-muted-foreground mt-1">
                        Association qui améliore le pronostic de l'IC
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                    <div>
                      <strong className="text-foreground font-bold">
                        ARA2
                      </strong>
                      <p className="text-sm text-muted-foreground mt-1">
                        Antagonistes des récepteurs de l'angiotensine II
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                    <div>
                      <strong className="text-foreground font-bold">
                        Dapaglifozine
                      </strong>
                      <p className="text-sm text-muted-foreground mt-1">
                        Inhibiteur du SGLT2 améliorant le pronostic
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                    <div>
                      <strong className="text-foreground font-bold">
                        Furosémide
                      </strong>
                      <p className="text-sm text-muted-foreground mt-1">
                        Diurétique pour éliminer l'excès de liquide et réduire
                        les œdèmes
                      </p>
                    </div>
                  </li>
                </ul>
              </div>

              <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 lg:p-8 border-2 border-amber-200">
                <h3 className="text-xl font-bold text-foreground mb-4">
                  ⚠️ Observance du traitement
                </h3>
                <p className="text-base leading-relaxed text-muted-foreground">
                  Il est{" "}
                  <strong className="text-foreground font-bold">
                    essentiel
                  </strong>{" "}
                  de prendre ses médicaments tous les jours, même en l'absence
                  de symptômes. Ne jamais arrêter ou modifier son traitement
                  sans avis médical. Les médicaments agissent sur le long terme
                  pour protéger le cœur et prévenir les complications.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ET SI LES MEDICAMENTS ECHOUENT */}
      <section className="py-12 lg:py-16 relative z-10 bg-gradient-to-br from-purple-50/20 to-indigo-50/10">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8 text-center">
              Et si les médicaments ne suffisent pas ?
            </h2>

            <div className="space-y-6">
              <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-6 lg:p-8 border-2 border-purple-100">
                <h3 className="text-xl font-bold text-foreground mb-4">
                  Dispositifs médicaux implantables
                </h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <span className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0" />
                    <div>
                      <strong className="text-foreground font-bold">
                        Défibrillateur automatique implantable (DAI)
                      </strong>
                      <p className="text-sm text-muted-foreground mt-1">
                        Surveille le rythme cardiaque et délivre un choc
                        électrique en cas d'arythmie grave
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0" />
                    <div>
                      <strong className="text-foreground font-bold">
                        Resynchronisation cardiaque (CRT)
                      </strong>
                      <p className="text-sm text-muted-foreground mt-1">
                        Stimulateur cardiaque spécial qui coordonne les
                        contractions des ventricules
                      </p>
                    </div>
                  </li>
                </ul>
              </div>

              <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl p-6 lg:p-8 border-2 border-rose-100">
                <h3 className="text-xl font-bold text-foreground mb-4">
                  Solutions chirurgicales
                </h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <span className="w-2 h-2 bg-rose-600 rounded-full mt-2 flex-shrink-0" />
                    <div>
                      <strong className="text-foreground font-bold">
                        Pontage coronarien
                      </strong>
                      <p className="text-sm text-muted-foreground mt-1">
                        Si l'insuffisance est due à une maladie coronarienne
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-2 h-2 bg-rose-600 rounded-full mt-2 flex-shrink-0" />
                    <div>
                      <strong className="text-foreground font-bold">
                        Chirurgie valvulaire
                      </strong>
                      <p className="text-sm text-muted-foreground mt-1">
                        Réparation ou remplacement d'une valve défectueuse
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-2 h-2 bg-rose-600 rounded-full mt-2 flex-shrink-0" />
                    <div>
                      <strong className="text-foreground font-bold">
                        Assistance ventriculaire (LVAD)
                      </strong>
                      <p className="text-sm text-muted-foreground mt-1">
                        Pompe mécanique qui aide le cœur à pomper le sang
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-2 h-2 bg-rose-600 rounded-full mt-2 flex-shrink-0" />
                    <div>
                      <strong className="text-foreground font-bold">
                        Transplantation cardiaque
                      </strong>
                      <p className="text-sm text-muted-foreground mt-1">
                        En dernier recours, dans les cas les plus sévères
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* QUELQUES ACTIONS DE PREVENTION */}
      <section className="py-12 lg:py-16 relative z-10 bg-gradient-to-br from-teal-50/30 to-cyan-50/20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8 text-center">
              Quelques actions de prévention
            </h2>

            <div className="space-y-8">
              {/* SATELIA */}
              <div className="bg-gradient-to-br from-green-50/50 to-emerald-50/30 rounded-2xl p-6 lg:p-8 shadow-lg border-2 border-green-200">
                <div className="flex items-start gap-6">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Heart className="w-8 h-8 text-green-700" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-foreground mb-3">
                      SATELIA : télésurveillance innovante
                    </h3>
                    <p className="text-base leading-relaxed text-muted-foreground mb-4">
                      <strong className="text-foreground font-bold">
                        SATELIA
                      </strong>{" "}
                      est une solution de télésurveillance innovante existant
                      depuis 2017, développée au{" "}
                      <strong className="text-foreground font-bold">
                        CHU de BORDEAUX
                      </strong>
                      . C'est un accompagnement personnalisé proposé aux
                      patients atteints d'insuffisance cardiaque. Ce service
                      vous aide à mieux comprendre votre maladie, à adapter
                      votre mode de vie et à suivre votre traitement.
                    </p>
                    <div className="bg-green-100/50 rounded-xl p-4 mb-4 border border-green-200">
                      <p className="text-sm font-semibold text-green-800">
                        Ce dispositif est pris en charge à 100% par l'Assurance
                        Maladie.
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">
                        <strong className="text-foreground font-semibold">
                          Bénéfices :
                        </strong>
                      </p>
                      <ul className="space-y-1 ml-4">
                        <li className="flex items-start gap-2 text-sm">
                          <span className="text-green-600">•</span>
                          <span>Suivi à distance par des professionnels</span>
                        </li>
                        <li className="flex items-start gap-2 text-sm">
                          <span className="text-green-600">•</span>
                          <span>
                            Surveillance régulière de votre état de santé
                          </span>
                        </li>
                        <li className="flex items-start gap-2 text-sm">
                          <span className="text-green-600">•</span>
                          <span>Aide à la gestion du traitement</span>
                        </li>
                        <li className="flex items-start gap-2 text-sm">
                          <span className="text-green-600">•</span>
                          <span>Support nutritionnel et activité physique</span>
                        </li>
                      </ul>
                    </div>
                    <a
                      href="https://www.satelia.eu/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block mt-6 px-6 py-3 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700 transition-colors"
                    >
                      En savoir plus sur SATELIA
                    </a>
                  </div>
                </div>
              </div>

              {/* Vidéo YouTube */}
              <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-lg border-2 border-blue-100">
                <h3 className="text-2xl font-bold text-foreground mb-6 text-center">
                  Mieux comprendre l'insuffisance cardiaque
                </h3>
                <div className="aspect-video w-full rounded-xl overflow-hidden shadow-lg">
                  <iframe
                    width="100%"
                    height="100%"
                    src="https://www.youtube.com/embed/-wbbDLNWeQw"
                    title="Insuffisance cardiaque - Vidéo éducative"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  />
                </div>
              </div>

              {/* Campagne Ameli */}
              <div className="bg-gradient-to-br from-blue-50/50 to-indigo-50/30 rounded-2xl p-6 lg:p-8 shadow-lg border-2 border-blue-200">
                <h3 className="text-2xl font-bold mb-3 text-foreground">
                  Campagne de sensibilisation de l'Assurance Maladie
                </h3>
                <p className="text-base leading-relaxed mb-4 text-muted-foreground">
                  L'Assurance Maladie mène régulièrement des campagnes de
                  prévention sur l'insuffisance cardiaque. Restez informé des
                  dernières recommandations et des ressources disponibles.
                </p>
                <a
                  href="https://www.ameli.fr/gironde"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors"
                >
                  Visiter le site de l'Assurance Maladie
                </a>
              </div>

              {/* Engagement CPTS */}
              <div className="bg-gradient-to-br from-emerald-50/50 to-teal-50/30 rounded-2xl p-6 lg:p-8 shadow-lg border-2 border-emerald-200">
                <h3 className="text-2xl font-bold mb-3 text-foreground">
                  L'engagement de la CPTS Ouest Gironde
                </h3>
                <p className="text-base leading-relaxed text-muted-foreground">
                  Notre Communauté Professionnelle Territoriale de Santé
                  s'engage à améliorer le parcours de soins des patients
                  atteints d'insuffisance cardiaque à travers une coordination
                  renforcée entre médecins généralistes, cardiologues,
                  infirmiers et autres professionnels de santé du territoire.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* LE RDV A NE PAS MANQUER */}
      <section className="py-12 lg:py-16 relative z-10 bg-gradient-to-br from-red-50/20 to-rose-50/10">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-100 text-red-700 text-xs font-bold uppercase tracking-widest mb-4">
                <Calendar className="w-4 h-4" />
                Événement
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Le rendez-vous à ne pas manquer
              </h2>
            </div>

            <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-3xl p-8 lg:p-10 border-2 border-red-200 shadow-xl">
              <div className="flex items-start gap-6 mb-6">
                <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <Bus className="w-10 h-10 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-foreground mb-2">
                    Le Bus du Cœur
                  </h3>
                  <p className="text-base text-muted-foreground">
                    Un événement de prévention cardiovasculaire itinérant
                  </p>
                </div>
              </div>

              <div className="space-y-4 text-base leading-relaxed text-muted-foreground">
                <p>
                  <strong className="text-foreground font-bold">
                    En 2023, Le Bus du Cœur a fait une halte sur PESSAC.
                  </strong>
                </p>
                <p>
                  Sous l'égide de l'association « AGIR POUR LE CŒUR DES FEMMES
                  », les maladies cardio-vasculaires sont la{" "}
                  <strong className="text-foreground font-bold">
                    1ère cause de mortalité chez les femmes
                  </strong>
                  . Elles tuent{" "}
                  <strong className="text-foreground font-bold">
                    200 femmes par jour en France
                  </strong>
                  , 8 fois plus que le cancer du sein !
                </p>
                <p>
                  <strong className="text-foreground font-bold">
                    Services proposés :
                  </strong>
                </p>
                <ul className="space-y-2 ml-6">
                  <li className="flex items-start gap-3">
                    <span className="text-red-600 font-bold">•</span>
                    <span>Dépistage gratuit de l'hypertension artérielle</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-red-600 font-bold">•</span>
                    <span>Mesure du cholestérol et de la glycémie</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-red-600 font-bold">•</span>
                    <span>Électrocardiogramme</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-red-600 font-bold">•</span>
                    <span>
                      Conseils personnalisés par des professionnels de santé
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-red-600 font-bold">•</span>
                    <span>
                      Information sur les facteurs de risque cardiovasculaire
                    </span>
                  </li>
                </ul>
              </div>

              <div className="mt-8 bg-white rounded-2xl p-6 border-2 border-red-100">
                <p className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-red-600" />
                  Restez informé des prochaines étapes
                </p>
                <p className="text-sm text-muted-foreground">
                  Pour connaître les dates et lieux de passage du Bus du Cœur
                  dans votre région, consultez régulièrement notre site ou
                  contactez votre CPTS.
                </p>
              </div>

              <a
                href="https://www.agirpourlecoeurdesfemmes.com/agir/media/Les-Bus-du-Coeur"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-6 px-8 py-4 rounded-xl bg-red-600 text-white font-bold text-lg hover:bg-red-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                En savoir plus sur le Bus du Cœur
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Rappel bilan cardio-vasculaire */}
      <section className="py-8 lg:py-12 relative z-10 bg-gradient-to-br from-red-50/40 to-rose-50/30">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-red-100 to-rose-100 rounded-2xl p-6 lg:p-8 border-2 border-red-300 shadow-lg text-center">
              <p className="text-xl md:text-2xl font-bold text-red-800">
                Pensez à demander un bilan cardio-vasculaire à votre soignant !
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final + Bouton Retour */}
      <section className="py-12 lg:py-16 relative z-10 bg-gradient-to-br from-emerald-50/30 to-teal-50/20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-emerald-50/50 to-teal-50/30 rounded-3xl p-8 lg:p-12 shadow-2xl text-center mb-8 border-2 border-emerald-200">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
                Vous avez des questions ?
              </h2>
              <p className="text-lg mb-8 text-muted-foreground">
                N'hésitez pas à en parler avec votre médecin traitant ou votre
                cardiologue. Un suivi régulier est essentiel pour vivre mieux
                avec l'insuffisance cardiaque.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/prevention/memos-suivi"
                  className="px-8 py-4 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition-colors"
                >
                  Retour aux Mémos de Suivi
                </Link>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="px-8 py-4 rounded-xl bg-teal-600 text-white font-bold hover:bg-teal-700 transition-colors"
                >
                  Refaire le test EPOF
                </button>
              </div>
            </div>

            {/* Date de mise à jour */}
            <p className="text-center text-sm text-muted-foreground mb-6">
              Mis à jour le 2 avril 2024
            </p>

            <div className="flex justify-center">
              <Link
                href="/prevention/memos-suivi"
                className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors font-semibold"
              >
                <ArrowLeft className="w-5 h-5" />
                Retour aux Mémos de Suivi
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />

      <TestezVousModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </main>
  );
}

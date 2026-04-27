import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Card } from "@/components/ui/card";
import { Users, Heart, Shield, MapPin, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
// import { BackgroundGradient1 } from "@/components/background-gradient";

export default function PresentationPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* <BackgroundGradient1 /> */}

      <div className="relative z-10">
        <Header />

        <main className="pt-20">
          {/* Hero Section */}
          <section className="py-16 lg:py-24 bg-gradient-to-br from-primary/5 to-accent/5">
            <div className="container mx-auto px-4 lg:px-8">
              <div className="max-w-4xl mx-auto text-center">
                <h1 className="text-4xl lg:text-6xl font-bold text-foreground mb-6 text-balance">
                  Présentation de la CPTS Ouest Gironde
                </h1>
                <p className="text-xl lg:text-2xl text-muted-foreground text-balance">
                  Une communauté de professionnels de santé au service de votre
                  territoire
                </p>
              </div>
            </div>
          </section>

          {/* Territory Map Section */}
          <section
            id="territoire"
            className="py-16 lg:py-24 scroll-mt-36 [content-visibility:auto] [contain-intrinsic-size:900px]"
          >
            <div className="container mx-auto px-4 lg:px-8">
              <div className="max-w-5xl mx-auto">
                <h2 className="text-3xl lg:text-5xl font-bold text-foreground mb-8 text-center">
                  Notre Territoire
                </h2>
                <Card className="p-8 lg:p-12 rounded-3xl bg-emerald-50/50 border-2 border-emerald-100">
                  <div className="flex flex-col lg:flex-row items-center gap-8">
                    <div className="flex-1">
                      <Image
                        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/carte-cpts-OG9ejxRXN1zudFfmXq6tfwa7kiSrpd.jpg"
                        alt="Carte du territoire CPTS Ouest Gironde"
                        width={1536}
                        height={1024}
                        className="w-full h-auto rounded-2xl"
                        sizes="(max-width: 768px) calc(100vw - 5rem), (max-width: 1280px) 50vw, 640px"
                        quality={75}
                      />
                    </div>
                    <div className="flex-1 space-y-4">
                      <div className="flex items-start gap-3">
                        <MapPin className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                        <div>
                          <h3 className="text-xl font-bold text-foreground mb-2">
                            4 Communes
                          </h3>
                          <ul className="space-y-2 text-muted-foreground">
                            <li className="text-lg">Martignas-sur-Jalle</li>
                            <li className="text-lg">Mérignac</li>
                            <li className="text-lg">Pessac</li>
                            <li className="text-lg">Saint-Jean-d'Illac</li>
                          </ul>
                        </div>
                      </div>
                      <p className="text-muted-foreground text-lg leading-relaxed">
                        Le siège social est situé à Mérignac. La CPTS couvre un
                        territoire stratégique de l'Ouest Gironde.
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </section>

          {/* Why CPTS Section */}
          <section
            id="pourquoi"
            className="py-16 lg:py-24 bg-accent/10 scroll-mt-36 [content-visibility:auto] [contain-intrinsic-size:1700px]"
          >
            <div className="container mx-auto px-4 lg:px-8">
              <div className="max-w-5xl mx-auto">
                <h2 className="text-3xl lg:text-5xl font-bold text-foreground mb-12 text-center">
                  Pourquoi une CPTS ?
                </h2>
                <div className="grid md:grid-cols-2 gap-8">
                  <Card className="p-8 rounded-3xl bg-green-50/40 border-2 border-green-100">
                    <img
                      src="/presentation/Connecting teams-cuate.svg"
                      alt="Professionnels de santé collaborant"
                      className="w-full h-74 object-contain rounded-2xl mb-6"
                      loading="lazy"
                      decoding="async"
                    />
                    <h3 className="text-2xl font-bold text-foreground mb-4">
                      Mieux Travailler Ensemble
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      La création de la CPTS Ouest Gironde répond à un besoin
                      des professionnels de santé de mieux se connaître, de
                      mieux travailler ensemble et de construire collectivement
                      les réponses adaptées aux défis qui les attendent.
                    </p>
                  </Card>

                  <Card className="p-8 rounded-3xl bg-teal-50/40 border-2 border-teal-100">
                    <img
                      src="/presentation/Public health-cuate.svg"
                      alt="Soins aux patients"
                      className="w-full h-74 object-contain rounded-2xl mb-6"
                      loading="lazy"
                      decoding="async"
                    />
                    <h3 className="text-2xl font-bold text-foreground mb-4">
                      Au Service des Patients
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Les professionnels de santé du territoire, animés par la
                      volonté de mieux se coordonner au service des patients, de
                      fluidifier les prises en charge et de rendre leur
                      territoire attractif, ont créé cette dynamique.
                    </p>
                  </Card>
                </div>

                <Card className="mt-8 p-8 lg:p-12 rounded-3xl bg-emerald-100/30 border-2 border-emerald-200">
                  <div className="flex flex-col lg:flex-row gap-8 items-center">
                    <div className="flex-1">
                      <h3 className="text-2xl lg:text-3xl font-bold text-foreground mb-4">
                        Nos Objectifs
                      </h3>
                      <ul className="space-y-4">
                        <li className="flex items-start gap-3">
                          <Heart className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                          <span className="text-muted-foreground leading-relaxed">
                            Améliorer l'accès aux soins pour toutes les
                            populations, de manière continue sur l'ensemble du
                            territoire
                          </span>
                        </li>
                        <li className="flex items-start gap-3">
                          <Shield className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                          <span className="text-muted-foreground leading-relaxed">
                            Renforcer l'accès aux actions préventives dans une
                            logique pluri-professionnelle
                          </span>
                        </li>
                      </ul>
                    </div>
                    <div className="flex-1">
                      <img
                        src="/presentation/Team goals-cuate.svg"
                        alt="Équipe de santé en réunion"
                        className="w-full h-auto object-contain rounded-2xl"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                  </div>
                </Card>

                <div className="mt-8 p-8 rounded-3xl bg-green-50/30 border-2 border-green-100">
                  <p className="text-muted-foreground leading-relaxed text-lg">
                    La CPTS a signé un contrat avec l'Agence Régionale de Santé
                    et la caisse d'Assurance Maladie de la Gironde le{" "}
                    <strong className="text-foreground">15 juin 2022</strong>{" "}
                    dans le cadre de l'Accord Conventionnel Interprofessionnel
                    (ACI) du 21 août 2019.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Missions Section */}
          <section
            id="missions"
            className="py-16 lg:py-24 scroll-mt-36 [content-visibility:auto] [contain-intrinsic-size:1800px]"
          >
            <div className="container mx-auto px-4 lg:px-8">
              <div className="max-w-5xl mx-auto">
                <h2 className="text-3xl lg:text-5xl font-bold text-foreground mb-8 text-center">
                  Nos Missions
                </h2>
                <p className="text-xl text-muted-foreground text-center mb-12 text-balance">
                  Le projet de santé de la CPTS Ouest-Gironde s'articule autour
                  de 4 missions socles
                </p>

                <div className="space-y-6">
                  {/* Mission 1 */}
                  <Card className="p-8 rounded-3xl bg-emerald-50/60 border-2 border-emerald-200">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-2xl font-bold text-emerald-700">
                          1
                        </span>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-foreground mb-4">
                          Amélioration de l'accès aux soins
                        </h3>
                        <ul className="space-y-3 text-muted-foreground">
                          <li className="flex items-start gap-2">
                            <span className="text-primary mt-1">•</span>
                            <span>Faciliter l'accès à un médecin traitant</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-primary mt-1">•</span>
                            <span>
                              Prise en charge des soins non programmés
                            </span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-primary mt-1">•</span>
                            <span>
                              Développement du recours à la télé-santé
                            </span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </Card>

                  {/* Mission 2 */}
                  <Card className="p-8 rounded-3xl bg-teal-50/60 border-2 border-teal-200">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-teal-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-2xl font-bold text-teal-700">
                          2
                        </span>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-foreground mb-4">
                          Organisation de parcours pluri-professionnels
                        </h3>
                        <ul className="space-y-3 text-muted-foreground">
                          <li className="flex items-start gap-2">
                            <span className="text-primary mt-1">•</span>
                            <span>
                              Amélioration de la prise en charge des patients
                              diabétiques
                            </span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-primary mt-1">•</span>
                            <span>
                              Amélioration de la prise en charge de
                              l'insuffisance cardiaque
                            </span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-primary mt-1">•</span>
                            <span>
                              Gestion coordonnée des patients en situation
                              complexe
                            </span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-primary mt-1">•</span>
                            <span>Promotion du Dossier Médical Partagé</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-primary mt-1">•</span>
                            <span>
                              Création d'un annuaire territorial partagé
                            </span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </Card>

                  {/* Mission 3 */}
                  <Card className="p-8 rounded-3xl bg-green-50/60 border-2 border-green-200">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-green-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-2xl font-bold text-green-700">
                          3
                        </span>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-foreground mb-4">
                          Développement d'actions territoriales de prévention
                        </h3>
                        <ul className="space-y-3 text-muted-foreground">
                          <li className="flex items-start gap-2">
                            <span className="text-primary mt-1">•</span>
                            <span>
                              Sensibiliser la population aux dépistages (cancer
                              du sein, colorectal, col de l'utérus)
                            </span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-primary mt-1">•</span>
                            <span>Améliorer la couverture vaccinale</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-primary mt-1">•</span>
                            <span>
                              Soutenir le déploiement de programmes d'éducation
                              thérapeutique
                            </span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-primary mt-1">•</span>
                            <span>
                              Promouvoir les dispositifs sport et santé
                            </span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-primary mt-1">•</span>
                            <span>
                              Diffusion des dispositifs d'écoute et ressources
                              en planning familial
                            </span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-primary mt-1">•</span>
                            <span>
                              Aider au maintien à domicile des patients âgés ou
                              vulnérables
                            </span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </Card>

                  {/* Mission 4 */}
                  <Card className="p-8 rounded-3xl bg-emerald-50/50 border-2 border-emerald-200">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-2xl font-bold text-emerald-700">
                          4
                        </span>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-foreground mb-4">
                          Réponse à la survenue d'une crise sanitaire grave
                        </h3>
                        <p className="text-muted-foreground leading-relaxed">
                          La CPTS pourra également déployer des missions
                          optionnelles en faveur du développement de la qualité
                          et de la pertinence des soins et/ou de
                          l'accompagnement des professionnels de santé sur le
                          territoire.
                        </p>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          </section>

          {/* Organisation Section */}
          <section
            id="organisation"
            className="py-16 lg:py-24 bg-accent/10 scroll-mt-36 [content-visibility:auto] [contain-intrinsic-size:1400px]"
          >
            <div className="container mx-auto px-4 lg:px-8">
              <div className="max-w-5xl mx-auto">
                <h2 className="text-3xl lg:text-5xl font-bold text-foreground mb-12 text-center">
                  Organisation
                </h2>

                <Card className="p-8 lg:p-12 rounded-3xl bg-teal-50/50 border-2 border-teal-100 mb-8">
                  <div className="flex flex-col lg:flex-row gap-8 items-center">
                    <div className="flex-1">
                      <Image
                        src="/presentation/statut-juridique.png"
                        alt="Bureau de la CPTS"
                        width={1536}
                        height={1024}
                        className="w-full h-auto object-contain rounded-2xl"
                        sizes="(max-width: 768px) calc(100vw - 5rem), (max-width: 1280px) 50vw, 640px"
                        quality={75}
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-foreground mb-4">
                        Statut Juridique
                      </h3>
                      <p className="text-muted-foreground leading-relaxed mb-6">
                        L'ordonnance du 12 mai 2021 confirme le statut juridique
                        des CPTS. L'Association loi 1901 est le statut retenu
                        comme structure juridique. L'association de la CPTS
                        Ouest Gironde a été constituée en 2021.
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Les statuts sont disponibles sur demande à : <br />
                        <a
                          href="mailto:cptsouestgironde@gmail.com"
                          className="text-primary hover:underline font-semibold"
                        >
                          cptsouestgironde@gmail.com
                        </a>
                      </p>
                    </div>
                  </div>
                </Card>

                <Card className="p-8 lg:p-12 rounded-3xl bg-primary/5 border-2 border-primary/20">
                  <h3 className="text-2xl lg:text-3xl font-bold text-foreground mb-6 text-center">
                    Le Conseil d'administration
                  </h3>
                  <p className="text-muted-foreground leading-relaxed mb-8 text-center">
                    L'instance décisionnelle est le conseil d'administration de
                    la CPTS composé de 8 professionnels de santé suivants :
                  </p>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="p-6 rounded-2xl bg-background">
                      <div className="flex items-center gap-3 mb-2">
                        <Users className="w-6 h-6 text-primary" />
                        <h4 className="text-lg font-bold text-foreground">
                          Président
                        </h4>
                      </div>
                      <p className="text-muted-foreground">
                        Dr Aouizerate Erick (Cardiologue)
                      </p>
                    </div>

                    <div className="p-6 rounded-2xl bg-background">
                      <div className="flex items-center gap-3 mb-2">
                        <Users className="w-6 h-6 text-primary" />
                        <h4 className="text-lg font-bold text-foreground">
                          Vice-Présidente
                        </h4>
                      </div>
                      <p className="text-muted-foreground">
                        Dr Meliani Nedjari Kheira (Médecin Généraliste)
                      </p>
                    </div>

                    <div className="p-6 rounded-2xl bg-background">
                      <div className="flex items-center gap-3 mb-2">
                        <Users className="w-6 h-6 text-primary" />
                        <h4 className="text-lg font-bold text-foreground">
                          Trésorière
                        </h4>
                      </div>
                      <p className="text-muted-foreground">
                        Mme Laborde Claire (Kinésithérapeute)
                      </p>
                    </div>

                    <div className="p-6 rounded-2xl bg-background">
                      <div className="flex items-center gap-3 mb-2">
                        <Users className="w-6 h-6 text-primary" />
                        <h4 className="text-lg font-bold text-foreground">
                          Secrétaire
                        </h4>
                      </div>
                      <p className="text-muted-foreground">
                        Dr Menigoz Clément (Médecin Généraliste)
                      </p>
                    </div>
                  </div>

                  <div className="mt-8 p-6 rounded-2xl bg-background">
                    <h4 className="text-lg font-bold text-foreground mb-3">
                      Membres du conseil
                    </h4>
                    <p className="text-muted-foreground leading-relaxed">
                      Mme Christine Cauchetier (Pharmacienne)
                      <br />
                      Mme Marie Amélie Bonnet (Sage-femme)
                      <br />
                      Mme Géraldine Thibaudeau (Infirmière)
                      <br />
                      M. Samuel Etcheberry (Infirmier)
                    </p>
                  </div>

                  <div className="mt-8 p-6 rounded-2xl bg-background">
                    <h4 className="text-lg font-bold text-foreground mb-2">
                      Coordination Administrative
                    </h4>
                    <p className="text-muted-foreground">Corinne Berthier</p>
                  </div>
                </Card>

                <Card className="mt-8 p-8 rounded-3xl bg-card border-2">
                  <h3 className="text-2xl font-bold text-foreground mb-4">
                    Groupes de Travail
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Des groupes de travail pluriprofessionnels s'organisent par
                    mission socle et mission optionnelle afin de suivre et
                    mettre en œuvre le projet de santé. Leur nombre n'est pas
                    limité et pourra intégrer tout professionnel de santé qui
                    souhaite s'impliquer dans la dynamique territoriale.
                  </p>
                </Card>
              </div>
            </div>
          </section>

          <section className="py-14 lg:py-18 bg-background [content-visibility:auto] [contain-intrinsic-size:320px]">
            <div className="container mx-auto px-4 lg:px-8">
              <div className="max-w-5xl mx-auto">
                <div className="rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/5 via-card to-secondary/20 p-8 lg:p-10 text-center">
                  <p className="text-base lg:text-lg text-muted-foreground mb-3">
                    Suivez les actions de la CPTS, au plus près du terrain.
                  </p>
                  <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-6 text-balance">
                    Découvrez le suivi de nos activités et de nos événements
                  </h2>
                  <Link
                    href="/presentation/suivi-activites"
                    className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-6 py-3 font-semibold hover:bg-primary/90 transition-colors"
                  >
                    Accéder au suivi des activités
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </div>
  );
}

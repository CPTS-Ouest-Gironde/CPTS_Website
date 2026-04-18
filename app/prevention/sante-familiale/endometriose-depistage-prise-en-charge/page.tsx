import type { Metadata } from "next";
import Image from "next/image";
import { Calendar } from "lucide-react";
import articleData from "@/app/data/endometriose-depistage-prise-en-charge.json";
import {
  type ArticleData,
  type EndometrioseSection,
  parseEndometrioseArticle,
} from "@/app/data/endometriose-depistage-prise-en-charge.schema";
import { BackToActualitesLink } from "@/components/back-to-actualites-link";
import {
  AnnuaireSectionView,
  DefinitionSectionView,
  DiagnosticSectionView,
  MultidisciplinaireSectionView,
  ProfessionnelsSectionView,
  ResourcesSectionView,
  RisquesSectionView,
  StatsSectionView,
  SymptomesSectionView,
  TableOfContents,
  TraitementsSectionView,
  VideosSectionView,
} from "@/components/endometriose-article";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";

const data: ArticleData = parseEndometrioseArticle(articleData);

const description =
  "Repères sur l’endométriose : symptômes d’alerte, examens, traitements, prise en charge multidisciplinaire et ressources utiles en Gironde.";

export const metadata: Metadata = {
  title: `${data.title} | CPTS Ouest Gironde`,
  description,
  openGraph: {
    title: `${data.title} | CPTS Ouest Gironde`,
    description,
    type: "article",
    locale: "fr_FR",
    images: [
      {
        url: "https://cpts-ouest-gironde.fr/endometriose-depistage-prise-en-charge/endometriose-hero.jpg",
        alt: data.heroAlt,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${data.title} | CPTS Ouest Gironde`,
    description,
    images: [
      "https://cpts-ouest-gironde.fr/endometriose-depistage-prise-en-charge/endometriose-hero.jpg",
    ],
  },
  alternates: {
    canonical: "/prevention/sante-familiale/endometriose-depistage-prise-en-charge",
  },
};

function renderSection(section: EndometrioseSection) {
  switch (section.kind) {
    case "definition":
      return <DefinitionSectionView key={section.id} section={section} articleIntro={data.intro.paragraphs} />;
    case "stats":
      return <StatsSectionView key={section.id} section={section} />;
    case "symptomes":
      return <SymptomesSectionView key={section.id} section={section} />;
    case "diagnostic":
      return <DiagnosticSectionView key={section.id} section={section} />;
    case "professionnels":
      return <ProfessionnelsSectionView key={section.id} section={section} />;
    case "traitements":
      return <TraitementsSectionView key={section.id} section={section} />;
    case "risques":
      return <RisquesSectionView key={section.id} section={section} />;
    case "multidisciplinaire":
      return <MultidisciplinaireSectionView key={section.id} section={section} />;
    case "annuaire":
      return <AnnuaireSectionView key={section.id} section={section} />;
    case "videos":
      return <VideosSectionView key={section.id} section={section} />;
    case "resources":
      return <ResourcesSectionView key={section.id} section={section} />;
  }
}

export default function EndometrioseDepistagePriseEnChargePage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <section className="flex min-h-screen flex-col justify-center overflow-hidden bg-background pt-28 pb-12 lg:pt-32">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-12">
            <div>
              <BackToActualitesLink href="/prevention/sante-familiale" label="Santé familiale" className="mb-6" withMobileTopOffset={false} />
              <div className="mb-4 flex items-center gap-2 text-sm text-[#8f4545]">
                <Calendar className="h-4 w-4 text-[#8f4545]" />
                <span>{data.date}</span>
              </div>
              <h1 className="mb-4 text-4xl font-bold text-[#3d2b2f] text-balance lg:text-5xl">{data.title}</h1>
              <p className="text-lg font-light text-[#3d2b2f]/70 text-pretty lg:text-xl">{data.subtitle}</p>
            </div>
            <div className="overflow-hidden rounded-3xl border border-[#e5cfc9] shadow-xl w-full max-w-md mx-auto lg:max-w-none lg:mx-0">
              <div className="relative aspect-square w-full">
                <Image src={data.heroImage} alt={data.heroAlt} fill priority className="object-cover" sizes="(max-width: 768px) 100vw, (max-width: 1024px) 448px, 560px" />
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="bg-background py-8 md:py-12">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <TableOfContents items={data.sections.map(({ id, title }) => ({ id, title }))} />
          </div>
        </div>
      </section>
      {data.sections.map(renderSection)}
      {data.acknowledgment && (
        <div className="bg-[#faf3ef] py-12 md:py-16">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="mx-auto flex max-w-2xl flex-col items-center gap-5 rounded-3xl border border-[#e5cfc9] bg-[#3d2b2f] px-8 py-8 md:px-12 md:py-10">
              <Image
                src="/endometriose-depistage-prise-en-charge/ifem-logo.png"
                alt="Logo IFEM Endo"
                width={160}
                height={80}
                className="h-auto w-auto max-h-16 md:max-h-20"
              />
              <p className="text-center text-base leading-relaxed text-white/90 md:text-lg">
                {data.acknowledgment}
              </p>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </main>
  );
}

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  GraduationCap,
  Stethoscope,
  BadgeCheck,
  Waves,
  Wrench,
  Network,
  Eye,
  Clock,
  AlertTriangle,
  Users,
  Heart,
  Building2,
  MessageCircle,
  Info,
  Sparkles,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";
import { Blocks, type Block } from "@/components/sante-mentale-article/blocks";
import data from "@/app/data/sante-mentale-professionnels-et-approches.json";

const iconMap: Record<string, LucideIcon> = {
  GraduationCap,
  Stethoscope,
  BadgeCheck,
  Waves,
  Wrench,
  Network,
  Eye,
  Clock,
  AlertTriangle,
  Users,
  Heart,
  Building2,
  MessageCircle,
  Info,
  Sparkles,
};

type Professional = {
  title: string;
  iconName: string;
  image?: string;
  blocks: Block[];
};

type Approach = {
  title: string;
  subtitle?: string;
  iconName: string;
  image?: string;
  blocks: Block[];
};

type Criterion = { iconName: string; text: string };
type Structure = { iconName: string; name: string; description: string };

type Section =
  | {
      kind: "professionnels";
      id: string;
      title: string;
      intro: string[];
      tone: "white" | "neutral";
      professionals: Professional[];
    }
  | {
      kind: "approches";
      id: string;
      title: string;
      intro: string[];
      tone: "white" | "neutral";
      approaches: Approach[];
    }
  | {
      kind: "criteres";
      id: string;
      title: string;
      intro: string[];
      tone: "white" | "neutral";
      image: string;
      imageSide: "left" | "right";
      criteria: Criterion[];
      callout: string;
    }
  | {
      kind: "choix";
      id: string;
      title: string;
      tone: "white" | "neutral";
      image?: string;
      imageSide?: "left" | "right";
      blocks: Block[];
      highlight: string;
    }
  | {
      kind: "structures";
      id: string;
      title: string;
      intro: string[];
      tone: "white" | "neutral";
      structures: Structure[];
      advice: string;
      annuaireLink: { href: string; label: string };
      resource: { title: string; paragraphs: string[]; note: string };
    };

const sections = data.sections as unknown as Section[];

function sectionToneClass(tone: "white" | "neutral") {
  return tone === "neutral" ? "bg-muted/30" : "bg-background";
}

function Icon({ name, className }: { name: string; className?: string }) {
  const I = iconMap[name] ?? Info;
  return <I className={className} aria-hidden="true" />;
}

export default function SanteMentaleProfessionnelsEtApprochesPage() {
  return (
    <main className="min-h-screen">
      <Header />

      {/* HERO */}
      <section className="relative pt-32 lg:pt-32 pb-12 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50/40 to-background" />
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto">
            <Link
              href={data.backLink.href}
              className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{data.backLink.label}</span>
            </Link>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
              <Calendar className="w-4 h-4" />
              <span>{data.date}</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-4 text-balance">
              {data.title}
            </h1>
            <p className="text-lg lg:text-xl text-muted-foreground font-light mb-8 text-pretty">
              {data.subtitle}
            </p>
            <div className="rounded-2xl overflow-hidden shadow-xl">
              <div className="relative w-full aspect-[16/9]">
                <Image
                  src={data.heroImage}
                  alt={data.title}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, 900px"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* INTRO */}
      <section className="py-14 md:py-20 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 items-center">
            <div className="lg:col-span-3 space-y-5">
              {data.intro.paragraphs.map((p, i) => (
                <p
                  key={i}
                  className="text-base md:text-lg text-muted-foreground leading-relaxed"
                >
                  {p}
                </p>
              ))}
            </div>
            <div className="lg:col-span-2">
              <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-md">
                <Image
                  src={data.intro.image}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 400px"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTIONS */}
      {sections.map((section) => (
        <section
          key={section.id}
          id={section.id}
          className={`py-16 md:py-24 ${sectionToneClass(section.tone)}`}
        >
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-6xl mx-auto">
              {/* Section title + intro */}
              <div className="max-w-3xl mx-auto text-center mb-10 md:mb-14">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-balance">
                  {section.title}
                </h2>
                {"intro" in section && section.intro.length > 0 && (
                  <div className="space-y-3">
                    {section.intro.map((p, i) => (
                      <p
                        key={i}
                        className="text-base md:text-lg text-muted-foreground leading-relaxed text-pretty"
                      >
                        {p}
                      </p>
                    ))}
                  </div>
                )}
              </div>

              {/* PROFESSIONNELS */}
              {section.kind === "professionnels" && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {section.professionals.map((pro) => (
                    <article
                      key={pro.title}
                      className="flex flex-col rounded-2xl bg-background border border-border overflow-hidden shadow-sm"
                    >
                      <div className="relative w-full aspect-[4/3] bg-primary/5">
                        {pro.image ? (
                          <Image
                            src={pro.image}
                            alt={pro.title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          />
                        ) : (
                          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                            <Icon
                              name={pro.iconName}
                              className="w-20 h-20 text-primary/40"
                            />
                          </div>
                        )}
                      </div>
                      <div className="p-6 flex flex-col flex-1">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                            <Icon
                              name={pro.iconName}
                              className="w-5 h-5 text-primary"
                            />
                          </div>
                          <h3 className="text-lg md:text-xl font-bold text-foreground leading-tight">
                            {pro.title}
                          </h3>
                        </div>
                        <Blocks
                          blocks={pro.blocks}
                          textClass="text-sm text-muted-foreground leading-relaxed"
                        />
                      </div>
                    </article>
                  ))}
                </div>
              )}

              {/* APPROCHES */}
              {section.kind === "approches" && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                    {section.approaches.map((app) => (
                      <article
                        key={app.title}
                        className="flex flex-col rounded-2xl bg-muted/40 border border-border overflow-hidden shadow-sm"
                      >
                        <div className="relative w-full aspect-[16/9] bg-primary/5">
                          {app.image ? (
                            <Image
                              src={app.image}
                              alt={app.title}
                              fill
                              className="object-cover"
                              sizes="(max-width: 768px) 100vw, 50vw"
                            />
                          ) : (
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-primary/8 to-transparent flex items-center justify-center">
                              <Icon
                                name={app.iconName}
                                className="w-24 h-24 text-primary/50"
                              />
                            </div>
                          )}
                        </div>
                        <div className="p-6 md:p-7 flex flex-col flex-1">
                          <div className="flex items-start gap-3 mb-4">
                            <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                              <Icon
                                name={app.iconName}
                                className="w-5 h-5 text-primary"
                              />
                            </div>
                            <div>
                              <h3 className="text-lg md:text-xl font-bold text-foreground leading-tight">
                                {app.title}
                              </h3>
                              {app.subtitle && (
                                <p className="text-xs md:text-sm text-muted-foreground italic mt-0.5">
                                  {app.subtitle}
                                </p>
                              )}
                            </div>
                          </div>
                          <Blocks
                            blocks={app.blocks}
                            textClass="text-sm md:text-base text-muted-foreground leading-relaxed"
                            bold
                          />
                        </div>
                      </article>
                    ))}
                  </div>
                </>
              )}

              {/* CRITERES (Quand consulter) */}
              {section.kind === "criteres" && (
                <div className="space-y-10 md:space-y-12">
                  <div
                    className={`grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center ${
                      section.imageSide === "right" ? "lg:[&>*:first-child]:order-2" : ""
                    }`}
                  >
                    <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-lg">
                      <Image
                        src={section.image}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="(max-width: 1024px) 100vw, 50vw"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {section.criteria.map((c, i) => (
                        <div
                          key={i}
                          className="flex items-start gap-3 p-5 rounded-xl bg-background border border-border shadow-sm"
                        >
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                            <Icon
                              name={c.iconName}
                              className="w-5 h-5 text-primary"
                            />
                          </div>
                          <p className="text-sm text-foreground leading-relaxed pt-1.5">
                            {c.text}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="max-w-3xl mx-auto">
                    <div className="flex items-start gap-4 p-6 md:p-7 rounded-2xl bg-primary/10 border border-primary/20">
                      <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0">
                        <Sparkles className="w-5 h-5" />
                      </div>
                      <p className="text-base md:text-lg text-foreground leading-relaxed">
                        {section.callout}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* CHOIX (Quelle forme de thérapie) */}
              {section.kind === "choix" &&
                (section.image ? (
                  <div
                    className={`grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center ${
                      section.imageSide === "right"
                        ? "lg:[&>*:first-child]:order-2"
                        : ""
                    }`}
                  >
                    <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-lg">
                      <Image
                        src={section.image}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="(max-width: 1024px) 100vw, 50vw"
                      />
                    </div>
                    <div className="space-y-8">
                      <Blocks
                        blocks={section.blocks}
                        textClass="text-base md:text-lg text-muted-foreground leading-relaxed"
                      />
                      <blockquote className="relative p-7 md:p-9 rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-background border-l-4 border-primary">
                        <Heart className="absolute top-5 right-5 w-8 h-8 text-primary/20" />
                        <p className="text-lg md:text-xl font-medium text-foreground leading-relaxed text-balance">
                          {section.highlight}
                        </p>
                      </blockquote>
                    </div>
                  </div>
                ) : (
                  <div className="max-w-3xl mx-auto space-y-8">
                    <Blocks
                      blocks={section.blocks}
                      textClass="text-base md:text-lg text-muted-foreground leading-relaxed"
                    />
                    <blockquote className="relative p-7 md:p-9 rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-background border-l-4 border-primary">
                      <Heart className="absolute top-5 right-5 w-8 h-8 text-primary/20" />
                      <p className="text-lg md:text-xl font-medium text-foreground leading-relaxed text-balance">
                        {section.highlight}
                      </p>
                    </blockquote>
                  </div>
                ))}

              {/* STRUCTURES (Où s'adresser) */}
              {section.kind === "structures" && (
                <div className="space-y-10 md:space-y-12">
                  <div className="max-w-4xl mx-auto space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {section.structures.map((s) => (
                        <div
                          key={s.name}
                          className="flex flex-col items-center text-center gap-3 p-6 rounded-xl bg-background border border-border shadow-sm"
                        >
                          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                            <Icon
                              name={s.iconName}
                              className="w-7 h-7 text-primary"
                            />
                          </div>
                          <div>
                            <p className="font-bold text-foreground text-base leading-tight">
                              {s.name}
                            </p>
                            <p className="text-xs md:text-sm text-muted-foreground mt-1 leading-snug">
                              {s.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="p-6 rounded-xl bg-background border border-border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                        {section.advice}
                      </p>
                      <Link
                        href={section.annuaireLink.href}
                        className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80 transition-colors group shrink-0"
                      >
                        <span>{section.annuaireLink.label}</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>

                  <div className="max-w-3xl mx-auto p-6 md:p-8 rounded-2xl bg-primary/5 border border-primary/20">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/15 text-primary flex items-center justify-center shrink-0">
                        <Info className="w-5 h-5" />
                      </div>
                      <div className="space-y-3 flex-1">
                        <h3 className="text-base md:text-lg font-bold text-foreground">
                          {section.resource.title}
                        </h3>
                        {section.resource.paragraphs.map((p, i) => (
                          <p
                            key={i}
                            className="text-sm md:text-base text-muted-foreground leading-relaxed"
                          >
                            {p}
                          </p>
                        ))}
                        <p className="text-xs italic text-muted-foreground pt-1">
                          {section.resource.note}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      ))}

      <Footer />
    </main>
  );
}

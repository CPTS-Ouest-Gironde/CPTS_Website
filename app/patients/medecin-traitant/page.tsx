import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";
import {
  FolderOpen,
  Globe,
  Zap,
  Tablet,
  Bell,
  FileText,
  ExternalLink,
} from "lucide-react";
import medecinTraitantData from "@/app/data/medecin-traitant.json";

const iconMap: Record<string, React.ElementType> = {
  FolderOpen,
  Globe,
  Zap,
  Tablet,
};

export default function MedecinTraitantPage() {
  return (
    <main className="min-h-screen">
      <Header />

      {/* Hero Section - Full Height */}
      <section className="relative pt-24 lg:pt-40 pb-12 lg:pb-32 min-h-[50vh] lg:min-h-[100vh] flex items-center overflow-hidden">
        {/* Background gradient - absolute pour rester dans le hero */}
        <div
          className="pointer-events-none absolute inset-0 z-0"
          style={{
            background: `
              radial-gradient(
                ellipse 1400px 1000px at 90% 5%,
                rgba(78, 196, 90, 0.45) 0%,
                rgba(16, 185, 129, 0.30) 30%,
                rgba(16, 185, 129, 0.15) 50%,
                transparent 70%
              ),
              radial-gradient(
                ellipse 1200px 900px at 10% 95%,
                rgba(78, 196, 90, 0.40) 0%,
                rgba(20, 184, 166, 0.25) 30%,
                rgba(20, 184, 166, 0.12) 50%,
                transparent 70%
              ),
              linear-gradient(
                180deg,
                rgba(240, 253, 244, 0.50) 0%,
                rgba(255, 255, 255, 0.70) 25%,
                rgba(255, 255, 255, 0.70) 75%,
                rgba(236, 253, 245, 0.40) 100%
              )
            `,
          }}
        />

        {/* Illustration - positioned absolute on desktop */}
        <div className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 w-[550px] h-[550px] pointer-events-none">
          <Image
            src="/medecin-traitan/medecin-traitan.svg"
            alt=""
            fill
            className="object-contain"
            priority
            sizes="550px"
            aria-hidden="true"
          />
        </div>

        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center">
            {/* Text Content */}
            <div className="flex-1 text-center lg:text-left space-y-6 lg:max-w-2xl">
              <h1 className="text-5xl lg:text-7xl font-bold text-foreground text-balance leading-tight">
                {medecinTraitantData.hero.title}
              </h1>
              <p className="text-lg lg:text-2xl text-muted-foreground text-pretty max-w-xl mx-auto lg:mx-0 font-light">
                {medecinTraitantData.hero.subtitle}
              </p>
            </div>
            {/* Illustration mobile only */}
            <div className="lg:hidden relative w-64 h-64 mt-8">
              <Image
                src="/medecin-traitan/medecin-traitan.svg"
                alt="Illustration médecin traitant"
                fill
                className="object-contain"
                priority
                sizes="256px"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-12 lg:py-20 bg-secondary/20 [content-visibility:auto] [contain-intrinsic-size:700px]">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Benefits Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {medecinTraitantData.benefits.map((benefit) => {
              const Icon = iconMap[benefit.iconName] || FolderOpen;
              return (
                <Card key={benefit.id}>
                  <CardContent className="p-5 space-y-3 text-center">
                    <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                      <Icon className="w-7 h-7 text-primary" />
                    </div>
                    <h3 className="font-bold text-xs text-foreground uppercase tracking-wide">
                      {benefit.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {benefit.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Choix du médecin traitant */}
      <section className="py-10 bg-background [content-visibility:auto] [contain-intrinsic-size:380px]">
        <div className="container mx-auto px-4 max-w-4xl">
          <Card>
            <CardContent className="p-6 md:p-8 space-y-4">
              <h2 className="text-xl md:text-2xl font-bold text-foreground">
                {medecinTraitantData.choix.title}
              </h2>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                {medecinTraitantData.choix.description}
              </p>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                {medecinTraitantData.choix.declaration}
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Déclaration */}
      <section className="py-10 bg-secondary/10 [content-visibility:auto] [contain-intrinsic-size:520px]">
        <div className="container mx-auto px-4 max-w-4xl">
          <Card>
            <CardContent className="p-6 md:p-8 space-y-5">
              <h2 className="text-xl md:text-2xl font-bold text-foreground">
                {medecinTraitantData.declaration.title}
              </h2>

              {medecinTraitantData.declaration.methods.map((method, index) => (
                <p
                  key={index}
                  className="text-sm md:text-base text-muted-foreground leading-relaxed"
                >
                  {method.text}
                  {method.linkText && (
                    <>
                      {" "}
                      <Link
                        href={method.linkUrl || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-destructive hover:underline font-semibold"
                      >
                        {method.linkText}
                      </Link>
                      {method.afterText}
                    </>
                  )}
                </p>
              ))}

              <div className="pt-3 border-t border-border/50">
                <p className="text-sm md:text-base text-muted-foreground mb-2">
                  {medecinTraitantData.declaration.annuaire.text}
                </p>
                <Link
                  href={medecinTraitantData.declaration.annuaire.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-destructive hover:underline font-semibold inline-flex items-center gap-2 text-sm md:text-base"
                >
                  {medecinTraitantData.declaration.annuaire.url}
                  <ExternalLink className="w-4 h-4" />
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Image médecin traitant */}
      <section className="py-12 bg-background [content-visibility:auto] [contain-intrinsic-size:700px]">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="relative max-w-2xl mx-auto rounded-2xl overflow-hidden shadow-lg">
            <Image
              src={medecinTraitantData.image}
              alt="Médecin traitant"
              width={800}
              height={533}
              className="w-full h-auto"
              sizes="(max-width: 768px) 100vw, 672px"
            />
          </div>
        </div>
      </section>

      {/* Vous ne trouvez pas de médecin traitant */}
      <section className="py-10 bg-secondary/10 [content-visibility:auto] [contain-intrinsic-size:1100px]">
        <div className="container mx-auto px-4 max-w-4xl">
          <Card>
            <CardContent className="p-6 md:p-8 space-y-5">
              <h2 className="text-xl md:text-2xl font-bold text-foreground">
                {medecinTraitantData.noPas.title}
              </h2>

              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                {medecinTraitantData.noPas.description}
              </p>

              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                {medecinTraitantData.noPas.questionnaire.intro}{" "}
                <span className="font-bold">
                  {medecinTraitantData.noPas.questionnaire.bold}
                </span>{" "}
                {medecinTraitantData.noPas.questionnaire.description}{" "}
                <span className="font-bold">
                  {medecinTraitantData.noPas.questionnaire.contact}
                </span>
              </p>

              <p className="text-xs md:text-sm text-muted-foreground italic leading-relaxed">
                {medecinTraitantData.noPas.note}
              </p>

              {/* Warning Card */}
              <Card className="border-2 border-primary bg-primary/5">
                <CardContent className="p-4 md:p-5">
                  <div className="flex gap-3 md:gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-destructive/10 flex items-center justify-center">
                        <Bell className="w-5 h-5 md:w-6 md:h-6 text-destructive" />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <h3 className="font-bold text-sm md:text-base text-foreground">
                        {medecinTraitantData.noPas.warning.title}
                      </h3>
                      <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                        {medecinTraitantData.noPas.warning.description}{" "}
                        <span className="font-bold">
                          {medecinTraitantData.noPas.warning.bold}
                        </span>{" "}
                        {medecinTraitantData.noPas.warning.afterBold}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* MAS Section */}
              <div className="space-y-3 pt-2 border-t border-border/50">
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                  {medecinTraitantData.noPas.mas.intro}{" "}
                  <Link
                    href={medecinTraitantData.noPas.mas.linkUrl || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-destructive hover:underline font-semibold"
                  >
                    {medecinTraitantData.noPas.mas.linkText}
                  </Link>{" "}
                  {medecinTraitantData.noPas.mas.outro}
                </p>

                <p className="text-sm md:text-base text-muted-foreground font-semibold">
                  {medecinTraitantData.noPas.mas.contact.text}
                </p>

                <ul className="list-disc list-inside space-y-1.5 text-sm md:text-base text-muted-foreground pl-2 md:pl-4">
                  {medecinTraitantData.noPas.mas.contact.methods.map(
                    (method, index) => {
                      if (method.includes("votre compte ameli")) {
                        const parts = method.split("votre compte ameli");
                        return (
                          <li key={index} className="leading-relaxed">
                            {parts[0]}
                            <Link
                              href={
                                medecinTraitantData.noPas.mas.contact
                                  .ameliUrl || "#"
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-destructive hover:underline font-semibold"
                            >
                              votre compte ameli
                            </Link>
                            {parts[1]}
                          </li>
                        );
                      }
                      return (
                        <li key={index} className="leading-relaxed">
                          {method}
                        </li>
                      );
                    },
                  )}
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Downloads Section */}
      <section className="py-10 bg-background [content-visibility:auto] [contain-intrinsic-size:520px]">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="space-y-5">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-foreground mb-2">
                {medecinTraitantData.downloads.title}
              </h2>
              <p className="text-sm md:text-base text-muted-foreground">
                {medecinTraitantData.downloads.subtitle}
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 md:gap-5">
              {medecinTraitantData.downloads.files.map((file) => (
                <Link
                  key={file.id}
                  href={file.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block group"
                >
                  <Card className="hover:shadow-lg hover:border-destructive/50 transition-all cursor-pointer h-full">
                    <CardContent className="p-5 space-y-3 text-center flex flex-col items-center justify-center min-h-[180px]">
                      <div className="w-14 h-14 group-hover:scale-110 transition-transform">
                        <FileText className="w-full h-full text-destructive" />
                      </div>
                      <div className="space-y-1.5">
                        <p className="text-sm font-semibold text-foreground leading-snug">
                          {file.label}
                        </p>
                        {file.description && (
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            {file.description}
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

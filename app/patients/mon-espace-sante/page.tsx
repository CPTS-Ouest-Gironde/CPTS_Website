import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import Image from "next/image";
import Link from "next/link";
import { UserRound, FileText, MessageSquare, LayoutGrid, ExternalLink, BookOpen, LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import data from "@/app/data/mon-espace-sante.json";

const IconMap: Record<string, LucideIcon> = {
  UserRound,
  FileText,
  MessageSquare,
  LayoutGrid,
};

export default function MonEspaceSantePage() {
  return (
    <main className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="relative pt-32 lg:pt-40 pb-16 lg:pb-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/10 to-background" />

        {/* Decorative shapes */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/3 w-48 h-48 bg-primary/3 rounded-full blur-2xl" />

        {/* Subtle geometric patterns */}
        <div className="absolute top-32 right-20 w-24 h-24 border border-primary/10 rounded-2xl rotate-12" />
        <div className="absolute bottom-32 left-20 w-16 h-16 border border-primary/10 rounded-full" />
        <div className="absolute top-1/2 right-1/4 w-8 h-8 bg-primary/10 rounded-full" />
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-center">
              {/* Texte à gauche */}
              <div className="flex-1 lg:max-w-xl">
                <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-foreground mb-6 text-balance">
                  {data.title}
                </h1>

                <p className="text-lg lg:text-xl text-muted-foreground leading-relaxed mb-4">
                  {data.intro.description}
                </p>

                <p className="text-lg font-medium text-foreground mb-6">
                  {data.intro.summary}
                </p>

                <a
                  href={data.intro.link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors font-medium"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>{data.intro.link.label}</span>
                </a>

                <Link href={data.intro.tutorialButton.href}>
                  <Button
                    size="lg"
                    className="mt-6 w-full sm:w-auto gap-2 h-auto py-3 text-sm sm:text-base whitespace-normal leading-snug text-left sm:text-center"
                  >
                    <BookOpen className="w-4 h-4" />
                    {data.intro.tutorialButton.label}
                  </Button>
                </Link>
              </div>

              {/* Illustration à droite */}
              <div className="flex-1 lg:max-w-lg">
                <div className="rounded-2xl overflow-hidden">
                  <Image
                    src={data.heroImage}
                    alt={data.title}
                    width={500}
                    height={400}
                    className="w-full h-auto"
                    priority
                    sizes="(max-width: 768px) 100vw, 500px"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-16 lg:py-24 bg-secondary/20 overflow-hidden [content-visibility:auto] [contain-intrinsic-size:1200px]">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
              {data.features.map((feature) => {
                const Icon = IconMap[feature.iconName];
                return (
                  <Card key={feature.id} className="overflow-hidden border-primary/20 h-full">
                    <CardContent className="p-6 lg:p-8">
                      {/* Icon */}
                      <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                        {Icon && <Icon className="w-8 h-8 text-primary" />}
                      </div>

                      {/* Title */}
                      <h3 className="text-xl lg:text-2xl font-bold text-foreground mb-2">
                        {feature.title}
                      </h3>

                      {/* Subtitle */}
                      <p className="text-primary font-medium mb-4">
                        {feature.subtitle}
                      </p>

                      {/* Paragraphs */}
                      {feature.paragraphs && feature.paragraphs.map((p, i) => (
                        <p key={i} className="text-muted-foreground mb-3">
                          {p}
                        </p>
                      ))}

                      {/* Items list */}
                      {feature.items && (
                        <ul className="space-y-2 mb-4">
                          {feature.items.map((item, i) => (
                            <li key={i} className="flex items-start gap-2 text-muted-foreground">
                              <span className="text-primary mt-1">•</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      )}

                      {/* Additional text */}
                      {feature.additionalText && (
                        <p className="text-sm text-muted-foreground mt-4 pt-4 border-t">
                          {feature.additionalText}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* DMP Section */}
      <section className="relative py-16 lg:py-24 overflow-hidden [content-visibility:auto] [contain-intrinsic-size:900px]">
        {/* Decorative elements */}
        <div className="absolute top-1/4 left-10 w-32 h-32 border border-primary/10 rounded-full" />
        <div className="absolute bottom-1/4 right-10 w-20 h-20 border border-primary/10 rounded-2xl rotate-45" />
        <div className="absolute top-1/2 left-1/4 w-4 h-4 bg-primary/20 rounded-full" />
        <div className="absolute bottom-1/3 right-1/3 w-6 h-6 bg-primary/10 rounded-full" />

        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">
              {data.dmp.title}
            </h2>

            <p className="text-lg text-muted-foreground mb-4">
              {data.dmp.description}
            </p>

            <p className="text-lg font-semibold text-foreground mb-6">
              {data.dmp.highlight}
            </p>

            <div className="space-y-4 text-muted-foreground mb-6">
              {data.dmp.paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>

            <p className="text-sm text-muted-foreground italic mb-6">
              {data.dmp.note}
            </p>

            <a
              href={data.dmp.link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors font-medium mb-8"
            >
              <ExternalLink className="w-4 h-4" />
              <span>{data.dmp.link.label}</span>
            </a>

            {/* Separator */}
            <div className="w-16 h-1 bg-primary mx-auto mb-8" />

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {data.dmp.buttons.map((button, i) => (
                <a
                  key={i}
                  href={button.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button
                    variant={button.variant as "default" | "outline"}
                    size="lg"
                    className="w-full sm:w-auto"
                  >
                    {button.label}
                  </Button>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

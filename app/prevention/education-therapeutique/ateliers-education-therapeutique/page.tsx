import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Calendar, Phone, Mail } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import data from "@/app/data/ateliers-education-therapeutique.json";

export default function AteliersEducationTherapeutiquePage() {
  return (
    <main className="min-h-screen">
      <Header />

      {/* Hero Section - Full Height */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/10 to-background" />
        <div className="container mx-auto px-4 lg:px-8 relative z-10 py-24 lg:py-32">
          <div className="max-w-6xl mx-auto">
            <Link
              href={data.backLink.href}
              className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-8"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{data.backLink.label}</span>
            </Link>

            <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-center">
              {/* Texte à gauche */}
              <div className="flex-1 lg:max-w-xl">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                  <Calendar className="w-4 h-4" />
                  <span>{data.date}</span>
                </div>

                <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-foreground mb-6 text-balance">
                  {data.title}
                </h1>

                <p className="text-lg lg:text-xl text-muted-foreground leading-relaxed">
                  <span className="font-semibold text-foreground">{data.intro.highlight}</span> {data.intro.description}
                </p>
              </div>

              {/* Image à droite */}
              <div className="flex-1 lg:max-w-lg">
                <div className="rounded-2xl overflow-hidden shadow-2xl">
                  <Image
                    src={data.image}
                    alt={data.title}
                    width={600}
                    height={500}
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

      {/* Content Section */}
      <section className="pt-12 lg:pt-16 pb-20 lg:pb-32">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto space-y-12">

            {/* Structures */}
            {data.structures.map((structure) => (
              <Card key={structure.id} className={`overflow-hidden ${structure.type === "primary" ? "border-primary/30" : "border-amber-200"}`}>
                <CardContent className="p-6 lg:p-8">
                  <h3 className={`text-2xl lg:text-3xl font-bold mb-6 ${structure.type === "primary" ? "text-primary" : "text-amber-600"}`}>
                    {structure.title}
                  </h3>

                  {/* Contact */}
                  <div className="bg-secondary/30 rounded-xl p-4 mb-6">
                    <p className="text-muted-foreground mb-3" dangerouslySetInnerHTML={{ __html: structure.contact.intro }} />
                    <div className="flex flex-wrap gap-4">
                      <a href={`tel:${structure.contact.phone.replace(/\s/g, "")}`} className="inline-flex items-center gap-2 text-primary font-semibold hover:underline">
                        <Phone className="w-4 h-4" />
                        {structure.contact.phone}
                      </a>
                      {structure.contact.email && (
                        <a href={`mailto:${structure.contact.email}`} className="inline-flex items-center gap-2 text-primary font-semibold hover:underline">
                          <Mail className="w-4 h-4" />
                          {structure.contact.email}
                        </a>
                      )}
                    </div>
                    {structure.contact.suffix && (
                      <p className="text-muted-foreground mt-2">{structure.contact.suffix}</p>
                    )}
                  </div>

                  {/* Description (Pôle ETP) */}
                  {structure.description && (
                    <p className="text-muted-foreground mb-6">{structure.description}</p>
                  )}

                  {/* Modalités (Pôle ETP) */}
                  {structure.modalites && (
                    <div className="mb-6">
                      <p className="font-medium text-foreground mb-2">{structure.modalites.intro}</p>
                      <p className="text-muted-foreground">{structure.modalites.text}</p>
                    </div>
                  )}

                  {/* Services (Pôle ETP) */}
                  {structure.services && (
                    <div className="mb-6">
                      <p className="font-medium text-foreground mb-3">{structure.services.intro}</p>
                      <ul className="space-y-2">
                        {structure.services.items.map((item, i) => (
                          <li key={i} className="flex items-start gap-2 text-muted-foreground">
                            <span className="text-primary mt-1">–</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Affiche (Maison de la Nutrition) */}
                  {structure.affiche && (
                    <div className="rounded-xl overflow-hidden mt-6">
                      <Image
                        src={structure.affiche}
                        alt={`Affiche ${structure.title}`}
                        width={600}
                        height={800}
                        className="w-full max-w-md mx-auto h-auto"
                        sizes="(max-width: 768px) 100vw, 400px"
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}

            {/* Plateforme ETHNA */}
            <Card className="overflow-hidden border-primary/30">
              <CardContent className="p-6 lg:p-8">
                <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-4">
                  {data.plateforme.sectionTitle}
                </h2>
                <h3 className="text-xl lg:text-2xl font-bold text-amber-600 mb-4">
                  {data.plateforme.title}
                </h3>
                <p className="text-muted-foreground mb-6">
                  {data.plateforme.description}
                </p>
                <ul className="space-y-2">
                  {data.plateforme.missions.map((mission, i) => (
                    <li key={i} className="flex items-start gap-2 text-muted-foreground">
                      <span className="text-primary mt-1">•</span>
                      <span>{mission}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

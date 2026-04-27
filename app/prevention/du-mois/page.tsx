import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { BackgroundGradient0 } from "@/components/background-gradient";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import preventionData from "@/app/data/prevention-du-mois.json";

export default function PreventionDuMoisPage() {
  return (
    <main className="min-h-screen relative">
      <BackgroundGradient0 />
      <Header />

      {/* Hero Section */}
      <section className="relative pt-32 pb-8 lg:pt-40 lg:pb-10 z-10">
        <div className="absolute top-0 right-0 w-[40%] h-full -z-10 opacity-10">
          <div className="absolute top-[20%] right-[10%] w-72 h-72 bg-primary/20 rounded-full blur-[100px] animate-pulse" />
        </div>

        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
            {/* Left: Text content */}
            <div className="flex-1 text-center lg:text-left space-y-6 z-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest border border-primary/20">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                Prévention santé
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-foreground leading-tight">
                {preventionData.hero.title}
              </h1>

              <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0 leading-relaxed">
                {preventionData.hero.subtitle}
              </p>
            </div>

            {/* Right: SVG Illustration */}
            <div className="flex-1 w-full max-w-md lg:max-w-lg relative">
              <div className="relative w-full aspect-square">
                <Image
                  src="/prevention/prevention.svg"
                  alt="Prévention santé illustration"
                  fill
                  className="object-contain drop-shadow-2xl"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 600px"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Articles of the Month */}
      <section className="py-10 lg:py-16 relative z-10 [content-visibility:auto] [contain-intrinsic-size:1200px]">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              À la une ce mois-ci
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Découvrez nos campagnes et informations importantes du moment
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto">
            {preventionData.articles.map((article) => (
              <Link key={article.id} href={article.link}>
                <Card className="group h-full hover:shadow-2xl transition-all duration-300 overflow-hidden py-0 gap-0 border-0">
                  <CardContent className="p-0 px-0">
                    <div className="aspect-[16/10] relative overflow-hidden">
                      <Image
                        src={article.image}
                        alt={article.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) calc(100vw - 2rem), (max-width: 1200px) 50vw, 600px"
                        quality={75}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                      <div className="absolute top-4 left-4">
                        <span className="inline-block px-3 py-1 rounded-full bg-primary/90 text-white text-xs font-semibold">
                          {article.category}
                        </span>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                        <h3 className="text-xl md:text-2xl font-bold leading-tight mb-2">
                          {article.title}
                        </h3>
                        <div className="flex items-center gap-2 text-sm font-semibold">
                          Lire la suite
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 lg:py-24 relative z-10 [content-visibility:auto] [contain-intrinsic-size:1400px]">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Catégories de prévention
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Explorez nos différentes ressources de prévention et de suivi
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
            {preventionData.categories.map((category) => (
              <Link key={category.id} href={category.link}>
                <Card className="group h-full hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/50 overflow-hidden py-0 gap-0">
                  <CardContent className="p-0">
                    <div className="aspect-[4/3] relative overflow-hidden">
                      <Image
                        src={category.image}
                        alt={category.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) calc(100vw - 2rem), (max-width: 1200px) 33vw, 400px"
                        quality={75}
                      />
                    </div>
                    <div className="p-6 space-y-3">
                      <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                        {category.title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {category.description}
                      </p>
                      <div className="flex items-center gap-2 text-primary font-semibold text-sm pt-2">
                        En savoir plus
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

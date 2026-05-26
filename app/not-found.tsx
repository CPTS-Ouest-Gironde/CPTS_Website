import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import Image from "next/image";
import Link from "next/link";
import { Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChatbotErrorContext } from "@/app/_features/chatbot/ChatbotErrorContext";

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col">
      <ChatbotErrorContext />
      <Header />

      <section className="flex-1 flex items-center justify-center py-32 lg:py-40 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
            {/* Illustration */}
            <div className="flex-1 w-full max-w-md">
              <div className="relative w-full aspect-square">
                <Image
                  src="/404/404 Error with a cute animal-bro.svg"
                  alt="Page non trouvée - 404"
                  fill
                  className="object-contain"
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 text-center lg:text-left space-y-6">
              <div className="space-y-3">
                <h1 className="text-7xl lg:text-8xl font-black text-primary">404</h1>
                <h2 className="text-3xl lg:text-4xl font-bold text-foreground">
                  Page non trouvée
                </h2>
                <p className="text-lg text-muted-foreground max-w-md mx-auto lg:mx-0">
                  Oups ! La page que vous recherchez n'existe pas ou a été déplacée.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button asChild size="lg" className="gap-2">
                  <Link href="/">
                    <Home className="w-4 h-4" />
                    Retour à l'accueil
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="gap-2">
                  <Link href="/prevention/sante-familiale">
                    <ArrowLeft className="w-4 h-4" />
                    Articles santé
                  </Link>
                </Button>
              </div>

              {/* Suggestions */}
              <div className="pt-8 border-t border-border">
                <p className="text-sm font-semibold text-foreground mb-3">
                  Pages populaires :
                </p>
                <ul className="space-y-2 text-sm">
                  <li>
                    <Link href="/patients/coordonnees" className="text-primary hover:underline">
                      → Coordonnées et horaires
                    </Link>
                  </li>
                  <li>
                    <Link href="/prevention/education-therapeutique" className="text-primary hover:underline">
                      → Éducation thérapeutique
                    </Link>
                  </li>
                  <li>
                    <Link href="/professionnels/actions-outils" className="text-primary hover:underline">
                      → Actions et outils professionnels
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

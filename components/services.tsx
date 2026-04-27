import { Card, CardContent } from "@/components/ui/card"
import { Heart, Users, Calendar, Stethoscope, Phone, MapPin } from "lucide-react"

const services = [
  {
    icon: Calendar,
    title: "Permanence de soins",
    description: "Organisation de consultations non programmées pour répondre à vos besoins urgents.",
  },
  {
    icon: Users,
    title: "Parcours coordonné",
    description: "Suivi personnalisé avec coordination entre tous vos professionnels de santé.",
  },
  {
    icon: Heart,
    title: "Prévention santé",
    description: "Ateliers et programmes de prévention adaptés à tous les âges.",
  },
  {
    icon: Stethoscope,
    title: "Maladies chroniques",
    description: "Accompagnement spécifique pour les patients atteints de pathologies chroniques.",
  },
  {
    icon: Phone,
    title: "Nous contacter",
    description: "Une question ? Besoin d'information ? Notre équipe est à votre écoute pour vous orienter.",
  },
  {
    icon: MapPin,
    title: "Santé territoriale",
    description: "Actions de santé publique adaptées aux besoins de votre territoire.",
  },
]

export function Services() {
  return (
    <section id="services" className="py-12 lg:py-16 bg-gradient-to-b from-primary/5 to-background">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center space-y-3 lg:space-y-4 mb-10 lg:mb-12">
          <h2 className="text-2xl lg:text-4xl font-bold text-foreground text-balance">Nos services</h2>
          <p className="text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Une offre complète pour répondre à tous vos besoins de santé
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-6 max-w-5xl mx-auto">
          {services.map((service, index) => (
            <Card
              key={index}
              className="border-border rounded-2xl overflow-hidden bg-card"
            >
              <CardContent className="p-4 lg:p-6">
                <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-3 lg:mb-4">
                  <service.icon className="w-5 h-5 lg:w-6 lg:h-6 text-primary" />
                </div>
                <h3 className="text-sm lg:text-lg font-bold text-card-foreground mb-1 lg:mb-2">{service.title}</h3>
                <p className="text-xs lg:text-sm text-muted-foreground leading-relaxed">{service.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

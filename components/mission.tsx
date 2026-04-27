export function Mission() {
  return (
    <section id="mission" className="py-12 lg:py-16 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-3xl mx-auto text-center space-y-3 lg:space-y-4 mb-10 lg:mb-12">
          <h2 className="text-2xl lg:text-4xl font-bold text-foreground text-balance">
            Notre mission : coordonner les soins sur votre territoire
          </h2>
          <p className="text-base lg:text-lg text-muted-foreground leading-relaxed text-pretty">
            La CPTS rassemble médecins, infirmiers, pharmaciens et autres professionnels pour offrir une prise en charge globale et coordonnée.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-4 lg:gap-6 max-w-5xl mx-auto">
          <div className="bg-card rounded-2xl p-5 lg:p-6 border border-border">
            <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-3 lg:mb-4">
              <span className="text-xl lg:text-2xl font-bold text-primary">1</span>
            </div>
            <h3 className="text-base lg:text-lg font-bold text-card-foreground mb-2">Accès aux soins facilité</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Organisation de permanences et coordination des professionnels pour réduire les délais d'attente.
            </p>
          </div>

          <div className="bg-card rounded-2xl p-5 lg:p-6 border border-border">
            <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-3 lg:mb-4">
              <span className="text-xl lg:text-2xl font-bold text-emerald-600">2</span>
            </div>
            <h3 className="text-base lg:text-lg font-bold text-card-foreground mb-2">Coordination renforcée</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Vos professionnels de santé travaillent ensemble pour un suivi cohérent et personnalisé.
            </p>
          </div>

          <div className="bg-card rounded-2xl p-5 lg:p-6 border border-border">
            <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl bg-teal-500/10 flex items-center justify-center mb-3 lg:mb-4">
              <span className="text-xl lg:text-2xl font-bold text-teal-600">3</span>
            </div>
            <h3 className="text-base lg:text-lg font-bold text-card-foreground mb-2">Prévention et éducation</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Actions de prévention et d'éducation à la santé pour votre bien-être au quotidien.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

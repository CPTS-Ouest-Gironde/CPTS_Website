"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogTitle, VisuallyHidden } from "@/components/ui/dialog"
import { Check, Plus, Minus, ShoppingCart, ZoomIn, X, Loader2, AlertTriangle } from "lucide-react"
import Image from "next/image"
import data from "@/app/data/supports.json"
import {
  containsForbiddenLink,
  isValidPersonName,
  isValidPostalAddress,
} from "@/lib/message-content"
import { getPublicFormErrorDetails, type PublicFormErrorVariant } from "@/lib/public-form-errors"

interface Support {
  id: string
  name: string
  image: string
  pdf?: string
  description: string
}

interface SelectedSupport extends Support {
  quantity: number
}

const supports: Support[] = data.supports


export default function SupportsPage() {
  const [selectedSupports, setSelectedSupports] = useState<SelectedSupport[]>([])
  const [previewSupport, setPreviewSupport] = useState<Support | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")
  const [errorVariant, setErrorVariant] = useState<PublicFormErrorVariant>("error")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  })

  const toggleSupport = (support: Support) => {
    const exists = selectedSupports.find((s) => s.id === support.id)
    if (exists) {
      setSelectedSupports(selectedSupports.filter((s) => s.id !== support.id))
    } else {
      setSelectedSupports([...selectedSupports, { ...support, quantity: 1 }])
    }
  }

  const updateQuantity = (id: string, delta: number) => {
    setSelectedSupports(
      selectedSupports
        .map((s) => (s.id === id ? { ...s, quantity: s.quantity + delta } : s))
        .filter((s) => s.quantity > 0)
    )
  }

  const isSelected = (id: string) => selectedSupports.some((s) => s.id === id)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus("idle")
    setErrorMessage("")
    setErrorVariant("error")

    if (containsForbiddenLink(formData.name)) {
      setStatus("error")
      setErrorVariant("error")
      setErrorMessage("Les liens ne sont pas autorisés dans le nom.")
      return
    }

    if (!isValidPersonName(formData.name)) {
      setStatus("error")
      setErrorVariant("error")
      setErrorMessage("Le nom et le prénom contiennent des caractères invalides.")
      return
    }

    if (containsForbiddenLink(formData.address)) {
      setStatus("error")
      setErrorVariant("error")
      setErrorMessage("Les liens ne sont pas autorisés dans l'adresse postale.")
      return
    }

    if (!isValidPostalAddress(formData.address)) {
      setStatus("error")
      setErrorVariant("error")
      setErrorMessage("L'adresse postale contient des caractères invalides.")
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/supports/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          supports: selectedSupports.map((s) => ({
            id: s.id,
            name: s.name,
            quantity: s.quantity,
            description: s.description,
          })),
        }),
      })

      if (response.ok) {
        setStatus("success")
        setErrorMessage("")
        // Vider le panier et le formulaire
        setSelectedSupports([])
        setFormData({ name: "", email: "", phone: "", address: "" })
      } else {
        const apiError = await getPublicFormErrorDetails(response, "supports-order")
        setStatus("error")
        setErrorVariant(apiError.variant)
        setErrorMessage(apiError.message)
      }
    } catch {
      setStatus("error")
      setErrorVariant("error")
      setErrorMessage("Une erreur est survenue. Veuillez réessayer.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-12 lg:py-16 bg-gradient-to-br from-primary/5 to-accent/5">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-6xl mx-auto text-center">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4 text-balance">
                Commander des supports visuels
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground text-balance">
                Sélectionnez les supports que vous souhaitez commander en cliquant sur les cartes
              </p>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-12 lg:py-16">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <div className="grid lg:grid-cols-[1fr_400px] gap-8 lg:items-start">
                {/* Supports Grid */}
                <div>
                  <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-6">
                    Supports disponibles
                  </h2>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {supports.map((support) => (
                      <Card
                        key={support.id}
                        className={`rounded-2xl overflow-hidden transition-all duration-300 ${
                          isSelected(support.id)
                            ? "border-2 border-primary shadow-lg ring-2 ring-primary/20"
                            : "border border-border hover:border-primary/30 hover:shadow-md"
                        }`}
                      >
                        <div className="relative h-[320px] bg-gradient-to-br from-muted/50 to-muted group">
                          {support.id === "sachet-violentometre" ? (
                            <div className="w-full h-full flex flex-col items-center justify-center px-6 py-8 text-center">
                              <div className="w-20 h-20 rounded-2xl bg-muted/80 flex items-center justify-center mb-4">
                                <ShoppingCart className="w-10 h-10 text-muted-foreground/40" />
                              </div>
                              <p className="text-xs text-muted-foreground font-medium">
                                Visuel à venir
                              </p>
                            </div>
                          ) : (
                            <Image
                              src={support.image}
                              alt={support.name}
                              fill
                              className="object-contain px-6 pb-6 pt-2"
                              loading="lazy"
                              quality={75}
                              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            />
                          )}

                          {/* Zoom button - subtil en haut à droite */}
                          <Button
                            size="sm"
                            variant="ghost"
                            className="absolute top-3 right-3 w-8 h-8 rounded-lg p-0 bg-background/80 backdrop-blur-sm hover:bg-background opacity-0 group-hover:opacity-100 transition-all"
                            onClick={(e) => {
                              e.stopPropagation()
                              setPreviewSupport(support)
                            }}
                            aria-label={`Agrandir ${support.name}`}
                          >
                            <ZoomIn className="w-4 h-4" />
                          </Button>
                        </div>

                        <div className="p-4">
                          {/* Zone de texte avec hauteur fixe */}
                          <div className="h-[5.5rem] mb-3 flex flex-col justify-between">
                            <h3 className="text-sm font-bold text-foreground line-clamp-2 leading-[1.3] mb-1">
                              {support.name}
                            </h3>
                            <p className="text-xs text-muted-foreground leading-tight">{support.description}</p>
                          </div>

                          {/* Bouton d'action clair - toujours au même endroit */}
                          {isSelected(support.id) ? (
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full rounded-lg border-primary text-primary hover:bg-primary/5 font-semibold"
                              onClick={() => toggleSupport(support)}
                            >
                              <Check className="w-4 h-4 mr-2" />
                              Ajouté
                            </Button>
                          ) : (
                            <Button
                              variant="default"
                              size="sm"
                              className="w-full rounded-lg font-semibold"
                              onClick={() => toggleSupport(support)}
                            >
                              <Plus className="w-4 h-4 mr-2" />
                              Ajouter
                            </Button>
                          )}
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Order Summary */}
                <div>
                  <Card className="rounded-3xl border-2 p-6 lg:p-8">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <ShoppingCart className="w-5 h-5 text-primary" />
                      </div>
                      <h2 className="text-2xl font-bold text-foreground">Votre commande</h2>
                    </div>

                    <div className="mb-6 p-4 rounded-2xl bg-accent/10 border border-accent/30">
                      <p className="text-sm text-foreground font-semibold">
                        La commande est STRICTEMENT réservée aux adhérents de la CPTS OUEST GIRONDE
                      </p>
                    </div>

                    {/* Selected Supports */}
                    <div className="mb-6">
                      <h3 className="text-sm font-bold text-foreground mb-4 uppercase tracking-wide">
                        {selectedSupports.length} support{selectedSupports.length !== 1 ? "s" : ""} sélectionné
                        {selectedSupports.length !== 1 ? "s" : ""}
                      </h3>
                      {selectedSupports.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground text-sm">
                          Aucun support sélectionné
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {selectedSupports.map((support) => (
                            <div
                              key={support.id}
                              className="p-4 rounded-2xl bg-primary/5 border border-primary/20"
                            >
                              <div className="flex items-start justify-between gap-3 mb-3">
                                <p className="text-sm font-semibold text-foreground flex-1">
                                  {support.name}
                                </p>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-muted-foreground mr-2">Quantité:</span>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="w-8 h-8 rounded-full p-0"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    updateQuantity(support.id, -1)
                                  }}
                                  aria-label={`Diminuer la quantité de ${support.name}`}
                                >
                                  <Minus className="w-4 h-4" />
                                </Button>
                                <span className="w-8 text-center font-bold text-foreground">
                                  {support.quantity}
                                </span>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="w-8 h-8 rounded-full p-0"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    updateQuantity(support.id, 1)
                                  }}
                                  aria-label={`Augmenter la quantité de ${support.name}`}
                                >
                                  <Plus className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Order Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <Label htmlFor="name" className="text-sm font-semibold">
                          Votre nom / prénom
                        </Label>
                        <Input
                          id="name"
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="mt-1 rounded-xl"
                          disabled={isLoading}
                          maxLength={100}
                          autoComplete="name"
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="email" className="text-sm font-semibold">
                          Votre e-mail
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="mt-1 rounded-xl"
                          disabled={isLoading}
                          maxLength={254}
                          autoComplete="email"
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="phone" className="text-sm font-semibold">
                          Tel
                        </Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="mt-1 rounded-xl"
                          disabled={isLoading}
                          maxLength={32}
                          autoComplete="tel"
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="address" className="text-sm font-semibold">
                          Adresse postale
                        </Label>
                        <Input
                          id="address"
                          type="text"
                          value={formData.address}
                          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                          className="mt-1 rounded-xl"
                          disabled={isLoading}
                          maxLength={200}
                          autoComplete="street-address"
                          required
                        />
                      </div>

                      {status === "success" && (
                        <div className="p-4 rounded-2xl bg-green-50 border border-green-200 flex items-start gap-3">
                          <div className="w-5 h-5 rounded-full bg-green-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Check className="w-3 h-3 text-white" />
                          </div>
                          <p className="text-sm font-medium text-green-800">
                            Commande envoyée avec succès ! La coordinatrice CPTS reviendra vers vous prochainement.
                          </p>
                        </div>
                      )}

                      {status === "error" && (
                        <div
                          className={`p-4 rounded-2xl border flex items-start gap-3 ${
                            errorVariant === "warning"
                              ? "bg-amber-50 border-amber-200"
                              : "bg-red-50 border-red-200"
                          }`}
                        >
                          <div
                            className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                              errorVariant === "warning" ? "bg-amber-500" : "bg-red-600"
                            }`}
                          >
                            {errorVariant === "warning" ? (
                              <AlertTriangle className="w-3 h-3 text-white" />
                            ) : (
                              <X className="w-3 h-3 text-white" />
                            )}
                          </div>
                          <p
                            className={`text-sm font-medium ${
                              errorVariant === "warning" ? "text-amber-800" : "text-red-800"
                            }`}
                          >
                            {errorMessage || "Une erreur est survenue. Veuillez réessayer ou nous contacter."}
                          </p>
                        </div>
                      )}

                      <Button
                        type="submit"
                        size="lg"
                        className="w-full rounded-full font-bold mt-6"
                        disabled={selectedSupports.length === 0 || isLoading}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Envoi en cours...
                          </>
                        ) : (
                          "Valider la commande"
                        )}
                      </Button>
                    </form>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* Preview Modal */}
      <Dialog open={!!previewSupport} onOpenChange={() => setPreviewSupport(null)}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden">
          <VisuallyHidden>
            <DialogTitle>{previewSupport?.name || "Aperçu du support"}</DialogTitle>
          </VisuallyHidden>
          {previewSupport && (
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background"
                onClick={() => setPreviewSupport(null)}
                aria-label="Fermer l'aperçu"
              >
                <X className="w-5 h-5" />
              </Button>
              <div className="p-8">
                <h3 className="text-2xl font-bold text-foreground mb-4">{previewSupport.name}</h3>
                <div className="relative bg-muted rounded-2xl overflow-hidden">
                  {previewSupport.pdf ? (
                    <iframe
                      src={previewSupport.pdf}
                      className="w-full h-[600px]"
                      title={previewSupport.name}
                    />
                  ) : (
                    <div className="relative w-full h-[600px]">
                      <Image
                        src={previewSupport.image}
                        alt={previewSupport.name}
                        fill
                        className="object-contain"
                        loading="lazy"
                        quality={90}
                        sizes="(max-width: 768px) 100vw, 80vw"
                      />
                    </div>
                  )}
                </div>
                <p className="text-muted-foreground mt-4">{previewSupport.description}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

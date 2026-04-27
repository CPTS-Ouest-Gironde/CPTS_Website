"use client"

import dynamic from "next/dynamic"
import Link from "next/link"
import Image from "next/image"
import { useEffect, useMemo, useState, type MouseEvent } from "react"
import { useRouter } from "next/navigation"
import { Menu, X, ChevronDown, LogOut, ShieldAlert, ArrowRight, UserPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { createClient } from "@/lib/supabase/client"
import { isFullyAuthenticatedForProAccess } from "@/lib/supabase/pro-auth"

const SocialModal = dynamic(
  () => import("./social-modal").then((mod) => mod.SocialModal),
  { ssr: false },
)

const PROTECTED_PRO_LINKS = [
  "/professionnels/supports",
  "/professionnels/actions-outils",
  "/professionnels/formations",
] as const

const patientLinks = [
  { label: "Coordonnées utiles", href: "/patients/coordonnees" },
  { label: "L'annuaire des professionnels de santé", href: "/patients/annuaire" },
  { label: "Avez-vous un médecin traitant ?", href: "/patients/medecin-traitant" },
  { label: "Mon Espace de Santé", href: "/patients/mon-espace-sante" },
] as const

const presentationLinks = [
  { label: "Organisation", href: "/presentation#organisation" },
  { label: "Le territoire", href: "/presentation#territoire" },
  { label: "Pourquoi une communauté", href: "/presentation#pourquoi" },
  { label: "Missions", href: "/presentation#missions" },
  { label: "Le suivi de nos activités", href: "/presentation/suivi-activites" },
] as const

const preventionLinks = [
  { label: "Votre prévention du mois", href: "/prevention/du-mois" },
  { label: "Éducation thérapeutique", href: "/prevention/education-therapeutique" },
  { label: "Fiches de suivi", href: "/prevention/memos-suivi" },
  { label: "Articles santé familiale", href: "/prevention/sante-familiale" },
  { label: "Santé mentale", href: "/sante-mental" },
] as const

const protectedProfessionalLinks = [
  { label: "Commander des supports", href: "/professionnels/supports" },
  { label: "Nos actions & vos outils", href: "/professionnels/actions-outils" },
  { label: "Les formations", href: "/professionnels/formations" },
] as const

const logoutButtonToneClass =
  "border-red-200/70 bg-red-50/55 text-red-700 hover:bg-red-100/70 hover:text-red-800"

const logoutDropdownToneClass =
  "text-red-700 bg-red-50/55 border border-red-200/70 hover:bg-red-100/70 hover:text-red-800"

export function Header() {
  const router = useRouter()
  const supabase = useMemo(() => createClient(), [])
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSocialModalOpen, setIsSocialModalOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isAccessDialogOpen, setIsAccessDialogOpen] = useState(false)
  const [pendingProtectedHref, setPendingProtectedHref] = useState<string>(
    "/professionnels/supports",
  )

  useEffect(() => {
    let isMounted = true

    async function refreshAuthState() {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      const isFullyAuthenticated = await isFullyAuthenticatedForProAccess(user, () =>
        supabase.auth.getClaims(),
      )

      if (isMounted) {
        setIsAuthenticated(isFullyAuthenticated)
      }
    }

    void refreshAuthState()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      void refreshAuthState()
    })

    return () => {
      isMounted = false
      subscription.unsubscribe()
    }
  }, [supabase])

  const toggleDropdown = (name: string) => {
    setOpenDropdown(openDropdown === name ? null : name)
  }

  const espaceProHref = isAuthenticated ? "/professionnels" : "/login"
  const loginTargetHref = `/login?next=${encodeURIComponent(pendingProtectedHref)}`
  const pendingResourceLabel =
    protectedProfessionalLinks.find((link) => link.href === pendingProtectedHref)?.label ??
    "Ressource professionnelle"

  const handleProtectedRouteClick = (
    event: MouseEvent<HTMLAnchorElement>,
    href: (typeof PROTECTED_PRO_LINKS)[number],
  ) => {
    if (isAuthenticated) {
      return
    }

    event.preventDefault()
    setPendingProtectedHref(href)
    setIsMenuOpen(false)
    setIsAccessDialogOpen(true)
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setIsMenuOpen(false)
    setIsAccessDialogOpen(false)
    router.push("/")
    router.refresh()
  }

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 py-4">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="bg-white/98 backdrop-blur-xl border border-border/40 rounded-2xl shadow-xl">
            <div className="flex items-center justify-between h-20 px-4 lg:px-6">
              <Link href="/" className="flex-shrink-0 transition-opacity hover:opacity-80">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo-cpts-ouest-gironde-removebg-preview-USphMG3yVl3Lqb7ySVEstCfv6debUR.png"
                  alt="CPTS Ouest Gironde"
                  width={280}
                  height={80}
                  className="h-12 lg:h-14 w-auto"
                  priority
                  sizes="(max-width: 1024px) 192px, 280px"
                />
              </Link>

              <nav className="hidden xl:flex items-center gap-1">
                <Link
                  href="/"
                  className="px-4 py-2.5 text-sm font-semibold text-foreground/80 hover:text-primary hover:bg-primary/5 rounded-xl transition-all duration-200"
                >
                  Accueil
                </Link>

                <div className="relative group">
                  <button className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold text-foreground/80 hover:text-primary hover:bg-primary/5 rounded-xl transition-all duration-200 whitespace-nowrap">
                    Professionnels
                    <ChevronDown className="w-4 h-4 group-hover:rotate-180 transition-transform duration-300" />
                  </button>
                  <div className="absolute top-full left-0 mt-2 w-80 bg-background/95 backdrop-blur-xl border border-border/50 rounded-2xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 overflow-hidden">
                    <div className="py-2 px-2">
                      {isAuthenticated && (
                        <Link
                          href="/professionnels"
                          className="block px-4 py-2.5 text-sm font-semibold text-foreground/80 hover:bg-primary/8 hover:text-primary rounded-lg transition-all duration-200"
                        >
                          Tableau de bord pro
                        </Link>
                      )}

                      {!isAuthenticated && (
                        <Link
                          href="/professionnels/adhesion"
                          className="block px-4 py-2.5 text-sm font-medium text-foreground/70 hover:bg-primary/8 hover:text-primary rounded-lg transition-all duration-200"
                        >
                          Adhésion
                        </Link>
                      )}

                      {protectedProfessionalLinks.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          onClick={(event) => handleProtectedRouteClick(event, link.href)}
                          className="block px-4 py-2.5 text-sm font-medium text-foreground/70 hover:bg-primary/8 hover:text-primary rounded-lg transition-all duration-200"
                        >
                          {link.label}
                        </Link>
                      ))}

                      {isAuthenticated && (
                        <button
                          onClick={handleSignOut}
                          className={`mt-2 w-full flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 ${logoutDropdownToneClass}`}
                        >
                          <LogOut className="w-4 h-4" />
                          Se déconnecter
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="relative group">
                  <button className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold text-foreground/80 hover:text-primary hover:bg-primary/5 rounded-xl transition-all duration-200 whitespace-nowrap">
                    Patients
                    <ChevronDown className="w-4 h-4 group-hover:rotate-180 transition-transform duration-300" />
                  </button>
                  <div className="absolute top-full left-0 mt-2 w-80 bg-background/95 backdrop-blur-xl border border-border/50 rounded-2xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 overflow-hidden">
                    <div className="py-2 px-2">
                      {patientLinks.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          className="block px-4 py-2.5 text-sm font-medium text-foreground/70 hover:bg-primary/8 hover:text-primary rounded-lg transition-all duration-200"
                        >
                          {link.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="relative group">
                  <Link
                    href="/presentation"
                    className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold text-foreground/80 hover:text-primary hover:bg-primary/5 rounded-xl transition-all duration-200 whitespace-nowrap"
                  >
                    Présentation
                    <ChevronDown className="w-4 h-4 group-hover:rotate-180 transition-transform duration-300" />
                  </Link>
                  <div className="absolute top-full left-0 mt-2 w-72 bg-background/95 backdrop-blur-xl border border-border/50 rounded-2xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 overflow-hidden">
                    <div className="py-2 px-2">
                      {presentationLinks.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          className="block px-4 py-2.5 text-sm font-medium text-foreground/70 hover:bg-primary/8 hover:text-primary rounded-lg transition-all duration-200"
                        >
                          {link.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="relative group">
                  <button className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold text-foreground/80 hover:text-primary hover:bg-primary/5 rounded-xl transition-all duration-200 whitespace-nowrap">
                    Prévention
                    <ChevronDown className="w-4 h-4 group-hover:rotate-180 transition-transform duration-300" />
                  </button>
                  <div className="absolute top-full left-0 mt-2 w-72 bg-background/95 backdrop-blur-xl border border-border/50 rounded-2xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 overflow-hidden">
                    <div className="py-2 px-2">
                      {preventionLinks.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          className="block px-4 py-2.5 text-sm font-medium text-foreground/70 hover:bg-primary/8 hover:text-primary rounded-lg transition-all duration-200"
                        >
                          {link.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>

                <Link
                  href="/faq"
                  className="px-4 py-2.5 text-sm font-semibold text-foreground/80 hover:text-primary hover:bg-primary/5 rounded-xl transition-all duration-200"
                >
                  FAQ
                </Link>
              </nav>

              <div className="hidden xl:flex items-center gap-2 flex-shrink-0">
                {isAuthenticated ? (
                  <Button
                    type="button"
                    size="lg"
                    variant="outline"
                    className={`rounded-full font-semibold text-sm px-5 h-11 ${logoutButtonToneClass}`}
                    onClick={handleSignOut}
                  >
                    <LogOut className="w-4 h-4" />
                    Se déconnecter
                  </Button>
                ) : (
                  <Button asChild size="lg" variant="outline" className="rounded-full font-semibold text-sm px-5 h-11">
                    <Link href={espaceProHref}>Espace Pro</Link>
                  </Button>
                )}
                <Button
                  size="lg"
                  className="rounded-full font-semibold text-sm px-6 h-11 shadow-lg hover:shadow-xl transition-all duration-200"
                  onClick={() => setIsSocialModalOpen(true)}
                >
                  Nous Rejoindre
                </Button>
              </div>

              <button
                className="xl:hidden p-2.5 hover:bg-primary/5 rounded-xl transition-all duration-200"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Toggle menu"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

            {isMenuOpen && (
              <nav className="xl:hidden py-6 px-4 space-y-2 border-t border-border/40 max-h-[calc(100vh-6rem)] overflow-y-auto">
                <Link
                  href="/"
                  className="block px-4 py-2.5 text-base font-semibold text-foreground/80 hover:text-primary hover:bg-primary/5 rounded-xl transition-all duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Accueil
                </Link>

                <div className="px-4">
                  <button
                    onClick={() => toggleDropdown("professionnels")}
                    className="flex items-center justify-between w-full py-2.5 text-base font-semibold text-foreground/80 hover:text-primary transition-all duration-200"
                  >
                    Professionnels de Santé
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-300 ${openDropdown === "professionnels" ? "rotate-180" : ""}`}
                    />
                  </button>
                  {openDropdown === "professionnels" && (
                    <div className="mt-2 ml-3 space-y-1 border-l-2 border-primary/20 pl-4">
                      {isAuthenticated && (
                        <Link
                          href="/professionnels"
                          className="block py-2 text-sm font-semibold text-foreground/80 hover:text-primary transition-all duration-200"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          Tableau de bord pro
                        </Link>
                      )}

                      {!isAuthenticated && (
                        <Link
                          href="/professionnels/adhesion"
                          className="block py-2 text-sm font-medium text-foreground/70 hover:text-primary transition-all duration-200"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          Adhésion
                        </Link>
                      )}
                      {protectedProfessionalLinks.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          className="block py-2 text-sm font-medium text-foreground/70 hover:text-primary transition-all duration-200"
                          onClick={(event) => handleProtectedRouteClick(event, link.href)}
                        >
                          {link.label}
                        </Link>
                      ))}

                      {isAuthenticated && (
                        <button
                          onClick={handleSignOut}
                          className={`w-full text-left px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${logoutDropdownToneClass}`}
                        >
                          Se déconnecter
                        </button>
                      )}
                    </div>
                  )}
                </div>

                <div className="px-4">
                  <button
                    onClick={() => toggleDropdown("patients")}
                    className="flex items-center justify-between w-full py-2.5 text-base font-semibold text-foreground/80 hover:text-primary transition-all duration-200"
                  >
                    Espace Patients et Usagers
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-300 ${openDropdown === "patients" ? "rotate-180" : ""}`}
                    />
                  </button>
                  {openDropdown === "patients" && (
                    <div className="mt-2 ml-3 space-y-1 border-l-2 border-primary/20 pl-4">
                      {patientLinks.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          className="block py-2 text-sm font-medium text-foreground/70 hover:text-primary transition-all duration-200"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {link.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                <div className="px-4">
                  <button
                    onClick={() => toggleDropdown("presentation")}
                    className="flex items-center justify-between w-full py-2.5 text-base font-semibold text-foreground/80 hover:text-primary transition-all duration-200"
                  >
                    Présentation de la CPTS
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-300 ${openDropdown === "presentation" ? "rotate-180" : ""}`}
                    />
                  </button>
                  {openDropdown === "presentation" && (
                    <div className="mt-2 ml-3 space-y-1 border-l-2 border-primary/20 pl-4">
                      {presentationLinks.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          className="block py-2 text-sm font-medium text-foreground/70 hover:text-primary transition-all duration-200"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {link.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                <div className="px-4">
                  <button
                    onClick={() => toggleDropdown("prevention")}
                    className="flex items-center justify-between w-full py-2.5 text-base font-semibold text-foreground/80 hover:text-primary transition-all duration-200"
                  >
                    Prévention
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-300 ${openDropdown === "prevention" ? "rotate-180" : ""}`}
                    />
                  </button>
                  {openDropdown === "prevention" && (
                    <div className="mt-2 ml-3 space-y-1 border-l-2 border-primary/20 pl-4">
                      {preventionLinks.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          className="block py-2 text-sm font-medium text-foreground/70 hover:text-primary transition-all duration-200"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {link.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                <Link
                  href="/faq"
                  className="block px-4 py-2.5 text-base font-semibold text-foreground/80 hover:text-primary hover:bg-primary/5 rounded-xl transition-all duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  FAQ
                </Link>

                <div className="px-4 pt-3 space-y-2">
                  {isAuthenticated ? (
                    <Button
                      type="button"
                      size="lg"
                      variant="outline"
                      className={`w-full rounded-full font-semibold text-base h-12 ${logoutButtonToneClass}`}
                      onClick={handleSignOut}
                    >
                      <LogOut className="w-4 h-4" />
                      Se déconnecter
                    </Button>
                  ) : (
                    <Button asChild size="lg" variant="outline" className="w-full rounded-full font-semibold text-base h-12">
                      <Link href={espaceProHref} onClick={() => setIsMenuOpen(false)}>
                        Espace Pro
                      </Link>
                    </Button>
                  )}
                  <Button
                    size="lg"
                    className="w-full rounded-full font-semibold text-base h-12 shadow-lg hover:shadow-xl transition-all duration-200"
                    onClick={() => {
                      setIsMenuOpen(false)
                      setIsSocialModalOpen(true)
                    }}
                  >
                    Nous Rejoindre
                  </Button>
                </div>
              </nav>
            )}
          </div>
        </div>
      </header>

      <SocialModal
        isOpen={isSocialModalOpen}
        onClose={() => setIsSocialModalOpen(false)}
        showAdhesionCta={!isAuthenticated}
      />

      <AlertDialog open={isAccessDialogOpen} onOpenChange={setIsAccessDialogOpen}>
        <AlertDialogContent className="rounded-3xl border-2 p-0 overflow-hidden">
          <AlertDialogHeader className="relative p-6 pb-4 bg-gradient-to-br from-primary/10 to-accent/10 border-b border-border/70">
            <AlertDialogCancel asChild>
              <button
                type="button"
                aria-label="Fermer la fenêtre d'accès"
                className="absolute right-4 top-4 inline-flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-background/70 hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </AlertDialogCancel>

            <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/15 text-primary mb-1">
              <ShieldAlert className="h-6 w-6" />
            </div>
            <AlertDialogTitle className="text-xl">Accès réservé aux adhérents</AlertDialogTitle>
            <AlertDialogDescription className="text-sm leading-relaxed">
              Les ressources professionnelles sont visibles publiquement, mais leur consultation
              est réservée aux membres connectés de la CPTS.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="p-6 pt-4 space-y-4">
            <div className="rounded-xl border border-border bg-muted/40 px-4 py-3">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Ressource demandée
              </p>
              <p className="text-sm font-semibold text-foreground mt-1">{pendingResourceLabel}</p>
            </div>

            <div className="grid gap-2 sm:grid-cols-2">
              <Button asChild variant="outline" className="h-11 rounded-full font-semibold" onClick={() => setIsAccessDialogOpen(false)}>
                <Link href="/professionnels/adhesion">
                  <UserPlus className="h-4 w-4" />
                  Adhérer
                </Link>
              </Button>
              <Button asChild className="h-11 rounded-full font-semibold" onClick={() => setIsAccessDialogOpen(false)}>
                <Link href={loginTargetHref}>
                  Se connecter
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>

            <p className="text-xs text-muted-foreground text-center">
              Déjà adhérent ? Connectez-vous à l&apos;espace pro.
            </p>

          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

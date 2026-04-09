import Link from "next/link"
import {
  ArrowRight,
  BookOpenCheck,
  BriefcaseMedical,
  Megaphone,
  type LucideIcon,
} from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/server"

type ProfileRecord = {
  first_name: string | null
  last_name: string | null
}

type ShortcutItem = {
  title: string
  description: string
  href: string
  ctaLabel: string
  icon: LucideIcon
}

const PROFESSIONAL_SHORTCUTS: ShortcutItem[] = [
  {
    title: "Supports",
    description: "Commandez vos supports de communication pour vos actions CPTS.",
    href: "/professionnels/supports",
    ctaLabel: "Accéder",
    icon: Megaphone,
  },
  {
    title: "Actions & Outils",
    description: "Retrouvez les ressources métiers et les outils territoriaux.",
    href: "/professionnels/actions-outils",
    ctaLabel: "Accéder",
    icon: BriefcaseMedical,
  },
  {
    title: "Formations",
    description: "Consultez les formations et modalités d'inscription.",
    href: "/professionnels/formations",
    ctaLabel: "Accéder",
    icon: BookOpenCheck,
  },
]

export default async function ProfessionnelsHubPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  let profile: ProfileRecord | null = null

  if (user) {
    const profileResult = await supabase
      .from("profiles")
      .select("first_name,last_name")
      .eq("id", user.id)
      .maybeSingle()

    if (!profileResult.error) {
      profile = (profileResult.data as ProfileRecord | null) ?? null
    }
  }

  const fullName = [profile?.first_name, profile?.last_name].filter(Boolean).join(" ").trim()
  const greetingName = fullName || "Professionnel"

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="pt-24 lg:pt-28 flex-1">
        <section className="py-10 lg:py-14">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="mx-auto max-w-6xl space-y-6">
              <Card className="rounded-3xl border border-primary/20 bg-primary/[0.04] shadow-sm">
                <CardContent className="p-7 sm:p-9 lg:p-10">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary/80">
                    Tableau de bord
                  </p>
                  <h1 className="mt-3 text-3xl sm:text-4xl font-bold text-foreground text-balance">
                    Bienvenue sur votre espace professionnel.
                  </h1>
                  <p className="mt-4 max-w-3xl text-base sm:text-lg text-muted-foreground leading-relaxed">
                    Bonjour {greetingName}. Retrouvez vos accès rapides à l&apos;espace professionnel.
                  </p>
                </CardContent>
              </Card>

              <div className="grid gap-4 lg:grid-cols-3">
                {PROFESSIONAL_SHORTCUTS.map((shortcut) => {
                  const Icon = shortcut.icon

                  return (
                    <Card
                      key={shortcut.href}
                      className="rounded-2xl border border-border/80 bg-card shadow-sm"
                    >
                      <CardContent className="flex h-full flex-col p-6">
                        <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                          <Icon className="h-5 w-5" />
                        </div>

                        <h2 className="text-xl font-semibold text-foreground">{shortcut.title}</h2>
                        <p className="mt-2 flex-1 text-sm text-muted-foreground leading-relaxed">
                          {shortcut.description}
                        </p>

                        <Button asChild className="mt-5 h-10 self-start rounded-full px-4 font-semibold">
                          <Link href={shortcut.href}>
                            {shortcut.ctaLabel}
                            <ArrowRight className="h-4 w-4" />
                          </Link>
                        </Button>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

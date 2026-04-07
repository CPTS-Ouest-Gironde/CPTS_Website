import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { PasswordUpdateForm } from "@/components/auth/password-update-form"

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-24 pb-16">
        <section className="py-10 lg:py-16">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-xl mx-auto">
              <PasswordUpdateForm
                flow="recovery"
                title="Réinitialiser votre mot de passe"
                description="Définissez un nouveau mot de passe pour retrouver l'accès à votre espace pro."
              />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
